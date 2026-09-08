# Multi-agent execution brief — session-first UX

**Status:** Historical execution brief. The work described here shipped via PR #14 and subsequent PR #16 remediation; use `AGENTS.md` and `docs/roadmap.md` for current authorization.
**Repository:** `0xVorian/externalize`
**Base:** current `master`
**Primary contract:** `AGENTS.md` + `docs/session-first-ux.md`

## Mission

Rework Externalize so that the default learner experience is a **small, finite, low-intimidation session** rather than an exposed product/curriculum control surface.

The core product principle is:

> **Bound the effort, not the difficulty.**

Companion rules:

> **The learner should never have to understand Externalize before they can learn logic.**

> **Quiet chrome, explicit reasoning.**

The logic remains rigorous. The UX must stop adding unnecessary initiation and terminology cost.

## Read first

Before changing code, inspect and reconcile:

1. `AGENTS.md`
2. `docs/session-first-ux.md`
3. `docs/adaptive-curriculum-implementation.md`
4. `docs/adaptive-curriculum.md`
5. `docs/roadmap.md`
6. `docs/design-principles.md`
7. `docs/research/engagement-learning/synthesis.md`
8. current runtime and tests

Do not assume the older documents' pre-pilot runtime descriptions are still current. Inspect `master`.

## Current architectural state to preserve

The adaptive-curriculum pilot is already implemented and merged:

- `logic-foundations` is an explicit route;
- progress v7 contains route state and portable concept × capability evidence;
- the Sobel Chapter II §§2.6–2.8 source route exists;
- the prerequisite planner is deterministic and inspectable;
- SRS schedules concrete activities;
- clean/repaired pass semantics are deliberate;
- Explore is ungraded;
- EN/FR are independent copy;
- source-route completion is durable;
- no Chapter III+ expansion is authorized.

This assignment is a **UX/orchestration/content-surface refactor over that substrate**, not an adaptive-curriculum redesign.

## Canonical current failure mode

The current Sobel flow can present the learner with all of these at once:

- Learn / Explore / Practice / Progress;
- route choice;
- Reading / Mastery depth;
- source locator;
- reference panel;
- planner banner;
- `Un pont court pour un prérequis manquant`;
- `Implication`, `Quantificateur universel`, `Quantificateur existentiel`, `∀`, `∃`;
- then terminology such as `vérité par vacuité` and `forme prédicative`.

This is not acceptable merely because every term is technically correct.

The app is exposing its own architecture before the learner has done one useful reasoning step.

## Required product behavior

### A. Session-first initiation

The normal opening experience should present **one obvious useful primary action** with a finite contract, for example:

```text
A short logic session
6 steps · about 3 min
[ Start ]
```

or:

```text
Ready for a quick review
5 short steps · about 3 min
[ Start ]
```

or:

```text
Continue your reading
A short preparation round · about 4 min
[ Continue ]
```

The learner should not need to choose Learn / Explore / Practice / Progress before starting useful work.

The four functional modes remain reachable outside the active session. Do not add a fifth top-level Session mode.

### B. Fixed session envelope

Target 5–7 meaningful steps; use 6 as the default design target where content fits.

Requirements:

- step count and approximate time before starting;
- simple active position like `2 / 6`;
- step list fixed once the session starts;
- newly due work waits for the next round;
- interruption can resume the same bounded round;
- completing the declared envelope is a legitimate stopping point;
- no silent expansion.

### C. Explicit completion

End state should clearly say the round is finished.

Primary action: `Done for now` / independently authored FR equivalent.

Secondary action: `Do another short round`.

Do not make the default learning loop endless.

### D. Meaning before terminology

Beginner authoring progression:

> **meaning → use → name → notation → independent use**

Technical terms must still be learned. Do not permanently replace academic vocabulary with euphemisms.

But do not lead with jargon where an ordinary example can establish the idea first.

Normal beginner screen rule: at most one genuinely new technical term unless terms are inseparable.

No undefined technical term should be required merely to understand the next UI action.

### E. Planner state stays internal

Never expose learner-facing strings equivalent to:

- missing prerequisite;
- short bridge for missing prerequisite;
- planner intervention;
- unsupported bridge;
- raw concept/capability IDs.

The planner can still choose prerequisites. The learner should simply receive a short preparation round.

### F. One intellectual demand per screen

Do not make a learner process route/depth/reference/source/progress/planner controls while also solving the reasoning task.

Active session chrome should be minimal. A shape like `Exit` + `2 / 6` is preferable to the full application dashboard.

Reasoning state itself must remain explicit.

### G. Re-entry states

Use existing SRS/route/recency state to derive a simple opening action:

- interrupted bounded round → Resume;
- meaningful due review → Quick review;
- active route → Continue;
- return after stale evidence/lapse → See what stuck;
- nothing useful due → You're good for now + next useful review when derivable.

No missed-day punishment or reset streak.

## Content exemplar: rebuild the Sobel Chapter II preparation flow

This source route is the canonical first redesign target.

The learner should first encounter an ordinary-language empty-class example and make a prediction. Only after the underlying idea is understood should the UI introduce terms such as vacuous truth, universal quantifier, existential quantifier, `∀`, and `∃`.

