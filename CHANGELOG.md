# Changelog

All notable changes to Externalize are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Optional passkey accounts can copy progress v7 across devices on the Cloudflare free tier (Pages Functions + D1). Signed-out use is unchanged. Merge is per-item and never drops completions or evidence from either device; in-flight bounded sessions stay local and are invalidated only when learning state actually changes. Passkey controls hide unless `/api/status` can probe the migrated D1 schema. Production Pages binds D1 only under `env.production` in committed `wrangler.toml`; git-connected previews stay unbound (`/api/status` → `{ available: false }`). Provisioning: `docs/accounts.md`.
- Rounds now open with one warm-up check on the most recently practised concept (the last concept that has an exercise, independent of route). A correct answer continues into the planned material, or ends a short due-review early (`1 / 1` is honest). A miss on that step’s Check turns the rest of the round into a short repair of that concept. Only the one due item chosen as the warm-up is consumed; other due items and other skills on the same concept stay in the round. Short due lists are not padded with unlocked work from other concepts. A first-time learner still starts without a warm-up. **Exception:** a round whose next cluster already needs all 7 slots omits the warm-up so that cluster stays intact. The step counts toward the 5–7 envelope and the `n / m` counter.

### Changed

- Session-first docs now say a short due-review grows on a miss when the leftover tail cannot hold explanation plus practice, not merely because there was “no tail”. A one-item or two-item due list both grow.
- `docs/roadmap.md` now describes the v0.5.0 / v0.5.1 shipped baseline, the post-0.5.1 remediations already on `master` (mobile truth tables, session envelope, warm-up), optional passkey sync (#37), and the remaining GitHub Issues rather than “v0.4.0 + unreleased”.
- Production D1 (`externalize-progress`, id `6d9806e2-46c4-41b1-a5fe-8c224ecbadf3`) is bound only under `[[env.production.d1_databases]]` in committed `wrangler.toml`, with `[env.production.vars]` repeating `WEBAUTHN_RP_NAME` (vars and bindings do not inherit). `pages_build_output_dir` makes that file the source of truth, so a dashboard bind cannot stick. Preview stays unbound. Future remote migrations use the D1 console / query API or a gitignored `wrangler.remote.toml`.

### Removed

- `npm run d1:migrate:remote` (`scripts/d1-migrate-remote.ts`). Wrangler resolved `migrations_dir` relative to the temp config under `/tmp`, so the script could not apply `migrations/`.

### Fixed

- Passkey/D1 hardening before production bind (#39): `/api/status` probes the migrated schema rather than `SELECT 1`; challenge admission is a single conditional INSERT plus an atomic per-IP UPSERT; failed sync retries with exponential backoff and jitter (401 still keeps the queue); `/api/sync` responses are `parseProgressStore`d and merges cannot grow past the parser cap.
- A successful `/api/sync` is merged into the current local snapshot rather than overwriting it, so a save made while the request is in flight is kept and re-queued. A 401 no longer drops that queued push.
- Same-device sync no longer aborts an in-flight bounded round: SRS queue order and visit timestamps are not treated as a remote change.
- WebAuthn RP ID/origin come from a configured allowlist (never the request Host), user verification is required, challenges are single-use (`DELETE … RETURNING`) and origin-bound, and synced passkeys that report counter 0 are accepted.
- Unauthenticated challenge creation is rate-limited, expiry purge is periodic, CSRF Origin checks cover logout and every mutation, uploaded progress is deep-parsed, and concurrent sync uses a revision compare-and-swap.
- Git-connected Pages no longer declares a placeholder D1 binding at the top of `wrangler.toml` (that UUID made the preview deploy fail). Local `wrangler d1` uses `wrangler.local.toml`; `pages dev` binds the same sqlite with `--d1` because Pages rejects `--config`. A reported WebAuthn counter of 0 keeps the stored high-water mark. Unreadable stored snapshots are replaced on the next push instead of bricking sync. Translation `builderTokens` are deep-parsed. Extra WebAuthn origins must be `https:`. Challenge churn is a 40-row live cap via a single conditional INSERT (worst case 34.6k writes/day, under the free 100k cap).
- Mapped Unit 1 nesting lessons `level1-13-nesting` and `level1-14-nesting-guided` onto the `scope` concept so the session envelope keeps the explanation with its guided practice. Also mapped the translation intro card `level1-15-translate`. A content check now fails if any card, watch, or guided unit, or any exercise, lacks a prerequisites entry.
- Watch-table body rows use `<th scope="row">` for the hidden case label, so assistive tech announces it as a row header. Column alignment at 320px and 390px is unchanged.
- A due-review warm-up now consumes only the one chosen item, so other due exercises (including a different skill on the same concept) stay in the round. Short due lists are not padded with unrelated exercises: a pass ends the honest small round; a miss grows into same-concept explanation plus practice. Repair waits for that step’s Check rather than the first graded cell or node.
- A warm-up miss no longer changes the advertised `n / m` total on the Try again screen. The new total appears once the first repair step begins.
- Session rounds no longer end on a teaching step whose related practice was deferred to the next round. The envelope still targets 6 steps and stays within 5–7 when a cluster fits; otherwise it ends before that teaching step so the `n / m` counter stays honest. Applies to Logic foundations lessons and the Sobel preparation sequence.
- Teach–practice clusters longer than 7 micro-units no longer fall back to a blind cut at 6. If the first practice still fits in 7, this round takes through it; otherwise the cut falls between watch cases so the next round still opens with explanation, never a stranded guided step.
- Restored the 2×2 watch grid as a real table on narrow screens (down to ~320px). A leftover `display: grid` rule had stacked the `Q = T` / `Q = F` headers and wrapped row labels off the grid. The cryptic `P ↓ / Q →` corner legend is gone; row and column labels already name the axes, and a visually hidden label keeps the table accessible.
- Stopped screen-reader case labels from occupying a visual column in row-by-row truth tables, which had shifted ¬P (and other watch-table) values under the wrong headers. Negation watch copy now points at the highlighted row instead of saying that only the P column matters.

## [0.5.1] - 2026-09-08

### Changed

- Source-route checks now use a short shell heading and render the exercise question only once; predicate context is separated from the question instead of repeating one long prompt across the page.
- Audited learner-facing EN/FR examples for natural-language completeness and current interaction wording, including onboarding, the introductory truth-assignment lesson, and truth-table answer instructions.
- Ran a second app-wide copy pass over session, Progress, source-route, accessibility, and exercise surfaces; shortened prompts where the visual object already carries the facts, removed implementation/grading jargon, and made progress claims match the evidence actually recorded.

### Fixed

- Reconciled a third independent learner-facing audit: translation tasks keep the sentence that determines the formula visible; onboarding reflects the session-first entry; Progress hides internal capability language; evaluation prompts stop duplicating visible assignments; and several source/accessibility labels are corrected.
- Club examples now consistently say what was signed (the club register), including the F/G conditional check; the conditional facts, predicate key, and question are now authored as separate readable pieces.

## [0.5.0] - 2026-09-08

### Added

- Session-first default: opening the app offers one bounded round with visible step count and approximate time, then Start / Continue / Resume. Active chrome is Exit plus `n / m`. Finishing the envelope is a stopping point (`Done for now`, with `Do another short round` secondary)
- Learning-aligned re-entry from existing learner state: resume an interrupted round, a due quick review, see what stuck after stale evidence, continue the active route, or you're good for now with the next useful review when SRS can name it
- Local session telemetry in a separate `localStorage` key (`externalize-session-events-v1`): offered kind, started/completed/interrupted, step count, coarse duration of the current active segment, timestamp. It is not mastery evidence and is not part of progress export
- Sobel Chapter II opening rewritten as progressive micro-lessons: empty-club setup, checked prediction, missing-counterexample explanation, truth by vacuity, ordinary if–then, `→`, a genuine conditional check, universal meaning, `∀`, existential meaning, existential name, `∃`, same-witness conjunction, then a fresh transfer example before returning to Descartes. Unit 0 still names sentence letters after the schematic idea is in view
- Adaptive curriculum Phase A: the existing three-unit logic course now runs as the explicit `logic-foundations` route, with canonical concept × capability evidence on graded exercises, per-route progress, and a conservative v6 → v7 progress migration that preserves skills, SRS, resume, and existing learner evidence
- Adaptive curriculum Phase B: a Learn route for *Logic and Theism* Chapter II §§2.6–2.8 (pp. 35–40) over the same portable concept state, using a `classify-choice` interaction, source anchors without reproducing book text, Reading vs Mastery depth, and a browser walkthrough through terminal completion
- Adaptive curriculum Phase C: a deterministic skip / retrieve / teach planner that injects the smallest prerequisite detour from `conceptEvidence`, so already-demonstrated conditionals skip the Sobel bridge while unseen quantifiers still get a short teach sequence

### Changed

- Reconciled controlling/contributor documentation with the shipped adaptive, session-first, and exercise visual-grammar baseline; historical execution/design briefs are now labelled as such instead of presenting completed work as current authorization.
- Added a generated lesson/exercise/practice-chain inventory with `inventory:update` / `inventory:check`, and removed the duplicate root copy of the archived GPT-5.6 Sol engagement-learning report.
- Guided evaluation with one current target now reads formula → blank table cell → True/False (Vrai/Faux) → Check. Selection fills the target with compact T/F or V/F; the formula result stays undetermined (`—`) until Check. Only Check validates; wrong answers stay repairable in place. The generic Truth assignment panel remains for Explore, counterexamples, and given-assignment practice.
- The default learner journey is the session offer rather than a four-way Learn / Explore / Practice / Progress choice. Those modes remain reachable under More, outside an active round
- A session “step” is one learner-perceived micro-activity. Watch lessons with separately advanced cases count as one step per case, so the advertised envelope matches the work inside the round
- Planner diagnostics (`Avant de poursuivre`, missing-prerequisite / short-bridge copy) no longer appear as learner-facing UI. The planner still chooses skip / retrieve / teach internally
- Opening priority is resume, then due review, then lapse recovery, then route continuation, then idle. A mid-course learner with remaining lessons and stale evidence is offered lapse recovery before new material
- Source-route and Learn chrome (route, depth, locator, unit picker) stay on the browse surfaces and are hidden during an active bounded session
- Progress storage is version 7. v6 exports still import; historical concept evidence is backfilled only from tagged `exerciseStats`, never from lesson completion, and without fabricating `lastSeenAt`
- Learn shows a route picker between Logic foundations and Logic and Theism; switching routes does not create duplicate concept IDs. Source exercises enter the Practice pool only after a checked pass
- `practice:classify-choice` remains SRS/telemetry for the Sobel classification UI and is deliberately kept off the Progress interaction-family capability list; portable mastery stays in concept × capability evidence

### Fixed

- Guided evaluation no longer treats unset sentence letters as false, and no longer hides a required truth value behind “Choose the value for P.” Each step either names the requested value or states a goal that determines it. Unassigned letters stay blank, and the result column appears only when the committed assignment logically fixes it.
- A provisional guided True/False selection no longer reveals the derived formula result before Check. The target cell still shows the chosen T/F (V/F); `¬P` with provisional P = F stays `—` rather than flashing T.
- Content JSON imports declare `type: json` so Playwright helpers can load progress modules under native Node ESM
- Source-route classification items can be repaired in place: Try again is handled in Learn (it previously sat behind a Practice-only early return)
- Source-route Reading completion is now durable: finishing the last item persists `completedAt`, shows Done / return to the book instead of endless Continue, and revisiting a completed route does not restart at item 1. Mastery work remains reachable after that terminal state
- After that terminal action, the Done / return-to-the-book button is removed; the completed banner and Sobel locator remain, so the same completion click cannot be repeated
- Source-route checks stay on the current item (with feedback and Next) until the learner continues; a correct retrieve no longer jumps away because the planner dropped the item
- Existential-quantifier lessons (EN and FR) now attribute existential commitment to `∃`, not to conjunction
- Sobel preparation now requires a checked empty-club prediction before the counterexample explanation and the vacuity name; the learner cannot advance from setup to explanation without answering
- The `conditional:apply` bridge now teaches ordinary if–then, then `→`, then a checked application (`lat-retrieve-conditional` on `F(a) → G(a)`) before `∀x (F(x) → G(x))`. The empty-club prediction (`lat-predict-empty-club`) no longer grants `conditional × apply`
- The `∃` intro names the existential quantifier without witness or existential-commitment jargon; those terms arrive with same-witness conjunction
- The prerequisite planner no longer treats a missing bridge as skip; unmet requirements without authored material are an explicit `unsupported` outcome
- v6→v7 backfilled concept evidence with unknown recency prompts retrieve rather than counting as definitely fresh
- French source copy uses « cas de vérité par vacuité » rather than the English loan « vacuous »
- Successful progress import, and any wholesale replace of authoritative learner state, clears the interrupted bounded-session envelope so Resume cannot replay a plan against different progress
- Session telemetry duration counts only the current active segment, not wall-clock time spent away after an interruption

## [0.4.0] - 2026-09-07

### Added

- Capability-first progress: derived Ready / Developing / Consistent states, compact Learn unit/lesson meters, Practice session `n / 5` with a real completion boundary, and one-time progress moments for consistency, unlocks, and nested-evaluation scaffold withdrawal
- Progress tab summary groups **You can now**, **In progress**, and **Up next**, without removing existing lesson, exercise, concept-map, or diagnostic detail

### Changed

- Updated the GitHub Actions checkout/setup runtime actions to v7, removing the deprecated Node 20 action-runtime warning
- Consolidated transient Practice progress/session announcements into a dedicated state module and unified draft-vs-checked practice mutations, reducing orchestration duplication without changing learner behavior
- Renamed the short-horizon capability state from **Reliable** to **Consistent so far** so three recent clean attempts are not presented as delayed mastery evidence
- Standardized development, CI, and Cloudflare deployment on Node 22; release checks now include the Playwright suite
- PWA navigation now prefers fresh HTML online while retaining a cached built shell for offline reloads

### Fixed

- Made the maximum-scaffold browser regression follow the active system-chosen evaluation case instead of assuming one fixed intermediate truth value
- Progress imports now reject unsupported internal progress versions instead of silently resetting to a blank store; failed local loads preserve the raw payload under a recovery key
- Unit 2 completion is shown once on the first Practice screen after the Learn path, then clears when the learner continues
- Practice capability name and state are available once as visible text, without a duplicate screen-reader announcement
- Unit-completion notices are announced once; later rerenders of the same visible card no longer re-announce to assistive technology
- Starting a new Practice exercise from Progress after a completed `5 / 5` session now opens a fresh `0 / 5` episode instead of keeping the finished session
- Session-complete cards are announced once; later rerenders of the same visible card no longer re-announce to assistive technology
- Clicking the already-active Practice tab at `5 / 5` no longer silently starts a new session; only **Keep practising** does
- Completing the final Unit 2 lesson after a finished Practice session now opens Practice at `0 / 5` instead of carrying the stale completion

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

[Unreleased]: https://github.com/0xVorian/externalize/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/0xVorian/externalize/releases/tag/v0.4.0
[0.2.0]: https://github.com/0xVorian/externalize/releases/tag/v0.2.0
[0.1.0]: https://github.com/0xVorian/externalize/releases/tag/v0.1.0
