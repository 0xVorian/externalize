# Roadmap

This document tracks the shipped application and the remaining validation gates. It is intentionally conservative: implemented prototypes are not promoted to “done” merely because code exists.

## Current status — v0.4.0

Externalize now has three propositional-logic learning units, graded practice across multiple skills, local progress/SRS, EN/FR course material, Explore mode, export/import, a concept map, PWA support, browser regression coverage, and evidence-backed progress visibility throughout Learn, Practice, and Progress.

The main unresolved question is no longer whether the core interactions can be built, or whether progress can be made perceptible without inventing arbitrary gamification. It is whether sustained use makes symbolic-logic practice meaningfully easier and worth returning to.

### Current validation priority — sustained personal use

The progress-visibility pass defined in [progress-visibility.md](progress-visibility.md) is implemented. Learn exposes unit/lesson position; Practice exposes capability state and finite five-exercise sessions; Progress leads with capability-oriented summaries; meaningful transitions are derived from graded evidence rather than time spent or arbitrary XP.

Implemented scope:

- [x] Ambient unit/lesson position in Learn
- [x] Ambient capability state in Practice
- [x] Finite short practice-session arc (5 finalized exercises)
- [x] Session-complete summary based on actual changes
- [x] Visible transitions for capability reliability, new unlocks, and reduced scaffolding
- [x] Capability-first summary in Progress (`You can now`, `In progress`, `Up next`)
- [x] EN/FR, accessibility, reduced-motion, and ~320px mobile coverage
- [x] Unit and browser regression tests for progress derivation and transition behavior

**Validation criterion now:** use the current application repeatedly in ordinary phone sessions and determine whether the learner can tell what they are working on, notice meaningful progress, retain and transfer symbolic-logic skills, and want to return without being prompted by product-development work.

Progress claims must remain evidence-backed. Explore, time spent, and session completion are motivational/contextual signals only and must not masquerade as mastery.

Until sustained use produces evidence for a concrete change, **product validation takes priority over curriculum expansion**.

## Phase 0 — Documentation

- [x] Preserve original brief
- [x] Record design principles and technical decisions
- [x] Define MVP scope and build order
- [x] Define content model and authoring conventions
- [x] Adopt mobile-first browser as primary target
- [x] Establish independent EN/FR academic copy policy

## Phase 1 — Engine spike

Goal: prove the AST + evaluation core before building UI polish.

- [x] Propositional AST types
- [x] Parser: text → AST
- [x] Unicode display renderer
- [x] Vertical tree renderer
- [x] Evaluator with per-node truth values
- [x] Structural / semantic equivalence support
- [x] Truth-table engine
- [x] Local feedback modules
- [x] Unit tests for engine behavior

**Exit criterion:** parse and evaluate nested propositional formulas with visible intermediate state and distinguish structurally different scopes. **Met.**

## Phase 2 — Core interactive prototype

Goal: validate the core UX on a phone — externalized scope, visible evaluation, local feedback, and repairable attempts.

- [x] Formula trees readable at ~320px width
- [x] Main-connective / scope selection
- [x] Truth-value exploration with visible propagation
- [x] Local, diagnostic feedback
- [x] Repair within the same attempt
- [x] Persisted drafts
- [x] Local progress and spaced review
- [x] Mobile and accessibility regression coverage

**Product validation criterion:** use it regularly on a phone and want to return; working-memory load is visibly reduced. **Still pending sustained real-world use.**

## Phase 3 — Translation prototype

Goal: ordinary language → symbols using the same visible-state and local-repair principles.

Design: [phase3-translation.md](phase3-translation.md).

- [x] Tap-based symbol palette
- [x] Formula builder and AST compilation
- [x] Compare learner AST to expected structure / accepted equivalence
- [x] Local feedback for reversed conditionals, negation scope, missing grouping, and wrong atoms
- [x] Repair without discarding the attempt
- [x] EN/FR authored prompts and glosses
- [x] Mobile browser coverage
- [ ] Optional desktop drag/group interaction
- [ ] Richer structural read-back / construction affordances if real use justifies them

**Product validation criterion:** translation practice feels instructive on a phone rather than merely gradable. **Needs real-world use.**

## Phase 4 — Propositional practice system

The original “full propositional MVP” feature list is now substantially implemented.

- [x] Operator reference during lessons
- [x] Multiple hand-authored exercises per core skill
- [x] Evaluation practice
- [x] Interactive truth-table completion
- [x] Counterexample / model-finding challenges
- [x] Tautology classification
- [x] Translation practice
- [x] Expanded spaced-repetition scheduling
- [x] Concept map with prerequisites
- [x] Progress export/import
- [x] PWA manifest and offline shell
- [x] Cluster-based practice progression
- [x] Separate exploration from graded prediction
- [x] System-chosen diagnostic cases for graded evaluation
- [x] Accessible EN/FR UI and course content
- [x] Evidence-backed progress visibility in ordinary Learn/Practice use

**Current gate:** sustained personal use and validation of the learning loop, exercise quality, progression, repaired attempt semantics, retention, and transfer. Do not expand curriculum scope merely to satisfy an old checkbox list or because additional engine work is technically possible.

## Phase 5 — Natural deduction

Status: **prototype only**.

Implemented groundwork:

- [x] Proof rule types and validation engine
- [x] Mobile-oriented proof rendering
- [x] Two fill-one-step proof exercises (`nd-001`, `nd-002`)
- [x] Natural-deduction design document

Deferred until propositional practice is validated:

- [ ] Full Fitch-style proof editor with scope highlighting
- [ ] Broader rule set and prerequisite-aware rule picker
- [ ] Repair-invalid-step exercises
- [ ] Subproof interaction
- [ ] Derivation replay

## Phase 6 — Predicate logic

Status: **engine/design spike only**.

Implemented groundwork:

- [x] Predicate / quantifier AST extensions
- [x] Parser support for predicates, terms, `∀`, and `∃`
- [x] Free-variable / predicate-symbol helpers
- [x] Predicate-logic design document

Deferred:

- [ ] Predicate-logic learning units
- [ ] Translation exercises for quantified statements
- [ ] Models and countermodels
- [ ] Quantifier natural-deduction rules and UI

## Recommended session structure (for content authoring)

When writing lessons, follow this loop:

1. Introduce one concept with a minimal example
2. Several recognition questions
3. One guided construction
4. Mix with previously learned material
5. Small transfer challenge
6. Schedule weak concepts for later review

## What we are explicitly not building yet

- Native mobile app
- User accounts or cloud sync
- Full natural-deduction editor
- Predicate-logic curriculum/UI
- Multiple textbook notation systems
- Achievements, leaderboards, arbitrary XP/account levels, or heavy decorative gamification
- Hover-only or mouse-only interactions

The next major decision should follow evidence from using the existing product, not the existence of additional technically possible features.
