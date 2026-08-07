# Phase 5 — Natural deduction (prep)

Design prep for Fitch-style proof exercises on mobile. **No proof UI in this document's scope** — record constraints, rule-set options, and exercise patterns so Phase 5 implementation does not stall on unknowns. See [roadmap](roadmap.md) Phase 5, [decisions](decisions.md) (proof system), and [design principles](design-principles.md) (externalized state, repairable feedback).

## Goal

Learners apply introduction and elimination rules in a **line-based proof editor** with visible scope, cite prior lines correctly, and receive **local, repairable** feedback when a step is invalid. Exercises start with **fill-one-step** and **repair-step** patterns before open-ended construction.

**Exit criterion (from roadmap):** A fill-one-step exercise on a ~320px phone feels instructive; scope and citation errors are named without restarting the whole proof.

## Dependencies on propositional MVP (Phase 4)

Natural deduction UI must not begin until Phase 4 interaction patterns are stable. Concrete prerequisites:

| Phase 4 capability | Why ND needs it |
|--------------------|-----------------|
| **Scope visualization** (tree, boxes, indent) | Subproofs reuse the same "what is inside this boundary?" mental model as formula scope |
| **Tap-first input** with 44×44px targets | Line citations and rule picker are tap-heavy; no hover-only affordances |
| **Local, repairable feedback** taxonomy | Proof errors (wrong rule, out-of-scope citation) follow the same feedback shape as translation and eval |
| **AST-first engine** | Each proof line stores a `Formula`; rule application validates against AST structure, not strings |
| **Truth-table / counterexample exercises** | Learners understand validity and invalidity before constructing derivations |
| **Hand-authored exercise bank + skill tags** | Proof exercises extend `ExerciseType`, `FeedbackTag`, and SRS by demonstrated error |
| **Operator reference panel** (pin-able sheet) | Rule prerequisites mirror connective reference — learners pin rules beside the proof |

**Engine gaps to close in Phase 5 (not Phase 4):**

- Proof state type: ordered lines with `{ formula, justification, subproofLevel }`
- Rule catalog: named rules with arity, premise shape, and conclusion shape
- Step validator: given proof state + proposed line, return `{ ok } | { error: FeedbackTag, detail }`
- Scope checker: whether a cited line index is accessible from the current subproof

Phase 3 translation and Phase 4 truth-table work **de-risk** input and feedback but do not replace proof validation.

## Fitch-style layout (mobile constraints)

Target notation: **Fitch-style** — line numbers, one formula per line, justifications on the right, **indented subproofs** with visible scope boxes. Aligns with [decisions](decisions.md) and standard introductory logic texts.

### Layout sketch (~320px width)

```
┌─────────────────────────────┐
│ Premises + ⊢ conclusion     │  ← always visible (pinned header)
├─────────────────────────────┤
│ 1  P → Q          Premise   │
│ 2  P              Premise   │
│ ├─ 3  Q           Assump    │  ← subproof: box + indent
│ │   4  ...        MP, 1,2   │
│ └─                              │
│ 5  [ learner fills ]          │  ← active step highlighted
├─────────────────────────────┤
│ Rule picker (sheet)           │  ← bottom sheet, large taps
│ [∧I] [∧E] [→E] [→I] …       │
├─────────────────────────────┤
│ Cite lines: [1][2][3]…      │  ← tap line numbers, not drag
├─────────────────────────────┤
│ Feedback (local repair)       │
└─────────────────────────────┘
```

### Non-negotiable mobile constraints

From [design principles](design-principles.md) §9 and Phase 2–3 lessons:

| Constraint | Proof-specific application |
|------------|----------------------------|
| **Single column, vertical scroll** | Proof grows downward; no horizontal proof panes |
| **No horizontal scrolling** | Long formulas wrap or use collapsible subformula nodes (reuse tree renderer) |
| **44×44px minimum tap targets** | Line-number chips for citation; rule buttons in grid, not dense text links |
| **Tap-first citations** | Select rule → tap cited line numbers; optional desktop keyboard shortcuts later |
| **No colour-only scope** | Subproof boundaries use indent + left border/box + "Subproof" label |
| **Pinned context** | Premises, target conclusion, and current subproof assumption stay visible or one tap away |
| **Repair, don't restart** | Invalid step edits in place; prior correct lines remain locked |

