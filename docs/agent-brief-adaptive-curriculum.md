# Multi-agent execution brief — adaptive curriculum pilot

**Audience:** a primary coding agent with access to subagents / multi-agent delegation  
**Repository:** `0xVorian/externalize`  
**Primary roadmap:** [`adaptive-curriculum-implementation.md`](adaptive-curriculum-implementation.md)  
**Status:** ready for execution

## Mission

Advance Externalize's adaptive-curriculum roadmap as far as the current pilot authorization safely permits.

This is implementation work, not a request for another architecture proposal. Inspect the repository's actual state, make the changes, integrate subagent work, test it independently, and leave the repository in a coherent working state.

The product direction is:

> Keep one portable learner model over canonical concepts/capabilities; make the existing logic course an explicit route; then prove that the same learner state can support a source-driven *Logic and Theism* route with only the missing prerequisite bridge.

The immediate proving source is Jordan Howard Sobel's *Logic and Theism*, Chapter II §§2.6–2.8, focused on universal vs existential readings / existential import in the Descartes discussion.

## Read first

Before editing code, read these in order:

1. [`../AGENTS.md`](../AGENTS.md) — repository-wide rules and current execution boundary.
2. [`adaptive-curriculum-implementation.md`](adaptive-curriculum-implementation.md) — authoritative implementation roadmap, phases, gates, migration strategy, and tests.
3. [`adaptive-curriculum.md`](adaptive-curriculum.md) — conceptual model: concepts, capabilities, routes, source packs, portable learner state.
4. [`roadmap.md`](roadmap.md) — shipped baseline and product-validation constraints.
5. [`design-principles.md`](design-principles.md) — non-negotiable pedagogical/UX rules.
6. [`content-model.md`](content-model.md), [`testing.md`](testing.md), [`i18n.md`](i18n.md), [`versioning.md`](versioning.md).
7. [`curricula/logic-and-theism.md`](curricula/logic-and-theism.md) — especially the detailed Chapter II mapping for the pilot.

Then inspect the implementation itself. Do not assume the docs are perfectly synchronized with current code.

## Baseline to preserve

At the start of this assignment, Externalize is a framework-free Vite + TypeScript browser app with:

- three propositional-logic learning units;
- graded Practice for evaluation, scope, truth tables, counterexamples, tautology classification, prose→formula translation, and introductory proof steps;
- local progress storage v6;
- clean-pass vs repaired-pass semantics;
- concrete-exercise SRS;
- Explore mode that records no mastery evidence;
- EN/FR independently authored course material;
- capability/progress visibility;
- Vitest + Playwright regression coverage;
- predicate/quantifier AST/parser groundwork but no full predicate-logic course.

Phase A must preserve effective learner behavior.

## Authorized execution sequence

### Phase A — explicit `logic-foundations` route, parity first

Implement the route/evidence substrate while preserving the existing experience.

Deliver at least:

- a canonical concept representation suitable for route/source reuse;
- a small capability ontology for the pilot (`recognize`, `apply`, `debug`, `transfer` unless observed implementation constraints justify an equally small alternative);
- explicit evidence metadata on existing graded activities rather than inferring durable knowledge from interaction type alone;
- an explicit `logic-foundations` route reproducing current lesson/practice sequencing;
- route loading/selectors and route-aware progression;
- progress storage v7 additions for active route, per-route state, and portable concept/capability evidence;
- conservative v6→v7 migration preserving existing fields/evidence and effective resume position;
- historical concept-evidence backfill only where the new explicit metadata makes it defensible;
- parity tests proving that a fresh learner and representative existing learner experience the same current course behavior after migration.

Do not redesign lesson order, practice order, repaired-pass semantics, SRS policy, or current UI merely because the refactor makes that possible.

**Gate A:** independently verify route parity, migration parity, build, unit tests, and relevant browser regressions before treating Phase A as complete.

### Phase B — *Logic and Theism* Chapter II vertical slice

After Gate A, implement a narrow source-driven Learn route around Sobel Chapter II §§2.6–2.8.

The learner should be able to:

1. select/use the source route within Learn rather than entering a new top-level app mode;
2. see the source anchor / reading context;
3. receive only missing prerequisite support;
4. distinguish ordinary-language universal/hypothetical from existential readings of `A F is G`;
5. connect those readings to universal and existential quantification;
6. predict which reading the Descartes argument requires;
7. inspect why the premises can support a universal/hypothetical result without supplying existential import;
8. finish with a source-independent transfer item so success is not just memorizing the Sobel example;
9. have graded results strengthen the same canonical concept/capability state that other routes can reuse.

Use paraphrased source material and source anchors from the repository maps. Do not reproduce the book text.

Add the **minimum reusable interaction type** needed. A generic choice/classification interaction plus clear notation may be sufficient. Reuse existing predicate/quantifier parser/AST work where useful, but do not expand into a full predicate-logic curriculum.

