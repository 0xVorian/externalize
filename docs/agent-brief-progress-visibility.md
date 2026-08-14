# Cursor implementation brief — progress visibility

## Task

Implement the **progress visibility pass** for Externalize.

The current application already tracks meaningful learning state, but the learner does not strongly perceive movement while using Learn or Practice. The objective is to make progress continuously visible and emotionally legible **without adding arbitrary XP, account levels, decorative rewards, or false mastery claims**.

This is the current product priority after v0.3.5.

Read this brief as the implementation contract. You may inspect the rest of the repository for details, but you should not need prior conversation context to understand the intended behavior.

---

## Product thesis

Externalize should communicate:

> **You can now do more with less help.**

Progress should exist on three timescales:

1. **Immediate** — a meaningful completed action visibly changes something.
2. **Session** — a short practice bout has a finite arc and a completion state.
3. **Long-term** — capabilities are visibly Ready, Developing, or Reliable.

Do not solve this primarily with generic percentages or a Duolingo-style path. Do not create an XP economy.

Every progress claim must be backed by actual curriculum state or graded evidence.

---

## Repository / stack context

Externalize is a **framework-free TypeScript + Vite** browser application. Do not introduce React or another framework for this work.

Important existing files:

- `src/main.ts` — app orchestration, mode switching, progress persistence, lesson completion, practice finalization
- `src/app/storage.ts` — v6 local progress record, unlock logic, SRS, attempt finalization
- `src/app/progress-tracker.ts` — `SkillId`, `SkillStat`, `ExerciseStat`, progress summaries
- `src/app/progress-render.ts` — current Progress view
- `src/app/render.ts` — Practice rendering
- `src/app/lesson-render.ts` — Learn rendering
- `src/app/lessons.ts` — units, lessons, practice order
- `src/app/practice-clusters.ts` — Unit 1 cluster progression
- `src/app/evaluation-scaffold.ts` — configured scaffold levels for nested evaluation
- `src/app/concept-map-render.ts` / `src/app/prerequisites.ts` — concept graph/progress structure
- `src/app/what-next.ts` — current next-action derivation
- `src/i18n/messages.ts`, `src/i18n/lessons.ts` — EN/FR user-facing copy
- `src/styles/main.css` — application styles
- `e2e/` — Playwright coverage
- `docs/design-principles.md` — non-negotiable design constraints
- `docs/progress-visibility.md` — product model for this work

Preserve existing engine/content separation and AST-first logic behavior.

---

## Existing progress semantics you must preserve

`ProgressStore` is version 6 and already contains:

- `lessonsCompleted`
- `attempted`
- `passed`
- `skills`
- `exerciseStats`
- `errorCounts`
- SRS `queue`
- resume/draft state

A practice attempt is finalized only after an actual correct checked answer.

A **clean pass** means the first checked answer was correct.

A **repaired pass** means one or more wrong checks occurred before the correct answer. It still adds the exercise to `passed`, but it does **not** count as a clean skill success and is scheduled conservatively by SRS.

For graded `evaluate-formula`, the system chooses the truth assignment. Explore mode is free manipulation and writes no mastery/SRS evidence.

Do not weaken any of these semantics.

---

## Capability states

Add a small, pure derivation layer for user-facing capability state. Prefer a new module such as:

- `src/app/progress-visibility.ts`

or an equivalently focused name.

Use the existing tracked skill IDs:

| Skill id | Capability |
|---|---|
| `practice:identify-main-connective` | Find the main connective |
| `practice:evaluate-formula` | Evaluate formulas |
| `practice:fill-truth-table-cell` | Complete truth-table cases |
| `practice:find-counterexample` | Construct counterexamples |
| `practice:classify-tautology` | Recognize tautologies |
| `practice:translate-prose-to-formula` | Translate prose into formulas |
| `practice:proof-fill-step` | Complete proof steps |

Derive four states:

```ts
type CapabilityState = 'locked' | 'ready' | 'developing' | 'reliable';
```

Semantics:

- **locked** — no exercise for this skill is currently unlocked;
- **ready** — at least one exercise for this skill is unlocked, but there are no finalized graded attempts for the skill;
- **developing** — at least one finalized graded attempt exists, but reliability is not established;
- **reliable** — at least **3 finalized attempts** and a **clean-pass rate >= 0.8**.

