# Optional passkey accounts and progress sync

Externalize stays local-first. Signed-out use is unchanged: progress lives in `localStorage` (storage format v7) and file export/import still works. A passkey is an optional way to copy that snapshot to another device. There is no email, password, or third-party identity provider.

This feature runs on the **Cloudflare free tier**: Pages Functions for the API and **D1** for users, credentials, challenges, sessions, and progress snapshots.

## Learner-facing behaviour

- Signing in is offered quietly on Progress → **Another device**, next to export/import.
- If the D1 binding is missing, Functions are down, or `/api/status` is not available, the passkey controls stay hidden. The static app still loads.
- Offline, the app keeps working from `localStorage`. A signed-in device queues a push and copies when it is online again.
- Sign-out clears the HttpOnly session cookie. Local progress stays.
- **Remove server copy** deletes the user, passkeys, sessions, and stored snapshot on the server. Local progress stays unless the learner also clears it.

### In-flight bounded session

Bounded rounds (`externalize-active-session-v1`) are local orchestration, not mastery evidence, and are **not** synced. After a merge that actually changes the v7 snapshot, the local in-flight session is invalidated — the same rule as file import — so the next opening offer is derived from the combined progress.

## Merge rules

`src/app/progress-merge.ts` is the single implementation. The client merges `(local, remote)` after sign-in; the server merges `(incoming, stored)` on each push. Unit tests lock the resulting objects, not just counts.

| Field | Rule |
|---|---|
| `lessonsCompleted`, `attempted`, `passed` | Union; left-then-right order |
| `level0/1/2Complete`, `onboardingComplete` | OR |
| `queue` (SRS) | Per `exerciseId`, keep the more advanced schedule: larger `intervalDays`, then larger `ease`, then later `due` |
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

## Session handling

- Session cookie: `ex_session`, **HttpOnly**, **SameSite=Lax**, **Secure** on HTTPS, `Path=/`, 30-day max-age.
- The cookie value is a random token; D1 stores only its SHA-256 hash.
- WebAuthn challenges live in D1 for five minutes and are deleted on use.
- RP ID and origin default to the incoming request (`url.hostname` / `url.origin`) so `localhost`, `127.0.0.1`, and `*.pages.dev` work without extra env vars. Override with `WEBAUTHN_RP_ID` and `WEBAUTHN_ORIGIN` for a custom domain.

Passkeys are discoverable (`residentKey: 'required'`). Authenticator attachment is not restricted, so a platform passkey, a synced iCloud/Google passkey, or a cross-device / hybrid QR passkey can all be used. **Add another passkey** while signed in registers an extra credential on the same account.

## API

All routes sit under `/api/` (Pages Function `functions/api/[[path]].ts`). Binding name: **`DB`**.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/status` | `{ available: true \| false }` — false/404 hides the account UI |
| GET | `/api/session` | Cookie session: `{ signedIn, passkeyCount }` |
| POST | `/api/auth/register/options` + `/verify` | Create a passkey and account |
| POST | `/api/auth/login/options` + `/verify` | Sign in with an existing passkey |
| POST | `/api/auth/passkeys/options` + `/verify` | Add a passkey to the current account |
| POST | `/api/auth/logout` | Clear the session cookie |
| GET/POST | `/api/sync` | Pull / merge-and-store progress v7 |
| DELETE | `/api/account` | Delete server data |

Without `env.DB`, `/api/status` returns `{ available: false }` and every other route returns `503`. Functions never throw past that guard.

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

Wrangler config: [`wrangler.toml`](../wrangler.toml). Schema: [`migrations/0001_init.sql`](../migrations/0001_init.sql).

## Production provisioning (Cloudflare dashboard)

This repository does **not** create the production D1 database. After the Pages git integration is already deploying `master` to `externalize.pages.dev`, the owner should:

1. **Create a D1 database** in the Cloudflare dashboard (Workers & Pages → D1). Name it `externalize-progress` (or any name you prefer). Copy its UUID.
2. **Replace the placeholder** `database_id` in `wrangler.toml` (`00000000-0000-0000-0000-000000000000`) with that UUID, **or** skip the file and bind only in the dashboard — both must use the binding name **`DB`**.
3. **Apply migrations to the remote database:**
   ```bash
   npx wrangler d1 migrations apply externalize-progress --remote
   ```
   If the Wrangler account has several D1 databases, pass `--env` / the real database name as shown by `npx wrangler d1 list`.
4. **Bind D1 to the Pages project:** Pages → project → Settings → Bindings → Add → D1. Variable name: **`DB`**. Select `externalize-progress`. Save and **redeploy** so Functions receive the binding.
5. **Optional environment variables** (Pages → Settings → Environment variables), production and preview:
   | Variable | When to set | Example |
   |---|---|---|
   | `WEBAUTHN_RP_NAME` | Display name on the passkey prompt | `Externalize` |
   | `WEBAUTHN_RP_ID` | Custom domain (registrable domain, no scheme) | `externalize.pages.dev` or `logic.example.org` |
   | `WEBAUTHN_ORIGIN` | Full origin, no trailing slash | `https://externalize.pages.dev` |

   Until a custom domain is attached, omitting these is fine: Functions derive RP ID and origin from the request.

6. Confirm `https://<pages-host>/api/status` returns `{ "available": true }`. Open Progress → Another device; **Create a passkey** should appear. If the binding is missing, the JSON is `{ "available": false }` and the UI stays on file export/import only.

The static build (`npm run build`) does not talk to Cloudflare. Git deploys keep serving the app if Functions or D1 are absent; only the passkey controls stay hidden.

## Free-tier budget

For a handful of learners the working set is tiny: one JSON snapshot per user (v7 progress is well under D1’s row limits), a few credential rows, and short-lived challenges. Pages Function invocations happen on sign-in, occasional debounced pushes, and `/api/status` checks — well inside the free daily allotment.

## Follow-ups not in this change

- Credential nicknames / a device list beyond “add another passkey”
- Custom-domain-only RP ID hardening once a production hostname is chosen
- Compressing snapshots if progress documents grow substantially
