# AGENTS.md

Repository-wide operating instructions for coding agents working on Externalize.

## Mission

Externalize is a local-first, mobile-first learning application whose defining idea is to **externalize intermediate reasoning state** so the learner does not have to hold large symbolic structures in working memory.

The current authorized product direction is the **session-first, low-intimidation UX refactor**: preserve the adaptive learner model and rigorous logic while making the normal experience a small, finite, one-tap learning round whose effort is obvious before the learner starts.

Core product rules:

> **Bound the effort, not the difficulty.**

> **The learner should never have to understand Externalize before they can learn logic.**

> **Quiet chrome, explicit reasoning.**

The implementation contract for this work is:

- **[`docs/session-first-ux.md`](docs/session-first-ux.md)** — product/UX plan, phases, gates, anti-example, invariants, and non-goals.
- **[`docs/agent-brief-session-first-ux.md`](docs/agent-brief-session-first-ux.md)** — current multi-agent execution brief.
- [`docs/adaptive-curriculum-implementation.md`](docs/adaptive-curriculum-implementation.md) — implemented adaptive architecture and learner-state contract that the UX work must preserve.
- [`docs/adaptive-curriculum.md`](docs/adaptive-curriculum.md) — conceptual route/source architecture.
- [`docs/research/engagement-learning/synthesis.md`](docs/research/engagement-learning/synthesis.md) — research basis and cautions around engagement mechanics.

Do not substitute an older phase plan or a generic educational-platform architecture for these documents.

## Source-of-truth order

When documents conflict, use this order for the current work:

1. `AGENTS.md`
2. `docs/session-first-ux.md`
3. `docs/adaptive-curriculum-implementation.md`
4. `docs/adaptive-curriculum.md`
5. `docs/roadmap.md`
6. `docs/design-principles.md`
7. current runtime behavior and tests
8. `docs/content-model.md`, `docs/decisions.md`, `docs/authoring.md`, and other scoped design notes
9. historical agent briefs / old phase plans

`docs/agent-brief-session-first-ux.md` is the current execution brief, but it does not override the product contract above it.

When a document describes pre-implementation state, inspect the code before assuming it is still current.

## Current architectural state

The adaptive-curriculum Phases A–C are implemented and merged. Treat them as substrate, not as the current redesign target.

Current properties include:

- the existing course runs as the explicit `logic-foundations` route;
- progress v7 adds route state and portable concept × capability evidence;
- the *Logic and Theism* Chapter II §§2.6–2.8 source route exists;
- the prerequisite planner is deterministic and inspectable (`skip` / `retrieve` / `teach` / `unsupported`);
- source-route completion is durable;
- SRS still schedules concrete activities;
- clean/repaired attempt semantics are deliberate;
- Explore is ungraded;
- EN/FR are independently authored.

The Chapter II implementation is complete, but its experiential product-validation gate remains pending real use.

## Current execution boundary — session-first UX

Prosecute the UX plan in order and respect its gates.

### Phase UX-A — session shell and finite contract

Make the normal entry path one obvious useful action with a finite commitment.

Required properties include:

- a narrow deterministic session plan/selector over existing concrete route/SRS items;
- one-tap normal initiation;
- visible step count and approximate effort before starting;
- a fixed 5–7 step envelope where current content permits, with 6 as the default design target rather than a universal law;
- no silent session expansion;
- interruption/resume of the same bounded round;
- explicit completion with `Done for now` primary and another round secondary;
- the four functional modes remain reachable outside the active session;
- session completion itself creates no mastery evidence.

Do not add a fifth top-level `Session` mode.

### Phase UX-B — low-intimidation beginner surface

Remove avoidable product and terminology load before the first useful reasoning step.

Required properties include:

- planner/debug state never appears as learner-facing copy;
- progressive disclosure of route/depth/reference/source controls;
- the Sobel Chapter II pilot is the canonical first content rewrite;
- meaning precedes terminology where possible: **meaning → use → name → notation → independent use**;
- normal beginner screens introduce at most one genuinely new technical term unless terms are inseparable;
- the earliest `logic-foundations` material is audited for the same terminology-before-meaning failure mode;
- proper academic terms and notation are eventually taught, not permanently hidden;
- reasoning/intermediate state remains explicit.