Both English and French user-facing material must ship in the same change, independently authored in the appropriate academic vocabulary.

**Gate B:** verify that source-specific completion does not create duplicate concept state, that existing `logic-foundations` evidence can suppress redundant prerequisites, and that the transfer item strengthens the same durable concept.

### Phase C — deterministic just-in-time planner

If the Phase B implementation has enough structure to justify extracting the planner, implement the small deterministic policy from the roadmap.

It should produce explicit inspectable decisions such as:

- skip a requirement already demonstrated strongly enough;
- give one retrieval/transfer check for weak or stale evidence;
- teach a short bridge for unseen prerequisites;
- add formalization work only in Mastery depth.

Do not introduce an LLM recommender, ranking model, opaque score optimizer, or server call.

Snapshot/unit-test planner decisions.

### Hard stop

Do not proceed into Chapter III+ renderers/interactions (modal world cards, causal graphs, Bayes UI, Cantor UI, decision matrices) during this assignment. Do not add PDF ingestion, cloud sync/accounts, a backend, or runtime AI curriculum generation.

Document useful future findings instead.

## Multi-agent work decomposition

Use subagents where useful, but avoid turning delegation into parallel merge conflict.

A sensible decomposition is:

- **Architecture/parity agent:** inventory current progression and design route data/selectors with parity tests.
- **Persistence/evidence agent:** v7 migration, portable concept evidence, finalization semantics, migration fixtures/tests.
- **Source-content agent:** author the Sobel Chapter II source pack/route items and EN/FR pedagogical copy from the existing map; no runtime core edits unless coordinated.
- **UI/integration agent:** route selector/source context within Learn and minimal new activity renderer.
- **QA/reviewer agent:** independently review diffs, test migration/parity/no-false-mastery semantics, and exercise mobile/a11y flows.

The primary agent remains responsible for architecture consistency and final integration. Do not allow multiple agents to make competing uncoordinated edits to `storage.ts`, `main.ts`, or the central route schema.

## Engineering constraints

- Inspect before editing; prefer observed runtime state over assumptions from docs.
- Keep Vite + vanilla TypeScript unless there is an extraordinary demonstrated need otherwise.
- Keep logic validation AST/engine-based where applicable; do not grade formulas with raw string equality.
- Keep SRS attached to concrete exercises/activities.
- Keep route state distinct from portable concept mastery.
- Do not infer mastery from lesson/read completion, hints, navigation, Explore, or time spent.
- Preserve in-place repair semantics.
- Preserve accessibility and ~320px mobile usability.
- New user-facing strings require both EN and FR, authored independently.
- Stable learner-referenced IDs must not be casually renamed.
- Prefer small pure selectors and explicit data over a large orchestration framework.
- Do not prematurely merge all lesson/exercise types into one universal activity abstraction.

## Required tests

Treat the roadmap's architecture tests as a minimum contract:

1. fresh-learner route parity;
2. representative v6→v7 migration/resume parity;
3. portable mastery suppresses redundant source prerequisites;
4. source completion advances source route without duplicating concepts;
5. transfer evidence strengthens the same canonical concept;
6. Reading vs Mastery depth can differ without splitting concept identity;
7. reading/navigation/hints/Explore produce no false mastery.

Also preserve existing unit/browser coverage around repaired attempts, SRS, progress visibility, EN/FR parity, mobile, and accessibility.

Before final completion, run:

```bash
npm ci
npm test
npm run build
npm run test:e2e
```

If Playwright cannot run because of an environment limitation, do not silently claim success: run everything available, document the exact blocker, and keep browser-test changes reviewable.

## Documentation obligations

As implementation lands:

- keep [`content-model.md`](content-model.md) synchronized with the actual route/evidence/storage model;
- update [`roadmap.md`](roadmap.md) with gate status rather than declaring work complete because code exists;
- add architecturally meaningful/user-visible changes under `CHANGELOG.md` → `[Unreleased]`;
- do not bump the package version or cut a release unless separately authorized;
- record decisions exposed by the pilot rather than silently generalizing beyond it.

## Decision policy

Make reasonable implementation decisions without asking for routine clarification. Prefer the smallest architecture that preserves the roadmap's properties.

When the roadmap leaves a choice open:

1. inspect current patterns;
2. choose the least-complex compatible option;
3. write a focused test that captures the intended contract;
4. document genuinely consequential choices.

If a requested property conflicts with an established invariant, stop that specific change, explain the conflict in the work log/final report, and preserve the invariant rather than layering a workaround.

## Final report

When finished, report concisely:

- phases/gates completed;
- architectural changes actually made;
- migration behavior and compatibility;
- the exact Sobel vertical slice implemented;
- tests run and their results;
- any remaining failing/blocked checks;
- decisions deferred until real usage;
- commit/PR identifiers if applicable;
- explicit confirmation that Chapter III+ speculative expansion was not undertaken.

Do not report a phase as complete solely because a producing subagent says it is. Independently verify the integrated repository state first.
