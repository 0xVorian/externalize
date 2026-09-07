# Adaptive curriculum implementation assessment

**Status:** Phase A implemented in the runtime; Phases B–C remain the authorized next gates  
**Created:** 2026-09-07  
**Updated:** 2026-09-07  
**Scope:** turn the source-driven curriculum idea into a small, testable extension of the existing application without rewriting Externalize

## Executive conclusion

The new direction fits the product, but the runtime is less route-agnostic than the conceptual docs now are.

Externalize already has the right low-level assets: a prerequisite graph, versioned local progress, SRS, repairable attempts, reusable renderers/logic engines, and a clean split between engine behavior and authored copy. However, the current application still treats **one hard-coded three-unit sequence** as the curriculum, and its learner capability model is keyed primarily to **exercise families** rather than to durable concepts.

The correct implementation is therefore a targeted refactor, not a rewrite:

1. make the current logic course the first explicit **route**;
2. upgrade progress so graded attempts can emit evidence for **concept × capability** pairs;
3. add **source packs** whose route steps reference the same canonical concepts;
4. add a deterministic just-in-time planner that chooses the smallest prerequisite intervention;
5. validate the architecture with one narrow *Logic and Theism* vertical slice before implementing the rest of the book.

Do **not** build a generic AI curriculum generator, PDF reader, universal activity engine, or every Sobel-specific interaction up front.

---

## Observed current state

### What is already reusable

- `content/prerequisites.json` already defines canonical-ish concepts and prerequisite edges.
- `src/app/prerequisites.ts` already loads the graph and exposes concept/lesson relationships.
- `src/app/storage.ts` provides versioned local persistence, export/import, SRS, attempt finalization, repaired-pass semantics, and migration infrastructure.
- `src/app/progress-tracker.ts` and `progress-visibility.ts` already distinguish attempt evidence from mere exposure and derive user-facing capability states.
- Existing propositional interactions are mechanically validated by the engine rather than by prose heuristics.
- Natural deduction and predicate logic already have engine/design groundwork.
- `Explore` does not contaminate mastery evidence, which is exactly the right rule for source-driven experimentation.

### Where the runtime is still coupled to one curriculum

1. `src/app/lessons.ts` owns a fixed `ALL_LEARN_LESSONS` sequence and fixed unit numbers `0 | 1 | 2`.
2. Practice unlock is hard-coded through `LEVEL_*_PRACTICE_UNLOCK_ORDER` and unit completion.
3. `storage.ts` persists `level0Complete`, `level1Complete`, and `level2Complete` as first-class progression state.
4. `ResumePoint` knows only app mode + lesson/exercise, not route/source/anchor.
5. `AppMode` is fixed to Learn / Practice / Progress / Explore; there is no notion of a selected learning route.
6. `SkillId` currently describes interaction families (`evaluate-formula`, `translate-prose-to-formula`, etc.), not durable knowledge such as `quantifier-scope` or `conditional-probability`.
7. An exercise definition has one interaction type and parameters, but does not explicitly declare the **concept/capability evidence** a successful attempt should strengthen.
8. Lesson types are narrowly `card | watch | guided`, with `watch`/`guided` strongly oriented around formulas. Source-driven material will eventually need other representations (world cards, causal graphs, decision matrices, set diagrams), but those should be added incrementally.

The main mismatch is therefore **curriculum orchestration and learner-state semantics**, not the propositional engine.

---

## Target architecture

Keep the existing four user-facing modes. A source-driven book is a **Learn route**, not a fifth app mode.

```text
                         canonical concept graph
                                  |
                 +----------------+----------------+
                 |                                 |
       logic-foundations route            source-driven route
                 |                                 |
        neutral content/items            source pack + anchors
                 |                                 |
                 +---------------+-----------------+
                                 |
                         graded activities
                                 |
                    concept × capability evidence
                                 |
                         one learner model
                                 |
                          global Practice/SRS
```

### 1. Canonical concepts

Durable, source-independent nodes.

```ts
type ConceptId = string;

type ConceptDefinition = {
  id: ConceptId;
  requires?: ConceptId[];
  label: { en: string; fr: string };
};
```

Do not encode a book chapter or exercise as a concept.

### 2. Capabilities

A concept can be known in different ways. Avoid an enormous taxonomy initially.

Recommended pilot set:

```ts
type Capability =
  | 'recognize'
  | 'apply'
  | 'debug'
  | 'transfer';
```

`translate`, `evaluate`, `construct-proof`, etc. remain **interaction families**; they are not necessarily the learner-model ontology.

For example:

- a translation exercise can emit `conditional × apply` evidence;
- a scope bug hunt can emit `scope × debug` evidence;
- a fresh Sobel-independent example can emit `existential-import × transfer` evidence.

We can add capability dimensions later only when real content demands them.

### 3. Evidence on graded activities

Extend exercise/activity metadata rather than attempting to infer concepts from interaction type.

