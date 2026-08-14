# Changelog

All notable changes to Externalize are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Capability-first progress: derived Ready / Developing / Reliable states, compact Learn unit/lesson meters, Practice session `n / 5` with a real completion boundary, and one-time progress moments for reliability, unlocks, and nested-evaluation scaffold withdrawal
- Progress tab summary groups **You can now**, **In progress**, and **Up next**, without removing existing lesson, exercise, concept-map, or diagnostic detail

### Fixed

- Unit 2 completion is shown once on the first Practice screen after the Learn path, then clears when the learner continues
- Practice capability name and state are available once as visible text, without a duplicate screen-reader announcement

## [0.3.5] - 2026-08-11

### Added

- Explore mode: free formula sandbox with live truth rows, no progress or SRS recording
- Per-attempt diagnostic case selection for `evaluate-formula` practice with coverage-first assignment picking

### Changed

- Graded evaluation exercises use system-chosen, read-only truth assignments; learners predict only the root value
- Evaluation assessment prompts state the fixed assignment (`Given P = T and Q = F, …`) in English and French

### Fixed

- Learners cannot change sentence-letter values during graded `evaluate-formula` practice, preventing self-selected easy cases from counting as mastery evidence

## [0.3.4] - 2026-08-10

- Evaluation exercises use separate `assessmentPrompt`, `hint`, and `feedback` copy; graded prompts must not disclose the answer
- Rule-aware evaluation feedback that states the correct root value and explains the connective rule using visible child values
- Learner-produced intermediate values for nested evaluation (`eval-007`, `eval-008`, `eval-020`) with scaffold levels that increase on clean passes
- Unit 1 nesting and translation lessons before nested practice and translation exercises
- Unit 0 transfer exercises `tt-001` and `counter-001` for varied retrieval after conjunction evaluation
- Cluster-based Unit 1 practice unlock (eval, truth-table, scope, translation, and proof clusters progress independently)
- `scripts/generate-inventory.ts` to emit current lesson and exercise counts
- Watch-grid lesson styling with a visually distinct active cell state
- Accessible text status list for the progress concept map (alongside the visual graph)
- Scope exercises use select-then-check so accidental taps are not graded immediately

### Changed

- Translation skill label is locale-neutral (`Prose to formula` / `Énoncé → formule`); skill id `practice:translate-prose-to-formula`
- Conservative `negation-scope` translation feedback only when the learner AST contains misplaced negation
- French lesson copy uses proper *vérité-fonctionnel* terminology instead of calqued *truth-fonctionnel*
- French progress UI labels the translation skill as *Énoncé → formule* (locale-neutral)
- Scope and atom tree nodes use distinct accessible names for connectives vs sentence letters

### Fixed

- Grandfather existing v0.3.3 Unit 1 completers onto the three lessons added in v0.3.4 so practice unlock stays consistent
- Translation `negation-scope` feedback no longer masks wrong-operator or wrong-atom mistakes when negation scope already matches
- Continue now advances within the active practice cluster instead of jumping to the first unpassed exercise in flattened cluster order
- Dark-mode truth-table and control surfaces now use semantic CSS variables instead of hard-coded white backgrounds
- `getCellFeedback()` wrong-answer fallback no longer returns the correct-answer default string
- `detectNegationScope` no longer tags omitted negation as a scope error

## [0.3.3] - 2026-08-10

### Fixed

- Update remaining Playwright specs for in-place repair, Progress sync disclosure, and unit navigation semantics
- Accept commutative conjunction operand order in `translate-003` via `acceptCommutativeAnd`
- Hide counterexample assessed root truth value before Check, matching evaluate-formula assessment boundaries
- Replace misleading `⊃` gloss in lesson 0.1 with explicit `Let P = …` / `Soit P = …` notation
- Remove untaught `scope-012` from Unit 0 practice; gate now uses `eval-011` transfer on conjunction
- Move `scope-012` to Unit 2 practice after nesting is taught
- Unified `selectNextExerciseId` policy so immediately due repaired reviews are not starved by new frontier exercises

## [0.3.2] - 2026-08-10

### Added

- Explicit T/F or V/F prediction and checking for evaluate-formula practice, with the assessed root hidden until the learner checks an answer
- Targeted Playwright coverage at desktop, 320px, and 390px for the repaired practice, proof, translation, watch-grid, locale, and persistence boundaries

### Changed