This deliberately mirrors the existing `comfortable` threshold in `progress-tracker.ts`.

Important: `SkillStat.successes` represents clean passes. Repaired passes increase attempts but not successes. Do not redefine that just to make progress move faster.

Capability state should normally be **derived**, not separately persisted.

Add unit tests around all threshold boundaries, especially repaired passes and `3 attempts / 80%` cases.

---

## Learn: ambient progress

The Learn view should continuously show compact progress context without competing with the lesson.

Required information:

- current unit title;
- current lesson position in that unit;
- completed lessons / total lessons in the unit.

A compact accessible meter is appropriate. Use text as well as any visual bar; never rely on colour alone.

Examples of the information hierarchy, not mandatory literal copy:

```text
Unit 1 · Connectives
Lesson 6 of 15 · 5 completed
[progress meter]
```

On lesson completion, this context must visibly advance.

When a unit is completed, make that transition explicit once. It can be a restrained transition message/card; do not use confetti or generic praise.

Implementation note: `renderLessonView` currently receives limited completion flags. Prefer passing a small derived progress context object rather than coupling the renderer to all of `ProgressStore`.

---

## Practice: ambient capability + finite session

Practice is where the largest change should be felt.

Every Practice screen should make it easy to perceive:

1. the current capability being exercised;
2. its current state (`Ready`, `Developing`, `Reliable` where meaningful);
3. current practice-session position (`n / 5`).

The exercise itself remains the primary visual content. Keep this chrome compact at ~320px width.

### Session semantics

A practice session target is **5 finalized exercise attempts**.

Rules:

- wrong checks do not increment the session;
- repairing the same attempt does not increment the session until that attempt finalizes;
- a finalized repaired pass counts as one completed session item;
- an attempt id must never count twice;
- Explore activity never counts;
- merely entering/leaving Practice never counts;
- session completion itself never modifies mastery, SRS, skill stats, or unlocks.

Session state is **motivational UI state, not mastery state**.

Do not bump the v6 progress schema solely to store a decorative session counter. It is acceptable to keep a lightweight practice-session state in app/session state. It should survive normal in-app mode changes during the current page lifecycle. Persistence across a full browser restart is optional for this pass.

If you choose to persist it, keep it clearly separate from mastery evidence and do not contaminate progress export/import semantics accidentally.

### Session completion

After the fifth finalized attempt, show a clear session-complete state before silently rolling into an endless sixth item.

The learner must be able to:

- finish/leave the session;
- choose **Keep practising** (or locale-appropriate equivalent), which starts a new `0 / 5` session.

The summary should be based on facts from this session. Always include the number completed. Include meaningful transitions that actually occurred (see next section). If no major transition occurred, it is enough to list the capabilities practised; do not invent “strength gained” claims.

---

## Progress moments: detect real before/after transitions

When a checked practice answer causes an attempt to finalize, compare relevant progress state **before and after** finalization.

A good location for this boundary is around `commitCheckedPracticeState()` in `src/main.ts`, because it currently has access to both the pre-finalization `progress` value and the result of `recordCheckedPracticeState()`.

Create pure transition detection rather than scattering conditional UI logic through event handlers.

Suggested shape:

```ts
type ProgressMoment =
  | { kind: 'capability-reliable'; skillId: SkillId }
  | { kind: 'capability-first-pass'; skillId: SkillId }
  | { kind: 'exercise-unlocked'; exerciseId: string }
  | { kind: 'capability-unlocked'; skillId: SkillId }
  | { kind: 'scaffold-advanced'; exerciseId: string; from: number; to: number };
```

Exact type design is up to you; preserve the semantics.

Priority order for presentation:

1. capability became **Reliable**;
2. a genuinely new capability became available;
3. next exercise/challenge unlocked;
4. scaffold level advanced / assistance reduced;
5. first demonstrated pass in a capability.

Do not show a transition if the underlying state did not change.

Do not show the same transition repeatedly after rerender/resume.

### Suggested copy tone

Examples only; author EN/FR independently:

```text
Formula evaluation is now reliable.
Counterexamples are now available.
Less support next time — you’ll supply an intermediate value yourself.
```

Avoid:

```text
Amazing!!! +100 XP
You're a Logic Master!
```