### Phase UX-C — learning-aligned re-entry

Use actual learner state to make return cheap and purposeful.

Candidate opening states:

- interrupted bounded round → resume;
- meaningful due review → quick review;
- active route → continue;
- stale evidence after a lapse → see what stuck;
- nothing useful due → you're good for now + next useful review when derivable.

Do not add missed-day punishment, reset streaks, XP, or a second reward economy.

### Phase UX-D — minimal local validation telemetry

Only if it remains small and clearly separated from mastery, local telemetry may record offered session kind, start/completion/interruption, step count, coarse duration, and timestamp.

If this materially complicates persistence or migration, defer it rather than expanding the blast radius.

### Stop boundary

Do **not** implement Chapter III–XIII interaction families, a generic curriculum/session generator, PDF reader, server/backend, cloud accounts, push/email reminders, framework migration, or universal workflow/reasoning engine as part of this assignment.

## Canonical UX anti-pattern

The current Sobel pilot has demonstrated a learner-facing failure mode where the application can simultaneously expose:

- Learn / Explore / Practice / Progress;
- route choice;
- Reading / Mastery depth;
- source locator and reference panel;
- `Avant de poursuivre` planner diagnostics;
- `Un pont court pour un prérequis manquant`;
- several new terms/symbols such as implication, universal/existential quantifier, `∀`, and `∃`;
- then further terminology inside the lesson.

Do not merely restyle this. The learner should receive a short preparation round, not an explanation of the planner or curriculum architecture.

## Product invariants

Preserve these unless the current UX plan explicitly changes their presentation:

- **Externalize intermediate state.** Prefer small visible transformations to hidden mental jumps.
- **Local, repairable feedback.** Wrong attempts should be fixable in place when possible.
- **Evidence-backed progress only.** Reading completion, navigation, hints, time spent, Explore activity, or session completion must never masquerade as mastery.
- **SRS remains concrete.** Schedule actual exercises/activities, not abstract concept IDs.
- **Concept mastery is portable.** Source routes strengthen/reuse canonical concept state rather than invent source-specific duplicates.
- **Content and engine remain separate.** Do not encode authored pedagogy into validators unnecessarily.
- **No universal engine/workflow abstraction.** Add narrow representation-specific machinery only when real content demands it.
- **Keep the four functional modes.** Learn / Explore / Practice / Progress remain available, but the default initiation surface may de-emphasize them in favor of one session action.
- **Session is orchestration, not mastery.** Session state may organize concrete work but does not itself strengthen concept evidence or SRS.
- **Bounded means bounded.** Once started, the declared session step list must not silently grow.
- **Planner internals stay internal.** Learners should not see missing-prerequisite/bridge/debug terminology.
- **Meaning before terminology for novices.** Teach the real academic words, but attach them to understood ideas before making them the primary surface where possible.
- **One intellectual demand per screen where practicable.** Quiet product chrome; explicit problem state.
- **Mobile first.** The app must remain usable at ~320px width with tap-first interactions and no hover-only path.
- **Accessibility is required.** Never rely on colour alone; preserve keyboard and screen-reader behavior.
- **EN and FR are independent academic copy.** Add both in the same change, written independently rather than mirror-translated. See `docs/i18n.md` and `.cursor/rules/i18n-academic.mdc`.
- **AST-first logic.** Never grade formulas by raw string equality when structural/semantic logic is required.

## Learner-state semantics to protect

The current runtime has carefully defined attempt semantics. Do not casually rewrite them while adding session orchestration.

- A practice attempt finalizes only after a checked correct answer.
- A clean pass means the first checked answer was correct.
- A repaired pass may unlock progression but does not count as a clean skill success and remains conservatively scheduled by SRS.
- Explore is ungraded and writes no mastery/SRS evidence.
- Existing `skills`, `exerciseStats`, `passed`, drafts, queue, resume, route state, and concept evidence must remain compatible.
- Historical concept evidence may be backfilled only when defensible from explicit activity evidence metadata; lesson completion alone is not mastery evidence.
- Source-route Reading/Mastery behavior and durable completion must remain coherent even if the controls are progressively disclosed.
- An interrupted bounded session may be persisted for resume, but its mere existence/completion is not learning evidence.

