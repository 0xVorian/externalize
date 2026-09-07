import { describe, expect, it } from 'vitest';
import { EXERCISE_DEFINITIONS } from './exercises';
import {
  ALL_LEARN_LESSONS,
  LEVEL_0_LESSONS,
  LEVEL_0_PRACTICE_UNLOCK_ORDER,
  LEVEL_1_LESSONS,
  LEVEL_1_PRACTICE_UNLOCK_ORDER,
  LEVEL_2_PRACTICE_UNLOCK_ORDER,
  firstIncompleteLesson,
  PRACTICE_UNLOCK_ORDER,
} from './lessons';
import {
  completeLesson,
  getUnlockedExerciseIds,
  importProgress,
  loadProgress,
  selectNextExerciseId,
} from './storage';
import {
  LOGIC_FOUNDATIONS_ROUTE_ID,
  logicFoundationsLessonOrder,
  logicFoundationsPracticeOrder,
  routeLessonIds,
  routePracticeIds,
  requireRoute,
} from './routes';
import { flattenUnit1Clusters } from './practice-clusters';
import { evidenceForExercise } from './evidence';
import { isCanonicalConcept } from './concepts';
import { CAPABILITIES } from './curriculum';

function completeIds(ids: readonly string[]) {
  let store = loadProgress();
  for (const id of ids) {
    store = completeLesson(store, id);
  }
  return store;
}

describe('logic-foundations route parity', () => {
  it('encodes the current lesson order', () => {
    expect(routeLessonIds(LOGIC_FOUNDATIONS_ROUTE_ID)).toEqual(
      ALL_LEARN_LESSONS.map((lesson) => lesson.id),
    );
    expect(logicFoundationsLessonOrder()).toEqual(routeLessonIds(LOGIC_FOUNDATIONS_ROUTE_ID));
  });

  it('encodes the current practice unlock order', () => {
    expect(routePracticeIds(LOGIC_FOUNDATIONS_ROUTE_ID)).toEqual([...PRACTICE_UNLOCK_ORDER]);
    expect(logicFoundationsPracticeOrder()).toEqual([...PRACTICE_UNLOCK_ORDER]);
    expect(routePracticeIds(LOGIC_FOUNDATIONS_ROUTE_ID).slice(0, 4)).toEqual([
      ...LEVEL_0_PRACTICE_UNLOCK_ORDER,
    ]);
    expect(
      routePracticeIds(LOGIC_FOUNDATIONS_ROUTE_ID).slice(
        LEVEL_0_PRACTICE_UNLOCK_ORDER.length,
        LEVEL_0_PRACTICE_UNLOCK_ORDER.length + LEVEL_1_PRACTICE_UNLOCK_ORDER.length,
      ),
    ).toEqual(flattenUnit1Clusters());
    expect(routePracticeIds(LOGIC_FOUNDATIONS_ROUTE_ID).slice(-LEVEL_2_PRACTICE_UNLOCK_ORDER.length)).toEqual(
      [...LEVEL_2_PRACTICE_UNLOCK_ORDER],
    );
  });

  it('starts a fresh learner on the first Unit 0 lesson', () => {
    const store = loadProgress();
    expect(store.activeRouteId).toBe(LOGIC_FOUNDATIONS_ROUTE_ID);
    expect(store.version).toBe(7);
    expect(firstIncompleteLesson(store.lessonsCompleted).id).toBe(LEVEL_0_LESSONS[0].id);
    expect(getUnlockedExerciseIds(store)).toEqual([]);
    expect(store.routes[LOGIC_FOUNDATIONS_ROUTE_ID]?.currentStepId).toBe('unit-0-learn');
  });

  it('unlocks Unit 0 practice only after the Unit 0 learn step', () => {
    const afterUnit0 = completeIds(LEVEL_0_LESSONS.map((lesson) => lesson.id));
    expect(getUnlockedExerciseIds(afterUnit0)).toEqual(['eval-001']);
    expect(afterUnit0.resume.lessonId).toBe(LEVEL_1_LESSONS[0].id);
    expect(afterUnit0.routes[LOGIC_FOUNDATIONS_ROUTE_ID]?.currentStepId).toBe('unit-1-learn');
  });

  it('keeps Unit 1 practice locked until Unit 1 lessons are complete', () => {
    const store = completeIds([
      ...LEVEL_0_LESSONS.map((lesson) => lesson.id),
      LEVEL_1_LESSONS[0].id,
    ]);
    expect(getUnlockedExerciseIds(store)).toEqual(['eval-001']);
    expect(store.routes[LOGIC_FOUNDATIONS_ROUTE_ID]?.currentStepId).toBe('unit-1-learn');
  });

  it('matches current Unit 1 clustered unlock after Unit 1 lessons', () => {
    const store = completeIds([
      ...LEVEL_0_LESSONS.map((lesson) => lesson.id),
      ...LEVEL_1_LESSONS.map((lesson) => lesson.id),
    ]);
    expect(getUnlockedExerciseIds(store)).toEqual([
      'eval-001',
      'eval-010',
      'tt-002',
      'counter-002',
      'eval-020',
      'scope-003',
      'val-001',
      'translate-001',
      'nd-001',
    ]);
  });

  it('keeps Unit 2 practice locked until Unit 2 lessons are complete', () => {
    const store = completeIds([
      ...LEVEL_0_LESSONS.map((lesson) => lesson.id),
      ...LEVEL_1_LESSONS.map((lesson) => lesson.id),
    ]);
    expect(getUnlockedExerciseIds(store)).not.toContain('eval-021');
  });

  it('does not invent a next exercise before Unit 0 is complete', () => {
    const store = loadProgress();
    expect(() => selectNextExerciseId(store)).toThrow('No practice exercises unlocked');
  });

  it('labels the canonical route in both locales', () => {
    const route = requireRoute(LOGIC_FOUNDATIONS_ROUTE_ID);
    expect(route.label.en.length).toBeGreaterThan(0);
    expect(route.label.fr.length).toBeGreaterThan(0);
    expect(route.label.en).not.toBe(route.label.fr);
  });
});

