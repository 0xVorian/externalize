# Phase 6 — Predicate logic (design prep)

Design for extending the engine and content model with **quantifiers, predicates, variables, and constants** before any predicate-logic UI ships. **Prep only** — no implementation in this phase. See [roadmap](roadmap.md) Phase 6, [future work plan](future-work-plan.md) (Tier 3), and [decisions](decisions.md) (notation, AST-first).

## Goal

Record how first-order predicate logic fits the existing propositional stack so Phase 3–5 work does not paint us into a corner. When Phase 6 starts, we should be able to extend `Formula` once, teach quantified statements with the same tap-first / AST-first patterns, and add model-based exercises without rewriting the parser or renderer from scratch.

**Exit criterion (Phase 6, not this doc):** A learner can translate a simple quantified English sentence, inspect binding scope in a tree, and find a small countermodel on a phone.

## Scope (this document)

| In scope | Out of scope |
|----------|--------------|
| AST shape for predicates, terms, quantifiers | Parser / evaluator implementation |
| Notation and naming conventions | Translation or proof UI |
| Impact analysis on parser, renderer, exercises | Model checker or domain library |
| Open decisions and provisional defaults | Content YAML for predicate exercises |
| Explicit deferrals | Identity, many-sorted logic, equality reasoning |

## Current baseline

Today `engine/ast/types.ts` defines propositional `Formula`:

- `atom` — sentence letter (`P`, `Q`, …)
- `not`, `and`, `or`, `imp`, `iff` — truth-functional connectives

Evaluation uses `Assignment: Record<string, boolean>`. The parser (`engine/parse/parse.ts`), display renderer (`engine/render/display.ts`), tree renderer (`engine/render/tree.ts`), and equivalence checker (`engine/equiv/equivalent.ts`) are all propositional-only.

Predicate logic **extends** this layer; it does not replace it. Every propositional formula remains valid first-order syntax when viewed as 0-place predicates (see below).

## AST extension

### Design principles

1. **One `Formula` union** — quantifiers and predicates are additional `kind` variants on the same type learners and exercises compare. Avoid a parallel “FOL AST” that must be converted at exercise boundaries.
2. **Separate terms from formulas** — terms denote objects; formulas denote truth values. Mixing them complicates parsing and natural-deduction rules later.
3. **Explicit binding** — each `forall` / `exists` node carries the bound variable name and its body. Free variables may appear in authoring strings but exercises that require binding checks compare normalized ASTs.
4. **Backward compatible** — existing propositional exercises, tests, and `collectAtoms()` callers keep working; new helpers (`collectFreeVariables`, `collectPredicateSymbols`, …) live alongside current utilities.

### Proposed types (sketch)

```typescript
/** Individual constants and variables (terms). */
type Term =
  | { kind: 'const'; name: string }   // a, b, c, …
  | { kind: 'var'; name: string };    // x, y, z, …

/** n-place atomic predicate applied to terms; n = 0 is a propositional atom. */
type Pred = {
  kind: 'pred';
  name: string;
  args: Term[];   // [] for P, [t] for F(x), [t1, t2] for R(x, y)
};

type ForAll = {
  kind: 'forall';
  var: string;
  body: Formula;
};

type Exists = {
  kind: 'exists';
  var: string;
  body: Formula;
};

/** Extended union — propositional variants unchanged. */
type Formula =
  | Pred | Not | And | Or | Imp | Iff | ForAll | Exists;

/** Migration: today’s Atom { kind: 'atom', name } becomes Pred { kind: 'pred', name, args: [] }. */
```

**Compatibility note:** During migration, either alias `atom` → `pred` with empty args or accept both in `parse()` output until content is updated. Prefer a single canonical `pred` shape in new code.

### Terms and arity