```ts
type EvidenceTag = {
  concept: ConceptId;
  capability: Capability;
  role?: 'primary' | 'supporting';
};

type ActivityDefinition = {
  id: string;
  interaction: string;
  evidence?: EvidenceTag[];
  requires?: Array<{ concept: ConceptId; capability?: Capability }>;
};
```

Existing exercises can be adapted without changing their mechanics.

### 4. Routes

A route says **what becomes relevant when**.

```ts
type RouteDefinition = {
  id: string;
  kind: 'canonical' | 'source';
  steps: RouteStep[];
};

type RouteStep = {
  id: string;
  anchor?: string;
  depth?: 'reading' | 'mastery';
  requires?: Requirement[];
  items: string[];
};
```

The current three-unit course becomes `logic-foundations` without changing its initial order.

### 5. Source packs

Source-specific material is thin metadata over canonical concepts.

```ts
type SourcePack = {
  id: string;
  title: string;
  citation: string;
  routes: string[];
  anchors: SourceAnchor[];
};

type SourceAnchor = {
  id: string;
  locator: string; // e.g. "II.2.6–2.8, pp. 35–40"
  requires: Requirement[];
  items: string[];
  modes: Array<'prerequisite' | 'derive' | 'predict' | 'interrogate' | 'formalize' | 'transfer'>;
};
```

The public repository should store bibliography, locators, paraphrased prompts, and short necessary quotations only — not the book text.

### 6. Learner state

Keep exercise-specific state and SRS. Add portable concept evidence and route state.

```ts
type ConceptCapabilityStat = {
  attempts: number;
  cleanPasses: number;
  transferPasses: number;
  recentErrors: string[];
  lastSeenAt?: string;
};

type RouteProgress = {
  currentStepId?: string;
  depthByStep?: Record<string, 'reading' | 'mastery'>;
  seenItems?: string[];
};

// ProgressStore v7 additions
activeRouteId: string;
routes: Record<string, RouteProgress>;
conceptEvidence: Record<string, ConceptCapabilityStat>;
```

Key format can initially be `${conceptId}:${capability}`.

Do not delete existing `skills`, `exerciseStats`, `passed`, or SRS data in the first migration. They remain useful and allow a safe incremental rollout.

---

## What should *not* be generalized yet

### Do not replace the current engines

The propositional AST/evaluator is good at propositional exercises. Predicate/model, modal, Bayesian, set-theoretic, and causal interactions will need different engines or lightweight validators. They do not need to share one universal reasoning engine.

The reusable layer is curriculum/evidence orchestration, not mathematical representation.

### Do not make every source interaction graded

`Prerequisite`, `Derive`, and `Interrogate` can contain teaching/exploration items that produce no mastery evidence. Only interactions with clear success criteria should change portable concept state.

### Do not generate routes with an LLM at runtime

The first source packs should be hand-authored from the maps. Once two or three sources exist, we will know which fields are stable enough to automate.

### Do not integrate a PDF reader yet

For the pilot, source anchors can say where to read and Externalize can prepare/check the learner around that passage. Local PDF attachment, text extraction, synchronization, highlighting, and licensing/provenance UI are separate problems and can wait.

---

## Recommended implementation sequence

## Phase A — route refactor with zero intended learner-visible change

Goal: prove the current logic course can run through the new route abstraction.

1. Introduce `content/concepts.json` (or evolve `prerequisites.json`) with canonical concept definitions.
2. Add explicit evidence metadata for the existing graded exercises.
3. Add `content/routes/logic-foundations.json` reproducing the current lesson/practice order.
4. Add route loader/selectors.
5. Change progression helpers so `logic-foundations` produces exactly the current unlock behavior.
6. Add v7 progress fields: `activeRouteId`, `routes`, `conceptEvidence`.
7. Migrate v6 conservatively and derive whatever historical concept evidence is defensible from `exerciseStats` + exercise evidence tags.
8. Regression-test that existing users see the same Learn/Practice sequence after migration.

**Gate:** current course behavior and existing progress survive unchanged. **Met in code** (route-parity, v6→v7 migration, and existing Learn/Practice regression tests). Independent full-suite verification belongs with the assignment close-out.

Canonical concepts for the existing course remain in `content/prerequisites.json`. Explicit evidence tags live in `content/exercise-evidence.json`. The route file is `content/routes/logic-foundations.json`. Progress v7 adds `activeRouteId`, `routes`, and `conceptEvidence` without deleting v6 fields.

## Phase B — one *Logic and Theism* vertical slice

Use Chapter II §§2.6–2.8 (Descartes and existential import).

Why this slice:

- it motivated the feature;
- the learning target is crisp;
- it reuses existing conditionals/scope knowledge;
- it adds a small amount of genuinely new quantifier machinery;
- transfer can be tested with ordinary language examples;
- success can be judged without integrating the PDF.

Add only the minimum new interaction needed, likely a generic **choice/classification** activity plus static formula display. Do not build the full predicate-logic curriculum first.