## Implementation style

Externalize is framework-free TypeScript + Vite. Do not introduce React, Svelte, a state-management framework, backend service, database, or heavy dependency unless explicitly authorized.

Prefer:

- small pure selectors and derivation modules;
- explicit, inspectable session plans over opaque recommendation logic;
- reusing existing route/SRS/activity IDs;
- minimal new persistence for interrupted-session resume only;
- narrow renderers/components with clear UX responsibility;
- stable IDs once progress/state can reference them;
- incremental compatibility layers over destructive schema replacement.

Do not merge lessons, exercises, routes, and sessions into a universal `ActivityDefinition` or workflow system merely because they can be abstracted.

## Multi-agent coordination

When several agents work concurrently:

- Have one coordinator own the integration plan and UX/gate assessment.
- Partition work by bounded modules or test surfaces; avoid parallel edits to central files (`main.ts`, storage, session selectors, route selectors) unless explicitly coordinated.
- Agents must inspect current code before proposing changes and report observed state, not assumptions.
- A producing agent saying “tests pass” is not sufficient. The coordinator should independently inspect diffs and verify relevant tests before declaring a gate met.
- Keep commits logically scoped and comprehensible. Do not mix unrelated cleanup with the UX refactor.
- If a useful refactor is not necessary for the current gate, defer it.

A recommended partition is recorded in `docs/agent-brief-session-first-ux.md`.

## Testing and gate discipline

At minimum, run relevant focused tests during implementation and the full repository checks before declaring the assignment complete:

```bash
npm ci
npm test
npm run build
npm run test:e2e
```

`npm run release:check` runs the full release-oriented sequence when the environment has Playwright available.

For the session-first work, prioritize coverage for:

- one-action default entry;
- fixed session size and no expansion;
- interrupted-session resume;
- explicit completion and optional another round;
- session completion does not create mastery/SRS evidence;
- planner internals absent from learner-facing copy;
- meaning-before-terminology in the Sobel opening flow;
- default work does not require route/depth taxonomy;
- existing route, migration, SRS, clean/repaired, source-completion, and Explore invariants;
- EN/FR, keyboard/screen reader, reduced motion, and ~320px high-risk flow.

Do not weaken existing tests to make the refactor pass. Update expectations only where the intentionally changed learner-facing contract is documented.

## Documentation and changelog

For architecturally meaningful or user-visible changes:

- update the relevant docs in the same change;
- add a clear entry under `## [Unreleased]` in `CHANGELOG.md`;
- do not bump `package.json` version unless explicitly cutting a release;
- follow `docs/versioning.md` and `.cursor/rules/versioning-changelog.mdc`.

Keep the roadmap, session-first plan, content model, and actual runtime aligned.

## Source-content boundary

The repository may contain source maps for copyrighted books, but should not reproduce source text. For *Logic and Theism* use chapter/section/page anchors, paraphrased instructional material, and only short necessary quotations. If the map does not support a source-specific claim, mark it unresolved rather than inventing Sobel's position.

## Definition of done for the current assignment

The assignment is successful when:

1. a normal learner can open Externalize and begin one useful bounded round with one obvious tap;
2. the learner knows the approximate effort before starting and the session cannot silently expand;
3. completing the round is a legitimate stopping point;
4. the active-session surface is materially quieter than the current mode/route/depth-heavy shell;
5. planner/debug state is not learner-facing;
6. the Sobel opening flow establishes meaning before piling on quantifier terminology;
7. the earliest foundations experience is audited for the same intimidation failure mode;
8. re-entry after a gap yields a simple, bounded, pedagogically justified next action;
9. learner-state/SRS/route semantics remain intact;
10. EN/FR, accessibility, mobile, unit, build, and browser checks pass;
11. work stops before speculative curriculum, backend, notification, gamification, or universal-engine expansion;
12. the resulting PR remains unmerged until independently reviewed.

The experiential product gate is:

> **Can a learner open Externalize and feel that doing one round is trivially reasonable, even when the reasoning inside the round is genuinely difficult?**