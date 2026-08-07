# Phase 3 — Translation prototype

Design for ordinary language ↔ propositional symbols, building on the Phase 2 tree renderer and feedback loop. **Spike only** — no full exercise flow yet. See [roadmap](roadmap.md) Phase 3 and [decisions](decisions.md) (input modalities, AST-first, equivalence).

## Goal

Learners build a formula from a tap-based symbol palette (mobile primary), see scope as a vertical tree, and receive **local, repairable** feedback when the AST differs from the expected answer. One exercise should feel instructive on a ~320px phone without horizontal scrolling.

**Exit criterion (from roadmap):** One translation exercise feels instructive on a phone; feedback is local and repairable.

## Scope (this phase)

| In scope | Out of scope |
|----------|--------------|
| EN → formula via palette | Formula → EN selection |
| Tap-first formula building | Full keyboard entry |
| Live read-back (tree + Unicode string) | Spaced-repetition wiring for translation |
| AST comparison + tagged feedback | Semantic equivalence as default pass |
| Optional desktop drag-to-group **with tap equivalent** | Truth-table or proof exercises |
| One hard-coded spike exercise | Content YAML loader |

## Interaction model

### Layout (mobile primary)

```
┌─────────────────────────────┐
│ Prompt (English + atom key) │
├─────────────────────────────┤
│ Built formula preview       │  ← Unicode string + vertical tree
│ (scope boxes / indent)      │
├─────────────────────────────┤
│ Structural sub-question       │  ← optional: "main connective?"
├─────────────────────────────┤
│ Symbol palette (tap targets)  │
│ [P] [Q]  [¬][∧][∨][→][↔]     │
│ [(] [)]  [⌫] [↶]            │
├─────────────────────────────┤
│ Check / feedback panel      │
└─────────────────────────────┘
```

Palette sits **below** the preview so thumbs reach operators without obscuring scope. Minimum tap target: 44×44 CSS px (consistent with existing tree buttons).

### Tap-based symbol palette

Primary input for Phase 3. Tokens come from exercise config (`palette` in [content-model](content-model.md)):

- **Atoms** — sentence letters with optional gloss (`P` = "It rains.")
- **Connectives** — `¬`, `∧`, `∨`, `→`, `↔` (Unicode, matching engine)
- **Parentheses** — `(` `)` when `includeParentheses: true`
- **Edit** — backspace (remove last token / collapse selection), undo (one step)

Each palette button inserts a **token** into a linear **builder sequence**. The sequence is validated and compiled to an AST — not free typing.

Stub: `src/app/translation/palette-render.ts` → `renderSymbolPalette()`.

### Building from palette vs typing

| Approach | Role in Externalize |
|----------|---------------------|
| **Palette + builder** | **Primary (Phase 3).** Every symbol is explicit; no invalid characters; scope errors are structural, not parse errors. |
| **Dev/parser typing** | **Engine only.** `engine/parse/parse.ts` accepts strings for tests and authoring. Learners do not type formulas in Phase 3. |

**Builder pipeline:**

1. Learner taps palette → append token to `BuilderToken[]`.
2. `compileBuilderTokens(tokens)` → `Formula | CompileError` (balanced parens, arity checks).
3. On success: `format(formula)` for string preview, `toVerticalTree(formula)` for scope display.
4. On submit: compare learner AST to expected via `equivalent()` with exercise flags.

Typing is deferred to desktop keyboard shortcuts (Phase 4+). If added later, typed input still flows through `parse()` into the same AST type — never string comparison.

**Why not type on mobile:** Small screens, ambiguous `→` vs `-`, and paren errors produce opaque parse failures. Palette keeps errors in the feedback taxonomy (missing parens, wrong connective) instead of "parse error at position 7."

### Optional drag-to-group (desktop)

Drag can clarify scope by wrapping a contiguous sub-sequence in parentheses or applying a connective across a selection. **Required tap equivalent:**

| Drag affordance | Tap equivalent |
|-----------------|----------------|
| Drag two operands onto `∧` hub | Select left slot → tap `∧` → select right slot (or tap `∧` then fill operand slots in order) |
| Drag bracket around selection | Select range → tap `(` or `)` to wrap; or "Group" button after multi-select |
| Reorder operands | Not allowed in v1 (structural equality is order-sensitive unless commutative flag set) |

