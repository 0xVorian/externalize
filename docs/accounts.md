# Optional passkey accounts and progress sync

Externalize stays local-first. Signed-out use is unchanged: progress lives in `localStorage` (storage format v7) and file export/import still works. A passkey is an optional way to copy that snapshot to another device. There is no email, password, or third-party identity provider.

This feature runs on the **Cloudflare free tier**: Pages Functions for the API and **D1** for users, credentials, challenges, sessions, and progress snapshots.

## Learner-facing behaviour

- Signing in is offered quietly on Progress → **Another device**, next to export/import.
- If D1 is not actually usable, Functions are down, or `GET /api/status` returns `{ available: false }`, the passkey controls stay hidden. The static app still loads.
- Offline, the app keeps working from `localStorage`. A signed-in device queues a push and copies when it is online again. An expired session (HTTP 401) **keeps** that queued push until the learner signs in with a passkey.
- Sign-out clears the HttpOnly session cookie. Local progress stays.
- **Remove server copy** deletes the user, passkeys, sessions, and stored snapshot on the server. Local progress stays unless the learner also clears it.

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
- User verification is **required** at both options and verify. Synced passkeys that report signature counter `0` are accepted; a positive counter that did not advance is rejected as a clone.
- RP ID and origin are **never** taken from the request `Host`. They come from a configured allowlist:

  | Origin | RP ID |
  |---|---|
  | `http://localhost:<port>` | `localhost` (IP literals such as `127.0.0.1` are rejected) |
  | `https://externalize.pages.dev` and `https://*.externalize.pages.dev` | `externalize.pages.dev` |
  | `WEBAUTHN_ORIGIN` and comma-separated `WEBAUTHN_ALLOWED_ORIGINS` | `WEBAUTHN_RP_ID` when it is a valid RP ID for that host |

  Pin `WEBAUTHN_RP_ID` / `WEBAUTHN_ORIGIN` for a custom domain. Preview hosts stay on the pages.dev RP ID so a production passkey still works on a preview if the hostname is a suffix of that RP ID.

Passkeys are discoverable (`residentKey: 'required'`). Authenticator attachment is not restricted, so a platform passkey, a synced iCloud/Google passkey, or a cross-device / hybrid QR passkey can all be used. **Add another passkey** while signed in registers an extra credential on the same account.

Unauthenticated `*/options` routes are rate-limited per client (30 / 10 minutes in-memory) and the table of live challenges is capped (200). Expired challenge/session rows are purged at most every ten minutes, not on every request.

## API

All routes sit under `/api/` (Pages Function `functions/api/[[path]].ts`). Binding name: **`DB`**.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/status` | Probes D1 with `SELECT 1`. `{ available: false }` when the binding is missing or the query fails (so a placeholder `database_id` cannot show account UI). When available: `{ available: true, signedIn, passkeyCount }` so the client does not need a second session fetch. |
| GET | `/api/session` | Cookie session: `{ signedIn, passkeyCount }` |
| POST | `/api/auth/register/options` + `/verify` | Create a passkey and account |
| POST | `/api/auth/login/options` + `/verify` | Sign in with an existing passkey |
| POST | `/api/auth/passkeys/options` + `/verify` | Add a passkey to the current account |
| POST | `/api/auth/logout` | Clear the session cookie (CSRF-protected) |
| GET/POST | `/api/sync` | Pull / merge-and-store progress v7 (CAS on `revision`) |
| DELETE | `/api/account` | Delete server data |

Without a working D1, `/api/status` returns `{ available: false }` and every other route returns `503`. Functions never throw past that guard. A committed placeholder UUID in `wrangler.toml` is only for local `wrangler pages dev`; Git-connected Pages must still bind a real database, and `/api/status` reflects whether queries actually work.

## Local development

Signed-out Vite (`npm run dev`, `npm run preview`) has no Functions, so account controls stay hidden.

To exercise passkeys locally:

```bash
npm run dev:pages
```

That builds the static app, applies D1 migrations to the **local** database, and serves both `dist/` and Functions at `http://localhost:8788`. Use **localhost**, not `127.0.0.1`: WebAuthn RP IDs cannot be IP addresses.

