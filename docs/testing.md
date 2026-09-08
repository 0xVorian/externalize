# Testing

Externalize has two test layers:

| Layer | Command | Scope |
|-------|---------|-------|
| Unit / integration | `npm test` | Engine, storage, render helpers, i18n (Vitest) |
| Browser smoke | `npm run test:e2e` | Critical integration flows plus a targeted mobile matrix (Playwright) |

## Repository inventory drift check

`docs/generated-inventory.md` is generated from the current lesson/exercise/practice-chain source. Verify it during housekeeping/content changes with:

```bash
npm run inventory:check
```

If lesson/exercise inventory intentionally changes, refresh it with `npm run inventory:update` and commit the generated file.

`npm run release:check` also includes this inventory check before unit/build/E2E verification.

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
| `e2e/smoke/onboarding.spec.ts` | First-run intro skip and finish |
| `e2e/smoke/counter-001.spec.ts` | Find-counterexample toggle and check |
| `e2e/smoke/translate-002.spec.ts` | Translation try-again after wrong answer |
| `e2e/smoke/evaluate-lifecycle.spec.ts` | Explicit prediction, wrong-answer repair, exactly-once finalization |
| `e2e/smoke/scope-repair.spec.ts` | Wrong scope selection repaired inside one attempt |
| `e2e/smoke/proof-rules.spec.ts` | `nd-001` and `nd-002` through rendered rule controls |
| `e2e/smoke/practice-resume.spec.ts` | Translation and proof draft hydration after reload |
| `e2e/smoke/biconditional-symmetry.spec.ts` | Swapped biconditional operands accepted through the UI |
| `e2e/smoke/french-content.spec.ts` | French-authored prompt and atom gloss rendering |
| `e2e/mobile/high-risk.spec.ts` | Watch, evaluation, scope, translation, truth table, and proof at 320px and 390px |
| `e2e/smoke/progress-visibility.spec.ts` | Learn meters, Unit 1 lesson count, practice session counting, consistency/scaffold moments, Unit 2 completion one-shot, session complete, Progress capability summary |
| `e2e/smoke/session-first.spec.ts` | Opening offer, bounded-round start/resume/completion, effort contract, import invalidation, re-entry and telemetry boundaries |
| `e2e/smoke/source-route.spec.ts` | Logic and Theism route planning, repair, terminal completion/revisit, and source-return behavior |
| `e2e/smoke/guided-evaluation.spec.ts` | Guided unset/partial assignment semantics, True/False → formal notation bridge, provisional selection, explicit Check and repair |
| `e2e/smoke/ui-remediation.spec.ts` | Exercise stimulus/response/action visual contract and feedback-facing regressions |
| `e2e/smoke/pwa-offline.spec.ts` | Installed/offline navigation shell reload |
| `e2e/smoke/repaired-review-priority.spec.ts` | Immediately due repaired reviews are not starved by frontier work |

Helpers under `e2e/helpers/` seed `localStorage` with the same progress shapes the app uses in production.

Desktop Chromium runs the complete smoke directory. The mobile projects run only `e2e/mobile/` at 320×640 and an emulated 390px phone, so the full suite is not multiplied across devices.

### Selectors

Tests prefer stable `data-action` hooks already used by the app. A minimal `data-testid="unit-picker"` is added on the learn-path unit tabs.

### CI

GitHub Actions runs on every push and pull request to `master` (see [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)):

| Job | Steps |
|-----|-------|
| `test-and-build` | `npm ci` → `npm test` → `npm run build` |
| `e2e` | `npm ci` → Playwright Chromium install → `npm run test:e2e` with `CI=true` |

The e2e job runs after unit tests and build succeed. Playwright config enables retries and a single worker when `CI` is set.

To reproduce locally:

```bash
npm ci
npm run inventory:check
npm test && npm run build
npx playwright install --with-deps chromium
CI=1 npm run test:e2e
```

If browser smoke tests become flaky on GitHub runners, investigate and isolate the flaky case. Do not weaken or disable the E2E merge gate as routine housekeeping; any temporary CI bypass should be an explicit, separately reviewed decision.

### First-time setup

After `npm install`, download browsers once:

```bash
npx playwright install chromium
```