- Progress storage v6 separates attempted exposure from passed exercises; sequential practice now unlocks only after a correct pass
- One persisted exercise session now owns all checked answers and repairs, then finalizes learning statistics and SRS exactly once; repaired passes remain due for immediate review
- Practice repairs now stay within one attempt across scope, evaluation, truth-table, tautology, counterexample, translation, and proof exercises
- Practice drafts preserve assignments, translation tokens, and proof selections across reloads; Progress uses localized exercise descriptions instead of raw IDs

### Fixed

- Accept swapped biconditional operands in translation grading while retaining directional reversed-conditional feedback
- Clarify the independently authored English and French `translate-003` prompts so `(P → Q) ∧ R` is the unambiguous target
- Route every configured proof `RuleId` through the rendered UI, making `nd-002` conjunction elimination completable
- Use English T/F instructions, French-authored translation atom glosses, and the intended 2×2 watch grid in actual lessons

## [0.3.1] - 2026-08-07

### Added

- **Tree keyboard navigation** for main-connective scope exercises: roving tabindex and Arrow/Home/End keys on parse-tree connective buttons (`src/app/tree-keyboard.ts`); documented in [`docs/accessibility.md`](docs/accessibility.md)
- Translation feedback semantic equivalence: `classifyTranslation` accepts logically equivalent formulas via `engine/equiv/equivalent.ts` when `acceptEquivalent` is set; specific mistake tags (reversed conditional, negation scope, missing parens, wrong atom) are checked before semantic acceptance
- **Level 2 guided lesson** `level2-09-de-morgan-guided`: live truth row for `¬P ∧ ¬Q`, contrasting the de Morgan equivalent with `¬(P ∨ Q)` under the same assignment
- **Level 2 practice tier** (`eval-021`, `scope-013`, `eval-022`, `counter-005`, `scope-014`, `tt-006`): six exercises on double negation, connective precedence, and de Morgan's laws; unlocks sequentially after all Unit 2 lessons (`level2Complete`); progress UI adds Unit 2 exercise subsection
- **Natural deduction exercise** (`nd-002`, `proof-fill-step`): fill-one-step proof with ∧ elimination (left conjunct); unlocks after `nd-001`
- **Evaluate-formula expansion** (`eval-011`–`eval-020`): ten new exercises — nine Level 1 flat-binary rows with varied assignments plus one nested `¬(P ∨ Q)` tree eval; template bank, unlock order, prerequisites, and EN/FR prompts
- GitHub Actions CI (`.github/workflows/ci.yml`): `npm test`, `npm run build`, and Playwright Chromium smokes on push/PR to `master`
- Playwright smoke tests: onboarding skip/finish (`e2e/smoke/onboarding.spec.ts`), `counter-001` find-counterexample (`e2e/smoke/counter-001.spec.ts`), `translate-002` try-again flow (`e2e/smoke/translate-002.spec.ts`)

### Changed

- Translation builder tokens use `pred` (0-place) instead of legacy `atom`; palette emits `data-token="pred"` with backward-compatible parsing for `atom`
- Ignore Playwright `test-results/` and `playwright-report/`; deduplicate `[0.3.0]` changelog bullets from merge integration

### Fixed

- E2E `translate-002` smoke uses `pred` palette tokens after builder migration
## [0.3.0] - 2026-08-07

### Added