### Justification column

On narrow screens the justification column competes with formulas for width.

**Provisional approach:**

1. **Primary row:** line number + formula (full width)
2. **Secondary row:** justification text, indented, smaller type — e.g. `→E, 1, 2`
3. **Collapsed mode (optional):** show only rule abbreviations on the line; expand on tap for full citation list

Avoid a fixed two-column table that forces horizontal scroll. Desktop may show classic Fitch columns side-by-side as a progressive enhancement.

### Vertical proof layout

Prefer **stacked lines** over sideways "textbook spread." Each line is a card-like row:

- Left gutter: line index (tap target for citation)
- Center: formula (Unicode, wraps)
- Subproof: additional left padding (8–16px per level) + vertical scope bar

Maximum practical subproof depth on 320px: **2–3 levels** before horizontal formula space becomes tight. Authoring should cap starter exercises at depth 2; deeper nesting is advanced content with collapsible assumption lines.

## Scope and subproof UI challenges (320px)

Subproofs are the highest-risk UI element — they combine indentation, assumption discharge, and citation rules.

### Challenge 1: Visible scope without horizontal space

| Technique | Role |
|-----------|------|
| **Left scope bar** | Continuous vertical line for open subproof; corner bracket at discharge |
| **Indent per level** | 12–16px per subproof level (test with longest plausible formula) |
| **Assumption label** | Text: "Assumption: Q" on the opening line, not only "Assump" |
| **Discharge marker** | Closing line shows rule name + discharged assumption line number |

Colour may highlight **active subproof** but must duplicate with bold border or "Active subproof" text.

### Challenge 2: Citing lines across scope boundaries

Learners must learn which lines are **accessible** from the current line.

- **Accessible lines:** same subproof or outer scope; not lines in sibling subproofs or discharged inner subproofs
- **UI:** When picking citations, **disable** inaccessible line chips (grey + `aria-disabled`) rather than allowing tap-then-error only
- **Feedback:** `citation-out-of-scope` — "Line 4 is inside a subproof that has already closed."

Reuse scope logic from formula trees: subproof ≈ nested subtree; discharge ≈ exiting a node.

### Challenge 3: Conditional proof and contradiction

`→I` and `¬I` (or `⊥` from `P ∧ ¬P`) require tracking **assumption line index** and **discharge line**.

- Show assumption formula pinned at subproof open
- On discharge, animate or scroll to the closing line with explicit "Discharge assumption from line 3"
- For `→I`, learner must select which assumption line is discharged — default to innermost open assumption in v1

### Challenge 4: Formula length inside subproofs

At depth 2, usable formula width ≈ 260px after gutters.

- Wrap at connectives where possible
- Collapse inner subformulas to `[…]` with tap-to-expand (same as eval tree)
- Authoring guideline: starter proof lines ≤ ~40 characters Unicode

### Challenge 5: Rule picker + citations on one screen

Bottom sheet pattern (cf. operator reference in Phase 4):

1. Tap "Add step" or edit active line
2. Sheet: rule grid → after rule selected, sheet shows **eligible line chips** filtered by rule arity
3. Confirm applies step; sheet dismisses

Keeps thumbs in lower half of screen; proof context remains visible above sheet (dimmed, not hidden).

## Rule set options (minimal starter)

Exact rule set is **provisional** until Phase 4 exit review. Options below share the same UI; engine stores rules as data.

### Option A — Minimal IPL-style core (recommended lean)

Smallest set that supports direct proofs, conditional proof, and contradiction:

