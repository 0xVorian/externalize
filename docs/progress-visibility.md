# Progress visibility

Status: **current product priority after v0.3.5**.

Externalize already stores substantial learning state: completed lessons, attempted/passed exercises, skill statistics, SRS state, error history, diagnostic-case coverage, prerequisites, and per-exercise scaffold level. The problem is experiential rather than informational: most of that movement is invisible while the learner is actually learning or practising.

The goal of this work is to make progress **perceptible, truthful, and emotionally legible** without turning Externalize into an XP-driven game.

## Product problem

A learner can currently complete lessons and exercises, improve skill statistics, unlock later practice, and receive less assistance without strongly feeling that they have moved forward.

The Progress tab can report state after the fact, but progress should not live only in a destination named “Progress”. It should be visible in the ordinary learning loop.

A successful version should let the learner answer, without opening a diagnostic dashboard:

1. **What am I working on now?**
2. **What did I just accomplish?**
3. **What changed because of it?**
4. **What can I do now that I could not do before?**
5. **What is next?**

## Three timescales

### 1. Immediate progress

A meaningful checked action should visibly affect the surrounding experience.

Examples:

- an exercise moves the current practice session from `2 / 5` to `3 / 5`;
- a first pass unlocks the next practice item;
- a clean attempt moves a skill across a confidence threshold;
- a lesson completion advances the visible unit position;
- a clean nested-evaluation pass increases the exercise scaffold level, so the next encounter requires more learner-produced intermediate state.

Routine correct answers need not trigger celebration. **State transitions should.**

### 2. Session progress

Practice should feel like a finite episode rather than an endless stream.

The initial implementation should use a short practice session target (five finalized exercises is the default design target). A repaired attempt still counts as one completed session item once it is finalized; the distinction between repaired and clean remains important for mastery/SRS semantics.

At session completion, show a compact summary of genuine changes during that session, for example:

- 5 exercises completed;
- Evaluation strengthened;
- Counterexamples unlocked;
- Less support next time on nested evaluation.

The session counter is motivational structure, **not mastery evidence**. Starting or finishing a session must not itself improve skill statistics or SRS state.

### 3. Long-term capability progress

The primary long-term language should be capabilities rather than arbitrary account levels.

Prefer:

- **Main connective — Developing**
- **Formula evaluation — Reliable**
- **Counterexamples — Ready**

Over:

- Level 17
- 840 XP
- Logic score 73

The existing skill statistics provide a conservative first derivation:

- **Ready** — the skill is available in unlocked practice but has no finalized graded attempts;
- **Developing** — at least one finalized graded attempt exists, but the reliability threshold has not been met;
- **Reliable** — at least 3 finalized attempts with a clean-pass rate of at least 80%.

This mirrors the existing `comfortable` logic in `progress-tracker.ts`. Repaired passes are completed attempts but are not counted as clean successes, so they must not inflate reliability.

These labels are presentation states, not a new persistence or scoring system unless implementation evidence later shows a need for one.

## Capability vocabulary

For the current exercise model, the first capability set can map directly to existing tracked skills:

| Skill id | User-facing capability |
|---|---|
| `practice:identify-main-connective` | Find the main connective |
| `practice:evaluate-formula` | Evaluate formulas |
| `practice:fill-truth-table-cell` | Complete truth-table cases |
| `practice:find-counterexample` | Construct counterexamples |
| `practice:classify-tautology` | Recognize tautologies |
| `practice:translate-prose-to-formula` | Translate prose into formulas |
| `practice:proof-fill-step` | Complete proof steps |

English and French capability copy must be authored independently under the existing i18n rules.

## Surfaces

### Learn

Learning screens should show compact position context, such as:

- current unit;
- lesson position within the unit;
- overall lesson progress where useful.

Completing a lesson should visibly advance that context. Unit completion is a transition worth making explicit.

### Practice

Practice should always make the following easy to perceive:

- current capability/skill;
- current capability state (`Ready`, `Developing`, `Reliable` where applicable);
- practice-session position (`n / 5`);
- meaningful transition after finalization, when one occurred.

