# Batch G integration review

**Base:** `master` @ `c066ceb` (v0.3.0 post-housekeeping)  
**Release:** v0.3.1 — 2026-08-07  
**Integration commit:** post-merge on `master` (see git log)

## Branches merged (9/9)

| Branch | Tip | Notes |
|--------|-----|--------|
| `feature/translation-pred-tokens` | `bb9e615` | Fast-forward; builder `pred` tokens |
| `feature/translation-semantic-equiv` | `975adc0` | Merge; semantic equivalence in feedback |
| `feature/level2-de-morgan-guided` | `ded9557` | Merge; `level2-09-de-morgan-guided` |
| `feature/level2-practice` | `3dfb49f` | Merge; Unit 2 practice tier |
| `feature/nd-exercise-002` | `c45e71d` | Merge; `nd-002` ∧ elimination |
| `feature/eval-exercise-expansion` | `952f0d6` | Merge; `eval-011`–`eval-020` |
| `feature/arrow-key-tree-nav` | `e0a68d1` | Merge; tree keyboard a11y |
| `feature/e2e-expansion` | `317a187` | Merge; 3 new Playwright smokes |
| `feature/github-actions-ci` | `3e874c9` | Already ancestor via e2e branch (CI workflow) |

**Skipped:** None (all branches materialized after ~5 min polling).

## Merge order

1. Translation pred tokens → semantic equiv  
2. Level 2 guided lesson → Level 2 practice  
3. `nd-002` → eval expansion → arrow keys → e2e → CI (already present)

## Conflict resolutions

- **`CHANGELOG.md`:** Consolidated `[Unreleased]` bullets across merges; removed erroneous duplicate Level 2 / tree-nav entries under `[0.3.0]`.
- **`content/prerequisites.json`:** Merged Level 2 practice entries with `nd-002`; repaired JSON tail after nd merge.
- **`eval-011` / `eval-012` ID collision:** Level 1 expansion keeps `eval-011`–`eval-020`; Level 2 practice renumbered to **`eval-021`** / **`eval-022`** in `exercises.ts`, `lessons.ts`, prerequisites, i18n, and presentation inventory.
- **`src/i18n/messages.ts`:** Rebuilt EN/FR prompts from `feature/eval-exercise-expansion` + Level 2 `eval-021`/`eval-022` / scope entries.
- **`content/exercise-templates.json`:** 22 eval templates (20 expansion + 2 Level 2).
- **`tools/exercise-generator/generate.test.ts`:** Expect scope 14, eval 22, fillTruthTable 6.

## Post-merge fix

- **`e2e/smoke/translate-002.spec.ts`:** Palette inserts use `pred` (not legacy `atom`) after pred-token migration.

## Verification

| Command | Result |
|---------|--------|
| `npm test` | **197** tests passed (26 files) |
| `npm run build` | Success |
| `npm run test:e2e` | **9** passed (Chromium) |

## Release

- Version **0.3.1** in `package.json`
- Tag **`v0.3.1`** pushed with `master`
