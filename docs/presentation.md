# Presentation: truth tables, trees, and layout

How we choose **what** to show on screen for evaluation and structure — separate from the engine (which always uses an AST + per-node values).

## Inventory (current content)

Use this when adding exercises or wondering what UI you will see.

### Level 0 — Course

| ID | Title (EN) | Presentation | Notes |
|----|------------|--------------|-------|
| `level0-01-letters` | Sentence letters | Card (text) | No formula tree |
| `level0-02-truth` | Truth assignments | Card (text) | |
| `level0-03-and` | Conjunction ∧ | Card (text) | Truth-table notation in example block |
| `level0-04-watch` | Worked cases: P ∧ Q | **4-row truth table** | Highlight steps 1–4 |
| `level0-05-guided` | Guided: P ∧ Q | **Toggles + live row** | Same table as watch, one row |

### Level 1 — Connectives

| ID | Title (EN) | Presentation | Notes |
|----|------------|--------------|-------|
| `level1-01-neg` | Negation | Card (text) | |
| `level1-02-neg-watch` | Worked cases: ¬P | **2-row truth table** | Single atom |
| `level1-03-neg-guided` | Guided: ¬P | **Toggles + live row** | One atom column |
| `level1-04-or` | Disjunction ∨ | Card (text) | |
| `level1-05-or-watch` | Worked cases: P ∨ Q | **4-row truth table** | |
| `level1-06-or-guided` | Guided: P ∨ Q | **Toggles + live row** | |
| `level1-07-imp` | Material conditional → | Card (text) | |
| `level1-08-imp-watch` | Worked cases: P → Q | **4-row truth table** | |
| `level1-09-imp-guided` | Guided: P → Q | **Toggles + live row** | |
| `level1-10-iff` | Biconditional ↔ | Card (text) | |
| `level1-11-iff-watch` | Worked cases: P ↔ Q | **4-row truth table** | |
| `level1-12-iff-guided` | Guided: P ↔ Q | **Toggles + live row** | |

### Practice — tiered unlock (22 exercises)

**Unit 0** (after introductory unit complete):

| Order | ID | Formula | Type | Presentation |
|-------|-----|---------|------|--------------|
| 1 | `eval-001` | `P ∧ Q` | Evaluate | **Toggles + live row** |
| 2 | `scope-012` | `(P ∧ Q) ∧ R` | Main connective | **Tree (tap only)** |

**Unit 1** (after all 12 Level 1 lessons):

| Order | ID | Formula | Type | Presentation | Likely issues |
|-------|-----|---------|------|--------------|---------------|
| 1 | `eval-010` | `¬P` | Evaluate | **Toggles + live row** | |
| 2 | `eval-003` | `P ∨ Q` | Evaluate | **Toggles + live row** | |
| 3 | `eval-004` | `P → Q` | Evaluate | **Toggles + live row** | |
| 4 | `eval-005` | `P ↔ Q` | Evaluate | **Toggles + live row** | |
| 5 | `scope-003` | `¬(P ∧ Q)` | Main connective | **Tree (tap only)** | |
| 6 | `scope-009` | `¬P ∧ Q` | Main connective | **Tree (tap only)** | |
| 7 | `scope-004` | `P ∨ (Q ∧ R)` | Main connective | **Tree (tap only)** | |
| 8 | `scope-007` | `(P ∧ Q) ∨ R` | Main connective | **Tree (tap only)** | |
| 9 | `eval-002` | `(P → Q) ↔ ¬R` | Evaluate | **Tree + toggles (P,Q,R)** | Nested tree |
| 10 | `eval-006` | `(P ∨ Q) → R` | Evaluate | **Tree + toggles** | |
| 11 | `eval-007` | `P ∧ (Q ∨ R)` | Evaluate | **Tree + toggles** | |
| 12 | `eval-008` | `¬(P ∧ Q)` | Evaluate | **Tree + toggles** | |
| 13 | `eval-009` | `(P → Q) ∧ R` | Evaluate | **Tree + toggles** | |
| 14 | `scope-001` | `(P → Q) ∧ R` | Main connective | **Tree (tap only)** | Classic “pick ∧ not →” |
| 15 | `scope-005` | `(P ∨ Q) → R` | Main connective | **Tree (tap only)** | |
| 16 | `scope-006` | `¬(P → Q)` | Main connective | **Tree (tap only)** | |
| 17 | `scope-008` | `P → (Q ∨ R)` | Main connective | **Tree (tap only)** | |
| 18 | `scope-010` | `(P → Q) → R` | Main connective | **Tree (tap only)** | |
| 19 | `scope-011` | `P ↔ (Q → R)` | Main connective | **Tree (tap only)** | |
| 20 | `scope-002` | `(P → Q) ↔ ¬R` | Main connective | **Tree (tap only)** | Deepest scope tree |

### Other screens

| Screen | Presentation |
|--------|--------------|
| Progress | Checklists, stats, export/import — no formulas |

### Auto-routing rule (code)

- `usesLiveTruthRow(formula)` → true for flat lesson/practice formulas: `P ∧ Q`, `¬P`, `P ∨ Q`, `P → Q`, `P ↔ Q` (`src/app/truth-table-render.ts`).
- Nested or multi-atom formulas stay on parse-tree eval; add new flat formulas to the set explicitly when authoring.

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
- **Interpretation controls:** each letter has explicit **V / F segment buttons** (not a single opaque row); hint text under the panel title explains tap-to-set.

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

- `src/app/atom-toggles-render.ts` — shared V/F segment controls
- `src/app/lesson-render.ts` — watch table, guided live row
- `src/app/render.ts` — practice tree + toggles
- `src/i18n/messages.ts` — `formatTruthValue`, `formatAssignmentLine`
- `src/styles/main.css` — `.truth-table-*`, `.tree-*`, `.node-value-*`
