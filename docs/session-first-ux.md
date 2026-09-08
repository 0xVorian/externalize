# Session-first, low-intimidation UX

**Status:** Implemented on `master` (session-first PR #14; exercise visual-grammar follow-up PR #16). Automated gates are green; the experiential UX gate remains pending real use.
**Created:** 2026-09-07
**Scope:** reduce initiation cost, intimidation, and re-entry friction without weakening the logic, learner model, SRS, or adaptive-curriculum semantics.

## Executive principle

> **Bound the effort, not the difficulty.**

Externalize teaches material that is intrinsically difficult. The product should not add avoidable difficulty through navigation, taxonomy, planner/debug language, premature terminology, or an open-ended sense of work.

Two companion rules follow:

> **The learner should never have to understand Externalize before they can learn logic.**

> **Quiet chrome, explicit reasoning.**

The reasoning state should remain highly visible. The application architecture should not.

## Why this work is authorized now

The August engagement/durable-learning research does **not** justify a gamification sprint. It does support reducing session-initiation friction and keeping cognitively useful acts at the center of engagement. The strongest learning mechanisms remain retrieval, spacing, informative feedback, generation/self-explanation, worked examples with fading, calibration, and transfer.

The adaptive-curriculum pilot now provides a clean substrate for this UX work:

- concrete SRS activities remain schedulable;
- concept × capability evidence remains portable across routes;
- the prerequisite planner can choose `skip` / `retrieve` / `teach` internally;
- source routes can prepare a learner for difficult reading without duplicating mastery state.

The missing layer is a learner-facing experience that makes starting one useful round feel finite and reasonable.

See `docs/research/engagement-learning/synthesis.md` for the research basis and `docs/adaptive-curriculum-implementation.md` for the architecture that must be preserved.

---

## Canonical anti-example

Before the session-first refactor, the Chapter II Sobel pilot could expose a screen roughly like:

- top-level choices: `Cours`, `Explorer les formules`, `Exercices`, `Parcours`;
- route choices: `Fondements de la logique`, `Logic and Theism`;
- depth choices: `Lecture`, `Maîtrise`;
- a source locator;
- a reference panel;
- a planner banner headed `Avant de poursuivre`;
- bullets such as `Un pont court pour un prérequis manquant. (Implication (→))`, `Quantificateur universel (∀)`, `Quantificateur existentiel (∃)`;
- then a lesson titled `Implication sans instance`, containing further terms such as `vérité par vacuité` and `forme prédicative`.

This is an explicit UX failure even when the underlying logic and planner decisions are correct.

### Why it fails

1. **Planner state leaks into learner-facing copy.** “Missing prerequisite” and “bridge” are implementation concepts, not learning goals.
2. **The learner is asked to understand the product taxonomy before doing useful work.** Modes, routes, depth, source location, and reference machinery all compete with the first reasoning task.
3. **Terminology precedes meaning.** Several unfamiliar technical terms and symbols arrive before the learner has an intuitive object to attach them to.
4. **The work feels open-ended.** “Section 1 of 14” communicates a curriculum commitment rather than a small bounded round.
5. **Intrinsic and extraneous difficulty are stacked.** The logic is already difficult; the interface adds avoidable working-memory and initiation cost.

The redesign must not merely restyle this screen. It must change what the learner is asked to perceive and decide.

---

## Product decisions

### 1. Session is the default experience, not a fifth mode

Externalize retains the functional structure of Learn / Explore / Practice / Progress, but the normal learner journey should begin with one useful bounded action rather than a four-way mode choice.

Do **not** add a fifth top-level `Session` mode. Session orchestration sits above/between the existing modes.

Normal opening state should answer:

> **What is the smallest useful thing I can do right now?**

Examples:

```text
Externalize

A short logic session
6 steps · about 3 min

[ Start ]
```

```text
Externalize

Ready for a quick review
5 short steps · about 3 min

[ Start ]
```

```text
Externalize

Continue your reading
A short preparation round · about 4 min

[ Continue ]
```

The four functional modes remain reachable through secondary navigation outside the active session.

### 2. Every session has a fixed envelope

The learner must know roughly how much work they are agreeing to **before** starting.

Initial target: **5–7 meaningful steps**, with **6** as the default design target when content fits. Logic tasks are heavier than vocabulary taps; do not copy another product's item count mechanically.

Rules:

- show step count and approximate time before start;
- once started, show simple position (`2 / 6`);
- a session must not silently expand after it starts;
- newly due work waits for the next round;
- finishing the declared envelope is legitimate completion;
- stopping after one completed session is never framed as failure or premature exit.

A session may contain a mixture of route items and due retrieval when that is pedagogically coherent, but composition must remain deterministic and inspectable.

### 3. Completion must feel complete

At the end of the fixed envelope, the primary message is that the learner has finished the round.

Preferred shape:

```text
Done.

You finished this round.
Next useful review: tomorrow.

[ Done for now ]

Do another short round
```

`Done for now` is the primary action. `Do another` is secondary and optional.

Do not use infinite-scroll or endless-continue semantics for the default learning loop.

### 4. One intellectual demand per screen

A learning screen should ordinarily ask the learner to deal with one idea or one action.

Avoid simultaneously presenting:

- route/depth controls;
- prerequisite diagnostics;
- reference taxonomy;
- source metadata;
- capability/progress detail;
- the actual exercise;
- multiple competing next actions.

The screen may show the intermediate reasoning state required for the current problem. That is the defining Externalize behavior and must remain explicit.

### 5. Meaning before terminology

Technical vocabulary is part of the target competence. It must be learned, not permanently hidden. But it should usually arrive **after the learner has an intuitive meaning to attach it to**.

Default authoring progression:

> **meaning → use → name → notation → independent use**

Example shape:

1. `There is at least one F.`
2. learner reasons about an ordinary example;
3. `Logicians call this an existential claim.`
4. `We write this with ∃.`
5. later: `existential quantifier (∃)` appears without extra scaffolding.

Rules:

- do not lead a novice screen with jargon when ordinary language can establish the idea first;
- introduce at most one genuinely new technical term on a normal beginner screen unless the terms are inseparable;
- no undefined technical term should be required merely to understand what button to press or what the next task is;
- proper academic EN/FR vocabulary remains required once introduced;
- terminology scaffolding should fade with competence.

### 6. Planner state is never learner-facing

The deterministic prerequisite planner remains valuable, but its internal categories are not UI copy.

Never expose text equivalent to:

- `missing prerequisite`;
- `short bridge for missing prerequisite`;
- `unsupported bridge`;
- `planner intervention`;
- raw concept/capability IDs.

If the planner decides three prerequisites need work, the learner-facing surface should say something like:

```text
Before you continue
A short preparation round · 6 steps · about 3 min

[ Start ]
```

Then simply teach/check the prerequisite ideas.

### 7. Hide architecture until it becomes useful

Route, source, depth, reference, Progress, and Explore controls are useful expert affordances. They are not the default novice contract.

Use progressive disclosure:

- default opening: one primary useful action;
- active session: minimal chrome, e.g. `Exit` + `2 / 6`;
- route/source controls: secondary navigation outside a session;
- Reading/Mastery depth: shown only where choosing depth is meaningful;
- reference material: available on demand, not automatically competing with the task;
- source locator: visible when returning to the source is useful, especially at completion, not necessarily on every micro-step.

### 8. Re-entry should be learning-aligned

The opening action should derive from actual learner state rather than an arbitrary daily demand.

Candidate deterministic states, in this order:

- unfinished bounded session → **Resume this round**;
- genuinely due SRS review → **Quick review**;
- meaningful stale-evidence retrieval → **See what stuck**;
- active route with useful next material → **Continue**;
- nothing useful due → **You're good for now** + next useful review estimate.

If a source-route plan already injects retrieve for the same stale prerequisite, that preparation round is used once instead of a second lapse envelope of the same items.

A lapse is not a punishment state. Do not say “you missed N days” or reset a visible achievement counter as part of this work.

### 9. One authoritative progress economy

Session completion is motivational/contextual information, not mastery.

Do not add:

- XP;
- hearts;
- pseudo-currency;
- leaderboards;
- reset-on-miss streaks;
- arbitrary account levels;
- a second prestigious engagement score.

Capability progress remains evidence-backed. If cadence/history is added later, it is contextual history, not an alternative mastery system.

---

## Session planning model

Implement the smallest explicit abstraction that can support the UX. Do not build a generic learning-workflow engine.

A possible shape:

```ts
type SessionKind =
  | 'start'
  | 'continue'
  | 'quick-review'
  | 'lapse-recovery';

type SessionStep = {
  id: string;
  source: 'route' | 'practice';
  itemId: string;
  unitIndex?: number; // watch-case index when one lesson has several separately advanced cases
};

type SessionPlan = {
  id: string;
  kind: SessionKind;
  steps: SessionStep[];
  estimatedMinutes: number;
};
```

This is illustrative, not a required schema. Reuse existing route/SRS selectors and activity IDs wherever possible.

A session unit is one learner-perceived micro-activity: one principal intellectual demand and one local completion transition. Cards, guided lessons, and practice items are one unit each. A watch lesson with separately advanced cases contributes one unit per case, so “N steps” is not a multi-case lesson counted as one tap-through. The plan is frozen after start and does not expand.

Important invariants:

- a plan is concrete and inspectable;
- the step list is fixed for the lifetime of the active session;
- session completion writes no mastery by itself;
- only the underlying graded activities affect SRS/concept evidence;
- lesson exposure remains exposure;
- Explore remains ungraded;
- repaired/clean-pass semantics remain unchanged.

Persist only enough session state to resume an interrupted bounded round. Do not invent a new general-purpose workflow store.

---

## Content redesign exemplar: Sobel Chapter II pilot

The current source route should be the first canonical UX rewrite because it exposes the intimidation problem clearly.

### Current conceptual target

The learner needs to understand that a universal/hypothetical claim can be true without asserting an instance, while an existential claim asserts at least one witness, then return to Sobel's Descartes discussion.

### Preferred beginner progression

Start in ordinary language, e.g. a case with no members of the relevant class, and ask whether a universal claim can still be true. Establish the idea before naming `truth by vacuity`, `universal quantifier`, or `existential quantifier`.

Possible progression:

1. ordinary-language empty-class example;
2. learner prediction (checked);
3. feedback: no counterexample exists;
4. introduce the name for the phenomenon;
5. ordinary if–then meaning, then `→`, then a checked conditional application;
6. universal meaning, then `∀`, then the name `universal quantifier`;
7. contrast with a claim that explicitly asserts an example exists;
8. introduce `∃` after the existential meaning is understood, then name the existential quantifier;
9. same-witness conjunction (witness / existential commitment only here);
10. transfer to a fresh neutral example;
11. return to the Sobel/Descartes question;
12. source locator only when it helps the learner resume reading.

Do not copy these exact words blindly; EN and FR must be independently authored and academically idiomatic.

### Source text boundary

Continue to use bibliographic metadata, section/page locators, paraphrases, and short necessary quotations only. Do not reproduce Sobel's exposition.

---

## Implementation phases

## Phase UX-A — session shell and finite contract

Goal: make the normal entry path one-tap and bounded without changing learning semantics.

Required:

- deterministic `SessionPlan` (or equivalently narrow selector/state) over existing concrete route/SRS items;
- default/opening surface with one primary Start/Continue action;
- fixed 5–7 step envelope where current content permits, default target 6;
- session position display;
- explicit completed state with primary `Done for now` and secondary `Do another`;
- no silent expansion;
- interruption/resume of the active bounded round;
- existing Learn / Explore / Practice / Progress still reachable outside the active session;
- no mastery/SRS change from session completion itself.

**Gate:** a normal learner can open Externalize and begin one useful bounded round with one obvious tap, knowing the approximate effort before starting. **Implemented** (`session-plan.ts`, opening/chrome/complete renderers, `main.ts` orchestration, persistence for interrupted resume).

## Phase UX-B — low-intimidation beginner surface

Goal: make the first Sobel slice and the beginning of logic foundations understandable before terminology-heavy chrome appears.

Required:

- remove planner/debug language from learner-facing UI;
- redesign Sobel Chapter II pilot around meaning-before-terminology;
- audit the earliest `logic-foundations` material for the same failure mode;
- one intellectual demand per screen where practicable;
- progressive disclosure of route/depth/reference/source controls;
- independently authored EN/FR copy;
- preserve actual formal terms and notation, introduced progressively rather than deleted.

**Gate:** the opening and Sobel preparation flow no longer requires the learner to understand route/planner vocabulary or multiple new technical terms before doing the first useful reasoning step. **Implemented** (planner copy removed from `learnUi`; Sobel empty-class setup → checked prediction → counterexample explanation → vacuity name → if–then → `→` → conditional check → universal meaning → ∀ → existential meaning → name → ∃ → same-witness conjunction → transfer → return to Descartes; session chrome hides route/depth). The experiential product-validation gate remains pending real use.

## Phase UX-C — learning-aligned re-entry

Goal: make return after a short gap cheap and purposeful.

Required:

- opening-state derivation for due review / continue / lapse recovery / nothing useful due;
- `See what stuck`-style lapse recovery rather than missed-day punishment;
- next-useful-review indication after a completed round when derivable from existing SRS state;
- no notifications, conventional streak, XP, or backend required.

**Gate:** returning after a gap produces one obvious, bounded, pedagogically justified next action. **Implemented** (`offerOpening` derives resume → due review → lapse recovery → continue → idle). A mid-course learner with remaining lessons and stale evidence is offered lapse recovery before new material.

## Phase UX-D — validation instrumentation

Goal: distinguish initiation failure from learning failure without creating a cloud analytics project.

Local-only, minimal session telemetry may record:

- session offered kind;
- started/not started;
- completed/interrupted;
- step count;
- coarse duration;
- timestamp.

This telemetry is **not mastery evidence** and should remain clearly separate from concept/SRS state.

**Gate:** enough local evidence exists to judge whether the bounded-session redesign lowers initiation friction without polluting the learner model. **Implemented** as a small separate `localStorage` log (`session-telemetry.ts`, key `externalize-session-events-v1`). Not part of progress v7 export/import.

---

## Explicit non-goals

This programme does **not** authorize:

- Chapter III+ source interaction expansion;
- PDF ingestion/reader integration;
- backend/accounts/cloud sync;
- push/email notification infrastructure;
- runtime AI curriculum/session generation;
- universal activity/workflow engine;
- React/Svelte/framework migration;
- XP, hearts, currencies, leaderboards, reset streaks, loss framing, casino-style rewards;
- weakening graded evidence semantics;
- hiding intermediate reasoning state merely to make screens look sparse.

---

## Acceptance criteria

Before calling the session-first UX successful:

1. Opening the app presents one obvious useful primary action.
2. Normal useful work begins in one tap.
3. The learner sees approximate effort before starting.
4. The active round has a fixed finite envelope and cannot silently expand.
5. Completion is explicit; leaving after one round is legitimate.
6. A beginner need not understand modes, routes, depth, planner state, or concept IDs to start learning.
7. Planner/debug terminology never leaks into learner-facing copy.
8. Technical vocabulary is progressively introduced without deleting the real academic terms.
9. Normal beginner screens introduce at most one genuinely new technical term unless inseparable.
10. Reasoning state remains explicit and locally repairable.
11. Existing clean/repaired attempt semantics, SRS, concept evidence, route progress, Explore semantics, and migration behavior remain intact.
12. Learn / Explore / Practice / Progress remain available as functional tools, but do not dominate the default initiation surface.
13. EN/FR are independently authored.
14. Keyboard/screen-reader behavior and ~320px mobile layout remain sound.
15. Unit, build, and browser suites remain green.
16. No new engagement currency or fake mastery signal is introduced.

---

## Validation question

The UX gate is deliberately experiential:

> **Can a learner open Externalize and feel that doing one round is trivially reasonable, even when the reasoning inside the round is genuinely difficult?**

If the answer is no, do not reach for streaks or rewards first. Reduce initiation and intimidation friction further while protecting the rigor of the learning task.

Automated tests can show that the envelope is honest and the terminology sequence is ordered. They cannot prove this experiential gate.
