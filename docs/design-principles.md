# Design Principles

These constraints govern every feature decision. When in doubt, prefer the option that keeps more reasoning state visible, requires smaller intellectual steps, and adds less product-interface burden.

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

The adaptive learner model expresses portable knowledge as concept × capability evidence while interaction-family skill IDs remain useful for concrete activities and telemetry.

## 5. Bound the effort, not the difficulty

Lessons and practice should be short enough to start without ceremony, but "short" must be a learner-visible contract rather than merely an authoring intention.

The normal learner experience should begin with one useful bounded round:

- roughly 5–7 meaningful steps where content permits;
- approximate effort visible before start;
- simple position such as `2 / 6` during the round;
- no silent expansion after start;
- explicit completion;
- stopping after one completed round is legitimate.

A session may mix new material, guided work, due retrieval, and transfer where pedagogically coherent. The exact mixture is secondary to the fixed finite envelope.

Session completion is **not mastery evidence**. Only the underlying graded activities affect learner capability/SRS state.

See `docs/session-first-ux.md`.

## 6. Intelligent tone, no decorative gamification

Frame logic as inspection and debugging, not cartoon achievement hunting.

The August engagement-learning synthesis does not justify a second reward economy. Do not add XP, hearts, pseudo-currency, leaderboards, reset-on-miss streaks, fake scarcity, near-misses, or casino-style variable rewards merely to increase activity.

Visible progress is valuable when it remains epistemically expensive: capability changes should correspond to actual graded evidence. If cadence/history is explored later, keep it contextual rather than a competing mastery score.

The product may use low-friction initiation, bounded sessions, learning-aligned re-entry, and lapse recovery because these make useful retrieval easier to start without changing what counts as learning.

See `docs/research/engagement-learning/synthesis.md`.

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
- **Persistence:** local progress; optional PWA/home-screen use without requiring accounts

When mobile and desktop affordances conflict, choose the option that works on a phone.

## 10. Independent locale copy (not translation)

English and French are **parallel course materials**, each using that language's standard logic vocabulary.

- **Do** author `en` and `fr` blocks independently in `src/i18n/`
- **Do** use EN analytic terms and FR university terms once those terms are pedagogically introduced
- **Do** use locale-appropriate examples in each language
- **Do not** mirror-translate from one locale to the other
- **Do not** treat either locale as the "source of truth" for wording

New user-facing strings require both locales in the same change. See `docs/i18n.md`.

## 11. Match presentation to the pedagogical goal

Evaluation and structure can be shown as a **truth table**, a **vertical parse tree**, or other narrow representations. Pick the shape that externalizes what the learner needs *right now* — not one universal widget.

- **Truth table (rows):** small atom set, all cases shown or stepped through (watch / demo). Example: four rows for `P ∧ Q`.
- **Parse tree:** nested formulas, values propagating through subformulas (eval exercises with structure) or scope selection (main connective exercises).

Do not use a parse tree when the lesson is only “here are the four truth-table cases”; use a table with a highlighted row instead. See `docs/presentation.md`.

## 12. Make progress perceptible — and evidence-backed

Tracking progress internally is not enough. The learner should be able to **feel movement while using Externalize**, without needing to visit a separate Progress screen.

Progress operates on three timescales:

- **Immediate:** a checked exercise or completed lesson visibly changes something.
- **Session:** a short bout has a finite arc and a clear completion state.
- **Long-term:** the learner can see which capabilities are new, developing, or consistent across recent attempts, and what is likely to come next.

Every progress claim must correspond to real curriculum state or assessed evidence. Do not manufacture an XP economy merely to create motion.

In particular:

- distinguish **completion/exposure** from **consistent recent performance**;
- derive skill confidence from finalized graded attempts, not taps, time spent, Explore activity, or session completion;
- make genuine transitions noticeable: a new exercise/capability unlocked, a skill becoming consistent across recent attempts, a unit completed, or support being reduced after clean performance;
- treat **withdrawal of scaffolding** as a form of progress;
- celebrate transitions more strongly than routine correct clicks.

The emotional message should be **“you can now do more with less help,”** not “a number went up.”

See `docs/progress-visibility.md`.

## 13. Quiet chrome, progressive terminology

The material may be difficult. The interface must not add unnecessary difficulty before the learner reaches the reasoning task.

Two rules govern beginner-facing surfaces:

> **The learner should never have to understand Externalize before they can learn logic.**

> **Meaning → use → name → notation → independent use.**

Consequences:

- the normal opening surface presents one obvious useful action rather than requiring a mode/route/depth decision;
- active sessions minimize product chrome and expose the reasoning state instead;
- planner/debug concepts such as “missing prerequisite” or “bridge” never appear as learner-facing explanations;
- route, source, depth, reference, and detailed progress controls are progressively disclosed when useful;
- technical vocabulary is genuinely taught, but novice screens establish meaning before piling on names and symbols where possible;
- a normal beginner screen should introduce at most one genuinely new technical term unless terms are inseparable;
- one intellectual demand per screen is the default aspiration.

Do **not** achieve visual simplicity by hiding intermediate reasoning state. The desired pattern is **quiet chrome, explicit reasoning**.

See `docs/session-first-ux.md`.

## 14. Separate the logical object from the response operation

A graded screen should make the learner's cognitive operation visually obvious:

> **logical object / stimulus → response workspace → explicit Check → reason-bearing feedback**

The distinction should come from composition and whitespace before decorative chrome. Avoid one large undifferentiated card in which formula, controls, feedback, and actions compete for attention.

For select-then-check interactions:

- selection is provisional;
- the learner may see **what they selected**, but not whether it worked before Check;
- Check is the point at which correctness is revealed and graded evidence may change;
- wrong answers remain repairable in place where possible.

For beginner truth-value choices, ordinary-language controls (**True / False**, **Vrai / Faux**) may bridge into compact formal notation (**T/F**, **V/F**) in the reasoning surface. Formal notation is sequenced, not removed.

See `docs/presentation.md`.