```bash
npx wrangler d1 migrations apply externalize-progress --local
npx wrangler pages dev dist --ip 0.0.0.0 --port 8788
```

Wrangler config: [`wrangler.toml`](../wrangler.toml). Schema: [`migrations/0001_init.sql`](../migrations/0001_init.sql), [`migrations/0002_challenge_origin_and_revision.sql`](../migrations/0002_challenge_origin_and_revision.sql). Wrangler 4 accepts the same `database_id` / `preview_database_id` placeholder for `pages dev --local`; replace both with the real UUID before a production bind.

## Production provisioning (Cloudflare dashboard)

This repository does **not** create the production D1 database. After the Pages git integration is already deploying `master` to `externalize.pages.dev`, the owner should:

1. **Create a D1 database** in the Cloudflare dashboard (Workers & Pages → D1). Name it `externalize-progress` (or any name you prefer). Copy its UUID.
2. **Replace the placeholder** `database_id` (and `preview_database_id`) in `wrangler.toml` (`00000000-0000-0000-0000-000000000000`) with that UUID, **or** skip the file and bind only in the dashboard — both must use the binding name **`DB`**. Do not leave the nil UUID as the production bind: `/api/status` will report `{ available: false }` until `SELECT 1` succeeds.
3. **Apply migrations to the remote database:**
   ```bash
   npx wrangler d1 migrations apply externalize-progress --remote
   ```
   If the Wrangler account has several D1 databases, pass `--env` / the real database name as shown by `npx wrangler d1 list`.
4. **Bind D1 to the Pages project:** Pages → project → Settings → Bindings → Add → D1. Variable name: **`DB`**. Select `externalize-progress`. Save and **redeploy** so Functions receive the binding.
5. **Environment variables** (Pages → Settings → Environment variables), production and preview:
   | Variable | When to set | Example |
   |---|---|---|
   | `WEBAUTHN_RP_NAME` | Display name on the passkey prompt | `Externalize` |
   | `WEBAUTHN_RP_ID` | Custom domain (registrable domain, no scheme) | `logic.example.org` |
   | `WEBAUTHN_ORIGIN` | Full origin, no trailing slash | `https://logic.example.org` |
   | `WEBAUTHN_ALLOWED_ORIGINS` | Extra exact origins, comma-separated | `https://preview.logic.example.org` |

   On `*.externalize.pages.dev` these may be omitted: Functions use the built-in allowlist and pin RP ID to `externalize.pages.dev`. They do **not** fall back to the request Host.

6. Confirm `https://<pages-host>/api/status` returns `{ "available": true, ... }`. Open Progress → Another device; **Create a passkey** should appear. If the binding is missing or D1 queries fail, the JSON is `{ "available": false }` and the UI stays on file export/import only.

The static build (`npm run build`) does not talk to Cloudflare. Git deploys keep serving the app if Functions or D1 are absent; only the passkey controls stay hidden.

## Free-tier budget

Every app open hits `GET /api/status` (one D1 `SELECT 1`, plus a session read when the cookie is present). A signed-in open also `GET /api/sync` and POSTs only when local learning state differs from remote or a push is already queued. Challenge/session expiry is not rewritten on every call.

For a handful of learners that still fits the free daily Function and D1 allotments. The write risks that would not are unbounded unauthenticated `INSERT`s into `challenges` and a `DELETE` on every request — both of those are capped as described above. Free D1 is 100k rows written/day; exhausting it would disable sync until 00:00 UTC (the static app still loads).

## Follow-ups not in this change

- Credential nicknames / a device list beyond “add another passkey”
- Compressing snapshots if progress documents grow substantially
- Typechecking `functions/` under the root `tsc` config (Wrangler still bundles them; DOM vs Workers lib conflict)
