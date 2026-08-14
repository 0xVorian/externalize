# Future work plan — historical batch record

This document preserves the proactive agent/workstream plan used while Externalize was growing from the Level 0 prototype into the current propositional-logic application.

**It is no longer the source of truth for what to build next.** Most of the work listed here shipped by v0.3.5. See [Roadmap](roadmap.md) for current status and remaining validation gates.

## Outcome of the original workstreams

| Original workstream | Status by v0.3.5 | Where it landed |
|---------------------|------------------|-----------------|
| **Level 1 course** | Done | Unit 1 lessons for `¬`, `∨`, `→`, `↔`, nesting, and translation introduction in EN/FR |
| **Exercise bank** | Done and expanded | Scope, evaluation, truth-table, counterexample, tautology, translation, and proof-step exercises |
| **Authoring guide** | Done | [authoring.md](authoring.md) and [content-model.md](content-model.md) |
| **Truth-table engine** | Done | `engine/truth-table/` plus lesson/practice renderers |
| **Phase 3 translation design** | Done and implemented | [phase3-translation.md](phase3-translation.md), `src/app/translation/`, translation feedback |
| **Concept map** | Done | Progress concept graph and accessible text status |
| **2×2 watch grid** | Done | Binary connective watch lessons |
| **Accessibility pass** | Done for current MVP scope | Keyboard tree navigation, focus/ARIA work, mobile regression tests |
| **PWA shell** | Done | Manifest, service worker, installable shell |
| **Predicate-logic prep** | Done as design/engine spike | [predicate-logic.md](predicate-logic.md), AST/parser extensions |
| **Natural-deduction prep** | Done as design/prototype | [natural-deduction.md](natural-deduction.md), proof engine, two fill-step exercises |
| **Exercise generation tooling** | Added beyond the original plan | `tools/exercise-generator/` and inventory tooling |

## Original batch mapping

The historical batch IDs are kept here so old commits, notes, and discussions remain understandable.

### Batch A — Content

- **A1 — Level 1 course:** completed.
- **A2 — Exercise bank:** completed and subsequently expanded beyond the original 15–25 exercise target.

### Batch B — Engine and authoring

- **B3 — Truth-table engine:** completed and integrated into lessons and practice.
- **B4 — Authoring guide + content model examples:** completed.

### Batch C — Translation

- **C5 — Translation design + minimal stub:** completed, then developed into working graded translation practice.

## Work that remains intentionally deferred

These are not “missing MVP checkboxes.” They remain deferred until use of the existing propositional product provides a reason to pursue them.

| Area | Why defer |
|------|-----------|
| **Cloud sync / user accounts** | Local-first storage plus export/import is sufficient for the current validation stage |
| **Heavy gamification** | Mastery evidence and useful practice matter more than decorative retention mechanics |
| **React or framework rewrite** | Current TypeScript/Vite architecture supports the product; a rewrite would add churn without a learning benefit |
| **Full natural-deduction editor** | The existing proof prototype is enough groundwork until propositional practice is validated |
| **Predicate-logic curriculum/UI** | Engine/parser preparation exists; teaching and interaction design should follow evidence from the current product |
| **Multiple notation systems** | One canonical Unicode notation is sufficient for the current scope |
| **Native mobile app** | The mobile-first PWA is the current validation vehicle |

## Current near-term gate

The next gains should come from **using and observing the product**, not from executing another prewritten feature batch.

Questions to answer before broadening scope:

1. Does Externalize actually reduce working-memory burden while solving symbolic-logic problems?
2. Are the Learn → Practice → repair → review loops pleasant enough to repeat voluntarily?
3. Do the different practice types measure distinct skills cleanly enough for progress/SRS to mean something?
4. Is the existing propositional curriculum deep enough to expose real weaknesses rather than only rehearse familiar cases?
5. Which interactions are genuinely instructive on a phone, and which merely function technically?

When those questions generate concrete evidence, create a new focused work plan rather than reviving the completed batch structure above.

## Related documentation

| Document | Relationship |
|----------|--------------|
| [Roadmap](roadmap.md) | Current shipped status and validation gates |
| [Design principles](design-principles.md) | Non-negotiable pedagogical and UX constraints |
| [Presentation](presentation.md) | When to use truth tables, parse trees, and other representations |
| [Content model](content-model.md) | Exercise schema, concepts, and progress representation |
| [Authoring guide](authoring.md) | Adding lessons and exercises |
| [Technical decisions](decisions.md) | Platform, notation, and architecture choices |
| [Predicate logic](predicate-logic.md) | Phase 6 engine/design preparation |
| [Natural deduction](natural-deduction.md) | Phase 5 design/prototype preparation |

## Contributor hygiene

For future work:

1. Tie changes to a current issue or explicit product question rather than one of the historical A/B/C batches.
2. Link new content to skill tags and concept ids.
3. Confirm mobile tap-first completion around a 320px viewport for interactive UI.
4. Add user-visible changes to [CHANGELOG](../CHANGELOG.md) under `[Unreleased]`.
5. Keep exploration, graded prediction, and construction distinct when interpreting progress evidence.
