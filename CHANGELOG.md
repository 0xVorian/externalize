# Changelog

All notable changes to Externalize are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Learn paths

- Learn / Practice tabs; new users start in Learn mode; practice locked until Level 0 is complete
- **Level 0 learn path**: 5 lessons (sentence letters, truth values, ∧, watch mode, guided try)
- **Level 1 learn path (Unit 1 — Connectives)**: 12 lessons covering ¬, ∨, →, and ↔ — concept cards, truth-table watch lessons, and guided live-row tries
- Unit 1 unlocks after Unit 0; end-of-unit flow offers “Continue to Unit 1” before practice auto-resume
- Operator reference panel (collapsible) during lessons
- **2×2 watch grid** for binary watch lessons (P on rows, Q on columns, active-cell highlight)
- Generalized lesson truth-table renderer (engine-backed; single-atom `¬P` and binary connectives)
- Guided lesson hints declare target `atom` + `value`; progression generalized beyond `P ∧ Q`

#### Practice & exercises

- Exercise bank expanded to 20 hand-authored items: 11 main-connective (scope) and 9 evaluate-formula tasks with nested-structure variety and targeted feedback
- Fill-truth-table-cell exercises (`tt-001`–`tt-005`) with partial-table UI and cell validation
- Phase 3 translation MVP: `translate-001` with symbol palette, builder compile, and translation feedback classifier
- Gated practice unlock from `eval-001`, tiered through a prerequisites graph (`content/prerequisites.json`)

#### Progress & PWA

- **Progress tab**: resume where you left off, Unit 0/1 lesson checklists, review-due count, concept map with prerequisite graph
- Skill tracking and frequent error tags from attempt history (e.g. sub-connective vs main-connective)
- Progress export/import (JSON file) for moving between devices
- Progress storage v3→v4: resume point, per-skill stats, error counts, unit picker, formula-aware resume, toast notices
- **PWA**: installable shell (service worker, manifest, icons)
- English / French language toggle with mid-lesson re-translation

#### Engine & tests

- Truth-table engine module (`engine/truth-table/`): full table generation, partial-row masking, single-cell validation
- Render integration tests for UI modules

#### Documentation

- **Authoring guide** ([`docs/authoring.md`](docs/authoring.md)): lessons and exercises, worked examples, i18n/presentation pointers
- **Content model** ([`docs/content-model.md`](docs/content-model.md)) updated to reflect current TypeScript layout
- **Future work plan** ([`docs/future-work-plan.md`](docs/future-work-plan.md)): tiered workstreams and deferred-scope list
- Accessibility audit ([`docs/accessibility.md`](docs/accessibility.md)): MVP UI review, fixes applied, known gaps
- Level 1 integration notes ([`docs/level1-integration.md`](docs/level1-integration.md))
- Phase 3 translation design ([`docs/phase3-translation.md`](docs/phase3-translation.md))
- Predicate logic design prep ([`docs/predicate-logic.md`](docs/predicate-logic.md)) and natural deduction design prep ([`docs/natural-deduction.md`](docs/natural-deduction.md))
- i18n policy ([`docs/i18n.md`](docs/i18n.md), design principle §10, Cursor rule)

### Changed

- Spaced-repetition intervals tuned per skill: translation and fill-truth-table review sooner than scope; evaluate-formula sits between the two
- MVP UI accessibility pass: ARIA labels and roles on trees, truth tables, V/F segments, mode nav, and progress cards; `:focus-visible` outlines on tap targets; evaluation tree nodes no longer rendered as inert buttons
- Learn navigation chains Unit 0 → Unit 1; practice still unlocks after Unit 0
- Watch and guided lessons for flat binary formulas (`P ∧ Q`, `P ∨ Q`, `P → Q`, `P ↔ Q`) use a live truth-table row instead of a parse tree
- Tree and table truth labels follow locale (`V`/`F` in French, `T`/`F` in English)
- Progress storage migrated through v2→v4 with lesson completion tracking
- English and French copy rewritten as independent academic prose (not mirror translations)

## [0.2.0] - 2026-08-07

### Added

- MVP-0 mobile UI: vertical formula tree, main-connective tap exercises, evaluation toggles
- Feedback module (`engine/feedback/`) with tagged scope-selection messages
- Path-based tree node IDs (`root`, `root.L`, `root.R`, `root.O`) stable across re-renders
- 5 hard-coded exercises and localStorage spaced-repetition queue
- Golden-tree evaluation test and feedback unit tests (25 total)

### Changed

- `evaluateWithNodes` uses a single traversal that builds tree and values together
- UI stack: Vite + vanilla TypeScript with structured `src/app/` modules
- Implication associativity policy documented; learner exercises require explicit parentheses

## [0.1.0] - 2026-08-07

### Added

- Project documentation: vision brief, design principles, technical decisions, roadmap, content model
- Phase 1 propositional logic engine (AST, parser, evaluator, equivalence)
- Mobile-first design constraint and MVP-0 sequencing
- Versioning policy and Cursor rule

[Unreleased]: https://github.com/0xVorian/externalize/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/0xVorian/externalize/releases/tag/v0.2.0
[0.1.0]: https://github.com/0xVorian/externalize/releases/tag/v0.1.0
