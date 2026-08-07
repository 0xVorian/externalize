# Future work plan

Planning document for **proactive work** on content, engine modules, and Phase 3–4 preparation. This is **not** the shipped application roadmap — see [Roadmap](roadmap.md) for build order, MVP scope, and phase exit criteria.

Use this doc when deciding what to work on next in parallel (solo or via agent batches), without confusing it with “what ships in which phase.”

## Purpose

Externalize already has a working Level 0 path and gated practice. The next gains come from:

- **Content** — Level 1 lessons, a larger exercise bank, and clear authoring conventions
- **Engine** — reusable truth-table machinery and Phase 3 translation hooks
- **Prep** — design stubs and decision records so Phase 3–4 work does not stall on unknowns

This plan prioritizes work that unblocks learning and authoring. It deliberately defers platform features (cloud sync, gamification, full ND UI) until core propositional interactions are solid.

## Workstreams by tier

Tiers reflect **dependency and payoff**, not roadmap phases. Tier 1 should land before Tier 2; Tier 3 can run in parallel once Tier 1 content exists.

### Tier 1 — Content foundation

| Workstream | Outcome | Notes |
|------------|---------|-------|
| **Level 1 course** | Lessons for `¬`, `∨`, `→`, `↔` in EN and FR | Follow Level 0 pattern: intro → recognition → guided try; align with [i18n](i18n.md) (independent academic copy, not literal translation) |
| **Exercise bank** | 15–25 hand-authored exercises | Mix scope, eval, and early translation-ready prompts; tag skills per [content model](content-model.md) |
| **Authoring guide** | Contributor-facing how-to | JSON/YAML examples, skill tags, feedback templates, presentation choices ([presentation](presentation.md)) |

### Tier 2 — Engine and Phase 3 prep

| Workstream | Outcome | Notes |
|------------|---------|-------|
| **Truth-table engine module** | Shared module for watch tables, live rows, partial cells | Extract from ad hoc rules (e.g. `usesLiveTruthRow`); support generalization beyond `P ∧ Q` |
| **Phase 3 translation design** | Spec + minimal stub | **Done (C5):** [phase3-translation.md](phase3-translation.md), stub in `src/app/translation/` |
| **Content model examples** | Concrete files matching the draft schema | One file per exercise type; engine validation targets |

### Tier 3 — Phase 4 polish and decision records

| Workstream | Outcome | Notes |
|------------|---------|-------|
| **Concept map** | Prerequisite graph + mastery overlay | Render from concept graph in [content model](content-model.md) |
| **2×2 grid view** | Alternate renderer for small atom sets | Optional spatial view for `P ∧ Q`-style patterns; see [presentation](presentation.md) |
| **Accessibility (a11y)** | Keyboard paths, focus order, screen-reader labels | Tap-first stays primary; no hover-only affordances |
| **PWA manifest** | Home-screen install, offline shell | Lightweight; no sync requirement |
| **Predicate / ND decision docs** | Recorded choices before UI work | **Predicate prep (done):** [predicate-logic.md](predicate-logic.md); ND still TBD in [decisions](decisions.md) |
| **Predicate / ND decision docs** | Recorded choices before UI work | **ND prep (done):** [natural-deduction.md](natural-deduction.md); predicate logic still TBD; finalize rule set in [decisions](decisions.md) when Phase 5 starts |

## Agent batch launch plan

When running parallel agents (or focused sessions), use three batches with **five workstreams** total. Each stream should produce reviewable artifacts (docs, JSON content, or isolated modules) without blocking others.

### Batch A — Content (parallel)

| ID | Workstream | Deliverables |
|----|------------|--------------|
| **A1** | Level 1 course | Lesson copy + structure for `¬`, `∨`, `→`, `↔`; EN and FR; watch/guided patterns where tables fit |
| **A2** | Exercise bank | 15–25 exercises with ids, skills, expected ASTs, feedback keys |

**Merge order:** A1 and A2 can land independently; reconcile skill tags and concept ids before wiring into the app.

### Batch B — Engine and authoring (parallel)

| ID | Workstream | Deliverables |
|----|------------|--------------|
| **B3** | Truth-table engine module | API for full table, highlighted row, live row, future partial cell; tests |
| **B4** | Authoring guide + content model examples | `docs/` or `content/` examples; validation notes tied to [content model](content-model.md) |

**Merge order:** B4 can start immediately; B3 should not require app-wide refactors in the first PR (module + tests first).

### Batch C — Phase 3 (single stream, after A/B context helps)

| ID | Workstream | Deliverables |
|----|------------|--------------|
| **C5** | Phase 3 translation design + minimal stub | **Done:** [phase3-translation.md](phase3-translation.md) + `src/app/translation/` |

**Gate:** C5 benefits from A2 (sample translation prompts) and B4 (schema examples). It does not require B3 or Tier 3 items.

```text
Batch A (content)     A1 ── Level 1 lessons
                      A2 ── Exercise bank

Batch B (engine)      B3 ── Truth-table module
                      B4 ── Authoring guide + examples

Batch C (Phase 3)     C5 ── Translation design + stub
```

## What not to spend effort on yet

These are explicitly out of scope for this plan (also reflected in [roadmap](roadmap.md) “not building yet”):

| Area | Why defer |
|------|-----------|
| **Cloud sync / user accounts** | Local-first MVP; export/import is enough for now |
| **Heavy gamification** | Achievements, leaderboards, streak mechanics — mastery feedback and concept map first |
| **React or framework rewrite** | Current stack proves UX; rewrite is churn without new learning outcomes |
| **Full natural-deduction editor** | Phase 5; needs stable eval/translation patterns and decision docs |
| **Predicate logic UI** | Phase 6; AST prep in [predicate-logic.md](predicate-logic.md) — implement after Phase 4–5 |
| **Template-based exercise generation** | Hand-authored JSON until patterns and feedback are proven |
| **Multiple textbook notation systems** | One canonical Unicode notation per [decisions](decisions.md) |

Revisit this list only after Phase 3 translation feels instructive on a phone and the exercise bank covers core propositional skills.

## Related documentation

| Document | Relationship |
|----------|--------------|
| [Roadmap](roadmap.md) | **App build order** and phase exit criteria — not duplicated here |
| [Presentation](presentation.md) | When to use truth tables vs parse trees; 2×2 grid notes |
| [Content model](content-model.md) | Exercise schema, concept graph, progress shape |
| [Technical decisions](decisions.md) | Platform, notation, authoring, open questions |
| [Predicate logic (Phase 6 prep)](predicate-logic.md) | AST extension, notation, engine impact — design only |
| [Natural deduction (Phase 5 prep)](natural-deduction.md) | Fitch mobile layout, rule-set options, fill/repair exercise patterns |
| [Design principles](design-principles.md) | Non-negotiable UX constraints for all workstreams |
| [Internationalization](i18n.md) | EN/FR copy conventions for Level 1 and exercises |

## Session checklist (contributors)

Before opening a PR tied to this plan:

1. State which batch/id (e.g. A2, B3) the change belongs to
2. Link new content to skill tags and concept ids
3. Confirm mobile tap-first completion on a ~320px viewport for any UI
4. Add or update [CHANGELOG](../CHANGELOG.md) under `[Unreleased]` for user-visible changes
5. Do **not** fold this work into [roadmap](roadmap.md) phase checkboxes unless the feature actually ships in the app
