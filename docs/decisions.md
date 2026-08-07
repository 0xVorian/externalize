# Technical Decisions

Recorded decisions and rationale from planning conversations. Revisit entries marked **provisional** once the first prototype is running.

## Decided

### Platform: mobile-first, local-first web application

**Decision:** Build as a web app optimized for phone browsers, with local storage; no account required for v1.

**Rationale:**

- Primary use case is short practice sessions on a phone
- Works without install friction; optional PWA / add-to-home-screen later
- `localStorage` / IndexedDB sufficient for progress, SRS queue, and mistake history
- Easier to iterate on UI than a native mobile app
- Desktop and tablet layouts extend the mobile base, not the other way around

### First canonical logic: classical propositional logic

**Decision:** Standard infix notation with explicit parentheses: `¬`, `∧`, `∨`, `→`, `↔`, sentence letters `P`, `Q`, `R`, …

**Rationale:** Covers the MVP scope. Predicate logic and natural deduction notation deferred until the interaction model is proven.

**Provisional:** Whether to support alternative textbook conventions (e.g. `⊃` vs `→`, Polish notation) — defer until AST + pretty-printer exist.

### Predicate logic (Phase 6 prep)

**Decision (design):** Extend the existing `Formula` AST with `Term`, n-place `pred`, `forall`, and `exists` nodes; single Unicode notation (`∀`, `∃`, `F(x)`); propositional atoms migrate to 0-place predicates. Finite models per exercise for evaluation — no global FOL theorem prover.

**Rationale:** Keeps one comparison path for exercises (AST-first), aligns with Phase 3 palette/builder patterns, and avoids truth-table misuse for quantifiers.

**Details:** [predicate-logic.md](predicate-logic.md). Implementation deferred until Phase 6; open questions (α-equivalence default, quantifier display colon, max arity) marked provisional there.

### Proof system (future)

**Decision:** Fitch-style natural deduction (likely target) — line numbers, indented subproofs, visible scope boxes. Exact rule set TBD.

**Note:** Choose rule details after propositional translation, evaluation, and truth-table interactions feel solid. Proof UI is high complexity.

**Prep doc:** [natural-deduction.md](natural-deduction.md) — mobile layout constraints, minimal rule-set options (Option C → A lean), fill-one-step vs repair-step patterns, subproof UI at ~320px, Phase 4 dependencies. Update this entry when the starter rule set is finalized.

### Expression representation: AST

**Decision:** All formulas stored and compared as abstract syntax trees.

**Rationale:** Required for scope-aware feedback, equivalence checking, and later proof validation. Enables multiple render targets (Unicode, ASCII, LaTeX) from one structure.

### Equivalence checking

**Decision:** Default to **structural AST equality** (normalized shape). Per-exercise flags may allow:

- commutativity of `∧` / `∨` (operand order ignored)
- semantic equivalence via exhaustive truth-table comparison (small atom sets only)

Do not treat arbitrary algebraic equivalence as globally accepted on day one.

**Never:** Raw string comparison.

### Content authoring: hand-authored data first

**Decision:** v1 exercises in JSON or YAML files. Template-based generation once patterns emerge from ~20+ hand-authored exercises.

### Progress storage

**Decision:** Local only for v1. Export/import JSON for backup and migration.

No authentication, no server sync, until there is a concrete need.

### Input modalities

**Decision (v1 priority order):**

1. Tap-to-select (primary — scope highlighting, truth-value toggles, multiple choice)
2. Symbol palette + tap-to-insert (translation and formula building)
3. Drag-and-drop where it clarifies structure — **only with an equivalent tap path** (required for mobile)
4. Keyboard shortcuts (desktop enhancement, later)

**Rationale:** Mobile-first rules out hover and mouse-only interactions. Drag-and-drop is pedagogically useful for scope but must never be the only way to complete an exercise.

### Evaluation presentation: truth table vs parse tree

**Decision:** Use **truth-table rows** for watch/demo lessons that enumerate all assignments on a small formula (e.g. four cases of `P ∧ Q`). Use a **live single-row table plus toggles** for guided try on the same flat formula. Use the **vertical parse tree** for practice eval on nested formulas and for scope-tap tasks.

**Rationale:** A tree for `P ∧ Q` alone reads as a misaligned list and hides the 2×2 pattern. Tables match standard logic pedagogy and the card-lesson notation (`T ∧ T ⇒ T`, …). Trees remain essential once propagation or scope matters.

**Details:** Highlight active table row + step label; locale-aware `V`/`F` vs `T`/`F` in all cells; parent connective row aligned with child rows in trees. See `docs/presentation.md`.

### UI stack: Vite + vanilla TypeScript

**Decision:** Vite for bundling; vanilla TS with structured modules under `src/app/` for MVP-0. No React/Svelte until component complexity justifies it.

**Rationale:** Zero ceremony, aligns with engine-only dependencies, mobile tap UI is manageable with explicit render functions. Revisit if proof editor or complex state makes vanilla unwieldy.