Progress moments should complement existing diagnostic exercise feedback, not replace it.

---

## Scaffold withdrawal is progress

This is important and should not be dropped as “nice to have.”

`storage.ts` already advances `exerciseStats[exerciseId].scaffoldLevel` after a clean pass for exercises configured by `evaluation-scaffold.ts`.

At present this is nearly invisible.

When a finalized clean attempt causes scaffold level to increase, surface a progress moment explaining that **the next encounter will ask the learner to carry more of the intermediate reasoning**.

Do not call this “support reduced” unless the configured next level really does require more learner input. Inspect `evaluation-scaffold.ts` and the evaluation rendering semantics rather than assuming level numbers have a generic meaning.

This transition is particularly aligned with the product identity and should feel positive but restrained.

---

## Progress view: capability-first summary

Do not delete the existing detailed Progress functionality. The detailed lesson/exercise lists, concept map, struggles, comfortable skills, errors, import/export, and What next? remain useful.

Add a concise capability-oriented summary near the top.

Desired groups:

### You can now

Reliable capabilities.

### In progress

Developing capabilities.

### Up next

Prefer the next Ready capability if one exists; otherwise use the next meaningful curriculum/practice step already available from existing unlock/What next logic.

If a group is empty, provide calm useful empty-state copy rather than hiding the entire model.

The purpose is to make long-term progress legible as **abilities acquired**, not only counts of lessons/exercises.

---

## Compact concept/orientation context

Do **not** render the full concept map in Learn or Practice.

The full map remains in Progress.

The ambient Learn/Practice treatment should provide enough context to know where the current activity sits: unit + lesson or capability + state + session position. If a compact nearby-concept treatment falls naturally out of the implementation, that is acceptable, but do not make a miniature dashboard that crowds the exercise.

---

## i18n requirements

All new user-facing copy must ship in both English and French in the same change.

Follow the existing rule that EN and FR are independently authored academic/product copy, not literal mirror translations.

At minimum add locale-aware strings for:

- capability names if existing skill labels are not sufficient;
- `Ready`, `Developing`, `Reliable`;
- Learn progress labels;
- Practice session progress;
- session-complete heading/actions/summary vocabulary;
- each progress-moment kind;
- capability-summary headings (`You can now`, `In progress`, `Up next`) and empty states;
- accessibility labels for meters/statuses.

Preserve i18n parity tests.

---

## Accessibility / motion requirements

- No colour-only progress meaning.
- Progress meters need accessible text/labels.
- Any status chip must have readable text.
- Keyboard interaction must remain unchanged for exercises.
- Progress announcements after finalization should be accessible; use an appropriate live-region/status treatment without causing noisy repeated announcements.
- If you add animation, respect `prefers-reduced-motion` and make the state understandable with animation disabled.
- Preserve ~320px mobile usability and no horizontal panning.

---

## Architecture guidance

Prefer pure derivation and small view-models over making renderers understand storage internals.

A reasonable decomposition is:

```text
progress-visibility.ts
  deriveCapabilityStates(...)
  deriveCapabilityState(...)
  snapshotProgressVisibility(...)
  diffProgressVisibility(before, after, exerciseId)

practice-session.ts
  createPracticeSession(target = 5)
  recordFinalizedAttempt(session, attemptId, skillId, moments)
  isPracticeSessionComplete(session)
```

Names and exact structure are flexible.

Try to keep:

- mastery state in `storage.ts`;
- session/motivational state separate;
- transition logic pure/testable;
- rendering functions given small explicit context objects;
- `src/main.ts` responsible for orchestration rather than detailed progress rules.

Do not duplicate unlock logic. Reuse `getUnlockedExerciseIds()` / existing curriculum functions.

Do not duplicate skill classification logic in multiple renderers.

---

## State-transition edge cases

Handle these deliberately:

1. **Wrong → repair → correct**
   - one finalized session item;
   - `Developing` may remain Developing;
   - do not report a clean-skill improvement that did not happen.

2. **Finalized exercise rerender / resume**
   - do not increment session twice;
   - do not redisplay a supposedly new unlock as if it just happened again.

3. **Reliable threshold crossing**
   - show only when state changes from non-Reliable to Reliable;
   - if already Reliable, another clean pass is routine progress, not a new reliability event.

