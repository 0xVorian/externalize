# Presentation: truth tables, trees, and layout

How we choose **what** to show on screen for evaluation and structure — separate from the engine (which always uses an AST + per-node values).

## Inventory and drift control

The canonical per-item presentation inventory lives in `src/app/presentation.test.ts`; that test must cover every foundations lesson, source lesson, and exercise. The current lesson/exercise/practice-chain counts are generated into [`generated-inventory.md`](generated-inventory.md) by `npm run inventory:update` and checked by `npm run inventory:check`.

Do **not** maintain a second hand-written exhaustive ID table here. This document records the presentation rules; the test and generated inventory record the exhaustive current bank.

Current broad surfaces:

- foundations: three propositional units (`ALL_LEARN_LESSONS`);
- source route: narrow *Logic and Theism* Chapter II cards + `classify-choice` checks;
- Practice: evaluation, scope, fill-truth-table, counterexample, tautology, translation, proof-step, and source classification activities;
- Explore: free assignment manipulation, explicitly ungraded.

## Rule of thumb

| Goal | Prefer |
|------|--------|
| Show **all cases** of a small formula (demo / watch) | **Truth table** (rows) or **2×2 grid** for binary formulas |
| Show **one assignment** you build step by step (guided try on a small formula) | **Live truth-table row** with one blank target and a True/False workspace |
| Show **how values propagate** under one assignment (practice eval, complex formulas) | **Vertical parse tree** with values on every node |
| Show **scope / main connective** (practice) | **Vertical parse tree** (tap targets, no values required) |

When the lesson is “here are the four assignments for P ∧ Q”, a parse tree is the wrong shape — it hides the 2×2 pattern and reads like an unrelated list. When the learner **sets** one letter at a time on the same small formula, a **single live table row** with a blank target is enough. Use a parse tree when the formula has nested structure worth propagating (practice eval exercises).

## Truth table (watch lessons)

**Used today:** Binary watch lessons use the **2×2 grid**; single-atom watch `level1-02-neg-watch` (`¬P`, two steps) uses the **row table**.

### Row table (single-atom and fallback)

- All rows visible; **highlight the active row**; dim inactive rows slightly.
- Columns: atom assignments + result column (formula header, e.g. `P ∧ Q`).
- Step counter (“Case 1 of 4”) plus row highlight — redundant on purpose (orientation + focus).
- Locale-aware truth labels in cells (`T`/`F` EN, `V`/`F` FR) via `formatTruthValue()`.

**Single-atom default:** `level1-02-neg-watch` (`¬P`) — two rows, not a 2×2 grid.

### 2×2 grid (binary watch lessons)

**Used today:** `level0-04-watch`, `level1-05-or-watch`, `level1-08-imp-watch`, `level1-11-iff-watch`.

- **P on rows** (T then F, top to bottom), **Q on columns** (T then F, left to right); top-left cell is P=T, Q=T.
- Each cell shows the formula result under that assignment; **highlight the active cell** matching the current watch step; dim inactive cells.
- Same step counter and locale labels as the row table.
- Set per lesson via `watchLayout: 'grid' | 'table'` in `src/app/lessons.ts`; binary formulas default to grid when eligible.

**Authoring:** `watchSteps` in `src/i18n/lessons.ts` — each step is `{ assignment, explanation }`. Result cells are computed by the engine; do not duplicate in copy.

**Future extensions:**

- Layout toggle (grid ↔ table) on binary watch lessons for learners who prefer rows.
- Partial tables (one missing cell) for Phase 4 interactive truth-table exercises.

## Live truth-table row (guided lessons)

**Used today:** Level 0 guided lesson `level0-05-guided` (`P ∧ Q`), and the other `*-guided` lessons.

When exactly one sentence letter is the current target:

- Keep the formula visible.
- Show that letter as a blank, highlighted cell in the live row. Already-set letters stay in compact T/F (V/F). Letters not yet assigned render as unknown (`—`), not as a silent F.
- The result column uses **partial determination** over **committed** values only. A provisional True/False fill appears in the target cell but does not count toward the result until Check. The result shows T/F only when the committed assignment already fixes the formula; otherwise it stays blank (`—`). Example: `P ∧ Q` with committed P = F is already F; `¬P` with P unset or only provisionally selected stays unknown.
- Each guided prompt either names the requested value (`Set P to true`) or states a goal from which the value follows (`Make P → Q false`). The app does not hide a required value behind a free choice.
- Do **not** show the generic multi-row Truth assignment panel, and do not show inactive T/F controls for letters the learner is not being asked about.
- Put True / False (Vrai / Faux) in a distinct response workspace below the row. Choosing a value fills the target with formal notation only; the result stays `—` until Check / Vérifier grades it. Wrong answers stay repairable in place. After the last correct check, the derived result and done explanation appear and Continue is the primary action.

The assignment panel remains for Explore, find-counterexample, and given-assignment practice evaluation, where the learner is editing or inspecting the whole assignment.

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

## Logic and Theism Chapter II slice

Source-route cards (`lat-ii-26-*`, quantifier bridges) use the existing card lesson renderer. Graded `lat-*` items use **classify-choice**: labelled options, select then check, repair in place. They are not in the Unit 0/1/2 unlock tables above.

## Locale and notation

- Formal displays (tables, trees, assignment panels) use compact T/F and V/F via `formatTruthValue()`.
- Answer controls for a single requested truth value use ordinary words: True / False and Vrai / Faux.
- Do not hardcode `T`/`F` in renderers — see `docs/i18n.md` and design principle §10.

## Adding a new presentation mode

1. Decide which pedagogical goal it serves (enumerate cases vs one assignment vs scope).
2. Add render function under `src/app/` (keep engine locale-agnostic).
3. Add UI copy in **both** `en` and `fr` (`src/i18n/`).
4. Record the decision here or in `docs/decisions.md` if non-obvious.
5. Mobile-check at ~320px before shipping.

## Related files

- `src/app/truth-table-render.ts` — truth table, live row, watch grid
- `src/app/atom-toggles-render.ts` — shared V/F segment controls
- `src/app/lesson-render.ts` — watch table/grid, guided live row
- `src/app/classify-choice-render.ts` — select-then-check classification
- `src/app/render.ts` — practice tree + toggles
- `src/i18n/messages.ts` — `formatTruthValue`, `formatAssignmentLine`
- `src/styles/main.css` — `.truth-table-*`, `.watch-grid-*`, `.tree-*`, `.node-value-*`
