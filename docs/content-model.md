# Content Model

How lessons, exercises, and progress are represented in the codebase today.

## Design goals

- **Separation:** language-neutral structure in `src/app/`, locale copy in `src/i18n/`
- Engine validates formulas and runs exercises; UI renders from AST + assignment
- Skill tags and error tags drive spaced repetition (see progress record below)
- Exercise UIs must be completable on a phone browser (tap-first; no hover-only steps)

Future direction: YAML/JSON authoring under `content/` may replace hand-edited TypeScript arrays. `content/prerequisites.json` remains the canonical concept graph for the logic course; routes and evidence live as additional content files. Lesson/exercise definitions remain in TypeScript until migrated. Follow [Authoring guide](authoring.md).

## File layout (current)

```
content/
  prerequisites.json        — concept graph (lessons → exercises prerequisites)
  concepts-extra.json       — additional canonical concepts used by source routes (not on the Progress map)
  exercise-evidence.json    — explicit concept × capability tags on graded exercises
  routes/logic-foundations.json — canonical Learn/Practice sequence
  routes/logic-and-theism-reading.json — Chapter II §§2.6–2.8 source route
  sources/logic-and-theism.json — source pack (anchors, citation; no book text)

src/app/
  lessons.ts           — Unit 0/1/2 lessons and sequential practice order
  source-lessons.ts    — source-route card lessons (not in ALL_LEARN_LESSONS)
  exercises.ts         — EXERCISE_DEFINITIONS
  curriculum.ts        — route, capability, and evidence types
  concepts.ts          — canonical concept lookup (prerequisites + extras)
  evidence.ts          — load evidence tags; record/backfill conceptEvidence
  routes.ts            — route loader and selectors
  planner.ts           — skip / retrieve / teach / unsupported prerequisite policy
  source-route.ts      — Sobel route sequencing, completion, and revisit
  session-types.ts     — SessionPlan / OpeningOffer contracts
  session-plan.ts      — deterministic 5–7 step envelope over route/SRS items
  session-persistence.ts — interrupted-round resume (separate from progress v7)
  session-telemetry.ts — local UX-D events, not mastery
  session-opening-render.ts / session-chrome-render.ts / session-complete-render.ts
  presentation.test.ts — presentation inventory (must stay in sync)
  lesson-render.ts     — card, watch table, guided live row
  classify-choice-render.ts — tap-to-classify source items
  render.ts            — practice tree + toggles
  truth-table-render.ts
  progress-render.ts   — progress tab + concept map
  concept-map-render.ts
  prerequisites.ts     — loads content/prerequisites.json
  practice-attempt.ts  — one-session attempt and repair state
  storage.ts           — v7 progress persistence and centralized finalization
  progress-visibility.ts — derived capability states and progress-moment diffs
  practice-session.ts  — ephemeral 5-attempt practice session (not mastery)
  evaluation-scaffold.ts — nested evaluation intermediate-value withdrawal

src/i18n/
  lessons.ts           — lesson copy, learn UI, reference panel
  session.ts            — session opening / chrome / completion copy
  source.ts            — Logic and Theism lesson/exercise copy (EN + FR)
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
| `guidedSteps[]` with `{ kind: 'hint', mode: 'instruct' \| 'goal', text, atom, value }` or `{ kind: 'done', text }` | `guided` | Step-by-step learner try; instruct names the value, goal makes it derivable |

Lessons live in `LEVEL_0_LESSONS`, `LEVEL_1_LESSONS`, and `LEVEL_2_LESSONS`. Combined navigation uses `ALL_LEARN_LESSONS`. Source-route cards live in `src/app/source-lessons.ts` and are **not** part of that sequence.

## Exercise schema

Defined in `src/app/exercises.ts`:

```typescript
type ExerciseType =
  | 'identify-main-connective'
  | 'evaluate-formula'
  | 'fill-truth-table-cell'
  | 'find-counterexample'
  | 'classify-tautology'
  | 'classify-choice'
  | 'translate-en-to-formula'
  | 'proof-fill-step';

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

Copy in `src/i18n/messages.ts`:

