# Optional passkey accounts and progress sync

Externalize stays local-first. Signed-out use is unchanged: progress lives in `localStorage` (storage format v7) and file export/import still works. A passkey is an optional way to copy that snapshot to another device. There is no email, password, or third-party identity provider.

This feature runs on the **Cloudflare free tier**: Pages Functions for the API and **D1** for users, credentials, challenges, sessions, and progress snapshots.

## Learner-facing behaviour

- Signing in is offered quietly on Progress → **Another device**, next to export/import.
- If D1 is not actually usable, Functions are down, or `GET /api/status` returns `{ available: false }`, the passkey controls stay hidden. The static app still loads.
- Offline, the app keeps working from `localStorage`. A signed-in device queues a push and copies when it is online again. An expired session (HTTP 401) **keeps** that queued push until the learner signs in with a passkey.
- Sign-out clears the HttpOnly session cookie. Local progress stays.
- **Remove server copy** deletes the user, passkeys, sessions, and stored snapshot on the server. It is authorized by the session cookie and Origin check only; it does not re-prompt for a passkey. Session theft can remove the server copy; local progress on the device stays unless the learner also clears it.

### In-flight bounded session

Bounded rounds (`externalize-active-session-v1`) are local orchestration, not mastery evidence, and are **not** synced.

A successful `/api/sync` is merged into the **current** local snapshot, not the payload that was sent. A save that happens while the request is in flight is kept, and `pendingSync` stays set so it is pushed next.

The in-flight round is invalidated only when **learning state** actually changed (completions, evidence, SRS *values*, drafts, routes) — typically because another device wrote something new. Queue order, `lastVisitedAt`, and resume timestamps are not a reason to abort the round. A same-device push therefore does not destroy resume.

## Merge rules

`src/app/progress-merge.ts` is the single implementation. The client merges `(local, remote)` after sign-in; the server merges `(incoming, stored)` on each push. Uploaded snapshots are deep-parsed (`parseProgressStore`): version 7, typed nested fields, extra keys stripped, oversized or malformed payloads rejected. Unit tests lock the resulting objects, not just counts.

| Field | Rule |
|---|---|
| `lessonsCompleted`, `attempted`, `passed` | Union; left-then-right order |
| `level0/1/2Complete`, `onboardingComplete` | OR |
| `queue` (SRS) | Per `exerciseId`, keep the more advanced schedule: larger `intervalDays`, then larger `ease`, then later `due`. **Left queue order is preserved**; new ids from the right are appended. `merge(x, x)` does not reorder. |
| `skills`, `exerciseStats`, `errorCounts`, `conceptEvidence` | Per-item maxima (never sum, so shared history is not double-counted) |
| `exerciseStats.scaffoldLevel` | Maximum (more scaffolding withdrawn) |
| `exerciseStats.seenAssignmentKeys` | Union |
| `routes.seenItems` | Union |
| `routes.completedAt` | Earlier timestamp (first completion stands) |
| `routes.depthByStep` | `mastery` wins over `reading` |
| `resume`, `activeRouteId`, `lastExerciseId` | Later timestamp; equal timestamps prefer left |
| `practiceDrafts` | Per exercise; finalized beats active; otherwise more checks / later start |
| `lastVisitedAt` | Later timestamp |

A lagging device’s failed review does not rewind a more advanced SRS interval.

Server `POST /api/sync` is read–merge–write with a compare-and-swap on `progress.revision` (retry on conflict) so two devices pushing at once cannot last-write-win.

## Session handling

