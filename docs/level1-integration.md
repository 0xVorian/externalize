# Level 1 integration notes

Unit 1 (connectives beyond ∧) is **content-complete** and **minimally wired** in the app.

## What ships in this batch

| Area | Status |
|------|--------|
| `LEVEL_1_LESSONS` (12 lessons) | Done |
| EN + FR copy in `src/i18n/lessons.ts` | Done |
| Truth-table renderer (engine-backed, variable atom columns) | Done |
| Guided step progression (`atom` + `value` in copy) | Done |
| Navigation: Unit 0 → Unit 1 → practice | Done |
| Gating: Unit 1 after `level0Complete` | Done |
| Practice unlock: still after Unit 0 | Done |
| Progress checklist for Unit 1 | Done |

## Lesson inventory

| ID | Connective | Type | Formula |
|----|------------|------|---------|
| `level1-01-neg` | ¬ | card | — |
| `level1-02-neg-watch` | ¬ | watch | `¬P` (2 rows) |
| `level1-03-neg-guided` | ¬ | guided | `¬P` |
| `level1-04-or` | ∨ | card | — |
| `level1-05-or-watch` | ∨ | watch | `P ∨ Q` |
| `level1-06-or-guided` | ∨ | guided | `P ∨ Q` |
| `level1-07-imp` | → | card | — |
| `level1-08-imp-watch` | → | watch | `P → Q` |
| `level1-09-imp-guided` | → | guided | `P → Q` |
| `level1-10-iff` | ↔ | card | — |
| `level1-11-iff-watch` | ↔ | watch | `P ↔ Q` |
| `level1-12-iff-guided` | ↔ | guided | `P ↔ Q` |

## Remaining work (future batches)

1. **`docs/presentation.md` inventory** — add Level 1 rows to the course table.
2. **Practice exercises** for Level 1 connectives (eval-003+ or extend unlock order).
3. **`level1Complete` flag** in progress storage (optional; currently inferred from `lessonsCompleted`).
4. **Resume migration** — `guidedAssignment` resume snapshot still stores `{ P, Q }` only; sufficient for current formulas but should become formula-aware if atoms beyond P/Q appear.
5. **Unit picker in Learn tab** — let learners jump between Unit 0 and Unit 1 when both are unlocked.
6. **Completion toast** — surface `level0Complete` / Unit 1 complete messages from `learnUi` (copy exists for Unit 0; Unit 1 message TBD).

## Key files

- Definitions: `src/app/lessons.ts`
- Copy: `src/i18n/lessons.ts`
- Tables: `src/app/truth-table-render.ts`
- Guided logic: `src/app/lesson-state.ts`
- Shell: `src/app/lesson-render.ts`, `src/main.ts`, `src/app/storage.ts`
