# Level 1 integration notes — historical

**Status:** historical integration record. Unit 1 is fully shipped and has since been extended with nesting, translation, clustered Practice, session-first orchestration, and progress v7. Use `docs/content-model.md`, `docs/presentation.md`, and `docs/roadmap.md` for current behavior.

Unit 1 (connectives beyond ∧) was **content-complete** and **minimally wired** at the time of this record.

## What ships in this batch

| Area | Status |
|------|--------|
| `LEVEL_1_LESSONS` (12 lessons) | Done |
| EN + FR copy in `src/i18n/lessons.ts` | Done |
| Truth-table renderer (engine-backed, variable atom columns) | Done |
| Guided step progression (`atom` + `value` in copy) | Done |
| Navigation: Unit 0 → Unit 1 → practice | Done |
| Gating: Unit 1 after `level0Complete` | Done |
| Practice unlock: Unit 0 after `level0Complete`, Unit 1 after `level1Complete` | Done |
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

## Practice tiers

| Tier | Gate | First exercises |
|------|------|-----------------|
| Unit 0 | `level0Complete` | `eval-001` → `scope-012` |
| Unit 1 | `level1Complete` (all 12 lessons) | `eval-010` (¬P) → flat eval for ∨/→/↔ → nested scope/eval |

New exercise IDs: **`eval-010`**, **`scope-012`**.

## Historical follow-ups

The original follow-up list is superseded: formula-aware guided state, unit navigation/completion surfaces, and later persistence/session changes have all moved on. Do not use this file as a backlog.

## Key files

- Definitions: `src/app/lessons.ts`
- Copy: `src/i18n/lessons.ts`
- Tables: `src/app/truth-table-render.ts`
- Guided logic: `src/app/lesson-state.ts`
- Shell: `src/app/lesson-render.ts`, `src/main.ts`, `src/app/storage.ts`
