# Authoring guide

How to add lessons and exercises to Externalize. Content is **TypeScript data** in `src/app/` (language-neutral structure) plus **parallel locale copy** in `src/i18n/` (English and French written independently).

## Quick reference

| What | Structure | Copy |
|------|-----------|------|
| Level 0/1 lesson | `src/app/lessons.ts` | `src/i18n/lessons.ts` |
| Practice exercise | `src/app/exercises.ts` | `src/i18n/messages.ts` |
| Presentation routing | `src/app/presentation.test.ts` | — |

Run `npm test` after every content change. The i18n and presentation inventory tests fail if you forget a locale or a presentation entry.

---

## 1. Adding a Level 0 or Level 1 lesson

Level 0 is the introductory unit (`LEVEL_0_LESSONS`). Level 1 (connectives `¬`, `∨`, `→`, `↔`) will follow the same pattern in a future `LEVEL_1_LESSONS` array — the steps below apply to both.

### Step 1 — Choose lesson type and presentation

| `type` | Purpose | When to use | Presentation |
|--------|---------|-------------|--------------|
| `card` | Read-only prose + optional example block | Introduce a concept | `card` |
| `watch` | Instructor walks through fixed cases | Enumerate all truth assignments for a small formula | `truth-table-multi` |
| `guided` | Learner sets assignments step by step | Hands-on try on a small formula | `truth-table-live` |

See [Presentation rules](presentation.md) for the full decision table (table vs live row vs tree). **Do not** use a parse tree to enumerate the four cases of `P ∧ Q` — use a truth table.

Set `formula` on `watch` and `guided` lessons. Card lessons omit it.

### Step 2 — Register in `src/app/lessons.ts`

Append to `LEVEL_0_LESSONS` (or the future Level 1 array) in teaching order:

```typescript
{ id: 'level0-06-disjunction', type: 'card' },
{ id: 'level0-07-watch-or', type: 'watch', formula: 'P ∨ Q' },
{ id: 'level0-08-guided-or', type: 'guided', formula: 'P ∨ Q' },
```

**ID convention:** `level0-NN-slug` or `level1-NN-slug` — kebab-case, stable once shipped (progress records store lesson IDs).

### Step 3 — Add copy in `src/i18n/lessons.ts`

Add the same lesson key under **both** `en` and `fr` in the `LESSONS` object. Shape depends on type:

- **Card:** `title`, optional `subtitle`, `card: { title, body[], example? }`
- **Watch:** `title`, optional `subtitle`, `watchSteps: [{ assignment, explanation }]`
- **Guided:** `title`, optional `subtitle`, `guidedSteps: [{ kind: 'hint' | 'done', text }]`

Write each locale from scratch — see [i18n rules](i18n.md).

### Step 4 — Register presentation

Add an entry to `PRESENTATION` in `src/app/presentation.test.ts`:

```typescript
'level0-07-watch-or': 'truth-table-multi',
'level0-08-guided-or': 'truth-table-live',
```

Allowed values today: `card`, `truth-table-multi`, `truth-table-live`, `tree-eval`, `tree-scope`.

### Step 5 — Verify

```bash
npm test
```

`src/i18n/lessons.test.ts` asserts every lesson in `LEVEL_0_LESSONS` has copy in both locales. Watch lessons must have exactly 4 steps; guided lessons must have exactly 3 steps (current convention for binary connectives).

---

## 2. Adding a practice exercise

### Step 1 — Choose type

| `type` | Learner action | Typical presentation |
|--------|----------------|----------------------|
| `identify-main-connective` | Tap the main connective in the tree | `tree-scope` |
| `evaluate-formula` | Set atom truth values; read computed nodes | `truth-table-live` (flat `P ∧ Q` only) or `tree-eval` |

### Step 2 — Register in `src/app/exercises.ts`

```typescript
{
  id: 'scope-004',
  type: 'identify-main-connective',
  formula: 'P ∨ (Q ∧ R)',
},
```

For evaluation exercises, set `initialAssignment` so the first screen is meaningful:

```typescript
{
  id: 'eval-003',
  type: 'evaluate-formula',
  formula: 'P ∨ Q',
  initialAssignment: { P: true, Q: false },
},
```

**ID convention:** `scope-NNN` or `eval-NNN`.

