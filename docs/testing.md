# Testing

Externalize has two test layers:

| Layer | Command | Scope |
|-------|---------|-------|
| Unit / integration | `npm test` | Engine, storage, render helpers, i18n (Vitest) |
| Browser smoke | `npm run test:e2e` | Five critical user flows (Playwright) |

## Unit tests (Vitest)

```bash
npm test
npm run test:watch   # watch mode
```

Vitest config: [`vitest.config.ts`](../vitest.config.ts).

## End-to-end smoke tests (Playwright)

Playwright runs against a real browser. By default the config **builds and serves** the production bundle via `vite preview` on port `4173`.

```bash
npm run test:e2e
```

### Faster local iteration (dev server)

Point Playwright at the Vite dev server instead of preview:

```bash
PLAYWRIGHT_DEV=1 npm run test:e2e
```

Or start `npm run dev` yourself and set `PLAYWRIGHT_PORT` if you use a non-default port.

### Interactive UI

```bash
npm run test:e2e:ui
```

### Smoke coverage

| Spec | Flow |
|------|------|
| `e2e/smoke/level0-lesson.spec.ts` | Complete all five Level 0 lessons; practice unlocks |
| `e2e/smoke/tt-001.spec.ts` | Fill-truth-table cell submission |
| `e2e/smoke/translate-001.spec.ts` | Symbol-palette translation exercise |
| `e2e/smoke/progress-sync.spec.ts` | Progress export → clear → import |
| `e2e/smoke/unit-picker.spec.ts` | Unit 0 / Unit 1 tab navigation |

Helpers under `e2e/helpers/` seed `localStorage` with the same progress shapes the app uses in production.

### Selectors

Tests prefer stable `data-action` hooks already used by the app. A minimal `data-testid="unit-picker"` is added on the learn-path unit tabs.

### CI

There is no GitHub Actions workflow in this repository yet. When CI is added, run:

```bash
npm ci
npx playwright install --with-deps chromium
npm run test:e2e
```

Set `CI=1` so Playwright does not reuse an existing server and enables retries.

### First-time setup

After `npm install`, download browsers once:

```bash
npx playwright install chromium
```
