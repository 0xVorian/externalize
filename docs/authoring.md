# Authoring guide

How to add or change learning content in Externalize without breaking the learner model, presentation contract, or EN/FR parity.

Externalize currently uses **TypeScript data** for lesson/exercise structure, **parallel locale copy** under `src/i18n/`, and JSON content files for routes, concept/evidence metadata, and source packs. Do not introduce a new authoring format merely to avoid editing these files.

## Current sources of truth

| What | Structure | Copy / metadata |
|------|-----------|-----------------|
| Foundations lessons (Units 0–2) | `src/app/lessons.ts` | `src/i18n/lessons.ts` |
| Practice exercises | `src/app/exercises.ts` | `src/i18n/messages.ts` |
| Logic and Theism source lessons | `src/app/source-lessons.ts` | `src/i18n/source.ts` |
| Practice unlock sequencing | `src/app/lessons.ts`, `src/app/practice-clusters.ts` | — |
| Portable concept evidence | — | `content/exercise-evidence.json` |
| Routes | — | `content/routes/*.json` |
| Source anchors | — | `content/sources/*.json` |
| Presentation coverage | `src/app/presentation.test.ts` | `docs/presentation.md` |

Run `npm run inventory` for the current lesson/exercise/practice-chain inventory. `docs/generated-inventory.md` is generated from source and can be verified with `npm run inventory:check`; do not hand-edit it.

---

## 1. Foundations lessons

### Lesson schema

`src/app/lessons.ts` defines:

```ts
type LessonType = 'card' | 'watch' | 'guided';

type LessonDefinition = {
  id: string;
  type: LessonType;
  formula?: string;
  watchLayout?: 'grid' | 'table';
};
```

Lessons live in `LEVEL_0_LESSONS`, `LEVEL_1_LESSONS`, and `LEVEL_2_LESSONS`, then combine into `ALL_LEARN_LESSONS`.

Use stable IDs: progress records persist lesson IDs.

### Card lesson

Use for one compact explanatory step. Copy lives under the same lesson ID in both locales:

```ts
{
  title: '...',
  subtitle: '...',
  card: {
    title: '...',
    body: ['...'],
    example: '...', // optional
  },
}
```

For beginner material follow the shipped progression where practical:

> **meaning → use → name → notation → independent use**

Do not lead with implementation taxonomy or several undefined technical terms merely because the terms are academically correct.

### Watch lesson

Use to walk through authored cases while the engine computes the result.

Copy:

```ts
watchSteps: [
  { assignment: { P: true, Q: false }, explanation: '...' },
]
```

Binary flat formulas normally use the 2×2 watch grid; single-atom/fallback cases use rows. The renderer, not locale copy, formats `T/F` or `V/F`.

### Guided lesson

Use when the learner should build or infer one assignment value at a time.

```ts
guidedSteps: [
  {
    kind: 'hint',
    mode: 'instruct', // or 'goal'
    text: 'Set P to true.',
    atom: 'P',
    value: true,
  },
  { kind: 'done', text: '...' },
]
```

Two legitimate guided modes exist:

- **`instruct`** — the text explicitly names the requested value;
- **`goal`** — the visible logical goal uniquely determines the requested value.

Never store a secret expected value behind copy such as “Choose P” when both truth values would otherwise be legitimate.

Guided state distinguishes **unset**, **true**, and **false**. Unset/future atoms render as unknown, not as hidden false defaults. A provisional choice appears in the active target but must not reveal whether it satisfies the goal before **Check**.

Learner-facing choices use **True / False** and **Vrai / Faux**. Formal tables/trees use compact **T/F** and **V/F**.

---

## 2. Practice exercises

Definitions live in `src/app/exercises.ts`:

```ts
type ExerciseType =
  | 'identify-main-connective'
  | 'evaluate-formula'
  | 'fill-truth-table-cell'
  | 'find-counterexample'
  | 'classify-tautology'
  | 'classify-choice'
  | 'translate-en-to-formula'
  | 'proof-fill-step';
```

### Current interaction contract

| Type | Learner action | Validation / presentation |
|------|----------------|---------------------------|
| `identify-main-connective` | Select a connective, then Check | Root connective in vertical tree; repair in place |
| `evaluate-formula` | Read the **system-chosen, read-only assignment**, predict True/False, then Check | Flat formulas use a live row; nested formulas use a parse tree; the assessed root is hidden until Check |
| `fill-truth-table-cell` | Choose True/False for one blank result cell, then Check | Selection provisionally fills the target in formal notation; no grading until Check |
| `find-counterexample` | Build an assignment that makes the target truth value hold | Engine evaluates the learner assignment; root correctness stays assessment-safe until Check |
| `classify-tautology` | Classify from the complete truth table | Finite truth-table classification |
| `classify-choice` | Select one authored reading/claim, then Check | Choice ID comparison; used by the source pilot and repairable in place |
| `translate-en-to-formula` | Build a formula with the symbol palette | AST structure/equivalence + misconception classifier |
| `proof-fill-step` | Select a rule and cited lines | Natural-deduction step validator |

**Do not turn graded `evaluate-formula` back into learner-controlled assignment toggling.** Explore is the place for manipulating assignments freely; Explore writes no mastery/SRS evidence.

### Definition fields