### Step 3 — Add unlock order (if gated)

Append the ID to `PRACTICE_UNLOCK_ORDER` in `src/app/lessons.ts` where it should unlock. Exercises not in this list are unreachable in the gated practice flow.

### Step 4 — Add copy in `src/i18n/messages.ts`

Add the exercise key under **both** `en` and `fr` in `EXERCISE_COPY`:

```typescript
'scope-004': {
  prompt: 'Select the main connective of the formula.',
  feedback: {
    'selected-subconnective':
      '∧ binds tighter here; the outer connective governs the whole formula.',
  },
},
```

- `prompt` is required.
- `feedback` is optional; per-exercise tags override defaults from `FEEDBACK_DEFAULTS_*`.
- Available tags: `correct`, `wrong-main-connective`, `selected-subconnective`, `selected-atom`, `selected-operand-not-connective`.

### Step 5 — Register presentation

Add to `PRESENTATION` in `src/app/presentation.test.ts`:

```typescript
'scope-004': 'tree-scope',
'eval-003': 'tree-eval',   // not truth-table-live unless formula is exactly 'P ∧ Q'
```

**Auto-routing note:** `usesLiveTruthRow()` returns true only for the exact string `P ∧ Q`. New flat formulas do not automatically get a live table — choose `tree-eval` or extend the renderer.

### Step 6 — Verify

```bash
npm test
```

`src/i18n/messages.test.ts` asserts every exercise in `EXERCISE_DEFINITIONS` has a prompt and feedback templates in both locales.

---

## 3. Internationalization

Full policy: **[docs/i18n.md](i18n.md)**

Summary for authors:

- English and French are **independent course materials**, not translations.
- **EN:** analytic / introductory logic tradition — sentence letter, truth assignment, main connective, T/F.
- **FR:** logique propositionnelle — variable propositionnelle, interprétation, connecteur principal, portée, V/F.
- Formulas stay symbolic (`P ∧ Q`); only surrounding prose changes.
- Always add both locales in the same change. Never ship English-only copy.
- Cursor rule: `.cursor/rules/i18n-academic.mdc`

---

## 4. Presentation

Full inventory and layout rules: **[docs/presentation.md](presentation.md)**

| Pedagogical goal | Presentation |
|------------------|--------------|
| Show all cases of a small formula (demo) | Truth table, highlighted rows (`truth-table-multi`) |
| Learner sets one assignment on a small formula | Live table row + toggles (`truth-table-live`) |
| Propagate values under one assignment (complex formula) | Vertical parse tree with values (`tree-eval`) |
| Tap main connective / scope | Vertical parse tree, no values (`tree-scope`) |
| Introduce a concept in prose | Card (`card`) |

When adding content, update `PRESENTATION` in `presentation.test.ts` and the inventory table in `docs/presentation.md`.

---

## 5. Worked examples

### Example A — Watch lesson step (`P ∧ Q`)

**Goal:** Add a fifth watch lesson demonstrating `P ∨ Q` (hypothetical Level 1 content).

**1. `src/app/lessons.ts`**

```typescript
{ id: 'level1-01-watch-or', type: 'watch', formula: 'P ∨ Q' },
```

**2. `src/i18n/lessons.ts` — English**

```typescript
'level1-01-watch-or': {
  title: 'Worked cases: P ∨ Q',
  subtitle: 'Four assignments, displayed explicitly.',
  watchSteps: [
    {
      assignment: { P: true, Q: true },
      explanation:
        'At least one disjunct is true; P ∨ Q evaluates to T.',
    },
    {
      assignment: { P: true, Q: false },
      explanation:
        'P alone is true, so the disjunction is T — only both false makes ∨ false.',
    },
    {
      assignment: { P: false, Q: true },
      explanation:
        'Q is true; the disjunction evaluates to T.',
    },
    {
      assignment: { P: false, Q: false },
      explanation:
        'Both disjuncts false; P ∨ Q evaluates to F.',
    },
  ],
},
```

**3. `src/i18n/lessons.ts` — French (written fresh, not translated)**

