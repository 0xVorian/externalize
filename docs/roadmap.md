# Roadmap

## Phase 0 — Documentation (current)

- [x] Preserve original brief
- [x] Record design principles and technical decisions
- [x] Define MVP scope and build order
- [x] Sketch content model
- [x] Adopt MVP-0 sequencing (scope + eval before translation)
- [x] Adopt mobile-first browser as primary target

## Phase 1 — Engine spike

Goal: prove the AST + evaluation core before building UI polish.

- [x] Define AST types for propositional formulas
- [x] Parser: text → AST (minimal, for dev/testing)
- [x] Renderer: AST → display string (Unicode operators)
- [x] Renderer: AST → vertical tree structure (for mobile UI)
- [x] Evaluator: AST + variable assignment → truth value
- [x] Evaluator: return truth value at every node (for visible intermediate steps)
- [x] Structural equivalence check + optional commutativity flag
- [x] Unit tests for parser, evaluator, equivalence

**Exit criterion:** Can parse `(P → Q) ↔ ¬R`, evaluate under `{P: true, Q: false, R: true}` with per-node values, and detect that `¬(P ∧ Q)` differs from `¬P ∧ Q`. **Met.**

## Phase 2 — MVP-0 (first interactive prototype)

Goal: validate the core UX on a phone — externalized scope, visible evaluation, local feedback.

**Interactions:**

- [ ] Formula displayed as a **vertical tree** (readable at ~320px width)
- [ ] Tap to identify main connective / scope boundaries
- [ ] Toggle atom truth values; every node shows its computed value
- [ ] Local feedback for wrong scope selection (names the bug)
- [ ] 3–5 hard-coded exercises
- [ ] Minimal spaced-repetition queue in local storage

**Exit criterion:** You use it on your phone for a week and want to return. Working-memory load is visibly reduced.

## Phase 3 — Translation prototype

Goal: ordinary language ↔ symbols, now that the tree renderer and feedback loop are proven.

- [ ] Tap-based symbol palette (mobile primary)
- [ ] Optional drag-to-group on desktop, with tap equivalent
- [ ] Visual scope on built formula
- [ ] Compare learner AST to expected AST
- [ ] Local feedback (reversed conditional, wrong negation scope, missing parens)
- [ ] Structural sub-question per exercise + live read-back preview
- [ ] Works on phone without horizontal scrolling

**Exit criterion:** One translation exercise feels instructive on a phone; feedback is local and repairable.

## Phase 4 — Full propositional MVP

- [ ] Operator reference panel (pin-able / sheet on mobile)
- [ ] Multiple exercises per type (hand-authored JSON)
- [ ] Evaluation exercises (one subexpression at a time)
- [ ] Interactive truth tables (one missing column/cell at a time)
- [ ] Counterexample / validity challenges
- [ ] Spaced-repetition queue (expanded)
- [ ] Concept map with prerequisites
- [ ] Progress export/import
- [ ] Optional PWA manifest for home-screen install

## Phase 5 — Natural deduction (later)

Only after Phase 4 interaction patterns are stable.

- [ ] Fitch-style line-based proof editor with scope highlighting
- [ ] Rule picker with visible prerequisites
- [ ] Fill-one-step and repair-invalid-step exercises
- [ ] Derivation replay
- [ ] Mobile: vertical proof layout, large tap targets for line citations

## Phase 6 — Predicate logic (later)

- [ ] Quantifiers, predicates, variables in AST
- [ ] Translation exercises for quantified statements
- [ ] Simple models and countermodels
- [ ] Quantifier natural deduction rules

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
- Predicate logic or natural deduction UI
- Template-based exercise generation
- Multiple textbook notation systems
- Achievements, leaderboards, or heavy gamification
- Hover-only or mouse-only interactions