| Construct | AST | Surface syntax |
|-----------|-----|----------------|
| Propositional letter | `pred('P', [])` | `P` |
| 1-place predicate | `pred('F', [var('x')])` | `F(x)` |
| 2-place predicate | `pred('R', [var('x'), var('y')])` | `R(x, y)` |
| Constant in argument | `pred('F', [const('a')])` | `F(a)` |
| Nested term functions | **Defer** — no `f(x)` in v1 | — |

Functions (`f`, `g`) and identity (`=`) are listed under [What not to build yet](#what-not-to-build-yet).

### Quantifier scope

Quantifiers bind the variable **only in their immediate body** — standard FOL. Nested quantifiers reuse the same variable name only when shadowing is explicit in the tree (exercises should prefer distinct names until a dedicated “binding” lesson exists).

```
∀x (F(x) → ∃y R(x, y))
```

```text
forall x
└─ imp
   ├─ pred F [x]
   └─ exists y
      └─ pred R [x, y]
```

**Negated quantifiers:** `¬∀x F(x)` stays as `not(forall(...))` — no special “negated quantifier” node. Feedback can still tag `negated-quantifier-scope` when learners move `¬` across a quantifier incorrectly.

### Variable conventions

| Role | Symbols | Notes |
|------|---------|-------|
| Bound variables | `x`, `y`, `z` (then `w`, `v` if needed) | Quantifier node stores the name |
| Individual constants | `a`, `b`, `c`, … | Fixed denotations in model exercises |
| Predicate letters | `F`, `G`, `H`, … (1-place); `R`, `S`, … (2-place) | Exercise config may pin arity |
| Propositional (0-place) | `P`, `Q`, `R`, … | Same letters as MVP; 0-place `pred` |

Reuse of `R` as both a 0-place and 2-place symbol is **disallowed in authored content** — exercise metadata should declare allowed signatures.

## Notation choices

Single canonical Unicode notation per [decisions](decisions.md). No multi-textbook modes.

| Symbol | Meaning | Rejected alternatives (for now) |
|--------|---------|----------------------------------|
| `∀` | Universal quantifier | `(x)`, `Ax`, `⋀x` |
| `∃` | Existential quantifier | `Ex`, `⋁x` |
| `∀x` | Quantifier + variable | `∀x:` only if colon aids readability on mobile — **provisional** |
| `( … )` | Scope disambiguation | Brackets `[ ]` — stick to parentheses already taught |
| `F(x)`, `R(x, y)` | Predicate application | Prefix-only in v1; no infix `xRy` |
| `a`, `b` | Constants | Numerals, proper names in logic font |
| `¬`, `∧`, `∨`, `→`, `↔` | Connectives (unchanged) | Polish notation, `⊃` |

### Surface syntax examples

Authored strings for parser tests and future exercises:

```text
∀x F(x)
∃x (F(x) ∧ G(x))
∀x (F(x) → ∃y R(x, y))
¬∃x F(x)          → not(exists x F(x))   — prefer explicit parens in teaching: ¬∃x F(x) vs ¬(∃x F(x))
∀x F(x) → G(a)    → parse as (forall x F(x)) → G(a)  — left-assoc `→`; **authors use explicit parens**
(P → Q)             — still valid; pred P with args []
```

**Authoring rule (extends propositional):** Implication chains and mixed quantifier/connective formulas require **explicit parentheses** in learner-facing content, same policy as [decisions](decisions.md) for `→`.

### Locale copy (EN / FR)

Formulas stay symbolic; locale affects prose only ([i18n](i18n.md)).

| English | French (provisional labels) |
|---------|------------------------------|
| for all | pour tout |
| there exists | il existe |
| predicate | prédicat |
| constant | constante individuelle |
| bound variable | variable liée |
| free variable | variable libre |
| scope (of quantifier) | portée |

Independent academic traditions — French copy is not a literal translation of English lesson text.

## Impact on engine modules

### Parser (`engine/parse/`)

| Change | Detail |
|--------|--------|
| Token set | Add `∀`, `∃`; identifiers split into predicate vs constant vs variable by position (after quantifier → variable; after `(` in `F(` → predicate letter already consumed) |
| Grammar | `Primary` → predicate application \| variable \| `(` Formula `)`; `Quantifier` → `(∀\|∃) Var Formula` |
| Precedence | Quantifiers bind tighter than `→` but looser than `¬` — **provisional**; document in parser tests when implemented |
| Migration | `parse('P')` yields `pred('P', [])`; existing tests updated in one pass |

**Not yet:** Unicode subscripts, mixed binders on one quantifier (`∀x,y`), type annotations.

### Renderer (`engine/render/`)

| Module | Impact |
|--------|--------|
| `display.ts` | Format `∀x`, `∃x`, `F(t1, …, tn)`; parenthesis rules for quantifier body under connectives |
| `tree.ts` | Quantifier nodes as unary-ish rows (`∀x` label + body child); predicate nodes show name + comma-separated term children |

Mobile tree layout: quantifier scope should read **vertically** (bound variable on the quantifier row, body indented) — same externalized-scope principle as Phase 2.

### Evaluator (`engine/eval/`)

Propositional evaluation is **insufficient** for general FOL (undecidable). Phase 6 MVP targets:

| Exercise style | Evaluation approach |
|----------------|---------------------|
| Propositional fragment | Existing `evaluate()` on 0-place preds |
| Ground sentences (no free vars) | Finite model supplied in exercise — enumerate domain, interpret predicates, evaluate recursively |
| Open formulas | **Defer** — show syntax tree only, or require closed sentence in exercise |

New type (future): `Model = { domain: string[]; interp: Record<string, boolean[][]> }` — shape TBD; **not specified in this prep doc beyond sketch**.

### Equivalence (`engine/equiv/`)

| Level | Use |
|-------|-----|
| Structural AST equality | Default for translation exercises |
| α-equivalence | Optional flag: rename bound variables consistently |
| Semantic (same truth in all models) | **Out of scope** for automated checking except tiny finite models enumerated in exercise |

### Truth tables

Truth-table machinery (`engine/truth-table/`) applies only when a formula reduces to propositional atoms (no quantifiers, or quantifiers over empty domain edge cases). **Do not** force quantified formulas into truth-table UI.

### Feedback (`engine/feedback/`)

New tags (illustrative — implement with classifier in Phase 6):

| Tag | Example mistake |
|-----|-----------------|
| `wrong-quantifier` | `∃` vs `∀` |
| `quantifier-scope` | `∀x F(x) → G` vs `∀x (F(x) → G)` |
| `negated-quantifier-scope` | `¬∀x F(x)` vs `∀x ¬F(x)` |
| `wrong-binding` | Free `x` where bound `x` expected |
| `wrong-arity` | `F(x, y)` vs `F(x)` |
| `constant-for-variable` | `F(a)` vs `F(x)` in translation |

Pattern: same classifier-before-generic-fallback approach as [phase3-translation](phase3-translation.md).

## Impact on exercises and content model

### Exercise types (Phase 6 targets)

| Type | Learner action | Engine check |
|------|----------------|--------------|
| `translate-quantified` | Palette builds formula from English | Structural / α-equiv AST compare |
| `identify-quantifier-scope` | Tap main quantifier or bound variable span | Tree path match |
| `find-countermodel` | Assign domain + predicate extensions (tap grid) | Model satisfies `¬φ` for given closed φ |
| `evaluate-ground` | Given finite model, truth-value of closed sentence | Recursive eval in model |

These extend `ExerciseType` in [content-model](content-model.md); they are **not** added until Phase 6 implementation.

### Palette extensions

Phase 3 palette (`∀`, `∃`, `x`, `y`, `z`, `a`, `b`, predicate letters with arity slots) composes with existing connectives. Predicate application likely uses **slot filling**: tap `F`, tap `_`, tap `x` → `F(x)` token group compiled to `pred('F', [var('x')])`.

Builder pipeline stays: tokens → compile → `Formula` — never string compare.

### Presentation routing

| Formula shape | Likely presentation |
|---------------|---------------------|
| Closed quantified sentence | Tree + optional model grid |
| Ground atom / compound | Tree-eval or small model row |
| Open formula (lesson demo) | Tree-scope only |

Add rows to `presentation.test.ts` when UI lands; predicate formulas must not fall through to propositional truth-table modes incorrectly.

### Concept graph (future)

```text
propositional-complete  → predicate-syntax
predicate-syntax        → quantifier-scope
quantifier-scope        → translation-quantified
translation-quantified  → finite-models
finite-models           → nd-quantifier-rules   (Phase 6 late / post-Phase 6)
```

## Relationship to natural deduction (Phase 5)

Quantifier rules (∀E, ∀I, ∃E, ∃I) depend on **Fitch scope** from Phase 5. AST must expose:

- Whether a subproof is **flagged** for a bound variable (eigenvariable discipline)
- Which variables are **free in** a line’s formula

Record now; implement with proof editor. Phase 6 **content** can start with translation and models before full ND quantifier UI.

## What not to build yet

Explicit deferrals — revisit only after propositional Phase 4 and Phase 3 translation feel solid on a phone:

| Area | Why defer |
|------|-----------|
| **Predicate logic UI** | AST and notation must be settled first ([future-work-plan](future-work-plan.md)) |
| **Full FOL evaluator / prover** | Undecidable; use finite models per exercise |
| **Identity (`=`) and function symbols** | Adds term complexity and equality rules; optional later per [vision](vision.md) |
| **Many-sorted / typed logic** | Single domain for MVP countermodels |
| **Unification / automated proof search** | Conflicts with tap-one-step pedagogy |
| **Skolemization, prenex normal form** | Advanced; not mobile-practice material |
| **Alternative quantifier notations** | One Unicode convention |
| **Free typing of formulas on mobile** | Palette + builder only |
| **Truth tables for quantifiers** | Misleading pedagogy |
| **Semantic equivalence in all models** | Infeasible; finite enumeration only |
| **Content YAML migration for FOL** | After hand-authored spike exercises |
| **Quantifier ND rules UI** | After Phase 5 propositional ND is stable |

## Open decisions

| Question | Current lean | Status |
|----------|--------------|--------|
| `atom` vs `pred` with `args: []` | Migrate to `pred` only | **Provisional** |
| Quantifier syntax `∀x` vs `∀x:` | `∀x` + space; colon only if readability testing fails | **Provisional** |
| α-equivalence as default pass | Off; enable per exercise | **Provisional** |
| Max arity in MVP | 2 | **Provisional** |
| Domain size cap in countermodel UI | 3–4 elements | **Provisional** |
| Eigenvariable naming in ND | Distinct from constants | **Defer** to Phase 5/6 boundary |

Record final choices in [decisions](decisions.md) when implementation starts.

## Recommended implementation sequence (Phase 6)

1. **AST types + helpers** — `Term`, `Pred`, `ForAll`, `Exists`; `collectFreeVariables`; migrate `atom` → `pred`.
2. **Parser + display + tree** — round-trip tests for quantified examples in this doc.
3. **Finite-model evaluator** — ground and closed sentences only.
4. **Feedback classifier** — quantifier tags table above.
5. **Palette + one translation exercise** — spike like Phase 3 `translate-001`.
6. **Countermodel grid UI** — smallest domain first.
7. **ND quantifier rules** — after Phase 5 editor exists.

## Related documentation

| Document | Relationship |
|----------|--------------|
| [Roadmap](roadmap.md) | Phase 6 exit criteria |
| [Future work plan](future-work-plan.md) | Tier 3 predicate / ND decision docs |
| [Technical decisions](decisions.md) | Notation, AST-first, deferred scope |
| [Phase 3 translation](phase3-translation.md) | Palette + AST comparison pattern to extend |
| [Content model](content-model.md) | Exercise schema evolution |
| [Presentation](presentation.md) | Tree vs table routing |
| [Vision](vision.md) | Predicate logic learning goals |