The exercise itself remains the visual priority. Progress chrome must stay compact on a ~320px viewport.

### Progress

The Progress view should become more capability-oriented and less like a storage dump.

Keep detailed lists/statistics available, but foreground:

- **You can now** — reliable capabilities;
- **In progress** — developing capabilities;
- **Up next** — unlocked/ready capability or the next meaningful curriculum step;
- current unit/session/review context.

The concept map remains useful as the richer structural view.

### Concept context outside Progress

Do not render the full concept map everywhere. A compact current-context treatment is enough: current unit/capability plus nearby progression state. The goal is orientation, not a miniature dashboard competing with the exercise.

## Progress moments

After a finalized practice attempt, compare the relevant state before and after finalization. Show a progress moment only when something meaningful changed.

Priority transitions:

1. **Capability became Reliable**
2. **New exercise or capability unlocked**
3. **Scaffold level advanced / assistance reduced**
4. **Unit or curriculum milestone completed**
5. **First demonstrated pass in a capability**

Example tone:

- `Formula evaluation is now reliable.`
- `Counterexamples are now available.`
- `Less support next time — you’ll supply an intermediate value yourself.`

Avoid generic praise such as “Amazing!”, points, loot language, confetti-by-default, or messages unsupported by actual state.

## Scaffold withdrawal as progression

Externalize already persists `exerciseStats[exerciseId].scaffoldLevel`. For configured nested evaluation exercises, a clean pass advances that level up to the exercise maximum.

This is an unusually good fit for Externalize’s identity: progress can mean that the application does **less** for the learner.

When scaffold level advances, make that visible as a positive transition. Do not describe support as removed if the next scaffold level does not in fact require more learner-produced reasoning.

## Semantic invariants

These must survive the progress-visibility work:

- Explore mode never contributes mastery/progress evidence.
- Only finalized graded attempts affect skill statistics and SRS.
- A repaired pass remains different from a clean pass.
- Session completion does not modify mastery data.
- Unlocks continue to follow actual prerequisite/passed-state logic.
- Reliability must be derived from evidence, not from number of screens viewed or time spent.
- Existing progress exports/imports must remain valid unless a deliberate storage migration is introduced.

## Tone and visual direction

Modern does not mean noisy.

Use contemporary product affordances — compact meters, state chips, finite session arcs, transition cards — while preserving Externalize’s restrained visual language.

Prefer movement in **meaningful state** over decorative animation. Subtle animation is acceptable where it clarifies a transition and respects reduced-motion settings.

The target feeling is:

> I know where I am, I can see that I moved, and the product is asking me to do more because I have demonstrated that I can.

Not:

> I have accumulated enough points to fill another bar.

## First implementation scope

The first coherent pass should ship together:

- ambient unit/lesson progress in Learn;
- ambient capability state and `n / 5` session progress in Practice;
- a session-complete state with evidence-backed summary;
- transition messaging for reliability, unlocks, and scaffold advancement;
- a capability-first summary near the top of Progress;
- EN/FR copy, keyboard/screen-reader semantics, reduced-motion-safe behavior, and ~320px mobile coverage;
- unit tests for capability-state derivation and transition detection;
- Playwright coverage for the highest-risk progress flows.

See `docs/agent-brief-progress-visibility.md` for the implementation brief.

## Implementation

Derived presentation lives next to existing progress storage; it does not add a scoring system.

| Module | Role |
|---|---|
| `src/app/progress-visibility.ts` | Capability states and before/after progress-moment diffs |
| `src/app/practice-session.ts` | In-memory 5-attempt session (not mastery, not export/import) |
| `src/app/evaluation-scaffold.ts` | Nested evaluation scaffold levels already used for learner-produced intermediates |
| `src/i18n/messages.ts` (`visibilityUi`) | Independently authored EN/FR copy |

`commitCheckedPracticeState()` in `src/main.ts` diffs visibility snapshots before and after `recordCheckedPracticeState()`. A moment is shown only when underlying state changed, and only once per finalization.

