# Batch 2 review — parallel feature branches

Base: `origin/master` @ `42b2240`

## Summary

All 10 expected branches were present and reviewed. Integration landed on `master` via ordered merges (docs/tests first on master, then `feature/ux-polish` batch merge). Critical fixes applied during integration are listed below.

---

## feature/predicate-logic-doc

**OK**

- Docs-only: `docs/predicate-logic.md`, README/future-work links.
- No runtime impact.

---

## feature/natural-deduction-doc

**OK**

- Docs-only: `docs/natural-deduction.md`.
- No runtime impact.

---

## feature/render-tests

**OK**

- Added `src/app/render-routing.test.ts`, truth-table render tests.
- Minor: tests assume optional `formula` on evaluate exercises — fixed post-merge (`formula!` guard).

---

## feature/a11y

**Minor**

- ARIA roles/labels on trees, tables, mode nav, progress cards; `:focus-visible` outlines.
- Snapshot update for `aria-current="step"` on watch lessons.
- No critical issues.

---

## feature/grid-renderer

**Critical (fixed)**

- Branch shipped docs/tests but initial tip lacked wired `renderWatchGrid()` in lesson flow.
- **Fix:** Implemented `usesWatchGrid()` / `renderWatchGrid()` in `truth-table-render.ts`, wired in `lesson-render.ts`, CSS + i18n (`watchGridPrompt`, `watchGridAria`).

---

## feature/pwa-concept-map

**OK**

- Service worker registration in `main.ts`, manifest, progress concept map.
- No blocking issues.

---

## feature/ux-polish

**Critical (fixed)**

- Storage v4 migration (`level0Complete`, tiered unlock) conflicted with level1-practice unlock order.
- Branch was reset by parallel agents; recovered from stash (`8acb9aa`).
- **Fix:** Merged v4 storage with tiered `LEVEL_0/LEVEL_1_PRACTICE_UNLOCK_ORDER`; progress UI tier headings; import test expects v4.

---

## feature/truth-table-exercises

**Critical (fixed)**

- `fill-truth-table-cell` state/render (`submittedCell`, `partialTable`, `submitCellValue`) lost during parallel merges.
- **Fix:** Merged fill logic into unified `state.ts` / `render.ts`; added tt-001–tt-005 i18n (`getCellFeedback`, `cellFillAria`); prerequisites entries.

---

## feature/level1-practice

**Minor (fixed)**

- Added `eval-010`, `scope-012`, tiered unlock gates.
- **Fix:** Restored missing exercise definitions and i18n; prerequisites for eval-010/scope-012.

---

## feature/phase3-translate-mvp

**Critical (fixed)**

- Translation engine + palette UI cherry-picked but `state.ts` / `main.ts` diverged from fill-truth-table branch.
- **Fix:** Unified `AppState` (builder + partialTable); merged palette handlers in `main.ts`; `translate-001` in exercises, prerequisites, presentation inventory.

---

## Merge notes (master)

Merge order on master:

1. predicate-logic-doc, natural-deduction-doc, render-tests, a11y, grid-renderer (individual merges)
2. `feature/ux-polish` batch merge (pwa, truth-table, level1-practice, phase3, ux polish)

Post-merge integration commit: `c55974f` (state/render/i18n/prerequisites).
Final merge commit: `6140a3b`.

Conflict zones resolved:

| Area | Resolution |
|------|------------|
| `storage.ts` | v4 + tiered unlock retained |
| `state.ts` | fill + translation combined |
| `render.ts` | a11y tree markup + fill + translation routing |
| `truth-table-render.ts` | grid + partial table |
| `CHANGELOG.md` | deduplicated Unreleased entries |
| `messages.ts` / `lessons.ts` | a11y + fill + grid i18n merged |

Verification: **108 tests**, build clean.