- Session cookie: `ex_session` on HTTP, `__Host-ex_session` on HTTPS; **HttpOnly**, **SameSite=Lax**, **Secure** on HTTPS, `Path=/`, 30-day max-age. SameSite is not the only CSRF control: every POST/DELETE requires an `Origin` on the allowlist below.
- The cookie value is a random token; D1 stores only its SHA-256 hash.
- WebAuthn challenges live in D1 for five minutes and are consumed with a single `DELETE … RETURNING` (one-time, no TOCTOU). Options rows store the origin and RP ID chosen at create time; verify uses those, not the verify-request host.
- User verification is **required** at both options and verify. A reported signature counter of `0` means the authenticator does not increment: the stored high-water mark is kept. A positive counter that did not advance is rejected as a clone.
- RP ID and origin are **never** taken from the request `Host`. They come from a configured allowlist:

  | Origin | RP ID |
  |---|---|
  | `http://localhost:<port>` | `localhost` (IP literals such as `127.0.0.1` are rejected) |
  | `https://externalize.pages.dev` and `https://*.externalize.pages.dev` | `externalize.pages.dev` |
  | `WEBAUTHN_ORIGIN` and comma-separated `WEBAUTHN_ALLOWED_ORIGINS` | `WEBAUTHN_RP_ID` when it is a valid RP ID for that host. Extra origins must be `https:` (a mistyped `http://…` is ignored, not treated as CSRF-allowed). |

  Pin `WEBAUTHN_RP_ID` / `WEBAUTHN_ORIGIN` for a custom domain. Preview hosts stay on the pages.dev RP ID so a production passkey still works on a preview if the hostname is a suffix of that RP ID.

Passkeys are discoverable (`residentKey: 'required'`). Authenticator attachment is not restricted, so a platform passkey, a synced iCloud/Google passkey, or a cross-device / hybrid QR passkey can all be used. **Add another passkey** while signed in registers an extra credential on the same account.

Unauthenticated `*/options` routes are limited per client in D1 (10 / hour, keyed on a hash of `CF-Connecting-IP`) and by a 40-row live-challenge cap. The cap is a read-only `COUNT` **before** any insert or rate upsert, so a full table 429s with no D1 write. Expired challenge/session/rate rows are purged at most every ten minutes, not on every request. Worst-case writes if an attacker keeps the table full: 40 slots × 3 writes (insert, delete, rate upsert) × 288 five-minute windows/day ≈ **34.6k**, under the free D1 100k writes/day cap. The in-memory limiter is only a same-isolate first filter.

## API

All routes sit under `/api/` (Pages Function `functions/api/[[path]].ts`). Binding name: **`DB`**.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/status` | Probes D1 with `SELECT 1`. `{ available: false }` when the binding is missing or the query fails. When available: `{ available: true, signedIn, passkeyCount }` so the client does not need a second session fetch. |
| GET | `/api/session` | Cookie session: `{ signedIn, passkeyCount }` |
| POST | `/api/auth/register/options` + `/verify` | Create a passkey and account |
| POST | `/api/auth/login/options` + `/verify` | Sign in with an existing passkey |
| POST | `/api/auth/passkeys/options` + `/verify` | Add a passkey to the current account |
| POST | `/api/auth/logout` | Clear the session cookie (CSRF-protected) |
| GET/POST | `/api/sync` | Pull / merge-and-store progress v7 (CAS on `revision`) |
| DELETE | `/api/account` | Delete server data |

Without a working D1, `/api/status` returns `{ available: false }` and every other route returns `503`. Functions never throw past that guard.

Committed [`wrangler.toml`](../wrangler.toml) does **not** declare `[[d1_databases]]`. Git-connected Pages rejects a D1 binding whose database does not exist (error 10021), which would fail the preview deploy. A git-connected preview with no dashboard D1 bind is a static site: Functions still ship, `/api/status` reports `{ available: false }`, and account UI stays hidden. Bind `DB` in the Pages dashboard after creating the database — do not put a nil UUID in the committed config.

A stored snapshot that no longer parses is treated as missing: `GET /api/sync` returns `progress: null`, and `POST` CAS-replaces the row with the incoming snapshot instead of returning `500 corrupt-snapshot`.

## Local development

Signed-out Vite (`npm run dev`, `npm run preview`) has no Functions, so account controls stay hidden.

To exercise passkeys locally:

```bash
npm run dev:pages
```

That builds the static app, applies D1 migrations to the **local** database, and serves both `dist/` and Functions at `http://localhost:8788`. Use **localhost**, not `127.0.0.1`: WebAuthn RP IDs cannot be IP addresses.

```bash
npx wrangler -c wrangler.local.toml d1 migrations apply externalize-progress --local
npx wrangler pages dev dist --d1 DB=00000000-0000-0000-0000-000000000000 --ip 0.0.0.0 --port 8788
```

