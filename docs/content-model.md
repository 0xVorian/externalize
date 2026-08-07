# Content Model

Sketch of how lessons, exercises, and progress will be represented. **Provisional** — refine when the first prototype exists.

## Design goals

- Content authors edit JSON/YAML, not TypeScript
- Engine validates schema and runs exercises
- Same AST format for expected answers, learner input, and feedback templates
- Skill tags drive spaced repetition independently of lesson grouping
- Exercise UIs must be completable on a phone browser (tap-first; no hover-only steps)

## Concept graph (illustrative)

Concepts are nodes; edges are prerequisites.

```
proposition          → (none)
negation             → proposition
conjunction          → proposition, negation
disjunction          → proposition, negation
conditional          → proposition, negation, conjunction, disjunction
biconditional        → conditional
scope-and-parens     → all connectives
translate-en-to-sym  → scope-and-parens
translate-sym-to-en  → scope-and-parens
evaluate             → scope-and-parens
truth-table          → evaluate
validity-counterex   → truth-table
```

The visible concept map renders from this graph plus per-user mastery scores.

## Exercise schema (draft)

```yaml
id: translate-001
type: translate-en-to-formula
skill: translate-en-to-formula
concepts: [conditional, scope-and-parens]

prompt:
  english: "If it rains, then the game is cancelled."
  atoms:
    P: "It rains."
    Q: "The game is cancelled."

expected:
  # Canonical answer; engine compares via AST
  formula: "(P → Q)"

  # Optional: accept any semantically equivalent formula
  acceptEquivalent: false

palette:
  atoms: [P, Q]
  connectives: [¬, ∧, ∨, →, ↔]
  includeParentheses: true

structuralCheck:
  type: main-connective
  expected: →

feedback:
  reversed-conditional:
    message: "The antecedent and consequent appear reversed. 'If A, then B' becomes (A → B), not (B → A)."
  negation-scope:
    message: "Negation applies only to the nearest expression."
  missing-parens:
    message: "Parentheses are needed here to show which subformula the connective governs."

hints:
  - "Identify the two simple statements first."
  - "'If … then …' maps to a conditional."
  - "The condition after 'if' is the antecedent (left side of →)."
```

## Exercise types (engine interface)

MVP-0 uses `identify-main-connective`, `identify-scope`, and `evaluate-formula` first. Translation types follow in Phase 3.

| `type` | Learner action | Engine checks |
|--------|----------------|---------------|
| `identify-main-connective` | Tap the main operator in the tree | Selected node matches root connective |
| `identify-scope` | Tap subexpression boundaries | Selected region matches expected scope |
| `evaluate-formula` | Toggle atom values; read computed nodes | All node values match evaluation |
| `recognize-operator` | Multiple choice | Selected option |
| `translate-en-to-formula` | Build AST from palette | AST equality (or semantic equivalence) |
| `translate-formula-to-en` | Select or compose English | Match against allowed paraphrases |
| `evaluate-step` | Choose truth value of highlighted subexpr | Matches evaluation under assignment |
| `truth-table-cell` | Fill one cell | Matches column computation |
| `truth-table-column` | Fill entire column | Matches derived column |

### Truth-table exercises (Phase 4 prep)

`engine/truth-table/` generates and validates tables using **locale-agnostic booleans**; the UI maps values via `formatTruthValue()`.

| Helper | Role |
|--------|------|
| `generateTruthTable(formula, atoms)` | Full table for watch lessons and answer keys |
| `maskTruthTableRows(table, hiddenRowIndices)` | Partial table with blank result cells for `truth-table-cell` |
| `validateCell(formula, assignment, submitted)` | Single-cell check; returns `{ correct, expected }` |

Exercise definitions will supply the `atoms` column list and parsed formula; content files do not store `T`/`F` labels.
| `find-counterexample` | Set atom truth values | Premises true, conclusion false |
| `choose-rule` | Pick inference rule | Rule applicable to cited lines |
| `proof-fill-step` | Supply one proof line | Line valid given scope and citations |
| `proof-repair` | Explain or fix invalid step | Identifies specific rule violation |
| `compare-equivalence` | Yes/no or select equivalent | Semantic equivalence |

## Progress record (local storage, draft)

```typescript
interface ProgressRecord {
  version: 1;
  lastSession: string; // ISO date

  concepts: Record<string, {
    mastery: number;       // 0–1, derived from retrieval success
    lastReviewed: string;
    nextReview: string;
  }>;

  skills: Record<string, {
    attempts: number;
    errors: number;
    recentErrorTags: string[]; // e.g. "reversed-conditional"
  }>;

  srsQueue: Array<{
    exerciseId: string;
    due: string;
    interval: number;
    ease: number;
  }>;
}
```

Spaced repetition schedules by **demonstrated error tags**, not mere completion.

## Feedback tag taxonomy (starter set)

Propositional logic v1:

- `reversed-conditional`
- `reversed-biconditional`
- `negation-scope`
- `missing-parens`
- `extra-parens` (cosmetic — warn, don't fail, if equivalent)
- `wrong-main-connective`
- `wrong-operator`
- `wrong-atom`
- `assignment-premise-false`
- `assignment-conclusion-true` (counterexample incomplete)
- `equivalent-but-noncanonical` (informational)

Predicate logic and proof tags added in later phases.

## MVP-0 exercise example (draft)

```yaml
id: scope-001
type: identify-main-connective
skill: recognize-operator
concepts: [conditional, scope-and-parens]

display:
  formula: "(P → Q) ∧ R"
  layout: vertical-tree   # mobile-first renderer

expected:
  mainConnective: ∧
  # learner taps the ∧ node at the root

feedback:
  selected-conditional:
    message: "→ is the main connective of (P → Q), but not of the whole formula. The outer operator binds last."
  selected-atom:
    message: "P is an operand, not a connective."
```

## File layout (planned)

```
content/
  concepts.yaml          # concept graph
  lessons/
    01-atoms.yaml
    02-negation.yaml
    ...
  exercises/
    translate/
      001.yaml
      ...
engine/
  ast/
  parse/
  eval/
  feedback/
  truth-table/
app/
  ...                    # UI shell
```

Exact directory names may change at implementation time; the separation of `content/` and `engine/` will not.
