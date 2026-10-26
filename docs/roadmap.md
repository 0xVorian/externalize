# Roadmap

This document tracks the shipped application and the remaining validation gates. It is intentionally conservative: implemented prototypes are not promoted to “done” merely because code exists. Day-to-day follow-ups live in [GitHub Issues](https://github.com/0xVorian/externalize/issues); this file should not invent a parallel plan.

## Current status — v0.5.1, plus bounded remediations on `master`

Externalize now has three propositional-logic learning units, graded practice across multiple skills, local progress/SRS, EN/FR course material, Explore mode, export/import, a concept map, PWA support, browser regression coverage, evidence-backed progress visibility, explicit learning routes, portable concept × capability evidence, a narrow *Logic and Theism* Chapter II source-driven pilot with deterministic prerequisite planning, and the session-first low-intimidation UX on `master`.

Release history for the current baseline:

- **v0.4.0** — progress visibility, persistence/PWA hardening, and simplified Practice orchestration.
- **v0.5.0** — adaptive-curriculum Phases A–C, the bounded-session shell, reason-bearing feedback, and the exercise visual-grammar work (stimulus → response workspace → Check). These are no longer `[Unreleased]`.
- **v0.5.1** — learner-facing copy, accessibility, and source-route interaction reconciliation on that v0.5 baseline.

Work merged after v0.5.1 still sits under `[Unreleased]` in `CHANGELOG.md`. It is bounded remediation of observed friction, not a new product phase:

- mobile truth-table and watch-grid layout: the 2×2 grid is a real table again, the cryptic `P ↓ / Q →` legend is gone, and screen-reader case labels no longer occupy a visual column ([#21](https://github.com/0xVorian/externalize/issues/21), [#24](https://github.com/0xVorian/externalize/issues/24), [PR #26](https://github.com/0xVorian/externalize/pull/26));
- a concept’s teaching and practice stay in the same session round ([#25](https://github.com/0xVorian/externalize/issues/25), [PR #28](https://github.com/0xVorian/externalize/pull/28));
- rounds open with one warm-up check on the most recently practised concept ([#27](https://github.com/0xVorian/externalize/issues/27), [PR #32](https://github.com/0xVorian/externalize/pull/32));
- oversized teach–practice clusters no longer fall back to a cut at 6: this round takes through the first practice when it still fits, otherwise it splits between watch cases ([#30](https://github.com/0xVorian/externalize/issues/30), [PR #35](https://github.com/0xVorian/externalize/pull/35));
- a warm-up miss keeps the advertised `n / m` on Try again; the new total appears once the first repair step begins ([#33](https://github.com/0xVorian/externalize/issues/33), [PR #35](https://github.com/0xVorian/externalize/pull/35));
- Progress shows a course map: one next matching Home, an always-visible three-unit outline, and concept-map statuses that no longer depend on optional Logic and Theism lessons ([#43](https://github.com/0xVorian/externalize/issues/43)).

Optional passkey accounts ([#37](https://github.com/0xVorian/externalize/issues/37)) are a separate bounded feature, not a session-first remediation: signed-out local use stays as it is; Cloudflare Pages Functions + D1 copy progress when a passkey is created. Production D1 is bound only under `env.production` in committed `wrangler.toml` ([accounts.md](accounts.md)); preview deploys stay unbound.

Implementation of the session-first and adaptive baseline is complete; the experiential/product-validation gates remain open.

The main unresolved question is no longer whether the core interactions can be built. It is whether Externalize can make difficult formal material **easy to start, finite to engage with, understandable without product-taxonomy overhead, and useful enough to return to** while preserving rigorous mastery evidence and transfer.

### Current validation priority — experiential validation of the shipped interaction model

[`session-first-ux.md`](session-first-ux.md) is implemented. PR #16 also established the current exercise grammar: a clear logical stimulus, one response workspace, ordinary-language truth choices that bridge into formal T/F or V/F notation, and explicit Check before correctness is revealed.

The next work is **use, observation, and bounded remediation**. Do not reopen a broad redesign merely because the implementation plan has finished.

The governing product principle is:

> **Bound the effort, not the difficulty.**

The normal learner should not have to choose among app modes, routes, depth, planner state, or reference machinery before doing one useful reasoning step. Externalize should instead offer one obvious bounded round, show the approximate effort before start, keep the round finite, and make completion a legitimate stopping point.

The canonical pre-refactor anti-example was the Sobel Chapter II screen exposing mode navigation, route/depth controls, source/reference metadata, planner language such as `Un pont court pour un prérequis manquant`, and several new logic terms/symbols before the first useful reasoning action. That pattern remains explicitly prohibited.

Implemented sequence:

1. **UX-A — session shell and finite contract:** one-action entry, 5–7 step envelope where content permits (target 6), visible effort, interruption/resume, explicit completion. A short due-review may grow after a warm-up miss into same-concept repair, still within 7; other rounds do not silently expand. **Implemented.**
2. **UX-B — low-intimidation beginner surface:** planner internals removed from learner copy; progressive disclosure of route/depth/reference/source controls; Sobel opening rebuilt around meaning → use → name → notation → independent use; earliest foundations audited for the same failure mode. **Implemented.**
3. **UX-C — learning-aligned re-entry:** due review / continue / lapse-recovery / nothing-useful-due opening states, plus next-useful-review indication where existing SRS state supports it. **Implemented.**
4. **UX-D — minimal local validation telemetry:** small separate `localStorage` event log; not part of progress v7. **Implemented.**

**UX gate:** a learner can open Externalize and feel that doing one round is trivially reasonable even when the reasoning inside that round is genuinely difficult.

The implemented baseline does not authorize XP, hearts, reset streaks, currencies, leaderboards, backend notifications, runtime AI session generation, framework migration, or a universal workflow engine.

### Progress visibility baseline

The progress-visibility pass defined in [progress-visibility.md](progress-visibility.md) is implemented. Learn exposes unit/lesson position; Practice exposes capability state and finite five-exercise sessions; Progress leads with the same bounded next as Home and an always-visible three-unit outline, then capability summaries; meaningful transitions are derived from graded evidence rather than time spent or arbitrary XP.

Implemented scope:

- [x] Ambient unit/lesson position in Learn
- [x] Ambient capability state in Practice
- [x] Finite short practice-session arc (5 finalized exercises)
- [x] Session-complete summary based on actual changes
- [x] Visible transitions for capability consistency, new unlocks, and reduced scaffolding
- [x] Capability-first summary in Progress (`You can now`, `In progress`, `Up next` matching the shared round)
- [x] Course map v1 on Progress: one next matching Home, always-visible three-unit outline, translation on the concept map, main-route statuses independent of `lat-*` lessons
- [x] EN/FR, accessibility, reduced-motion, and ~320px mobile coverage
- [x] Unit and browser regression tests for progress derivation and transition behavior

This existing finite Practice session is useful substrate, but the session-first UX is broader: it must organize the **normal entry experience** across route continuation and useful retrieval, not merely count finalized Practice exercises after the learner has already navigated into Practice.

Progress claims must remain evidence-backed. Explore, time spent, reading completion, hints, and session completion are motivational/contextual signals only and must not masquerade as mastery.

### Adaptive-curriculum pilot

A concrete sustained-use case justified one bounded architectural extension: using Externalize while reading Jordan Howard Sobel's *Logic and Theism*.

The implementation contract is [`adaptive-curriculum-implementation.md`](adaptive-curriculum-implementation.md). The conceptual model is [`adaptive-curriculum.md`](adaptive-curriculum.md). Repository-wide agent rules are in [`../AGENTS.md`](../AGENTS.md).

The authorized adaptive sequence is now implemented through Phase C:

1. **Phase A — route refactor:** current logic course as explicit `logic-foundations`; portable concept × capability evidence and conservative progress migration. **Implemented** (v7 progress, route parity tests).
2. **Phase B — narrow Sobel vertical slice:** Chapter II §§2.6–2.8 existential-import/Descartes route using the same learner model. **Implementation complete** (`logic-and-theism-reading`, `classify-choice`, source isolation / portable mastery tests, source-route E2E walkthrough). **Product-validation gate pending** usage/manual confirmation that the route returns the learner to Sobel faster and with better understanding.
3. **Phase C — deterministic prerequisite planner:** small inspectable skip/retrieve/teach/unsupported policy. **Implemented** (`src/app/planner.ts`).

**Pilot gate:** the architecture earns its complexity only if existing learner progress survives, current course behavior remains stable, already-demonstrated knowledge suppresses redundant prerequisite teaching, and the source-driven slice gets the learner back into the book with better comprehension.

The shipped session-first UX is now part of that test: the route/planner substrate is intentionally quieter and should be judged by whether it gets the learner into useful reasoning and back to the source with less friction.

Do not treat the adaptive authorization as general curriculum expansion. Chapter III+ renderers, PDF ingestion, runtime AI route generation, generic backends, and universal activity/engine abstractions remain out of scope until the pilot is used and evaluated. Optional passkey sync (#37) is a separate, bounded Cloudflare Pages + D1 feature and must not grow into email, push, or a general accounts platform.

### Open GitHub Issues

As of 2026-10-26, remaining open issues (PR #34 closed #23, #29, and #31; PR #35 closed #30 and #33; PR #38 implemented #37; PR #40 closed #39):

- [#22](https://github.com/0xVorian/externalize/issues/22) — Daily practice reminder. Explicitly gated on an out-of-app experiment (2026-10-26 to 2026-11-08). Push/email infrastructure stays in “not building yet” unless that experiment shows a measurable increase in practice. Copy must not use streak or guilt language.
- [#36](https://github.com/0xVorian/externalize/issues/36) — Follow-ups from reviews of #34 and #35 (latest-card recap, split-round tests, dead branch).

#37 is implemented on `master`; #39 hardening landed in #40. Production D1 (`externalize-progress`) is bound only via committed `wrangler.toml` `env.production`; git-connected previews stay unbound. Provisioning: [docs/accounts.md](accounts.md).

Do not treat this list as authorization to invent extra work. If an issue is not listed, check GitHub rather than assuming a new phase.

## Phase 0 — Documentation

- [x] Preserve original brief
- [x] Record design principles and technical decisions
- [x] Define MVP scope and build order
- [x] Define content model and authoring conventions
- [x] Adopt mobile-first browser as primary target
- [x] Establish independent EN/FR academic copy policy
- [x] Preserve engagement/durable-learning research archive and synthesis
- [x] Define adaptive-curriculum architecture and Chapter II pilot
- [x] Define session-first low-intimidation UX contract

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

**Product validation criterion:** use it regularly on a phone and want to return; working-memory load is visibly reduced. **Still pending sustained real-world use; session-initiation friction is now an explicit validation target.**

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

**Current gate:** sustained personal use and validation of the learning loop, exercise quality, progression, repaired-attempt semantics, retention, transfer, source-driven use, and whether the shipped session-first/visual-grammar changes actually reduce initiation and interface friction. Curriculum expansion remains deferred.

## Phase 5 — Natural deduction

Status: **prototype only**.

Implemented groundwork:

- [x] Proof rule types and validation engine
- [x] Mobile-oriented proof rendering
- [x] Two fill-one-step proof exercises (`nd-001`, `nd-002`)
- [x] Natural-deduction design document

Deferred until real use justifies expansion:

- [ ] Full Fitch-style proof editor with scope highlighting
- [ ] Broader rule set and prerequisite-aware rule picker
- [ ] Repair-invalid-step exercises
- [ ] Subproof interaction
- [ ] Derivation replay

## Phase 6 — Predicate logic

Status: **engine/design spike only**, plus the minimum quantifier teaching needed by the Chapter II source pilot.

Implemented groundwork:

- [x] Predicate / quantifier AST extensions
- [x] Parser support for predicates, terms, `∀`, and `∃`
- [x] Free-variable / predicate-symbol helpers
- [x] Predicate-logic design document
- [x] Narrow Chapter II quantifier bridge/source interactions over the adaptive learner model

Deferred as a general curriculum:

- [ ] Predicate-logic learning units
- [ ] General translation exercises for quantified statements
- [ ] General models and countermodels
- [ ] Quantifier natural-deduction rules and UI

## Recommended session structure (for content authoring)

The old authoring loop remains useful as a source of ingredients, but the learner-facing contract is now governed by `docs/session-first-ux.md`.

A bounded session may contain:

1. one intuitive/new idea;
2. a small number of recognition/retrieval checks;
3. one guided application where needed;
4. spaced review of weak/stale material;
5. one transfer check when pedagogically justified.

Do not force every session to contain every ingredient. The important constraints are that the round is finite, the learner knows the effort before starting, and useful learning evidence still comes from the actual graded activities rather than session completion.

Source-driven routes may compress or reorder this loop when prerequisite evidence shows that parts are unnecessary; important learning sequences should still include genuine transfer rather than source-specific pattern matching.

## What we are explicitly not building yet

- Native mobile app
- Email/password accounts, push/email identity, or sync outside Cloudflare Pages + D1
- Full natural-deduction editor
- Full predicate-logic curriculum/UI
- Multiple textbook notation systems
- Achievements, leaderboards, arbitrary XP/account levels, hearts, currencies, or reset-on-miss streaks
- Hover-only or mouse-only interactions
- PDF ingestion / synchronized ebook reader
- Runtime LLM curriculum/session generation or opaque prerequisite recommendation
- Push/email notification infrastructure
- Universal learning-workflow/activity engine
- Chapter III+ source-specific interaction families before the adaptive pilot is validated

The next major expansion decision should follow evidence from using the session-first product and the Chapter II source-driven pilot, not the existence of additional technically possible features.