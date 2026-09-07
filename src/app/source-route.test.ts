import { describe, expect, it } from 'vitest';
import { evidenceKey } from './curriculum';
import {
  missingPrerequisiteBridges,
  planPrerequisites,
  plannedItemIds,
  planRequirement,
  PREREQUISITE_BRIDGES,
} from './planner';
import { evidenceForExercise } from './evidence';
import {
  completeSourceItem,
  currentSourceItemId,
  isPlannedSourceSequenceComplete,
  nextSourceItemId,
  plannedSourceItems,
  routeDepth,
  setActiveRoute,
  setRouteDepth,
  sourceRouteCompletedAt,
  SOURCE_EXERCISE_IDS,
} from './source-route';
import { getRoute, LOGIC_AND_THEISM_READING_ROUTE_ID, LOGIC_FOUNDATIONS_ROUTE_ID } from './routes';
import { TRACKED_SKILL_IDS, buildProgressSummary } from './progress-tracker';
import { snapshotProgressVisibility } from './progress-visibility';
import { SOURCE_LESSONS as SOURCE_LESSON_COPY, SOURCE_EXERCISES } from '../i18n/source';
import { getLessonCopy, getExerciseCopy, learnUi, progressUi } from '../i18n';
import {
  completeLesson,
  importProgress,
  loadProgress,
  beginPracticeAttempt,
  clearPracticeDraft,
  persistPracticeDraft,
  recordCheckedPracticeState,
} from './storage';
import { createState, selectClassificationChoice, checkClassification, tryAgainPractice, practiceDraftSnapshot } from './state';
import { LEVEL_0_LESSONS, LEVEL_1_LESSONS } from './lessons';
import { recordAttemptCheck } from './practice-attempt';
import { SOURCE_LESSONS } from './source-lessons';
import { EXERCISE_DEFINITIONS, getExerciseDefinition } from './exercises';

function completeLevel0() {
  let store = loadProgress();
  for (const lesson of LEVEL_0_LESSONS) {
    store = completeLesson(store, lesson.id);
  }
  return store;
}

function seedConditionalApply(store: ReturnType<typeof loadProgress>, options?: { attempts?: number; cleanPasses?: number }) {
  const attempts = options?.attempts ?? 4;
  const cleanPasses = options?.cleanPasses ?? 4;
  return {
    ...store,
    conceptEvidence: {
      ...store.conceptEvidence,
      [evidenceKey('conditional', 'apply')]: {
        attempts,
        cleanPasses,
        transferPasses: 0,
        recentErrors: [],
        lastSeenAt: new Date().toISOString(),
      },
    },
  };
}

function passChoice(store: ReturnType<typeof loadProgress>, exerciseId: string) {
  let next = beginPracticeAttempt(clearPracticeDraft(store), exerciseId);
  const exercise = getExerciseDefinition(exerciseId)!;
  let state = createState('en', exercise, next.practiceDraft);
  state = selectClassificationChoice(state, exercise.correctChoiceId!);
  state = checkClassification(state);
  return recordCheckedPracticeState(next, {
    ...next.practiceDraft!,
    phase: 'answered',
    selectedChoiceId: exercise.correctChoiceId,
    feedbackTag: 'correct',
    attempt: recordAttemptCheck(next.practiceDraft!.attempt, true),
  });
}