```typescript
type ExerciseCopy = {
  prompt: string;
  assessmentPrompt?: string;   // neutral graded instruction (evaluate-formula uses this)
  hint?: string;               // optional support, not shown until requested or after error
  atoms?: Record<string, string>; // locale-authored translation glosses
  choices?: Record<string, string>; // locale labels for classify-choice ids
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
| `classify-choice` | Select one labelled reading, then check | Selected id matches `correctChoiceId` (not formula string equality) |

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

`PRACTICE_UNLOCK_ORDER` in `lessons.ts` defines the order within each unit. Exposure alone does not unlock the next exercise: the preceding exercise ID must be in the `passed` list. The `logic-foundations` route reproduces this order; route-aware unlock currently delegates to the same Unit 0 / clustered Unit 1 / Unit 2 policy. Source-route `lat-*` exercises are not in that unlock order; they enter the global Practice pool only after a checked pass.

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

Stored in browser `localStorage` (see `src/app/storage.ts`). Version 7 keeps every v6 field and adds portable concept evidence plus per-route progress. Version 6 exports migrate conservatively.

```typescript
interface ProgressRecord {
  version: 7;
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
  activeRouteId: string; // default 'logic-foundations'
  routes: Record<string, RouteProgress>;
  conceptEvidence: Record<string, ConceptCapabilityStat>; // key: `${conceptId}:${capability}`
}
```

One opened exercise session is one attempt. Wrong checks keep that attempt active; the first correct check finalizes it. Only centralized finalization increments attempt/skill/error totals, updates SRS, adds `passed`, and records `conceptEvidence`.

- A clean pass is correct on the first checked answer and advances the normal SRS interval.
- A repaired pass follows one or more errors, still adds `passed`, records the encountered errors, and remains due immediately with reduced ease.
- Nested evaluate-formula exercises may store optional `exerciseStats[id].scaffoldLevel`. A clean pass increments it when the next level hides additional intermediate values. This is pedagogical support withdrawal, not a separate mastery score.
- Capability states (Ready / Developing / Consistent) are **derived** from unlocks and `SkillStat` evidence. See [`progress-visibility.md`](progress-visibility.md).
- The five-attempt practice session lives in app memory only. It must not be written into progress export/import.
- v6 → v7 migration preserves skills, exerciseStats, passed, drafts, queue, and resume. It sets `activeRouteId` to `logic-foundations`, initializes that route from lesson/resume state, and backfills `conceptEvidence` only from `exerciseStats` plus explicit evidence tags. Lesson completion alone is not mastery evidence. A v6 export does not invent `logic-and-theism-reading` route state.
- v5 migration preserves old `completed` IDs only as `attempted` exposure. It resets contaminated practice statistics, errors, and SRS, and requires fresh correct evidence for `passed`.

## Evidence tags

Graded exercises declare what a successful attempt should strengthen in `content/exercise-evidence.json`. Interaction families (`evaluate-formula`, translation, etc.) remain `SkillId`s; portable learner state uses concept × capability pairs (`recognize`, `apply`, `debug`, `transfer`). Source-route items tag the same canonical concepts (including extras such as `existential-import`); they must not invent source-specific duplicates.

The `logic-and-theism-reading` route’s skip / retrieve / teach detours are produced by `src/app/planner.ts` from `conceptEvidence`, then sequenced by `src/app/source-route.ts`. An unmet requirement with no authored bridge is `unsupported`, not skip. Evidence with attempts but missing/invalid `lastSeenAt` (including v6→v7 backfill) is retrieved rather than treated as fresh. Completing the final planned Reading item persists `routes[id].completedAt` and a terminal Done / return-to-book action; revisiting does not restart at item 1. Reading depth omits the Mastery empty-domain item; Mastery includes it without splitting concept identity. `practice:classify-choice` is SRS/telemetry only — it is not on the Progress capability list (`TRACKED_SKILL_IDS`); portable source mastery lives in concept × capability evidence.

Default initiation is a bounded session (`session-plan.ts`) over those same concrete items. Session completion writes no `conceptEvidence` or SRS. Planner categories are not learner-facing copy; a source-route detour is offered as a short preparation round. Interrupted sessions persist under `externalize-active-session-v1`, separate from progress v7.

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