Implementation note: drag is a **view** on the same `BuilderToken[]` + selection state; no separate AST path.

## Correctness: AST comparison

Never compare display strings ([design principle §8](design-principles.md)).

Default: **structural equality** after normalization (`engine/equiv/equivalent.ts`). Per-exercise flags only — no global "accept any tautology" mode.

### When ASTs differ: diagnosis before generic "wrong"

Run a **feedback classifier** on the pair `(expected, learner)` that returns a `TranslationFeedbackTag` (extends content-model taxonomy). Order matters: check specific bugs before falling back to `wrong-operator` / generic incorrect.

| Tag | Detection sketch | Example |
|-----|------------------|---------|
| `reversed-conditional` | Learner has `imp(B, A)` where expected is `imp(A, B)` and atoms/connective multiset matches swap | "If it rains…" → `Q → P` instead of `P → Q` |
| `reversed-biconditional` | Same pattern for `iff` | |
| `negation-scope` | Expected `not(and(P,Q))`, learner `and(not(P), Q)` with ¬ misplaced | `¬P ∧ Q` vs `¬(P ∧ Q)` |
| `missing-parens` | Learner AST differs by association / missing grouping | `(P → Q) ∧ R` built as `P → Q ∧ R` |
| `wrong-main-connective` | Root connective kind differs | Used `∧` where `→` is outermost |
| `wrong-operator` | Same tree shape, one connective node differs | `∨` vs `∧` |
| `wrong-atom` | Atom name mismatch | |
| `equivalent-but-noncanonical` | `allowSemantic` true and semantically equal but not structural | Informational, not failure |
| `extra-parens` | Structural match modulo redundant grouping | Warn only if equivalent |

Classifier lives in **`engine/feedback/translation.ts`** (new module, not in spike). MVP-0 scope feedback in `engine/feedback/scope.ts` is the pattern to follow.

Structural sub-question (per exercise): reuse `checkMainConnectiveSelection()` on the learner tree — reinforces scope vocabulary from Phase 2.

## Live read-back preview

On every successful compile:

1. **Unicode line** — `format(learnerAst)` via `engine/render/display.ts`.
2. **Vertical tree** — `toVerticalTree(learnerAst)` via `engine/render/tree.ts`.
3. **Empty / invalid** — placeholder or inline compile hint (unbalanced `(`).

Preview updates synchronously on each tap; no submit required to see scope.

## Connection to existing engine

| Engine module | Translation use |
|---------------|-----------------|
| `engine/ast/types.ts` | Canonical `Formula` for learner + expected |
| `engine/parse/parse.ts` | Authoring expected answers; dev harness |
| `engine/render/display.ts` | Unicode preview string |
| `engine/render/tree.ts` | Scope visualization, structural sub-questions |
| `engine/equiv/equivalent.ts` | Correctness check with per-exercise flags |
| `engine/feedback/scope.ts` | Pattern for tagged templates + `resolveFeedback()` |
| `engine/eval/evaluate.ts` | Not used in translation v1 |

App layer (`src/app/translation/`): types, `renderSymbolPalette()`, later builder reducer and exercise shell.

## Example exercise (spike target)

- **Prompt:** "If it rains, then the game is cancelled."
- **Atoms:** `P` = It rains.; `Q` = The game is cancelled.
- **Expected:** `(P → Q)`
- **Structural check:** main connective = `→`

## Implementation sequence (recommended)

1. **Builder + compile** — `BuilderToken[]` → AST; unit tests.
2. **Palette render + reducer** — wire tap actions; preview via tree renderer.
3. **`engine/feedback/translation.ts`** — classifier for priority tags.
4. **One end-to-end exercise** — hard-coded `translate-001`.
5. **Structural sub-question** — optional gate before full AST check.
6. **Desktop drag** — only after tap path is complete.
7. **Content YAML** — when schema stabilizes.

## Related files

- Spike stub: [`src/app/translation/`](../src/app/translation/)
- Roadmap: [Phase 3](roadmap.md#phase-3--translation-prototype)
- Exercise schema: [content-model](content-model.md)