```typescript
'level1-01-watch-or': {
  title: 'Cas typiques : P ∨ Q',
  subtitle: 'Quatre interprétations, présentées une à une.',
  watchSteps: [
    {
      assignment: { P: true, Q: true },
      explanation:
        'Au moins un argument est vrai : P ∨ Q vaut V.',
    },
    {
      assignment: { P: true, Q: false },
      explanation:
        'P seul suffit ; la disjonction est V — seul le cas V/F/F rend ∨ fausse.',
    },
    {
      assignment: { P: false, Q: true },
      explanation:
        'Q est vrai ; la disjonction vaut V.',
    },
    {
      assignment: { P: false, Q: false },
      explanation:
        'Les deux arguments sont faux ; P ∨ Q est F.',
    },
  ],
},
```

**4. `src/app/presentation.test.ts`**

```typescript
'level1-01-watch-or': 'truth-table-multi',
```

**Note:** The current truth-table renderer computes results for `P ∧ Q` only. Adding watch lessons for other connectives requires extending `truth-table-render.ts` — document that in `docs/presentation.md` when you do.

---

### Example B — Scope exercise (`(P → Q) ∧ R`)

**Goal:** Add a main-connective exercise (copy-paste template based on existing `scope-001`).

**1. `src/app/exercises.ts`**

```typescript
{
  id: 'scope-001',
  type: 'identify-main-connective',
  formula: '(P → Q) ∧ R',
},
```

**2. `src/app/lessons.ts` — unlock order**

```typescript
export const PRACTICE_UNLOCK_ORDER = [
  'eval-001',
  'eval-002',
  'scope-003',
  'scope-001',   // ← add or reorder here
  'scope-002',
] as const;
```

**3. `src/i18n/messages.ts` — English**

```typescript
'scope-001': {
  prompt: 'Select the main connective of the formula.',
  feedback: {
    'selected-subconnective':
      '→ is the main connective of (P → Q), but the formula as a whole is a conjunction. The outermost connective has widest scope.',
  },
},
```

**4. `src/i18n/messages.ts` — French**

```typescript
'scope-001': {
  prompt: 'Indiquez le connecteur principal de la formule.',
  feedback: {
    'selected-subconnective':
      "L'implication → structure (P → Q), mais la formule entière est une conjonction : le connecteur le plus externe a la portée maximale.",
  },
},
```

**5. `src/app/presentation.test.ts`**

```typescript
'scope-001': 'tree-scope',
```

**6. Verify and mobile-check**

```bash
npm test
npm run dev
```

Open the exercise on a ~320px viewport. Confirm tap targets on the tree align with the formula (see `docs/presentation.md` § Vertical parse tree).

---

## 6. Changelog and versioning

Full policy: **[docs/versioning.md](versioning.md)**

When you ship user-visible content:

1. Add a bullet under `## [Unreleased]` → `### Added` (or `Changed` / `Fixed`) in `CHANGELOG.md`.
2. Write past tense, learner-facing when possible.
3. Do **not** bump `package.json` version until cutting a release.

Good entry:

```markdown
### Added
- Level 1 watch lesson for disjunction (P ∨ Q), EN and FR
- Practice exercise `scope-004` (main connective of P ∨ (Q ∧ R))
```

Bad entry:

```markdown
### Changed
- misc content updates
```

Release workflow (when asked): move `[Unreleased]` to `## [X.Y.Z] - YYYY-MM-DD`, bump `package.json`, commit `release: vX.Y.Z`.

Cursor rule: `.cursor/rules/versioning-changelog.mdc`

---

## Checklist (copy before opening a PR)

- [ ] Lesson/exercise registered in `src/app/lessons.ts` or `src/app/exercises.ts`
- [ ] Both `en` and `fr` copy added in the matching `src/i18n/*.ts` file
- [ ] `PRESENTATION` entry in `src/app/presentation.test.ts`
- [ ] `PRACTICE_UNLOCK_ORDER` updated (exercises only)
- [ ] `docs/presentation.md` inventory updated (if presentation is new or noteworthy)
- [ ] `CHANGELOG.md` `[Unreleased]` updated
- [ ] `npm test` passes
- [ ] Mobile spot-check at ~320px width

## Related docs

- [Content model](content-model.md) — schema reference and file layout
- [Internationalization](i18n.md) — EN analytic vs FR logique propositionnelle
- [Presentation](presentation.md) — truth table vs live row vs tree
- [Design principles](design-principles.md) — mobile-first, tap-only, visible steps
- [Versioning](versioning.md) — semver and release workflow
