# Changelog

All notable changes to Externalize are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

- Watch lesson for `P ∧ Q` uses a truth table (highlighted row) instead of a parse tree
- Tree and table truth labels follow locale (`V`/`F` in French, `T`/`F` in English)
- Practice `eval-001` (`P ∧ Q`) uses live truth-table row instead of parse tree
- Guided Level 0 lesson uses a live truth-table row and toggles (not a parse tree) for `P ∧ Q`
- New users start in Learn mode instead of practice exercises
- Progress storage migrated to v2 with lesson completion tracking
- English and French copy rewritten as independent academic prose (not mirror translations)
- i18n policy documented (`docs/i18n.md`, design principle §10, Cursor rule)

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
