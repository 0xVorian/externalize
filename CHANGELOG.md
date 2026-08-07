# Changelog

All notable changes to Externalize are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Natural deduction design prep** ([`docs/natural-deduction.md`](docs/natural-deduction.md)): Fitch-style mobile layout constraints, minimal starter rule-set options, fill-one-step vs repair-step patterns, subproof UI at ~320px, Phase 4 dependencies; linked from future work plan and decisions
- **2×2 watch grid** for binary watch lessons: `renderWatchGrid()` with P on rows, Q on columns, active-cell highlight; used by `level0-04-watch`, `level1-05-or-watch`, `level1-08-imp-watch`, and `level1-11-iff-watch` (`level1-02-neg-watch` stays on the row table)
- **Level 1 learn path (Unit 1 — Connectives)**: 12 lessons covering ¬, ∨, →, and ↔ — concept cards, truth-table watch lessons, and guided live-row tries
- Generalized lesson truth-table renderer (engine-backed; supports single-atom `¬P` and binary connectives)
- Guided lesson hints declare target `atom` + `value`; progression generalized beyond `P ∧ Q`
- Unit 1 unlocks after Unit 0; learn path continues through Unit 1 before auto-resuming practice
- Progress tab Unit 1 checklist (visible once Unit 0 is complete)
- Integration notes: `docs/level1-integration.md`
- Exercise bank expanded to 20 hand-authored items: 11 main-connective (scope) and 9 evaluate-formula tasks with nested-structure variety and targeted feedback
- Flat evaluate exercises for `P ∨ Q`, `P → Q`, and `P ↔ Q` use the live truth-table row (same presentation as `P ∧ Q`)
- Phase 3 translation prototype design doc ([`docs/phase3-translation.md`](docs/phase3-translation.md)): tap-based symbol palette, builder-vs-typing, AST comparison, feedback taxonomy, drag/tap parity
- Minimal translation spike stub ([`src/app/translation/`](src/app/translation/)): exercise types, example `translate-001`, `renderSymbolPalette()` HTML renderer
- Truth-table engine module (`engine/truth-table/`): full table generation, partial-row masking, single-cell validation (locale-agnostic booleans for Phase 4 exercises)
- **Authoring guide** (`docs/authoring.md`): step-by-step instructions for lessons and exercises, worked examples (watch step + scope exercise), i18n/presentation pointers, changelog expectations
- **Content model** (`docs/content-model.md`) updated to reflect current TypeScript layout (replacing provisional YAML sketch)
- **Future work plan** (`docs/future-work-plan.md`): tiered workstreams, agent batch A/B/C plan, and deferred-scope list — separate from the app roadmap
- **Progress tab**: resume where you left off, lesson/exercise checklist, review-due count
- Skill tracking: surfaces what feels easy vs. what you struggle with (from attempt history)
- Frequent error tags (e.g. picking a sub-connective instead of the main one)
- Progress storage v3: resume point, per-skill stats, error counts, last-visited timestamp
- Progress export/import (JSON file) for moving between devices
- Level 0 learn path: 5 lessons (sentence letters, truth values, ∧, watch mode, guided try)
- Learn / Practice tabs; practice locked until Level 0 complete
- Operator reference panel (collapsible) during lessons
- Gated practice unlock: starts with `eval-001`, then unlocks more after completion
- English / French language toggle with mid-lesson re-translation

### Changed

- Learn navigation chains Unit 0 → Unit 1 (`ALL_LEARN_LESSONS`); practice still unlocks after Unit 0
- End of Unit 0 offers “Continue to Unit 1” instead of jumping straight to exercises
- Watch lesson for `P ∧ Q` uses a truth table (highlighted row) instead of a parse tree
- Tree and table truth labels follow locale (`V`/`F` in French, `T`/`F` in English)
- Practice flat binary formulas (`P ∧ Q`, `P ∨ Q`, `P → Q`, `P ↔ Q`) route to live truth-table row via explicit formula set
- Guided Level 0 lesson uses a live truth-table row and toggles (not a parse tree) for `P ∧ Q`
- New users start in Learn mode instead of practice exercises
- Progress storage migrated to v2 with lesson completion tracking
- English and French copy rewritten as independent academic prose (not mirror translations)
- i18n policy documented (`docs/i18n.md`, design principle §10, Cursor rule)

## [0.2.0] - 2026-08-07

### Added

- **Natural deduction design prep** ([`docs/natural-deduction.md`](docs/natural-deduction.md)): Fitch-style mobile layout constraints, minimal starter rule-set options, fill-one-step vs repair-step patterns, subproof UI at ~320px, Phase 4 dependencies; linked from future work plan and decisions
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

- **Natural deduction design prep** ([`docs/natural-deduction.md`](docs/natural-deduction.md)): Fitch-style mobile layout constraints, minimal starter rule-set options, fill-one-step vs repair-step patterns, subproof UI at ~320px, Phase 4 dependencies; linked from future work plan and decisions
- Project documentation: vision brief, design principles, technical decisions, roadmap, content model
- Phase 1 propositional logic engine (AST, parser, evaluator, equivalence)
- Mobile-first design constraint and MVP-0 sequencing
- Versioning policy and Cursor rule

[Unreleased]: https://github.com/0xVorian/externalize/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/0xVorian/externalize/releases/tag/v0.2.0
[0.1.0]: https://github.com/0xVorian/externalize/releases/tag/v0.1.0