describe('graded activity evidence', () => {
  it('tags every current exercise with a canonical concept × capability pair', () => {
    for (const exercise of EXERCISE_DEFINITIONS) {
      const tags = evidenceForExercise(exercise.id);
      expect(tags.length, exercise.id).toBeGreaterThan(0);
      for (const tag of tags) {
        expect(isCanonicalConcept(tag.concept), `${exercise.id}:${tag.concept}`).toBe(true);
        expect(CAPABILITIES).toContain(tag.capability);
      }
    }
  });

  it('does not treat lesson completion as concept evidence', () => {
    const store = completeIds(LEVEL_0_LESSONS.map((lesson) => lesson.id));
    expect(store.conceptEvidence).toEqual({});
    expect(store.passed).toEqual([]);
  });
});

describe('v6 import still reaches the same resume point', () => {
  it('preserves a mid-Unit-0 learner after v6 import', () => {
    const { progress } = importProgress(
      JSON.stringify({
        version: 6,
        lessonsCompleted: ['level0-01-letters', 'level0-02-truth'],
        level0Complete: false,
        level1Complete: false,
        level2Complete: false,
        queue: [],
        attempted: [],
        passed: [],
        practiceDrafts: {},
        resume: {
          mode: 'learn',
          lessonId: 'level0-03-and',
          updatedAt: new Date().toISOString(),
        },
        skills: {},
        exerciseStats: {},
        errorCounts: {},
        lastVisitedAt: new Date().toISOString(),
        onboardingComplete: true,
      }),
    );
    expect(progress.version).toBe(7);
    expect(progress.activeRouteId).toBe(LOGIC_FOUNDATIONS_ROUTE_ID);
    expect(progress.resume.lessonId).toBe('level0-03-and');
    expect(progress.resume.mode).toBe('learn');
    expect(firstIncompleteLesson(progress.lessonsCompleted).id).toBe('level0-03-and');
    expect(getUnlockedExerciseIds(progress)).toEqual([]);
  });
});
