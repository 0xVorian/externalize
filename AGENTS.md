# AGENTS.md

Repository-wide operating instructions for coding agents working on Externalize.

## Mission

Externalize is a local-first, mobile-first learning application whose defining idea is to **externalize intermediate reasoning state** so the learner does not have to hold large symbolic structures in working memory.

The current authorized development direction is the **adaptive curriculum pilot**: preserve the existing logic course, make it an explicit route over reusable concept/capability state, then validate that architecture with a narrow *Logic and Theism* source-driven vertical slice.

The implementation roadmap is authoritative for this work:

- **[`docs/adaptive-curriculum-implementation.md`](docs/adaptive-curriculum-implementation.md)** — execution roadmap, phases, gates, migration strategy, tests, and explicit non-goals.
- [`docs/adaptive-curriculum.md`](docs/adaptive-curriculum.md) — conceptual architecture and rationale.
- [`docs/curricula/logic-and-theism.md`](docs/curricula/logic-and-theism.md) and [`docs/curricula/logic-and-theism/`](docs/curricula/logic-and-theism/) — source mapping and pedagogical requirements.

Do not substitute an older phase plan or a generic educational-platform architecture for that roadmap.

## Source-of-truth order

When documents conflict, use this order for the adaptive-curriculum work:

1. `AGENTS.md`
2. `docs/adaptive-curriculum-implementation.md`
3. `docs/adaptive-curriculum.md`
4. `docs/roadmap.md`
5. `docs/design-principles.md`
6. current runtime behavior and tests
7. `docs/content-model.md`, `docs/decisions.md`, `docs/authoring.md`, and other scoped design notes
8. historical agent briefs / old phase plans

When a document describes pre-implementation state, inspect the code before assuming it is still current.

## Current execution boundary

Prosecute the roadmap in order and respect its gates.

### Phase A — route refactor

Make the current three-unit logic course run through an explicit `logic-foundations` route with **zero intended learner-visible behavior change**.

Required properties include:

- explicit canonical concept metadata;
- explicit concept × capability evidence on graded activities;
- route-aware progression;
- conservative v6 → v7 progress migration;
- preservation of current lesson/practice order, unlock behavior, repaired-pass semantics, SRS, resume behavior, and existing learner evidence;
- parity/regression tests before moving on.

Do not treat Phase A as permission to redesign the current course.

### Phase B — narrow Sobel vertical slice

Implement only the Chapter II §§2.6–2.8 / Descartes + existential-import slice described in the roadmap and source map.

Use the smallest reusable interaction surface that works. Reuse the existing predicate/quantifier engine groundwork where appropriate, but do **not** build a full predicate-logic curriculum merely to support this slice.

### Phase C — deterministic prerequisite planner

After the Phase B substrate is sound, a small deterministic just-in-time planner is in scope. Its decisions must be explicit and testable (`skip` / `retrieve` / `teach` style), not opaque runtime AI recommendations.

### Stop boundary

Do **not** implement Chapter III–XIII interaction families, a generic curriculum generator, a PDF reader, a server/backend, cloud accounts, or a universal reasoning engine as part of this assignment. Those remain later decisions gated on the pilot.

## Product invariants

Preserve these unless the roadmap explicitly changes them:

- **Externalize intermediate state.** Prefer small visible transformations to hidden mental jumps.
- **Local, repairable feedback.** Wrong attempts should be fixable in place when possible.
- **Evidence-backed progress only.** Reading completion, navigation, hints, time spent, Explore activity, or session completion must never masquerade as mastery.
- **SRS remains concrete.** Schedule actual exercises/activities, not abstract concept IDs.
- **Concept mastery is portable.** Source routes must strengthen/reuse the same canonical concept state rather than invent source-specific duplicates.
- **Content and engine remain separate.** Do not encode authored pedagogy into validators unnecessarily.
- **No universal engine.** Different representations may use different small validators/engines.
- **Keep the four top-level modes.** Learn / Explore / Practice / Progress remain the product structure; a book/source is a Learn route, not a new top-level Books mode.
- **Mobile first.** The app must remain usable at ~320px width with tap-first interactions and no hover-only path.
- **Accessibility is required.** Never rely on colour alone; preserve keyboard and screen-reader behavior.
- **EN and FR are independent academic copy.** Add both in the same change, written independently rather than mirror-translated. See `docs/i18n.md` and `.cursor/rules/i18n-academic.mdc`.
- **AST-first logic.** Never grade formulas by raw string equality when structural/semantic logic is required.