### Implication associativity and learner-facing input

**Decision:** The parser treats `→` and `↔` as **left-associative** when chained (`P → Q → R` parses as `(P → Q) → R`). **Learner-facing exercises must use explicit parentheses**; bare implication chains are not used in authored content.

**Rationale:** Avoids silent ambiguity in teaching material. Documented and tested; authors enforce parens in exercise strings.

### Locale copy: independent academic traditions

**Decision:** English and French strings are **authored independently**, not translated from one another.

**English** follows analytic philosophy / introductory logic: sentence letters, truth assignment, main connective, conjunct, material conditional, T/F.

**French** follows logique propositionnelle (French university usage): variables propositionnelles, interprétation/valuation, connecteur principal, portée, formule atomique, V/F.

Each locale uses its own examples and standard vocabulary. Parity of pedagogy, not parity of wording.

**Implementation:** Separate EN/FR blocks in `src/i18n/messages.ts` and `src/i18n/lessons.ts`; treat as parallel course notes, not a translation pair.

### Scope visualization

**Decision:** Use indentation, boxes, or connecting lines — not colour alone. On mobile, prefer **vertical tree layout** and collapsible subexpression nodes over wide horizontal formulas.

Colour may reinforce matching subexpressions but must duplicate information structurally or in text.

## Prototype sequencing

### Phase 1 — Engine spike (unchanged)

AST types, parse, render, evaluate, equivalence check, unit tests. No UI beyond dev harness.

### Phase 2 — MVP-0 UI (first interactive prototype)

**Decision:** Prove the core design principle on unambiguous symbolic input before fighting natural-language edge cases.

**Interactions:**

1. **Scope recognition** — given a formula shown as a tree, identify the main connective and its operands (tap to select; scope regions use boxes/indentation, not colour alone)
2. **Evaluate under an assignment** — flip atom truth values; watch every intermediate node update

Plus a tiny local spaced-repetition queue (a few hard-coded exercises).

**Exit criterion:** Using MVP-0 on a phone for a week feels worth returning to. The tree + visible intermediate values genuinely reduce working-memory load.

**Why before translation:** Translation combines linguistics ambiguity with heavy input UX. Scope and evaluation are mechanically checkable and directly exercise the AST renderer and the "externalize state" hypothesis.

### Phase 3 — Translation prototype (second interactive prototype)

**Decision:** Ordinary language → propositional formula via tap-based symbol palette (with optional drag-to-group on desktop), visible scope, local feedback.

Pair each exercise with a structural check (main connective, scope boundary) and live read-back preview.

**Exit criterion:** Translation feels instructive on a phone, not fiddly; feedback pinpoints errors without full restart.

### Deferred early decisions (ignore for now)

| Defer | Reason |
|-------|--------|
| Mobile native app | Web-first covers the use case |
| User accounts / cloud sync | Local storage sufficient for v1 |
| Multi-textbook notation modes | One notation keeps feedback precise |
| Predicate logic UI, identity | After propositional interaction model works; AST design in [predicate-logic.md](predicate-logic.md) |
| Full exercise generation engine | Hand-author first |
| Fancy gamification | Protect the brief's tone |
| Algebraic equivalence solver | Per-exercise flags + truth tables are enough |

## Open questions

| Question | Current lean | Status |
|----------|--------------|--------|
| Web framework | Vite + vanilla TS (`src/app/` modules) | **Decided** |
| Testing strategy | Unit tests on engine; manual phone testing for UI | **Decided** for MVP-0 |
| SRS algorithm | Simplified interval queue in localStorage | **Decided** for MVP-0 |
| Multiple valid translations | Accept semantically equivalent formulas where English is ambiguous; flag non-canonical but valid answers | **Provisional** |
| PWA manifest | Add when MVP-0 is stable | **Defer** |
| Accessibility | Screen-reader labels for all symbols; keyboard navigation on desktop | **Required** — details TBD |

## Risks to monitor

1. **Horizontal formulas on narrow screens** — mitigate with vertical tree layout
2. **Drag-and-drop fatigue** and touch imprecision — tap-first always available
3. **Translation pattern-matching** without structural understanding — mitigated by scope exercises coming first
4. **Over-gamification** hiding lack of mastery — keep feedback and concept map honest
5. **Proof UI complexity** — do not start natural deduction until truth-functional interactions are polished

## Review notes

### Initial planning (2026-08-07)

Strengths identified in the original brief: working-memory constraint as first-class requirement, disciplined MVP scope, feedback-as-repair, content/engine separation, tone framing.

### Sequencing revision (2026-08-07, second review)

External feedback correctly argued that translation as the *first* UI prototype spends early cycles on linguistics and input chrome rather than proving the core loop. MVP-0 (tree + scope + evaluation + tiny SRS) is the cheaper proof of the design principle. Translation remains the second UI prototype and stays early in the learning path.

Mobile-first constraint added: phone browser is the primary target; all interactions must work without hover or mouse precision.
