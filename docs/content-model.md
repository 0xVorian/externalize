# Content Model

How lessons, exercises, and progress are represented in the codebase today.

## Design goals

- **Separation:** language-neutral structure in `src/app/`, locale copy in `src/i18n/`
- Engine validates formulas and runs exercises; UI renders from AST + assignment
- Skill tags and error tags drive spaced repetition (see progress record below)
- Exercise UIs must be completable on a phone browser (tap-first; no hover-only steps)

Future direction: YAML/JSON authoring under `content/` may replace hand-edited TypeScript arrays. Until then, follow [Authoring guide](authoring.md).

## File layout (current)

```
src/app/
  lessons.ts           — LEVEL_0_LESSONS, PRACTICE_UNLOCK_ORDER
  exercises.ts         — EXERCISE_DEFINITIONS
  presentation.test.ts — presentation inventory (must stay in sync)
  lesson-render.ts     — card, watch table, guided live row
  render.ts            — practice tree + toggles
  truth-table-render.ts
  storage.ts           — progress persistence

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

Level 0 lessons live in `LEVEL_0_LESSONS`. Level 1 will add a parallel array when connective lessons ship.

## Exercise schema

Defined in `src/app/exercises.ts`:

```typescript
type ExerciseType = 'identify-main-connective' | 'evaluate-formula';

type ExerciseDefinition = {
  id: string;
  type: ExerciseType;
  formula: string;
  initialAssignment?: Assignment;   // evaluate-formula only
};
```

Copy in `src/i18n/messages.ts`:

```typescript
type ExerciseCopy = {
  prompt: string;
  feedback?: FeedbackTemplate;   // overrides per-tag defaults
};
```

### Exercise types (implemented)

| `type` | Learner action | Engine checks |
|--------|----------------|---------------|
| `identify-main-connective` | Tap the main operator in the tree | Selected node matches root connective |
| `evaluate-formula` | Toggle atom values; read computed nodes | All node values match evaluation |

Planned types (translation, truth-table fill, counterexample, proof steps) are listed in the roadmap — not yet in `ExerciseType`.

### Gated unlock

`PRACTICE_UNLOCK_ORDER` in `lessons.ts` defines which exercises become available after Level 0 completion, and in what order. IDs not in this list are unreachable in the practice tab.

## Presentation routing

Presentation mode is **not** stored on the lesson/exercise definition. It is inferred from type + formula and recorded in:

- `src/app/presentation.test.ts` — `PRESENTATION` map (enforced by tests)
- `docs/presentation.md` — human-readable inventory

Modes: `card`, `truth-table-multi`, `truth-table-live`, `tree-eval`, `tree-scope`.

## Concept graph (illustrative)

Concepts are nodes; edges are prerequisites. Not yet encoded as data — skill tags on exercises approximate this.

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

Stored in browser `localStorage` (see `src/app/storage.ts`). Version 3 includes resume point, lesson completion, per-skill stats, and SRS queue.

```typescript
interface ProgressRecord {
  version: 3;
  lastSession: string;
  completedLessons: string[];
  completedExercises: string[];
  resume: ResumePoint;
  skills: Record<string, { attempts: number; successes: number }>;
  errorCounts: Record<FeedbackTag, number>;
  srsQueue: Array<{ exerciseId: string; due: string; interval: number; ease: number }>;
}
```

Spaced repetition schedules by **demonstrated error tags**, not mere completion.

## Feedback tag taxonomy

Engine tags (propositional logic v1):

- `correct`
- `wrong-main-connective`
- `selected-subconnective`
- `selected-atom`
- `selected-operand-not-connective`

Defaults in `src/i18n/messages.ts`; per-exercise overrides in `EXERCISE_COPY[id].feedback`.

Future tags (from original sketch): `reversed-conditional`, `negation-scope`, `missing-parens`, etc. — added when translation and proof exercise types land.

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