- **Natural deduction prototype** (`nd-001`, `proof-fill-step`): Fitch-style fill-one-step exercise with modus ponens rule selection and line citation
- **Predicate logic AST spike**: extend `Formula` with `pred`, `forall`, `exists`, and `Term` types; parser accepts `∀`/`∃`, predicate application `F(x)`, and comma-separated arguments; migrate propositional letters to 0-place `pred`; helpers `collectFreeVariables` and `collectPredicateSymbols`; grammar documented in [`docs/predicate-logic.md`](docs/predicate-logic.md)
- **Progress concept map graph**: SVG prerequisite diagram on the Progress tab (completed, available, and locked nodes; EN/FR labels from `content/prerequisites.json`)
- Exercise template generator (`tools/exercise-generator/`, `content/exercise-templates.json`): validates scope, evaluate-formula, and fill-truth-table patterns and prints TypeScript/JSON snippets for author review (`npm run generate:exercises`); documented in `docs/authoring.md`
- **Find-counterexample exercises** (`counter-001`–`counter-004`): toggle truth assignments to make a formula evaluate to a target value; live row UI and `validateCounterexample`; unlocks after matching truth-table fill exercises
- **Playwright smoke test suite** (`e2e/smoke/`): five browser flows — Level 0 lesson completion, `tt-001` truth-table cell, `translate-001` palette translation, progress export/import, unit picker navigation; `npm run test:e2e`; documented in [`docs/testing.md`](docs/testing.md)
- **Predicate logic design prep** ([`docs/predicate-logic.md`](docs/predicate-logic.md)): AST extension sketch (terms, predicates, quantifiers), notation choices, parser/renderer/exercise impact, explicit Phase 6 deferrals; linked from future work plan, decisions, and README
- **Natural deduction design prep** ([`docs/natural-deduction.md`](docs/natural-deduction.md)): Fitch-style mobile layout constraints, minimal starter rule-set options, fill-one-step vs repair-step patterns, subproof UI at ~320px, Phase 4 dependencies; linked from future work plan and decisions
- **2×2 watch grid** for binary watch lessons: `renderWatchGrid()` with P on rows, Q on columns, active-cell highlight; used by `level0-04-watch`, `level1-05-or-watch`, `level1-08-imp-watch`, and `level1-11-iff-watch` (`level1-02-neg-watch` stays on the row table)
- **Level 2 unit (Nested formulas)**: 8 lessons on nested structure, double negation, connective precedence, and de Morgan's laws — unlocks after Unit 1 complete; unit picker adds Unit 2 tab; progress store tracks `level2Complete` (storage v5)
- Translation exercises `translate-002`–`translate-006`: negation scope, missing parentheses, reversed conditional, biconditional confusion; try-again flow on incorrect answers
- PWA shell (service worker, manifest) and progress concept map
- Level 1 UX polish: storage v4, unit picker, formula-aware resume, toast notices
- **Level 1 learn path (Unit 1 — Connectives)**: 12 lessons covering ¬, ∨, →, and ↔ — concept cards, truth-table watch lessons, and guided live-row tries
- Generalized lesson truth-table renderer (engine-backed; supports single-atom `¬P` and binary connectives)
- Unit 1 unlocks after Unit 0; learn path continues through Unit 1 before auto-resuming practice
- Progress tab Unit 1 checklist (visible once Unit 0 is complete)
- Flat evaluate exercises for `P ∨ Q`, `P → Q`, and `P ↔ Q` use the live truth-table row (same presentation as `P ∧ Q`)
- Phase 3 translation prototype design doc ([`docs/phase3-translation.md`](docs/phase3-translation.md)): tap-based symbol palette, builder-vs-typing, AST comparison, feedback taxonomy, drag/tap parity
- Minimal translation spike stub ([`src/app/translation/`](src/app/translation/)): exercise types, example `translate-001`, `renderSymbolPalette()` HTML renderer
- **Tautology validity challenges** (`classify-tautology`): five exercises (`val-001`–`val-005`) with read-only full truth tables and Yes/No tautology judgment; engine classifies formulas with ≤3 atoms via finite truth-table check
- **Progress tab “What next?”**: smart suggestion (resume point, weakest skill, or next unlocked exercise)
- **First-run onboarding**: three-screen intro (externalize idea, V/F segments, Progress tab); progress storage v5 with `onboardingComplete`
- Level 0 learn path: 5 lessons (sentence letters, truth values, ∧, watch mode, guided try)
- Learn / Practice tabs; practice locked until Level 0 complete
- Operator reference panel (collapsible) during lessons

#### Practice & exercises

- Fill-truth-table-cell exercises (`tt-001`–`tt-005`) with partial-table UI and cell validation
- Gated practice unlock from `eval-001`, tiered through a prerequisites graph (`content/prerequisites.json`)

#### Progress & PWA

- **Progress tab**: resume where you left off, Unit 0/1 lesson checklists, review-due count, concept map with prerequisite graph
- Skill tracking and frequent error tags from attempt history (e.g. sub-connective vs main-connective)
- Progress storage v3→v4: resume point, per-skill stats, error counts, unit picker, formula-aware resume, toast notices
- **PWA**: installable shell (service worker, manifest, icons)
- English / French language toggle with mid-lesson re-translation

#### Engine & tests

- Truth-table engine module (`engine/truth-table/`): full table generation, partial-row masking, single-cell validation

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

- Spaced-repetition intervals are tuned per skill: translation and fill-truth-table exercises review sooner than scope tasks; evaluate-formula sits between the two
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
