# Design Principles

These constraints govern every feature decision. When in doubt, prefer the option that keeps more state visible and requires smaller reasoning steps.

## 1. Externalize intermediate state

The learner should rarely need to remember what was established several steps earlier.

Always visible or one tap away:

- current premises and target conclusion
- substitutions already made
- truth values under the current assignment
- proof dependencies and what each line cites
- applicable rules and their prerequisites

Prefer **small explicit transformations** over steps described as "obviously follows."

## 2. Local, repairable feedback

Wrong answers should identify **what went wrong locally**, not just that the answer is wrong.

Good feedback examples:

- "Negation applies only to the nearest expression — here that is `Q`, not `P ∧ Q`."
- "This assignment makes premise 2 false."
- "Modus ponens requires the conditional and its antecedent on accessible lines."

The learner should **correct the existing attempt** when possible rather than restart from scratch.

## 3. Never rely on colour alone

Colour and shape may reinforce meaning (scope boxes, matching subexpressions) but must always be paired with:

- indentation
- explicit labels
- connecting lines or borders
- text descriptions accessible without colour perception

## 4. Separate skills, separate tracking

Recognition, translation, evaluation, and proof construction are different abilities. Track and schedule review for each independently.

A failed construction exercise should not automatically tank recognition scores for the same concept unless the error was genuinely about recognition.

Suggested skill tags: `recognize-operator`, `translate-en-to-formula`, `translate-formula-to-en`, `evaluate`, `truth-table`, `counterexample`, `choose-rule`, `construct-proof`, `repair-proof`.

## 5. Short sessions, real transfer

Lessons should be short enough to start without ceremony.

Each session should mix:

- one new micro-concept
- a few recognition checks
- one guided construction
- spaced review of weak areas
- one transfer challenge (not identical to the lesson example)

## 6. Intelligent tone, no decorative gamification

Frame logic as inspection and debugging, not cartoon achievement hunting.

Acceptable: streaks, daily goals, concept map, replay of completed derivations.  
Unacceptable: rewards that obscure whether the rule was actually understood.

## 7. Content and engine stay separate

Exercises, lessons, and hints are **data**. Parsing, evaluation, equivalence checking, and feedback generation live in the **engine**.

Revising wording or adding exercises must not require rewriting core logic code.

## 8. AST-first, never string comparison

Logical expressions are abstract syntax trees. The engine uses trees to:

- render notation
- evaluate under assignments
- detect scope and main connective
- check equivalence
- validate inference steps (later)
- generate precise feedback

Raw string equality is never sufficient for judging correctness.

## 9. Mobile-first browser experience

The primary use context is a phone in the browser — a short practice session in a spare moment. Design for that viewport first; tablet and desktop are progressive enhancements.

Constraints:

- **Layout:** single-column, vertical scroll; no interaction that requires a wide screen or precise mouse control
- **Touch:** minimum 44×44px tap targets; generous spacing between symbols and choices
- **Input:** tap and swipe first; drag-and-drop only where it clarifies structure and always with an equivalent tap-based path
- **No hover-only UI:** every action and hint must be reachable without `:hover`
- **Readable formulas:** tree view and scope highlighting must work on ~320px width without horizontal panning (vertical tree layout, wrapping, or collapsible nodes)
- **Performance:** fast load on mobile networks; no heavy runtime required for v1
- **Persistence:** `localStorage` / IndexedDB; optional PWA install later for home-screen access

When mobile and desktop affordances conflict, choose the option that works on a phone.