The flow should then transfer back to the Descartes/existential-import distinction and end with a useful Sobel locator.

Do not copy source text. Preserve the repository's copyright/source-content boundary.

Also audit the earliest `logic-foundations` lessons for the same terminology-before-meaning failure mode. Do not rewrite the entire curriculum unless necessary for the session-first contract.

## Implementation order

Coordinate work as four bounded phases.

### Phase UX-A — session shell

Implement:

- narrow deterministic session plan/selector over existing concrete route/SRS items;
- default one-action opening surface;
- fixed session steps and position;
- interruption/resume;
- explicit completion;
- secondary access to existing functional modes.

Do not change learner-evidence semantics.

### Phase UX-B — low-intimidation surface

Implement:

- remove planner/debug language from learner UI;
- progressively disclose route/depth/reference/source machinery;
- rewrite/restructure the Sobel pilot using meaning-before-terminology;
- audit earliest foundations onboarding for the same issue;
- EN/FR independently authored.

### Phase UX-C — re-entry

Implement:

- due-review / continue / lapse-recovery / nothing-due opening states;
- next-useful-review indication where existing SRS data supports it;
- no notifications/backend/streak system.

### Phase UX-D — minimal local validation telemetry

Only if it remains small and clearly separated from mastery:

- offered session kind;
- started;
- completed/interrupted;
- step count;
- coarse duration;
- timestamp.

If this would materially complicate persistence or migration, leave it documented and stop before implementing it.

## Multi-agent partition suggestion

Use one coordinator/integrator and partition by boundaries that minimize collisions:

- **Agent 1 — session orchestration/state:** inspect current Practice finite-session state, route resume, SRS selectors; propose/implement the narrowest fixed `SessionPlan` layer.
- **Agent 2 — shell/interaction UX:** default opening surface, active-session chrome, completion surface, progressive disclosure, mobile/accessibility.
- **Agent 3 — content/i18n:** Sobel Chapter II low-intimidation rewrite plus early-foundations terminology audit, EN and FR independently.
- **Agent 4 — tests/adversarial review:** derive acceptance tests from `docs/session-first-ux.md`, inspect for mastery contamination, planner leakage, accessibility/mobile regressions, and scope creep.

The coordinator owns `main.ts`/integration-heavy edits and resolves overlapping work deliberately. Do not have multiple agents casually rewrite central orchestration files in parallel.

## Learner-state invariants — merge blockers if violated

- session completion itself emits **no mastery evidence**;
- only checked graded activities affect concept evidence/SRS;
- clean pass means first checked answer correct;
- repaired pass remains conservative and repairable in place;
- Explore remains ungraded;
- route completion/resume remains durable;
- v7 migration/import/export remains compatible;
- portable mastery across routes remains intact;
- source exercises do not duplicate canonical concepts;
- Reading/Mastery semantics remain coherent even if depth controls are progressively disclosed;
- SRS remains concrete.

## UX invariants — merge blockers if violated

- normal entry offers one obvious useful action;
- useful work starts in one tap in the normal case;
- effort is visible before starting;
- session cannot silently expand;
- active-session chrome is materially simpler than the current shell;
- no planner/debug terminology reaches learners;
- no requirement to understand route/depth taxonomy before first useful work;
- proper logic terminology is introduced progressively, not deleted;
- reasoning/intermediate state remains explicit;
- completion is a legitimate stopping point;
- EN/FR parity by pedagogy, independently authored;
- ~320px, keyboard, screen reader, reduced motion remain sound.

## Explicit non-goals

Do NOT implement:

- Chapter III+ source work;
- PDF integration;
- backend/accounts/cloud sync;
- push/email reminders;
- runtime AI session generation;
- generic curriculum/workflow engine;
- framework migration;
- XP, hearts, currencies, leaderboards, conventional reset streaks;
- unrelated cleanup.

## Testing

At minimum:

```bash
npm ci
npm test
npm run build
npm run test:e2e
```

Add focused coverage for:

1. one-action default entry;
2. fixed session size and no expansion;
3. interrupted-session resume;
4. explicit completion and optional another round;
5. session completion does not alter mastery/SRS by itself;
6. planner internals absent from rendered learner copy;
7. Sobel flow begins with meaning/use before quantifier terminology;
8. route/depth controls are not required to begin the default session;
9. existing route/SRS/migration/repaired-pass tests remain green;
10. EN/FR and 320px high-risk flow.

Do not weaken old tests just to accommodate the redesign. Change expectations only where the new learner-facing contract is explicit in `docs/session-first-ux.md`.

## Delivery

Work on a feature branch and open one coherent PR against `master`.

Before asking for merge:

- inspect the full diff for scope creep;
- run the full checks;
- summarize the resulting opening flow and Sobel flow;
- list any deliberate deviations from the plan;
- identify which UX-D telemetry work, if any, was deferred;
- explicitly state that learner-state semantics were preserved;
- do **not** merge.

The final product gate is experiential:

> **Can a learner open Externalize and feel that doing one round is trivially reasonable, even when the reasoning inside the round is genuinely difficult?**
