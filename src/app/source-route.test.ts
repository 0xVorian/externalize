import { describe, expect, it } from 'vitest';
import { evidenceKey } from './curriculum';
import {
  planPrerequisites,
  plannedItemIds,
  planRequirement,
} from './planner';
import {
  completeSourceItem,
  currentSourceItemId,
  plannedSourceItems,
  routeDepth,
  setActiveRoute,
  setRouteDepth,
} from './source-route';
import {
  completeLesson,
  importProgress,
  loadProgress,
  beginPracticeAttempt,
  clearPracticeDraft,
  recordCheckedPracticeState,
} from './storage';
import { LEVEL_0_LESSONS, LEVEL_1_LESSONS } from './lessons';
import { LOGIC_AND_THEISM_READING_ROUTE_ID, LOGIC_FOUNDATIONS_ROUTE_ID } from './routes';
import { recordAttemptCheck } from './practice-attempt';
import { SOURCE_LESSONS } from './source-lessons';
import { getLessonCopy, getExerciseCopy, learnUi } from '../i18n';
import { EXERCISE_DEFINITIONS } from './exercises';
import { SOURCE_EXERCISE_IDS } from './source-route';
import { createState, selectClassificationChoice, checkClassification, tryAgainPractice } from './state';
import { getExerciseDefinition } from './exercises';

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
      'lat-quantifier-universal',
      'lat-check-universal',
      'lat-quantifier-existential',
      'lat-check-existential',
    ]);
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
    expect(items).not.toContain('lat-retrieve-conditional');
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
    expect(learnUi('fr').beforeYouContinue).toBeTruthy();
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
});
