# Batch F integration review

Integrated on **2026-08-07** from base `bfa72a3` on `master`. Release cut: **v0.3.0** (`f1efc5a`).

## Merge order (master)

1. `feature/predicate-ast-spike` (5b59c5f) — fast-forward
2. `feature/exercise-template-generator` (44e3d5e)
3. `b11629d` (translation exercises translate-002–006; branch ref absent locally)
4. `feature/counterexample-exercises` (7704321)
5. `feature/validity-tautology-challenges` (2e7c0c1)
6. `feature/srs-per-skill-tuning` (b985fa5)
7. `feature/visual-concept-map` — already contained in spike/master
8. `feature/progress-onboarding` — already contained via counter merge
9. `feature/level2-nested-formulas` (6338438)
10. `feature/nd-fill-one-step` (5d80d8b)
11. `feature/playwright-smoke-tests` (9402a07)
12. `feature/release-0.3.0-prep` (10e962f)

Post-merge fix commit: `e6eb90c` (prerequisites JSON, storage v5, FR translate copy, SRS profiles, e2e onboarding).

## Conflict resolutions (high level)

| Area | Resolution |
|------|------------|
| `CHANGELOG.md` | Consolidated Batch F bullets; release prep subsection structure partially retained; final body under `[0.3.0]`. |
| `content/prerequisites.json` | Merged counters, translate-002–006, val entries from auto-merge; appended `nd-001`; fixed JSON array after integration (`e6eb90c`). |
| `src/app/lessons.ts` `LEVEL_1_PRACTICE_UNLOCK_ORDER` | Counters interleaved with tt-001–tt-003; val-001–005 after tt-005 / counter-004; translate-001–006 chained; `nd-001` last. |
| `src/app/storage.ts` v5 | `onboardingComplete` + `level2Complete`; SRS module retained; removed duplicate `migrateV4ToV5`; v4→v5 sets `onboardingComplete: true`, normalize v5 defaults false. |
| `src/app/progress-render.ts` | Both `computeWhatNext` and `renderConceptMap`; Level 2 checklist; fixed `renderListItem(locale, …)` arity. |
| `engine/index.ts` / feedback | Union exports for counterexample + tautology + proof feedback tags. |
| `src/main.ts` | Handlers for try-again, counterexample, tautology, proof, onboarding coexist. |
| Predicate AST vs translation tests | `render-routing` uses `pred` nodes for reversed-conditional check. |

## Verification

| Check | Result |
|-------|--------|
| `npm test` | **169** passed (25 files) |
| `npm run build` | Pass |
| `npm run test:e2e` | **5** passed (Playwright chromium) |

## Release

- `package.json` → **0.3.0**
- Tag **`v0.3.0`** pushed to `origin`
- `master` pushed to `origin` (`f1efc5a`)

## Worktrees

Removed after merge: `externalize-ex-gen`, `externalize-tautology`, `externalize-playwright-e2e` (forced), `ext-release-prep` (forced).

Removed in post-release housekeeping: `/tmp/externalize-counter`, `/tmp/externalize-truth-table` (forced).

## Remaining issues

- `CHANGELOG [0.3.0]` still has some duplicate bullets from parallel branch merges (content accurate, not fully deduplicated).
- Builder translation AST still uses legacy `atom` tokens internally; tests that inject `builder.formula` must use `pred` after predicate spike.
- Playwright worktrees on unsupported OS use fallback Chromium build (tests passed).