A possible route step:

```text
Sobel II.2.6–2.8
  target: understand why Descartes gets universal-hypothetical content,
          not existential import

  requires:
    conditional × apply
    universal-quantifier × recognize
    existential-quantifier × recognize

  planner:
    if conditional is strong -> skip
    if quantifiers unseen -> 3-minute micro-lesson
    -> derive ordinary `A F is G` ambiguity
    -> predict which reading Descartes needs
    -> inspect the inference
    -> fresh transfer example
    -> return to book
```

**Gate:** using this route gets the learner back into Sobel faster and with better understanding than manually switching between the book and the canonical logic track.

## Phase C — deterministic just-in-time planner

Implement a small policy, not an optimizer.

For each requirement:

- `consistent` + transfer evidence -> no detour;
- some evidence but weak/stale -> one retrieval/transfer check;
- unseen -> micro-lesson + guided check;
- Mastery depth -> add formalization/construction activities.

The planner should return an explicit plan the UI can display and tests can snapshot.

```ts
type PlannedIntervention =
  | { kind: 'skip'; requirement: Requirement }
  | { kind: 'retrieve'; itemId: string }
  | { kind: 'teach'; itemIds: string[] };
```

Avoid opaque recommendations that cannot be inspected.

## Phase D — expand only when the representation changes

After the Descartes pilot, implement new interaction families in response to actual chapters:

- Chapter III: possible-world cards / modal state grid;
- Chapter V: causal/dependency graph;
- Chapter VII/VIII/XI: probability/Bayes interactions;
- Chapter X: finite sets, subset construction, diagonalization;
- Chapter XIII: decision matrices.

Each new renderer should satisfy a real reusable representational need, not a chapter-specific gimmick.

---

## UI recommendation

Do not add a top-level `Books` tab.

Keep:

- **Learn** — current route, route/source switcher, next route step;
- **Explore** — ungraded manipulation;
- **Practice** — global review drawn from portable concept evidence and concrete exercises;
- **Progress** — concept capability state plus per-route/source position.

On Learn, the header can become roughly:

```text
Externalize
Learn
Route: Logic & Theism ▾
Chapter II · §2.6 · Reading

Before you continue
You need: universal vs existential quantification
[2-minute bridge]
```

The canonical logic course is simply another route in the same selector.

---

## Important semantic decision: SRS remains concrete

Do not schedule abstract concepts directly.

Concept state answers: **what does the learner appear able to do?**

SRS answers: **which concrete activity should be shown again, and when?**

An exercise can strengthen multiple concept/capability pairs; the queue still schedules the exercise (or later an exercise generator/template). This preserves the current repair/SRS semantics and prevents an abstract concept scheduler from having to invent content.

---

## Migration strategy

A v7 migration can be non-destructive.

- Preserve all v6 fields initially.
- Set `activeRouteId = 'logic-foundations'`.
- Initialize `routes['logic-foundations']` from existing lesson/resume state.
- Build `conceptEvidence` from existing `exerciseStats` only where the new exercise metadata makes the mapping explicit.
- Do not infer mastery from lesson completion alone.
- Keep old `skills` as interaction-family telemetry until all progress views have migrated.

This lets us ship the architecture behind a route-aware UI without invalidating existing learning evidence.

---

## Architecture tests worth writing first

1. **Route parity:** a fresh learner on `logic-foundations` receives exactly the current lesson/practice ordering.
2. **Migration parity:** a representative v6 export resumes at the same effective place after v7 migration.
3. **Portable mastery:** concept evidence earned in `logic-foundations` suppresses redundant prerequisite teaching in `logic-and-theism-reading`.
4. **Source isolation:** completing a source-specific item advances its route but does not create a duplicate concept.
5. **Transfer evidence:** a source-independent transfer exercise strengthens the same concept learned through Sobel.
6. **Depth switch:** Reading can skip formal mastery items while Mastery includes them without splitting concept identity.
7. **No false mastery:** source navigation, reading completion, hints, and Explore activity never increment graded concept evidence.

---

## Decision points after the first vertical slice

Only after the Chapter II pilot should we decide:

- whether lessons and exercises should merge into one generic `ActivityDefinition`;
- whether route/source content should live in JSON, YAML, or TypeScript;
- whether concept evidence needs more than four capability dimensions;
- whether route planning should account for recency/forgetting beyond current SRS;
- whether source files should be attachable inside the app;
- whether source-map authoring can be partly automated.

The pilot is specifically intended to answer these questions with usage evidence rather than architecture taste.

## Recommendation

Proceed with **Phase A + the narrow Chapter II vertical slice**, but stop there before implementing Chapter III–X interactions.

The conceptual direction has enough merit to justify refactoring curriculum orchestration. It does **not** yet justify turning Externalize into a general educational platform. The next proof should be brutally concrete: can the same learner state and the same concept graph move smoothly between the existing logic course and Sobel, with less redundant work and better comprehension?