| Category | Rules |
|----------|-------|
| Conjunction | ∧I, ∧E (two elim variants or one with choice) |
| Disjunction | ∨I, ∨E |
| Conditional | →E (modus ponens), →I |
| Negation | ¬I, ¬E (or RAA limited to ⊥) |
| Bottom | ⊥ from explicit contradiction (optional ⊥E if ⊥ in language) |
| Repetition | Reit (optional — some texts omit) |

**Pros:** Matches most intro syllabi; each rule has clear introduction/elimination pairing.  
**Cons:** ∨E is hard for beginners; needs careful subproof UI for case analysis.

### Option B — And–Or–Not fragment first

Defer → and ↔ rules until conditional exercises exist in Phase 4 lessons:

| Phase 5a | ∧I, ∧E, ∨I, ¬I, ¬E, Reit |
| Phase 5b | Add →E, →I, then ↔I, ↔E |

**Pros:** Smaller initial validator; aligns with incremental concept graph.  
**Cons:** Two proof-editor milestones; authors need tagged exercise tiers.

### Option C — Single-conclusion Fitch with no ∨E initially

Use ∨I and negation-based case split later; early exercises only **direct** proofs without case analysis:

| Starter | ∧I, ∧E, →E, →I, ¬I, ¬E, Reit |

**Pros:** Avoids ∨E subproof UI complexity in first ship.  
**Cons:** Incomplete relative to full Fitch; must label exercises "no disjunction elimination."

### Recommendation (provisional)

Ship **Option C** for first proof exercises, expand to **Option A** once subproof citation UX is validated. Document chosen set in [decisions](decisions.md) when Phase 5 starts.

Rule metadata shape (engine, not UI):

```typescript
type RuleId = 'and-intro' | 'and-elim-left' | 'mp' | 'cond-intro' | /* … */;

type InferenceRule = {
  id: RuleId;
  name: { en: string; fr: string };
  arity: number;                    // count of cited lines
  premises: FormulaPattern[];       // shape match on cited lines
  conclusion: FormulaPattern;       // shape of new line
  subproofConstraints?: /* … */;    // for →I, ¬I, ∨E
};
```

## Exercise patterns: fill-one-step vs repair-step

Follow [design principles](design-principles.md): separate skills, small steps, repairable feedback. Proof skill tags: `choose-rule`, `construct-proof`, `repair-proof`.

### Fill-one-step

**Pattern:** Complete proof is shown except **one missing line** (or one missing justification). Learner supplies the single step.

| Variant | Learner action | Checks |
|---------|----------------|--------|
| **Fill formula** | Pick rule + citations; formula computed | Validator derives expected formula from rule + cites |
| **Fill rule** | Formula line given; choose rule and cites | Rule name and arity match |
| **Fill citation** | Rule and formula given; tap line numbers | Citation set matches rule requirements |

**Pedagogy:** Lowest working-memory load; teaches one rule application at a time. Default for first 10+ proof exercises.

**UI:** Missing line shown as dashed box or `[?]`; adjacent lines locked. Wrong attempt keeps other lines intact.

Example (fill formula):

```text
1  P → Q    Premise
2  P         Premise
3  ?         →
4  Q         →E, 1, 2   ← line 3 missing; learner must enter Q via MP before line 4 is justified
```

Authoring: store full proof AST + `hiddenLineIndices: [3]`.

### Repair-step

**Pattern:** Proof contains **one invalid line** — wrong rule, wrong citation, out-of-scope cite, or formula that does not follow. Learner finds and fixes the step.

| Error class | Example feedback tag |
|-------------|----------------------|
| Wrong rule for shape | `wrong-rule-for-premises` |
| Correct rule, wrong lines cited | `wrong-citation` |
| Citation out of scope | `citation-out-of-scope` |
| Formula mismatch | `conclusion-does-not-follow` |
| Discharge mismatch | `wrong-assumption-discharged` |

**Pedagogy:** Mirrors debugging — aligns with "logic as inspection" tone. Requires prior success on fill-one-step for the same rule.

**UI:** Invalid line highlighted (border + icon + text); tap line to edit rule/cites/formula; other lines fixed unless they depend on the invalid step (dependency re-check optional in v1).

