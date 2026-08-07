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

1. **`docs/presentation.md` inventory** — Level 1 rows and 20-exercise unlock order added.
2. **Practice exercises** for Level 1 connectives — flat eval `eval-003`/`004`/`005` ship in exercise bank; nested scope/eval items follow in unlock order.

## Shipped (UX polish batch)

- **`level1Complete` flag** in progress storage (v4; migrated from v3)
- **Unit picker** in Learn tab when Unit 0 and Unit 1 are both unlocked
- **Formula-aware resume** for guided lessons (`guidedAssignment` stores all formula atoms)
- **Completion toasts** for Unit 0 and Unit 1 guided capstones
- **Progress tab** Unit 1 section uses `level1Heading` / `level1Status`

## Key files

- Definitions: `src/app/lessons.ts`
- Copy: `src/i18n/lessons.ts`
- Tables: `src/app/truth-table-render.ts`
- Guided logic: `src/app/lesson-state.ts`
- Shell: `src/app/lesson-render.ts`, `src/main.ts`, `src/app/storage.ts`