describe('prerequisite planner', () => {
  it('skips a consistent requirement', () => {
    const plan = planRequirement(
      {
        [evidenceKey('conditional', 'apply')]: {
          attempts: 4,
          cleanPasses: 4,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: new Date().toISOString(),
        },
      },
      { concept: 'conditional', capability: 'apply' },
    );
    expect(plan).toEqual({ kind: 'skip', requirement: { concept: 'conditional', capability: 'apply' } });
  });

  it('retrieves when evidence is present but weak', () => {
    const plan = planRequirement(
      {
        [evidenceKey('conditional', 'apply')]: {
          attempts: 1,
          cleanPasses: 0,
          transferPasses: 0,
          recentErrors: ['incorrect-evaluation'],
        },
      },
      { concept: 'conditional', capability: 'apply' },
    );
    expect(plan.kind).toBe('retrieve');
    if (plan.kind === 'retrieve') {
      expect(plan.itemId).toBe('lat-retrieve-conditional');
    }
  });

  it('teaches unseen quantifier recognition', () => {
    const plan = planPrerequisites({}, [
      { concept: 'universal-quantifier', capability: 'recognize' },
      { concept: 'existential-quantifier', capability: 'recognize' },
    ]);
    expect(plan.every((item) => item.kind === 'teach')).toBe(true);
    expect(plannedItemIds(plan)).toEqual([
      'lat-universal-meaning',
      'lat-quantifier-universal',
      'lat-check-universal',
      'lat-existential-meaning',
      'lat-name-existential',
      'lat-quantifier-existential',
      'lat-existential-conjunction',
      'lat-check-existential',
    ]);
  });

  it('does not skip an unmet requirement that has no authored bridge', () => {
    const plan = planRequirement({}, { concept: 'typo-quantifier', capability: 'recognize' });
    expect(plan).toEqual({
      kind: 'unsupported',
      requirement: { concept: 'typo-quantifier', capability: 'recognize' },
      reason: 'missing-bridge',
    });
    expect(plannedItemIds([plan])).toEqual([]);
  });

  it('retrieves when evidence is consistent but lastSeenAt is missing', () => {
    const plan = planRequirement(
      {
        [evidenceKey('conditional', 'apply')]: {
          attempts: 4,
          cleanPasses: 4,
          transferPasses: 0,
          recentErrors: [],
        },
      },
      { concept: 'conditional', capability: 'apply' },
    );
    expect(plan.kind).toBe('retrieve');
  });

  it('retrieves when lastSeenAt is present but unparseable', () => {
    const plan = planRequirement(
      {
        [evidenceKey('conditional', 'apply')]: {
          attempts: 4,
          cleanPasses: 4,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: 'not-a-date',
        },
      },
      { concept: 'conditional', capability: 'apply' },
    );
    expect(plan.kind).toBe('retrieve');
  });

  it('still skips consistent evidence with a fresh lastSeenAt', () => {
    const plan = planRequirement(
      {
        [evidenceKey('conditional', 'apply')]: {
          attempts: 4,
          cleanPasses: 4,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: new Date().toISOString(),
        },
      },
      { concept: 'conditional', capability: 'apply' },
    );
    expect(plan.kind).toBe('skip');
  });

  it('requires an authored bridge for every planner-managed source requirement', () => {
    const route = getRoute(LOGIC_AND_THEISM_READING_ROUTE_ID)!;
    const reading = route.steps.find((step) => step.depth === 'reading') ?? route.steps[0]!;
    expect(missingPrerequisiteBridges(reading.requires ?? [])).toEqual([]);
  });

  it('teaches the conditional with meaning, notation, and a genuine application check', () => {
    const plan = planRequirement({}, { concept: 'conditional', capability: 'apply' });
    expect(plan.kind).toBe('teach');
    if (plan.kind === 'teach') {
      expect(plan.itemIds).toEqual(PREREQUISITE_BRIDGES['conditional:apply'].teach);
    }
    expect(PREREQUISITE_BRIDGES['conditional:apply'].retrieve).toBe('lat-retrieve-conditional');
    expect(PREREQUISITE_BRIDGES['conditional:apply'].teach).toEqual([
      'lat-conditional-bridge',
      'lat-predict-empty-club',
      'lat-empty-no-counterexample',
      'lat-name-vacuity',
      'lat-conditional-meaning',
      'lat-conditional-notation',
      'lat-retrieve-conditional',
    ]);
  });

  it('retrieves stale conditional evidence rather than reteaching', () => {
    const stale = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString();
    const plan = planRequirement(
      {
        [evidenceKey('conditional', 'apply')]: {
          attempts: 4,
          cleanPasses: 4,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: stale,
        },
      },
      { concept: 'conditional', capability: 'apply' },
    );
    expect(plan.kind).toBe('retrieve');
    if (plan.kind === 'retrieve') {
      expect(plan.itemId).toBe('lat-retrieve-conditional');
    }
  });
});

