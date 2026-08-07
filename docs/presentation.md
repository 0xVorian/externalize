# Presentation: truth tables, trees, and layout

How we choose **what** to show on screen for evaluation and structure — separate from the engine (which always uses an AST + per-node values).

## Rule of thumb

| Goal | Prefer |
|------|--------|
| Show **all cases** of a small formula (demo / watch) | **Truth table** (rows), optionally a 2×2 grid later |
| Show **one assignment** you build step by step (guided try on a small formula) | **Live truth-table row** + toggles |
| Show **how values propagate** under one assignment (practice eval, complex formulas) | **Vertical parse tree** with values on every node |
| Show **scope / main connective** (practice) | **Vertical parse tree** (tap targets, no values required) |

When the lesson is “here are the four assignments for P ∧ Q”, a parse tree is the wrong shape — it hides the 2×2 pattern and reads like an unrelated list. When the learner **sets** P and Q themselves on the same small formula, a **single live table row** plus toggles is enough. Use a parse tree when the formula has nested structure worth propagating (practice eval exercises).

## Truth table (watch lessons)

**Used today:** Level 0 watch lesson `level0-04-watch` (`P ∧ Q`, four steps).

- All rows visible; **highlight the active row**; dim inactive rows slightly.
- Columns: atom assignments + result column (formula header, e.g. `P ∧ Q`).
- Step counter (“Case 1 of 4”) plus row highlight — redundant on purpose (orientation + focus).
- Locale-aware truth labels in cells (`T`/`F` EN, `V`/`F` FR) via `formatTruthValue()`.

**Authoring:** `watchSteps` in `src/i18n/lessons.ts` — each step is `{ assignment, explanation }`. Result column is computed (`P && Q` for this lesson); do not duplicate in copy.

**Future extensions:**

- 2×2 grid view for the same data (spatial “only top-left is true” pattern) — optional alternate renderer, not a replacement for the table until tested.
- Partial tables (one missing cell) for Phase 4 interactive truth-table exercises.
- Generalize table renderer when watch lessons cover other connectives (`∨`, `→`) with the same small atom set.

## Live truth-table row (guided lessons)

**Used today:** Level 0 guided lesson `level0-05-guided` (`P ∧ Q`).

- **Toggles first** (interpretation), then a **one-row table** that updates as the learner assigns P and Q.
- Same column headers and locale labels as the watch table — learner connects “I changed P” to “the row changed”.
- No parse tree for this lesson: the tree duplicated the toggles and misaligned visually on mobile.

**When to use a tree instead:** practice evaluation on non-flat formulas (e.g. `(P → Q) ↔ ¬R`) where subformula values matter.

## Vertical parse tree (practice)

**Used today:** evaluation exercise `eval-002` and scope-tap exercises.

**Also `eval-001` (`P ∧ Q`):** uses the same **live single-row table** as the guided lesson — not a tree.

**Not used for Level 0 guided `P ∧ Q`** — see live row above.

- Single column, mobile-first; **no horizontal pan** on ~320px width.
- **Parent connective aligns with its children:** if `.tree-children` is indented, the parent’s node row gets the same left offset (`:has(> .tree-children)` in CSS). Avoids the “first line sticks out” bug.
- **Truth labels are locale-aware** everywhere (`formatTruthValue()`), including tree badges and practice eval.
- **Visual distinction:** atom badges = assigned inputs (neutral outline); connective badges = computed result (accent fill).

**When not to use a tree:** flat binary formulas shown only to enumerate truth cases (use table instead).

## Locale and notation

- Tree cells, toggles, and table cells must use the same labels per locale (`ui(locale).trueLabel` / `falseLabel`).
- Do not hardcode `T`/`F` in renderers — see `docs/i18n.md` and design principle §10.

## Adding a new presentation mode

1. Decide which pedagogical goal it serves (enumerate cases vs one assignment vs scope).
2. Add render function under `src/app/` (keep engine locale-agnostic).
3. Add UI copy in **both** `en` and `fr` (`src/i18n/`).
4. Record the decision here or in `docs/decisions.md` if non-obvious.
5. Mobile-check at ~320px before shipping.

## Related files

- `src/app/truth-table-render.ts` — shared watch / guided / eval-001 table
- `src/app/lesson-render.ts` — watch table, guided live row
- `src/app/render.ts` — practice tree + toggles
- `src/i18n/messages.ts` — `formatTruthValue`, `formatAssignmentLine`
- `src/styles/main.css` — `.truth-table-*`, `.tree-*`, `.node-value-*`