## Learner-state semantics to protect

The current runtime has carefully defined attempt semantics. Do not casually rewrite them while adding routes/evidence.

- A practice attempt finalizes only after a checked correct answer.
- A clean pass means the first checked answer was correct.
- A repaired pass may unlock progression but does not count as a clean skill success and remains conservatively scheduled by SRS.
- Explore is ungraded and writes no mastery/SRS evidence.
- Existing `skills`, `exerciseStats`, `passed`, drafts, queue, and resume data must survive the first adaptive-curriculum migration.
- Historical concept evidence may be backfilled only when it is defensible from explicit activity evidence metadata; lesson completion alone is not mastery evidence.

## Implementation style

Externalize is framework-free TypeScript + Vite. Do not introduce React, Svelte, a state-management framework, backend service, database, or heavy dependency unless the roadmap demonstrably requires it.

Prefer:

- small pure selectors and derivation modules;
- explicit data structures over hidden convention;
- migration functions with representative fixtures/tests;
- narrow renderer additions tied to pedagogical representation;
- stable IDs once learner progress can reference them;
- incremental compatibility layers over destructive schema replacement.

Do not merge lessons and exercises into a universal `ActivityDefinition` merely because the future architecture might permit it. The roadmap explicitly defers that decision until after the vertical slice.

## Multi-agent coordination

When several agents work concurrently:

- Have one coordinator own the integration plan and roadmap/gate assessment.
- Partition work by bounded modules or test surfaces; avoid parallel edits to the same central files (`storage.ts`, `main.ts`, route selectors, shared content schema) unless explicitly coordinated.
- Agents must inspect current code before proposing changes and report observed state, not assumptions.
- A producing agent saying “tests pass” is not sufficient. The coordinator should independently inspect diffs and run/verify the relevant tests before declaring a gate met.
- Keep commits logically scoped and comprehensible. Do not mix unrelated cleanup with migration behavior.
- If a useful refactor is not necessary for the current gate, defer it rather than expanding the blast radius.

## Testing and gate discipline

At minimum, run relevant focused tests during implementation and the full repository checks before declaring a phase complete:

```bash
npm ci
npm test
npm run build
npm run test:e2e
```

`npm run release:check` runs the full release-oriented sequence when the environment has Playwright available.

For adaptive curriculum work, prioritize the architecture tests listed in `docs/adaptive-curriculum-implementation.md`, especially:

- route parity for a fresh learner;
- v6 → v7 migration parity and resume equivalence;
- portable mastery across routes;
- source isolation;
- transfer evidence;
- Reading vs Mastery depth behavior;
- no false mastery from navigation/reading/hints/Explore.

Do not weaken existing tests to make the refactor pass. Update tests only where an intentionally changed contract is documented.

## Documentation and changelog

For architecturally meaningful or user-visible changes:

- update the relevant docs in the same change;
- add a clear entry under `## [Unreleased]` in `CHANGELOG.md`;
- do not bump `package.json` version unless explicitly cutting a release;
- follow `docs/versioning.md` and `.cursor/rules/versioning-changelog.mdc`.

When the runtime changes, keep `docs/content-model.md` and the roadmap accurate; do not leave the repository describing the old storage/route model as current.

## Source-content boundary

The repository may contain source maps for copyrighted books, but should not reproduce the source text. For *Logic and Theism* use chapter/section/page anchors, paraphrased instructional material, and only short necessary quotations. If the map does not support a source-specific claim, mark it as unresolved rather than inventing Sobel's position.

## Definition of done for this assignment

The assignment is successful when:

1. Phase A is implemented and independently verified with parity/migration coverage.
2. The Chapter II Sobel vertical slice runs as a source-driven route over the same portable learner model.
3. The prerequisite behavior is deterministic, inspectable, and minimal rather than a hidden recommender.
4. Existing learning/progress semantics are preserved unless an intentional change is documented and tested.
5. EN/FR, accessibility, mobile, unit, build, and browser checks pass.
6. Documentation and changelog describe the resulting architecture accurately.
7. Work stops before speculative Chapter III+ renderer expansion unless separately authorized.