```ts
type ExerciseDefinition = {
  id: string;
  type: ExerciseType;
  formula?: string;
  initialAssignment?: Assignment;
  hiddenRowIndex?: number;
  targetValue?: boolean;
  choiceIds?: string[];
  correctChoiceId?: string;
};
```

Common conventions:

- `scope-NNN` — main-connective exercise;
- `eval-NNN` — evaluation;
- `tt-NNN` — fill truth-table;
- stable IDs once shipped;
- formula correctness belongs in the engine, not in locale copy.

### Copy

Practice copy lives in both locale blocks in `src/i18n/messages.ts`.

```ts
type ExerciseCopy = {
  prompt: string;
  assessmentPrompt?: string;
  hint?: string;
  atoms?: Record<string, string>;
  choices?: Record<string, string>;
  feedback?: FeedbackTemplate;
};
```

Correct feedback should give the shortest useful logical reason, not fall back to a bare “Correct.” when the app knows why the answer is correct. Wrong feedback should identify the local misconception and preserve repair where possible.

### Unlock order

Foundations Practice is not one hand-edited linear list anymore:

- Unit 0: `LEVEL_0_PRACTICE_UNLOCK_ORDER`;
- Unit 1: clustered policy in `src/app/practice-clusters.ts` / `LEVEL_1_PRACTICE_UNLOCK_ORDER`;
- Unit 2: `LEVEL_2_PRACTICE_UNLOCK_ORDER`;
- `PRACTICE_UNLOCK_ORDER` is the combined compatibility view.

Progress v7 unlocks from **passed** graded evidence, not mere exposure. Repaired passes can unlock but remain conservative SRS/evidence; clean-pass semantics must remain intact.

### Portable evidence

When a graded exercise demonstrates reusable knowledge, tag it in `content/exercise-evidence.json` with canonical concept × capability evidence (`recognize`, `apply`, `debug`, `transfer`).

Do not invent source-specific duplicate concepts for knowledge that should transfer between routes.

---

## 3. Logic and Theism source-route content

The Chapter II pilot is deliberately narrow.

- source lesson structure: `src/app/source-lessons.ts`;
- EN/FR copy: `src/i18n/source.ts`;
- route order/requirements: `content/routes/logic-and-theism-reading.json`;
- anchors/citation metadata: `content/sources/logic-and-theism.json`;
- evidence: `content/exercise-evidence.json`.

Use source locators, bibliographic metadata, paraphrase, and only short necessary quotations. Do not reproduce substantial book text.

The deterministic planner may choose `skip`, `retrieve`, `teach`, or `unsupported`, but planner categories are **not learner-facing copy**.

Do not add Chapter III+ runtime interaction families without explicit authorization; the existing later-chapter maps are research/design material.

---

## 4. Presentation

Presentation is inferred from exercise/lesson type and formula; it is not a free-form authoring field.

`src/app/presentation.test.ts` must cover every lesson and exercise. Current presentation families include:

- `card`
- `watch-grid`
- `truth-table-multi`
- `truth-table-live`
- `truth-table-partial`
- `truth-table-tautology`
- `tree-eval`
- `tree-scope`
- `translation-palette`
- `proof-fill-step`
- `choice`

See `docs/presentation.md` for the pedagogical rule behind each representation.

The learner-facing visual grammar for graded work is:

> **logical object / stimulus → response workspace → explicit Check → feedback**

Do not add boxes merely for decoration; separation should clarify the cognitive operation.

---

## 5. Structural exercise generator

`content/exercise-templates.json` and `tools/exercise-generator/` support the repetitive structural patterns (`scope`, `eval`, `fillTruthTable`). The generator prints snippets for review; it does not replace authored EN/FR copy or evidence tagging.

```bash
npm run generate:exercises
npm run generate:exercises -- --diff
npm run generate:exercises -- --pattern=scope
```

Useful flags include `--json`, `--both`, `--pattern=...`, `--start-scope=N`, `--start-eval=N`, `--start-tt=N`, `--diff`, `--unlock-hint`, and `--templates=PATH`.

After generation:

1. review/paste the definition;
2. add independently authored EN and FR copy;
3. place it in the correct unlock/cluster policy if applicable;
4. add evidence tags where justified;
5. ensure presentation coverage;
6. refresh/check the generated inventory.

---

## 6. Internationalization

English and French are **parallel academic materials**, not a translation pair.

- author both locales in the same change;
- use standard terminology for each academic tradition;
- introduce formal terms progressively for novices rather than permanently avoiding them;
- formulas stay symbolic;
- truth-value answer controls may use words while formal representations use locale-aware compact notation.

See `docs/i18n.md` and `.cursor/rules/i18n-academic.mdc`.

---

## 7. Verification and pre-PR checklist

```bash
npm run inventory:update   # only when lesson/exercise inventory changed
npm run inventory:check
npm test
npm run build
npm run test:e2e
```

Before opening a PR:

- [ ] stable ID chosen;
- [ ] EN and FR authored independently;
- [ ] no hidden correctness leak before Check;
- [ ] wrong answers remain repairable where the interaction supports repair;
- [ ] no lesson/session completion masquerades as mastery;
- [ ] SRS/evidence semantics preserved;
- [ ] `presentation.test.ts` covers new content;
- [ ] `docs/generated-inventory.md` refreshed if inventory changed;
- [ ] ~320px/tap-first behavior considered;
- [ ] accessibility does not rely on colour alone;
- [ ] source text boundary respected;
- [ ] user-visible changes recorded under `[Unreleased]`.