Git-connected Pages reads [`wrangler.toml`](../wrangler.toml) (no D1). `wrangler pages dev` does **not** accept `-c` / `--config`. Local `wrangler d1` uses [`wrangler.local.toml`](../wrangler.local.toml); pages/e2e bind the same sqlite with `--d1 DB=<that file's database_id>`. Schema: [`migrations/0001_init.sql`](../migrations/0001_init.sql), [`migrations/0002_challenge_origin_and_revision.sql`](../migrations/0002_challenge_origin_and_revision.sql), [`migrations/0003_challenge_rate.sql`](../migrations/0003_challenge_rate.sql). Wrangler 4.152 accepted a nil UUID in the *local* file for `d1 migrations apply --local`. Cloudflare’s current Pages+D1 snippet sometimes shows `preview_database_id = "DB"` (the binding name) rather than a UUID; that field is only in the local config, never in the git-connected file.

## Production provisioning (Cloudflare dashboard)

This repository does **not** create the production D1 database. After the Pages git integration is already deploying `master` to `externalize.pages.dev`, the owner should:

1. **Create a D1 database** in the Cloudflare dashboard (Workers & Pages → D1). Name it `externalize-progress` (or any name you prefer).
2. **Bind it on the Pages project only** (do not add `[[d1_databases]]` to the committed `wrangler.toml`): Pages → project → Settings → Bindings → Add → D1. Variable name: **`DB`**. Select `externalize-progress`. Save and **redeploy** so Functions receive the binding. Putting a nil UUID in git-connected `wrangler.toml` makes the deploy fail.
3. **Apply migrations to the remote database:**
   ```bash
   npx wrangler d1 migrations apply externalize-progress --remote
   ```
   Use the dashboard database name from `npx wrangler d1 list`. Do not pass `-c wrangler.local.toml` for `--remote` (that file is local-only and uses a nil UUID).
4. **Environment variables** (Pages → Settings → Environment variables), production and preview:
   | Variable | When to set | Example |
   |---|---|---|
   | `WEBAUTHN_RP_NAME` | Display name on the passkey prompt | `Externalize` |
   | `WEBAUTHN_RP_ID` | Custom domain (registrable domain, no scheme) | `logic.example.org` |
   | `WEBAUTHN_ORIGIN` | Full origin, no trailing slash | `https://logic.example.org` |
   | `WEBAUTHN_ALLOWED_ORIGINS` | Extra exact origins, comma-separated | `https://preview.logic.example.org` |

   On `*.externalize.pages.dev` these may be omitted: Functions use the built-in allowlist and pin RP ID to `externalize.pages.dev`. They do **not** fall back to the request Host.

5. Confirm `https://<pages-host>/api/status` returns `{ "available": true, ... }`. Open Progress → Another device; **Create a passkey** should appear. If the binding is missing or D1 queries fail, the JSON is `{ "available": false }` and the UI stays on file export/import only.

The static build (`npm run build`) does not talk to Cloudflare. Git-connected previews without a dashboard D1 bind still deploy: the app serves, Functions answer `/api/status` with `{ available: false }`, and passkey controls stay hidden.

## Free-tier budget

Every app open hits `GET /api/status` (one D1 `SELECT 1`, plus a session read when the cookie is present). A signed-in open also `GET /api/sync` and POSTs only when local learning state differs from remote or a push is already queued. Challenge/session expiry is not rewritten on every call.

For a handful of learners that still fits the free daily Function and D1 allotments. Unauthenticated challenge creation is bounded globally (D1 quota + 40 live rows), not only in one isolate’s memory. Free D1 is 100k rows written/day; exhausting it would disable sync until 00:00 UTC (the static app still loads). The documented worst-case challenge write ceiling is under that cap (`dailyChallengeWriteCeiling` in `src/app/account-policy.ts`).

## Follow-ups not in this change

- Credential nicknames / a device list beyond “add another passkey”
- Compressing snapshots if progress documents grow substantially
- Typechecking `functions/` under the root `tsc` config (Wrangler still bundles them; DOM vs Workers lib conflict)