describe('source isolation and portable mastery', () => {
  it('does not duplicate concept ids when the source route is used', () => {
    const store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    expect(store.activeRouteId).toBe(LOGIC_AND_THEISM_READING_ROUTE_ID);
    expect(store.routes[LOGIC_AND_THEISM_READING_ROUTE_ID]).toBeTruthy();
    expect(Object.keys(store.conceptEvidence)).toEqual([]);
  });

  it('suppresses the conditional bridge when logic-foundations evidence is strong', () => {
    const store = seedConditionalApply(completeLevel0());
    const items = plannedSourceItems(store);
    expect(items).not.toContain('lat-conditional-bridge');
    expect(items).not.toContain('lat-predict-empty-club');
    expect(items).not.toContain('lat-retrieve-conditional');
    expect(items).not.toContain('lat-conditional-meaning');
    expect(items).not.toContain('lat-conditional-notation');
    expect(items).toContain('lat-quantifier-universal');
  });

  it('does not treat the source context card as mastery evidence', () => {
    let store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    expect(currentSourceItemId(store)).toBe('lat-conditional-bridge');
    store = completeSourceItem(store, 'lat-ii-26-context');
    expect(store.conceptEvidence).toEqual({});
    expect(store.passed).toEqual([]);
  });

  it('records transfer evidence on the same existential-import concept', () => {
    let store = setActiveRoute(completeLevel0(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    store = passChoice(store, 'lat-transfer-kind');
    const key = evidenceKey('existential-import', 'transfer');
    expect(store.conceptEvidence[key]?.cleanPasses).toBe(1);
    expect(store.conceptEvidence[key]?.transferPasses).toBe(1);
    expect(store.passed).toContain('lat-transfer-kind');
  });

  it('keeps Reading without the mastery empty-domain item', () => {
    const store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    expect(routeDepth(store)).toBe('reading');
    expect(plannedSourceItems(store)).not.toContain('lat-mastery-empty-domain');
    const mastery = setRouteDepth(store, 'mastery');
    expect(plannedSourceItems(mastery)).toContain('lat-mastery-empty-domain');
  });

  it('leaves logic-foundations unlocks unchanged for a fresh learner', () => {
    const store = loadProgress();
    expect(store.activeRouteId).toBe(LOGIC_FOUNDATIONS_ROUTE_ID);
    expect(store.passed).toEqual([]);
  });
});

describe('Sobel prediction, conditional teaching, and evidence integrity', () => {
  it('places a checked prediction between empty-club setup and the counterexample explanation', () => {
    const store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    const items = plannedSourceItems(store);
    const setup = items.indexOf('lat-conditional-bridge');
    const predict = items.indexOf('lat-predict-empty-club');
    const explain = items.indexOf('lat-empty-no-counterexample');
    const name = items.indexOf('lat-name-vacuity');
    expect(setup).toBeGreaterThanOrEqual(0);
    expect(predict).toBe(setup + 1);
    expect(explain).toBe(predict + 1);
    expect(name).toBe(explain + 1);
  });

  it('teaches ordinary if–then, then →, then a checked application, then ∀x (F(x) → G(x))', () => {
    const store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    const items = plannedSourceItems(store);
    const meaning = items.indexOf('lat-conditional-meaning');
    const notation = items.indexOf('lat-conditional-notation');
    const check = items.indexOf('lat-retrieve-conditional');
    const universalMeaning = items.indexOf('lat-universal-meaning');
    const forall = items.indexOf('lat-quantifier-universal');
    expect(meaning).toBeGreaterThan(items.indexOf('lat-name-vacuity'));
    expect(notation).toBe(meaning + 1);
    expect(check).toBe(notation + 1);
    expect(universalMeaning).toBe(check + 1);
    expect(forall).toBe(universalMeaning + 1);
    expect(getExerciseDefinition('lat-retrieve-conditional')?.formula).toBe('F(a) → G(a)');
    expect(getLessonCopy('en', 'lat-conditional-meaning').card!.body.join(' ')).not.toContain('→');
    expect(getLessonCopy('en', 'lat-conditional-notation').card!.example).toBe('F(x) → G(x)');
    expect(getLessonCopy('en', 'lat-universal-meaning').card!.body.join(' ')).not.toContain('∀');
    expect(getLessonCopy('en', 'lat-quantifier-universal').card!.example).toBe('∀x (F(x) → G(x))');
  });

  it('does not grant conditional × apply from the empty-club prediction', () => {
    const predictTags = evidenceForExercise('lat-predict-empty-club');
    expect(predictTags.some((tag) => tag.concept === 'conditional')).toBe(false);
    expect(predictTags).toEqual([
      { concept: 'existential-import', capability: 'recognize', role: 'primary' },
    ]);
    expect(evidenceForExercise('lat-retrieve-conditional')).toEqual([
      { concept: 'conditional', capability: 'apply', role: 'primary' },
    ]);

    let store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    store = passChoice(store, 'lat-predict-empty-club');
    expect(store.conceptEvidence[evidenceKey('conditional', 'apply')]).toBeUndefined();
    expect(store.conceptEvidence[evidenceKey('existential-import', 'recognize')]?.cleanPasses).toBe(1);
  });

  it('records conditional × apply only from the genuine application check', () => {
    let store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    store = passChoice(store, 'lat-retrieve-conditional');
    const key = evidenceKey('conditional', 'apply');
    expect(store.conceptEvidence[key]?.cleanPasses).toBe(1);
    expect(store.passed).toContain('lat-retrieve-conditional');
  });

  it('repairs a wrong empty-club prediction in place before the explanation', () => {
    let store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    expect(currentSourceItemId(store)).toBe('lat-conditional-bridge');
    store = completeSourceItem(store, 'lat-conditional-bridge');
    expect(currentSourceItemId(store)).toBe('lat-predict-empty-club');

    store = beginPracticeAttempt(clearPracticeDraft(store), 'lat-predict-empty-club');
    const exercise = getExerciseDefinition('lat-predict-empty-club')!;
    let state = createState('en', exercise, store.practiceDraft);
    state = selectClassificationChoice(state, 'needs-instance');
    state = checkClassification(state);
    store = recordCheckedPracticeState(store, practiceDraftSnapshot(state));
    expect(state.feedback?.correct).toBe(false);
    expect(store.practiceDraft?.attempt.status).toBe('active');
    expect(currentSourceItemId(store)).toBe('lat-predict-empty-club');

    state = tryAgainPractice(state);
    expect(state.phase).toBe('ready');
    state = selectClassificationChoice(state, 'still-true');
    state = checkClassification(state);
    store = recordCheckedPracticeState(store, practiceDraftSnapshot(state));
    expect(state.feedback?.correct).toBe(true);
    expect(store.practiceDraft?.attempt.status).toBe('finalized');
    expect(store.conceptEvidence[evidenceKey('conditional', 'apply')]).toBeUndefined();
    expect(currentSourceItemId(store)).toBe('lat-predict-empty-club');
  });
});

describe('source EN/FR copy', () => {
  it('authors source lessons independently in both locales', () => {
    for (const lesson of SOURCE_LESSONS) {
      const en = getLessonCopy('en', lesson.id);
      const fr = getLessonCopy('fr', lesson.id);
      expect(en.card?.body[0]).toBeTruthy();
      expect(fr.card?.body[0]).toBeTruthy();
      expect(en.card?.body[0]).not.toBe(fr.card?.body[0]);
    }
  });

  it('authors source exercises independently in both locales', () => {
    for (const id of SOURCE_EXERCISE_IDS) {
      const en = getExerciseCopy('en', id);
      const fr = getExerciseCopy('fr', id);
      expect(en.prompt).toBeTruthy();
      expect(fr.prompt).toBeTruthy();
      expect(en.prompt).not.toBe(fr.prompt);
      expect(Object.keys(en.choices ?? {}).sort()).toEqual(Object.keys(fr.choices ?? {}).sort());
    }
  });

  it('keeps route labels in both locales', () => {
    expect(learnUi('en').routeFoundations).not.toBe(learnUi('fr').routeFoundations);
    expect(learnUi('en').routeSobel).toBeTruthy();
    expect(learnUi('fr').routeSobel).toBeTruthy();
  });
});

describe('source v6 isolation', () => {
  it('does not invent source route state from a v6 foundations export', () => {
    const { progress } = importProgress(
      JSON.stringify({
        version: 6,
        lessonsCompleted: LEVEL_1_LESSONS.slice(0, 1).map((lesson) => lesson.id),
        level0Complete: false,
        level1Complete: false,
        level2Complete: false,
        queue: [],
        attempted: [],
        passed: [],
        practiceDrafts: {},
        resume: { mode: 'learn', lessonId: 'level0-01-letters', updatedAt: new Date().toISOString() },
        skills: {},
        exerciseStats: {},
        errorCounts: {},
        lastVisitedAt: new Date().toISOString(),
        onboardingComplete: true,
      }),
    );
    expect(progress.activeRouteId).toBe(LOGIC_FOUNDATIONS_ROUTE_ID);
    expect(progress.routes[LOGIC_AND_THEISM_READING_ROUTE_ID]).toBeUndefined();
  });
});

describe('source-route completion', () => {
  it('persists completed state on the final reading item and does not restart at item 1', () => {
    let store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    const items = plannedSourceItems(store);
    expect(items[0]).not.toBe('lat-ii-26-return');
    for (const itemId of items) {
      store = completeSourceItem(store, itemId);
    }
    expect(isPlannedSourceSequenceComplete(store)).toBe(true);
    expect(sourceRouteCompletedAt(store)).toBeTruthy();
    expect(currentSourceItemId(store)).toBe('lat-ii-26-return');
    expect(nextSourceItemId(store, 'lat-ii-26-return')).toBeUndefined();

    store = setActiveRoute(store, LOGIC_FOUNDATIONS_ROUTE_ID);
    store = setActiveRoute(store, LOGIC_AND_THEISM_READING_ROUTE_ID);
    expect(currentSourceItemId(store)).toBe('lat-ii-26-return');
    expect(isPlannedSourceSequenceComplete(store)).toBe(true);
  });

  it('keeps Mastery work reachable after reading completion', () => {
    let store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    for (const itemId of plannedSourceItems(store)) {
      store = completeSourceItem(store, itemId);
    }
    const mastery = setRouteDepth(store, 'mastery');
    expect(plannedSourceItems(mastery)).toContain('lat-mastery-empty-domain');
    expect(currentSourceItemId(mastery)).toBe('lat-mastery-empty-domain');
    expect(isPlannedSourceSequenceComplete(mastery)).toBe(false);
    expect(sourceRouteCompletedAt(mastery)).toBeTruthy();
  });

  it('keeps a finalized source exercise current until Next', () => {
    let store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    store = seedConditionalApply(store);
    store = {
      ...store,
      conceptEvidence: {
        ...store.conceptEvidence,
        [evidenceKey('universal-quantifier', 'recognize')]: {
          attempts: 1,
          cleanPasses: 0,
          transferPasses: 0,
          recentErrors: ['incorrect-evaluation'],
        },
      },
    };
    expect(currentSourceItemId(store)).toBe('lat-check-universal');
    store = passChoice(store, 'lat-check-universal');
    expect(currentSourceItemId(store)).toBe('lat-check-universal');
    expect(store.routes[LOGIC_AND_THEISM_READING_ROUTE_ID]?.seenItems ?? []).not.toContain(
      'lat-check-universal',
    );
    store = completeSourceItem(store, 'lat-check-universal');
    expect(currentSourceItemId(store)).not.toBe('lat-check-universal');
  });

  it('advances after Next even if the planner then skips the retrieve', () => {
    const stale = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString();
    let store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    store = {
      ...store,
      conceptEvidence: {
        ...store.conceptEvidence,
        [evidenceKey('conditional', 'apply')]: {
          attempts: 4,
          cleanPasses: 4,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: new Date().toISOString(),
        },
        [evidenceKey('universal-quantifier', 'recognize')]: {
          attempts: 3,
          cleanPasses: 3,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: stale,
        },
      },
    };
    expect(currentSourceItemId(store)).toBe('lat-check-universal');
    store = passChoice(store, 'lat-check-universal');
    expect(currentSourceItemId(store)).toBe('lat-check-universal');
    store = completeSourceItem(store, 'lat-check-universal');
    expect(currentSourceItemId(store)).not.toBe('lat-check-universal');
    expect(plannedSourceItems(store)).not.toContain('lat-check-universal');
  });
});

describe('source EN/FR pedagogical copy', () => {
  it('attributes existential commitment to ∃ on the conjunction card, not on the ∃ intro', () => {
    const introEn = getLessonCopy('en', 'lat-quantifier-existential').card!.body.join(' ');
    const introFr = getLessonCopy('fr', 'lat-quantifier-existential').card!.body.join(' ');
    expect(introEn).not.toMatch(/witness|existential commitment/i);
    expect(introFr).not.toMatch(/témoin|engagement existentiel/i);
    const en = getLessonCopy('en', 'lat-existential-conjunction').card!.body.join(' ');
    const fr = getLessonCopy('fr', 'lat-existential-conjunction').card!.body.join(' ');
    expect(en).toMatch(/existential commitment is in ∃/i);
    expect(en).not.toMatch(/Conjunction, not implication, carries the existential commitment/i);
    expect(fr).toMatch(/engagement existentiel vient de ∃/i);
    expect(fr).not.toMatch(/conjonction, non l’implication, qui porte l’engagement existentiel/i);
  });

  it('uses idiomatic French for vacuous truth and avoids English leakage', () => {
    const frLessons = JSON.stringify(SOURCE_LESSON_COPY.fr);
    expect(frLessons).toMatch(/cas de vérité par vacuité/);
    expect(frLessons).not.toMatch(/vacuous/i);
    expect(frLessons).not.toMatch(/assertion couvrante/i);
    expect(frLessons).not.toMatch(/Quelque membre a signé/);
    expect(frLessons).not.toMatch(/\bwitness\b/i);
    expect(frLessons).not.toMatch(/if–then/i);
    for (const copy of Object.values(SOURCE_EXERCISES.fr)) {
      const visible = [
        copy.prompt,
        copy.choiceWrong,
        copy.feedback?.correct,
        ...Object.values(copy.choices ?? {}),
      ].join(' ');
      expect(visible).not.toMatch(/vacuous/i);
    }
  });
});

describe('classify-choice Progress visibility', () => {
  it('keeps classify-choice off the Progress capability surface', () => {
    expect(TRACKED_SKILL_IDS).not.toContain('practice:classify-choice');
    const store = {
      ...loadProgress(),
      skills: {
        'practice:classify-choice': { attempts: 4, successes: 1, recentErrorTags: [] },
      },
    };
    const snapshot = snapshotProgressVisibility(store);
    expect(snapshot.capabilities['practice:classify-choice']).toBeUndefined();
    const summary = buildProgressSummary({
      level0Done: 0,
      level0Total: 1,
      level1Done: 0,
      level1Total: 1,
      level2Done: 0,
      level2Total: 1,
      lessonsCompleted: [],
      exercisesUnlocked: [],
      exercisesCompleted: [],
      reviewDue: 0,
      resume: null,
      skills: store.skills,
      errorCounts: {},
    });
    expect(summary.struggles.map((entry) => entry.id)).not.toContain('practice:classify-choice');
    expect(progressUi('en').skillLabel('practice:classify-choice')).not.toBe(
      'practice:classify-choice',
    );
    expect(progressUi('fr').skillLabel('practice:classify-choice')).not.toBe(
      'practice:classify-choice',
    );
  });
});

describe('classify-choice interaction', () => {
  it('finalizes only after the checked correct choice', () => {
    const exercise = EXERCISE_DEFINITIONS.find((item) => item.id === 'lat-classify-triangle')!;
    let state = createState('en', exercise);
    state = checkClassification(state);
    expect(state.attempt.status).toBe('active');
    state = selectClassificationChoice(state, 'existential');
    state = checkClassification(state);
    expect(state.feedback?.correct).toBe(false);
    expect(state.attempt.status).toBe('active');
    state = tryAgainPractice(state);
    expect(state.phase).toBe('ready');
    expect(state.selectedChoiceId).toBeNull();
  });

  it('repairs a persisted wrong classify-choice check in place', () => {
    let store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    store = beginPracticeAttempt(clearPracticeDraft(store), 'lat-check-universal');
    const exercise = getExerciseDefinition('lat-check-universal')!;
    let state = createState('en', exercise, store.practiceDraft);
    state = selectClassificationChoice(state, 'existential');
    store = persistPracticeDraft(store, practiceDraftSnapshot(state));
    state = checkClassification(state);
    store = recordCheckedPracticeState(store, practiceDraftSnapshot(state));
    if (store.practiceDraft) {
      state = { ...state, attempt: store.practiceDraft.attempt };
    }
    expect(state.feedback?.correct).toBe(false);
    expect(state.attempt.status).toBe('active');
    state = tryAgainPractice(state);
    expect(state.phase).toBe('ready');
    expect(state.selectedChoiceId).toBeNull();
  });
});