4. **Unlocking another exercise in the same capability**
   - this can be an “exercise unlocked” moment;
   - do not call the entire capability newly unlocked if it was already Ready/Developing/Reliable.

5. **Unlocking the first exercise for a skill**
   - this may be a “capability available” moment.

6. **Scaffold level unchanged at maximum**
   - no scaffold progress moment.

7. **Explore**
   - never starts/increments Practice session progress and never affects capability state.

8. **Imported progress**
   - capability state should derive correctly from imported v6 stats;
   - a stale ephemeral session should not create false “new” transitions after import.

9. **Locale switch**
   - current session/progress state survives; only presentation copy changes.

---

## Tests

### Unit tests

Add focused tests for at least:

- `locked → ready` capability derivation;
- `ready → developing` after first finalized attempt;
- reliable threshold: attempts >= 3 and clean-pass rate >= 0.8;
- repaired passes do not count as clean successes;
- reliability transition fires once at crossing;
- new exercise unlock diff;
- new capability unlock diff;
- scaffold advancement diff;
- no scaffold moment at max level;
- session increments once per finalized attempt id;
- wrong intermediate checks do not increment session;
- repaired finalization increments session once;
- session completes at 5;
- EN/FR string parity.

### Browser / Playwright tests

Cover the highest-risk flows:

1. Learn shows current unit/lesson progress and advances after lesson completion.
2. Practice shows capability state and session `0 / 5` (or equivalent initial state).
3. Finalizing one clean exercise advances session to `1 / 5`.
4. Wrong → repair → correct advances session only once.
5. Seed/drive a reliability threshold crossing and verify the progress moment.
6. Seed/drive a scaffold-level advancement and verify the “less support next time” moment.
7. Complete five finalized exercises and verify the session-complete state and Keep practising reset.
8. Progress view renders capability-first summary.
9. High-risk mobile coverage at ~320px/390px has no horizontal overflow.

Do not make tests depend on animation timing.

---

## Visual expectations

Use the existing design system and CSS rather than introducing a component library.

The visual hierarchy should be restrained:

- a thin/compact progress meter;
- small capability/status labels or chips;
- one progress-moment panel when something genuinely changes;
- a clearly bounded session-complete card/state;
- capability summary cards/list near the top of Progress.

The learner should notice progress without progress UI becoming the main activity.

---

## Non-goals

Do **not** include any of the following in this implementation:

- XP or points;
- arbitrary global levels;
- leaderboards;
- achievements/badges;
- streak pressure mechanics;
- social comparison;
- cloud sync/accounts;
- native app work;
- natural-deduction expansion;
- predicate-logic curriculum;
- framework rewrite;
- curriculum expansion merely to create more milestones.

---

## Documentation / changelog

As part of the implementation:

- keep `docs/progress-visibility.md` accurate if implementation details legitimately evolve;
- update `docs/content-model.md` if new durable types/state become part of the architecture;
- update `CHANGELOG.md` under `[Unreleased]` for the user-visible change;
- do not bump the package/release version unless the repository’s release workflow explicitly requires it for the implementation PR.

---

## Acceptance criteria

This work is complete when all of the following are true:

- [ ] Learn always gives compact, truthful unit/lesson progress context.
- [ ] Practice always gives compact capability state and session progress.
- [ ] A practice session has a real `5 finalized attempts` completion boundary.
- [ ] Session counting is exactly-once per finalized attempt and does not alter mastery state.
- [ ] Capability state is derived from existing graded evidence with the specified thresholds.
- [ ] Repaired passes cannot inflate a capability into Reliable incorrectly.
- [ ] Meaningful finalization transitions (reliability, unlock, scaffold withdrawal) are surfaced once and only when they truly occur.
- [ ] Scaffold advancement is visibly framed as the learner carrying more reasoning next time.
- [ ] Progress has a capability-first `You can now / In progress / Up next` summary while retaining detailed diagnostics.
- [ ] Explore remains completely outside mastery/session evidence.
- [ ] EN/FR copy is complete and parity-tested.
- [ ] Accessibility and reduced-motion behavior are sound.
- [ ] ~320px mobile remains usable without horizontal panning.
- [ ] Unit tests, build, and Playwright suite pass.

The final result should make a learner feel that Externalize is moving with them **because their demonstrated capability changed**, not because the interface awarded them a number.
