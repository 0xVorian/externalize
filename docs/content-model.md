# Content Model

How lessons, exercises, and progress are represented in the codebase today.

## Design goals

- **Separation:** language-neutral structure in `src/app/`, locale copy in `src/i18n/`
- Engine validates formulas and runs exercises; UI renders from AST + assignment
- Skill tags and error tags drive spaced repetition (see progress record below)
- Exercise UIs must be completable on a phone browser (tap-first; no hover-only steps)

Future direction: YAML/JSON authoring under `content/` may replace hand-edited TypeScript arrays. `content/prerequisites.json` is the first content file; lesson/exercise definitions remain in TypeScript until migrated. Follow [Authoring guide](authoring.md).

## File layout (current)

```
content/
  prerequisites.json   — concept graph (lessons → exercises prerequisites)

src/app/
  lessons.ts           — Unit 0/1/2 lessons and sequential practice order
  exercises.ts         — EXERCISE_DEFINITIONS
  presentation.test.ts — presentation inventory (must stay in sync)
  lesson-render.ts     — card, watch table, guided live row
  render.ts            — practice tree + toggles
  truth-table-render.ts
  progress-render.ts   — progress tab + concept map
  concept-map-render.ts
  prerequisites.ts     — loads content/prerequisites.json
  practice-attempt.ts  — one-session attempt and repair state
  storage.ts           — v6 progress persistence and centralized finalization
  progress-visibility.ts — derived capability states and progress-moment diffs
  practice-session.ts  — ephemeral 5-attempt practice session (not mastery)
  evaluation-scaffold.ts — nested evaluation intermediate-value withdrawal

src/i18n/
  lessons.ts           — lesson copy, learn UI, reference panel
  messages.ts          — exercise prompts, feedback, practice UI
  locale.ts            — preference load/save
  *.test.ts            — parity checks for both locales

engine/
  ast/ parse/ eval/ feedback/   — language-neutral logic
```

## Lesson schema

Defined in `src/app/lessons.ts`:

```typescript
type LessonType = 'card' | 'watch' | 'guided';

type LessonDefinition = {
  id: string;
  type: LessonType;
  formula?: string;   // required for watch and guided
};
```

Copy shape in `src/i18n/lessons.ts`:

| Field | Used by | Purpose |
|-------|---------|---------|
| `title`, `subtitle` | All | Lesson header |
| `card.title`, `card.body[]`, `card.example?` | `card` | Prose lesson |
| `watchSteps[]` with `{ assignment, explanation }` | `watch` | Truth-table walkthrough |
| `guidedSteps[]` with `{ kind: 'hint' \| 'done', text }` | `guided` | Step-by-step learner try |

Lessons live in `LEVEL_0_LESSONS`, `LEVEL_1_LESSONS`, and `LEVEL_2_LESSONS`. Combined navigation uses `ALL_LEARN_LESSONS`.

## Exercise schema

Defined in `src/app/exercises.ts`:

```typescript
type ExerciseType =
  | 'identify-main-connective'
  | 'evaluate-formula'
  | 'fill-truth-table-cell'
  | 'find-counterexample'
  | 'classify-tautology'
  | 'translate-en-to-formula'
  | 'proof-fill-step';

type ExerciseDefinition = {
  id: string;
  type: ExerciseType;
  formula?: string;
  initialAssignment?: Assignment;
  hiddenRowIndex?: number;
  targetValue?: boolean;
};
```

Copy in `src/i18n/messages.ts`:

```typescript
type ExerciseCopy = {
  prompt: string;
  assessmentPrompt?: string;   // neutral graded instruction (evaluate-formula uses this)
  hint?: string;               // optional support, not shown until requested or after error
  atoms?: Record<string, string>; // locale-authored translation glosses
  feedback?: FeedbackTemplate;   // overrides per-tag defaults
};
```

### Exercise types (implemented)

| `type` | Learner action | Engine checks |
|--------|----------------|---------------|
| `identify-main-connective` | Tap the main operator in the tree | Selected node matches root connective |
| `evaluate-formula` | Read the system-chosen assignment, inspect intermediate values, predict the hidden root, check T/F or V/F | Prediction matches AST evaluation under the assigned case |
| `fill-truth-table-cell` | Fill one masked result cell | Submitted Boolean matches evaluation |
| `find-counterexample` | Build an assignment for a target value | Assignment makes the formula match the target |
| `classify-tautology` | Classify from a complete truth table | Answer matches finite truth-table classification |
| `translate-en-to-formula` | Build a formula with the tap palette | AST structure/equivalence and misconception classifier |
| `proof-fill-step` | Select a rule and cite lines | Configured natural-deduction rule validates the step |

### Truth-table exercises

`engine/truth-table/` generates and validates tables using **locale-agnostic booleans**; the UI maps values via `formatTruthValue()`.

