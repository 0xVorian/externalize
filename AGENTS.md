# AGENTS.md

Repository-wide operating instructions for coding agents working on Externalize.

## Mission

Externalize is a local-first, mobile-first learning application whose defining idea is to **externalize intermediate reasoning state** so the learner does not have to hold large symbolic structures in working memory.

The **session-first, low-intimidation UX and exercise visual grammar are now the shipped baseline on `master`**. Current work should validate that baseline through real use and make bounded, evidence-driven remediations without weakening the adaptive learner model or rigorous logic.

Core product rules:

> **Bound the effort, not the difficulty.**

> **The learner should never have to understand Externalize before they can learn logic.**

> **Quiet chrome, explicit reasoning.**

The current product/architecture contract is:

- **[`docs/session-first-ux.md`](docs/session-first-ux.md)** — product/UX plan, phases, gates, anti-example, invariants, and non-goals.
- **[`docs/agent-brief-session-first-ux.md`](docs/agent-brief-session-first-ux.md)** — historical execution brief for the completed session-first implementation.
- [`docs/adaptive-curriculum-implementation.md`](docs/adaptive-curriculum-implementation.md) — implemented adaptive architecture and learner-state contract that the UX work must preserve.
- [`docs/adaptive-curriculum.md`](docs/adaptive-curriculum.md) — conceptual route/source architecture.
- [`docs/research/engagement-learning/synthesis.md`](docs/research/engagement-learning/synthesis.md) — research basis and cautions around engagement mechanics.

Do not substitute an older phase plan or a generic educational-platform architecture for these documents.

## Source-of-truth order

When documents conflict, use this order for current work:

1. `AGENTS.md`
2. `docs/roadmap.md`
3. `docs/session-first-ux.md`
4. `docs/adaptive-curriculum-implementation.md`
5. current runtime behavior and tests
6. `docs/design-principles.md`
7. `docs/adaptive-curriculum.md`
8. `docs/content-model.md`, `docs/decisions.md`, `docs/authoring.md`, and other scoped design notes
9. historical agent briefs / old phase plans

Historical execution briefs explain why a change was made; they are not fresh authorization to rerun that project.

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

## Current execution boundary — validation and bounded remediation

The adaptive pilot, UX-A–D session-first work, reason-bearing feedback pass, and exercise visual grammar are implemented on `master`.

Current work should therefore begin from observed product behavior, not from an old implementation checklist. Prefer:

- real-use validation of initiation friction, comprehension, repair, retention, transfer, and source-route usefulness;
- narrow fixes for concrete learner-facing friction or logical/pedagogical inconsistencies;
- keeping the default interaction grammar clear: **logical object → response workspace → Check → reason-bearing feedback**;
- sequencing beginner truth-value language as ordinary meaning (`True` / `False`, `Vrai` / `Faux`) into formal notation (`T/F`, `V/F`) rather than demanding notation fluency too early;
- preserving explicit intermediate reasoning state while removing product chrome and hidden defaults;
- updating controlling documentation whenever the shipped contract changes.

Do not create work simply to finish an old phase label. If real use does not justify a change, leave the shipped baseline alone.

### Implemented baseline

- one obvious bounded opening action with a frozen session envelope;
- interruption/resume and explicit completion;
- planner/debug language hidden from the learner;
- meaning → use → name → notation → independent use for novice material where practicable;
- learning-aligned re-entry and separate local session telemetry;
- stimulus/response/action visual separation for graded interactions;
- select-then-Check truth-value interactions with provisional state that reveals no correctness before Check;
- guided truth-table state distinguishes unknown from false and never computes from hidden defaults.

### Stop boundary

Do **not** implement Chapter III–XIII interaction families, a generic curriculum/session generator, PDF reader, server/backend, cloud accounts, push/email reminders, framework migration, or universal workflow/reasoning engine as part of this assignment.

## Canonical UX anti-pattern

The pre-session-first Sobel pilot demonstrated a learner-facing failure mode where the application could simultaneously expose:

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

The current runtime has carefully defined attempt semantics. Do not casually rewrite them while remediating the shipped interaction model.

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

## Validation criteria for the current baseline

Treat the shipped baseline as successful only insofar as real use supports these criteria:

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