### Progression within Phase 5

```text
choose-rule (MC)     →  fill-one-step  →  repair-step  →  multi-step construct
     ↑                      ↑                  ↑
  "Which rule applies?"   One blank line    One bad line    Open proof builder (later)
```

| Stage | Exercise type | Skill tag |
|-------|---------------|-----------|
| 1 | Multiple choice: name the rule | `choose-rule` |
| 2 | Fill-one-step (formula) | `construct-proof` |
| 3 | Fill-one-step (citation or rule) | `construct-proof` |
| 4 | Repair-step | `repair-proof` |
| 5 | Construct 2–4 line proof from scratch | `construct-proof` |
| 6 | Derivation replay (watch completed proof) | `recognize-operator` (support) |

Open-ended **construct from scratch** and **reorder steps** defer until fill/repair error rates justify the complexity.

### Content schema (sketch)

Extends [content-model](content-model.md) when implemented:

```typescript
type ProofExerciseType =
  | 'proof-fill-step'
  | 'proof-repair-step'
  | 'proof-choose-rule';

type ProofExerciseDefinition = {
  id: string;
  type: ProofExerciseType;
  premises: string[];           // parse to Formula[]
  conclusion: string;
  lines: ProofLineSpec[];       // full proof; some lines marked hidden or invalid
  allowedRules?: RuleId[];      // restrict picker for teaching
};

type ProofLineSpec = {
  formula?: string;             // omit when learner fills
  rule?: RuleId;
  cites?: number[];
  invalid?: boolean;            // repair-step: this line is the bug
  subproofLevel: number;
};
```

Feedback uses new engine tags (e.g. `citation-out-of-scope`, `wrong-rule-for-premises`) wired into `ProgressRecord.errorCounts`.

## What is out of scope (Phase 5 prep)

| Item | Defer to |
|------|----------|
| Full drag-and-drop proof editor | After tap path proven |
| Semantic proof search / auto-solve hints | Never as default — optional "reveal one step" |
| Predicate logic quantifier rules | Phase 6 |
| Multiple proof systems (sequent, Hilbert) | Out of product scope |
| LaTeX export of proofs | Phase 5+ polish |

## Implementation sequence (when Phase 5 opens)

1. **Proof AST + validator module** in `engine/` — no UI; unit tests for each starter rule
2. **Static proof renderer** — render authored proof JSON as mobile layout (read-only)
3. **Fill-one-step UI** — one exercise, hard-coded
4. **Citation picker + scope filtering**
5. **Repair-step UI** + feedback tags
6. **Rule picker sheet** + operator-reference integration
7. **Content loader** for proof exercises; SRS hooks

Revisit vanilla TS vs framework when step 3 complexity is known ([decisions](decisions.md) UI stack note).

## Related documentation

| Document | Relationship |
|----------|--------------|
| [Roadmap](roadmap.md) | Phase 5 checkboxes and exit criteria |
| [Future work plan](future-work-plan.md) | Tier 3 ND decision doc workstream |
| [Technical decisions](decisions.md) | Fitch-style target; rule set TBD → update when chosen |
| [Design principles](design-principles.md) | Externalized state, repairable feedback, mobile-first |
| [Content model](content-model.md) | Exercise types, skill tags, feedback taxonomy |
| [Phase 3 translation](phase3-translation.md) | Palette and scope patterns reused for formula display |
| [Presentation](presentation.md) | When to collapse subformulas in long lines |

## Open questions

| Question | Current lean | Status |
|----------|--------------|--------|
| Starter rule set | Option C → Option A | **Provisional** |
| ⊥ as primitive vs derived | Derived from `P ∧ ¬P` for v1 | **Provisional** |
| ∨E in first ship | Defer | **Provisional** |
| Justification two-row vs side column | Two-row on mobile | **Provisional** |
| Framework for proof editor | Vanilla until step 3 spike | **Provisional** |

Update this doc and [decisions](decisions.md) when choices close.