| Helper | Role |
|--------|------|
| `generateTruthTable(formula, atoms)` | Full table for watch lessons and answer keys |
| `maskTruthTableRows(table, hiddenRowIndices)` | Partial table with blank result cells for `truth-table-cell` |
| `validateCell(formula, assignment, submitted)` | Single-cell check; returns `{ correct, expected }` |

Exercise definitions supply formulas and row targets; content files do not store `T`/`F` labels.

### Evaluation case selection

`src/app/evaluation-cases.ts` picks a truth assignment when a graded `evaluate-formula` attempt opens:

- Coverage-first: unseen rows for the formula’s truth table before repeats
- Error-aware weighting: after `incorrect-evaluation` errors, falsifying rows for implications (e.g. `T,F` for `P → Q`) are weighted higher
- Seen assignment keys persist on `exerciseStats.seenAssignmentKeys` after a finalized pass

Explore mode (`AppMode: explore`) lets learners manipulate assignments with live results and does not write progress or SRS data.

### Gated unlock

`PRACTICE_UNLOCK_ORDER` in `lessons.ts` defines the order within each unit. Exposure alone does not unlock the next exercise: the preceding exercise ID must be in the v6 `passed` list.

## Presentation routing

Presentation mode is **not** stored on the lesson/exercise definition. It is inferred from type + formula and recorded in:

- `src/app/presentation.test.ts` — `PRESENTATION` map (enforced by tests)
- `docs/presentation.md` — human-readable inventory

Modes include cards, watch grids/tables, live truth rows, evaluation/scope trees, translation palettes, and proof-step panels.

## Concept graph (data)

Prerequisite relationships live in [`content/prerequisites.json`](../content/prerequisites.json). The Progress tab renders concepts, lessons, and exercise prerequisites via `src/app/prerequisites.ts`.

```
proposition          → (none)
negation             → proposition
conjunction          → proposition, negation
disjunction          → proposition, negation
conditional          → proposition, negation, conjunction, disjunction
biconditional        → conditional
scope-and-parens     → all connectives
```

## Progress record (local storage)

Stored in browser `localStorage` (see `src/app/storage.ts`). Version 6 separates exposure from successful completion and persists the current practice attempt/draft.

```typescript
interface ProgressRecord {
  version: 6;
  lessonsCompleted: string[];
  attempted: string[]; // at least one checked answer
  passed: string[];    // eventually answered correctly
  practiceDraft?: PracticeDraft;
  practiceDrafts: Record<string, PracticeDraft>;
  resume: ResumePoint;
  skills: Record<string, SkillStat>;
  exerciseStats: Record<string, ExerciseStat>;
  errorCounts: Record<PracticeErrorTag, number>;
  queue: SrsEntry[];
}
```

One opened exercise session is one attempt. Wrong checks keep that attempt active; the first correct check finalizes it. Only centralized finalization increments attempt/skill/error totals, updates SRS, and adds `passed`.

- A clean pass is correct on the first checked answer and advances the normal SRS interval.
- A repaired pass follows one or more errors, still adds `passed`, records the encountered errors, and remains due immediately with reduced ease.
- Nested evaluate-formula exercises may store optional `exerciseStats[id].scaffoldLevel`. A clean pass increments it when the next level hides additional intermediate values. This is pedagogical support withdrawal, not a separate mastery score.
- Capability states (Ready / Developing / Reliable) are **derived** from unlocks and `SkillStat` evidence. See [`progress-visibility.md`](progress-visibility.md).
- The five-attempt practice session lives in app memory only. It must not be written into progress export/import.
- v5 migration preserves old `completed` IDs only as `attempted` exposure. It resets contaminated practice statistics, errors, and SRS, and requires fresh correct evidence for `passed`.

## Feedback tag taxonomy

Engine and practice tags include:

- `correct`
- `wrong-main-connective`
- `selected-subconnective`
- `selected-atom`
- `selected-operand-not-connective`
- `reversed-conditional`, `negation-scope`, `missing-parens`
- proof/counterexample tags
- practice-only incorrect evaluation, truth-table-cell, and tautology tags

Defaults in `src/i18n/messages.ts`; per-exercise overrides in `EXERCISE_COPY[id].feedback`.

## Example: scope exercise (as shipped)

**Definition** (`exercises.ts`):

```typescript
{ id: 'scope-001', type: 'identify-main-connective', formula: '(P → Q) ∧ R' }
```

**Copy** (`messages.ts`, English):

```typescript
'scope-001': {
  prompt: 'Select the main connective of the formula.',
  feedback: {
    'selected-subconnective':
      '→ is the main connective of (P → Q), but the formula as a whole is a conjunction. The outermost connective has widest scope.',
  },
},
```

**Presentation:** `tree-scope` in `presentation.test.ts`.

## Adding content

See **[Authoring guide](authoring.md)** for step-by-step instructions, worked examples, and the pre-PR checklist.
