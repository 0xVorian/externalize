import { describe, expect, it } from 'vitest';
import { LEVEL_1_LESSONS, LEVEL_2_LESSONS } from './lessons';
import {
  loadProgress,
  beginPracticeAttempt,
  clearPracticeDraft,
  finalizePracticeAttempt,
  persistPracticeDraft,
  recordCheckedPracticeState,
  completeLesson,
  getUnlockedExerciseIds,
  isLevel1PracticeUnlocked,
  isLevel2PracticeUnlocked,
  exerciseLockReason,
  serializeProgressExport,
  importProgress,
} from './storage';
import { recordAttemptCheck, type PracticeErrorTag } from './practice-attempt';

const LEVEL_0_IDS = [
  'level0-01-letters',
  'level0-02-truth',
  'level0-03-and',
  'level0-04-watch',
  'level0-05-guided',
] as const;

function completeLevel0(store: ReturnType<typeof loadProgress>) {
  let next = store;
  for (const id of LEVEL_0_IDS) {
    next = completeLesson(next, id);
  }
  return next;
}

function completeAttempt(
  store: ReturnType<typeof loadProgress>,
  exerciseId: string,
  checks: Array<{ correct: boolean; errorTag?: PracticeErrorTag }> = [{ correct: true }],
) {
  let next = beginPracticeAttempt(clearPracticeDraft(store), exerciseId);
  for (const check of checks) {
    const draft = next.practiceDraft!;
    const checkedDraft = {
      ...draft,
      phase: 'answered' as const,
      feedbackTag: check.correct ? 'correct' as const : check.errorTag,
      attempt: recordAttemptCheck(draft.attempt, check.correct, check.errorTag),
    };
    next = recordCheckedPracticeState(next, checkedDraft);
    if (!check.correct) {
      next = persistPracticeDraft(next, {
        ...next.practiceDraft!,
        phase: 'ready',
        feedbackTag: undefined,
      });
    }
  }
  return next;
}

describe('storage v3', () => {
  it('migrates v2 store to v3 with resume point', () => {
    const store = {
      version: 3 as const,
      lessonsCompleted: ['level0-01-letters'],
      level0Complete: false,
      queue: [],
      completed: [],
      resume: { mode: 'learn' as const, lessonId: 'level0-02-truth', updatedAt: new Date().toISOString() },
      skills: {},
      exerciseStats: {},
      errorCounts: {},
      lastVisitedAt: new Date().toISOString(),
    };
    expect(store.version).toBe(3);
    expect(store.resume.lessonId).toBeTruthy();
  });

  it('records a repaired pass as one finalized attempt', () => {
    let store = loadProgress();
    store = completeLevel0(store);
    store = completeAttempt(store, 'scope-001', [
      { correct: false, errorTag: 'selected-subconnective' },
      { correct: true },
    ]);
    expect(store.skills['practice:identify-main-connective']?.attempts).toBe(1);
    expect(store.skills['practice:identify-main-connective']?.successes).toBe(0);
    expect(store.exerciseStats['scope-001']?.repairedPasses).toBe(1);
    expect(store.errorCounts['selected-subconnective']).toBe(1);
    expect(store.passed).toContain('scope-001');
  });

  it('unlocks Unit 0 exercises progressively after level0Complete', () => {
    let store = completeLevel0(loadProgress());
    expect(getUnlockedExerciseIds(store)).toEqual(['eval-001']);
    store = completeAttempt(store, 'eval-001');
    expect(getUnlockedExerciseIds(store)).toEqual(['eval-001', 'eval-011']);
    store = completeAttempt(store, 'eval-011');
    expect(getUnlockedExerciseIds(store)).toEqual(['eval-001', 'eval-011', 'tt-001']);
    store = completeAttempt(store, 'tt-001');
    expect(getUnlockedExerciseIds(store)).toEqual(['eval-001', 'eval-011', 'tt-001', 'counter-001']);
  });

  it('keeps Unit 1 exercises locked until all Level 1 lessons are complete', () => {
    let store = completeLevel0(loadProgress());
    store = completeAttempt(store, 'eval-001');
    store = completeAttempt(store, 'eval-011');
    store = completeAttempt(store, 'tt-001');
    store = completeAttempt(store, 'counter-001');
    expect(isLevel1PracticeUnlocked(store)).toBe(false);
    expect(getUnlockedExerciseIds(store)).toEqual(['eval-001', 'eval-011', 'tt-001', 'counter-001']);
    expect(exerciseLockReason(store, 'eval-010')).toBe('unit1');
    expect(exerciseLockReason(store, 'eval-003')).toBe('unit1');
  });

  it('unlocks Unit 1 exercises progressively after Level 1 complete', () => {
    let store = completeLevel0(loadProgress());
    for (const lesson of LEVEL_1_LESSONS) {
      store = completeLesson(store, lesson.id);
    }
    expect(isLevel1PracticeUnlocked(store)).toBe(true);
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
    store = completeAttempt(store, 'eval-001');
    expect(getUnlockedExerciseIds(store)).toEqual([
      'eval-001',
      'eval-011',
      'eval-010',
      'tt-002',
      'counter-002',
      'eval-020',
      'scope-003',
      'val-001',
      'translate-001',
      'nd-001',
    ]);
    store = completeAttempt(store, 'eval-010');
    expect(getUnlockedExerciseIds(store)).toContain('eval-019');
  });


  it('keeps Unit 2 exercises locked until all Level 2 lessons are complete', () => {
    let store = completeLevel0(loadProgress());
    for (const lesson of LEVEL_1_LESSONS) {
      store = completeLesson(store, lesson.id);
    }
    for (const id of ['eval-001', 'eval-011', 'tt-001', 'counter-001', 'eval-010', 'eval-003', 'eval-004', 'eval-005', 'tt-002', 'counter-002', 'tt-003', 'counter-003', 'scope-003', 'scope-009', 'scope-004', 'scope-007', 'eval-002', 'eval-006', 'tt-004', 'tt-005', 'counter-004', 'val-001', 'val-002', 'val-003', 'val-004', 'val-005', 'eval-007', 'eval-008', 'eval-009', 'scope-001', 'scope-005', 'scope-006', 'scope-008', 'scope-010', 'scope-011', 'scope-002', 'translate-001', 'translate-002', 'translate-003', 'translate-004', 'translate-005', 'translate-006', 'nd-001']) {
      store = completeAttempt(store, id);
    }
    expect(isLevel2PracticeUnlocked(store)).toBe(false);
    expect(exerciseLockReason(store, 'eval-021')).toBe('unit2');
  });

  it('unlocks Unit 2 exercises progressively after Level 2 complete', () => {
    let store = completeLevel0(loadProgress());
    for (const lesson of [...LEVEL_1_LESSONS, ...LEVEL_2_LESSONS]) {
      store = completeLesson(store, lesson.id);
    }
    expect(isLevel2PracticeUnlocked(store)).toBe(true);
    const base = getUnlockedExerciseIds(store);
    expect(base).toContain('eval-021');
    expect(base).not.toContain('scope-012');
    store = completeAttempt(store, 'eval-021');
    expect(getUnlockedExerciseIds(store)).toContain('scope-012');
  });

  it('marks level 0 complete after final lesson', () => {
    let store = loadProgress();
    store = completeLevel0(store);
    expect(store.level0Complete).toBe(true);
    expect(store.resume.mode).toBe('learn');
    expect(store.resume.lessonId).toBe('level1-01-neg');
  });

  it('switches to practice after full learn path', () => {
    let store = loadProgress();
    for (const id of [
      ...LEVEL_0_IDS,
      ...LEVEL_1_LESSONS.map((l) => l.id),
      ...LEVEL_2_LESSONS.map((l) => l.id),
    ]) {
      store = completeLesson(store, id);
    }
    expect(store.level2Complete).toBe(true);
    expect(store.resume.mode).toBe('practice');
  });

  it('round-trips progress through export and import', () => {
    let store = loadProgress();
    store = completeLesson(store, 'level0-01-letters');
    store = { ...store, level0Complete: true };
    store = completeAttempt(store, 'eval-001');

    const raw = serializeProgressExport(store, 'fr');
    const { progress: restored, locale } = importProgress(raw);

    expect(locale).toBe('fr');
    expect(restored.lessonsCompleted).toEqual(store.lessonsCompleted);
    expect(restored.skills).toEqual(store.skills);
    expect(restored.errorCounts).toEqual(store.errorCounts);
  });

  it('imports bare progress JSON for backward compatibility', () => {
    const store = loadProgress();
    const raw = JSON.stringify(store);
    const { progress: restored } = importProgress(raw);
    expect(restored.version).toBe(6);
  });

  it('migrates v5 completion as exposure and resets contaminated metrics', () => {
    const { progress: store } = importProgress(JSON.stringify({
      version: 5,
      lessonsCompleted: ['level0-01-letters'],
      level0Complete: true,
      level1Complete: false,
      level2Complete: false,
      queue: [{ exerciseId: 'eval-001', due: new Date().toISOString(), intervalDays: 8, ease: 2.8 }],
      completed: ['eval-001'],
      resume: { mode: 'practice', exerciseId: 'eval-001', updatedAt: new Date().toISOString() },
      skills: { 'practice:evaluate-formula': { attempts: 4, successes: 4, recentErrorTags: [] } },
      exerciseStats: { 'eval-001': { attempts: 4, successes: 4 } },
      errorCounts: { 'selected-subconnective': 2 },
      lastVisitedAt: new Date().toISOString(),
      onboardingComplete: true,
    }));
    expect(store.attempted).toEqual(['eval-001']);
    expect(store.passed).toEqual([]);
    expect(store.queue).toEqual([]);
    expect(store.skills).toEqual({});
    expect(store.exerciseStats).toEqual({});
    expect(store.errorCounts).toEqual({});
    expect(getUnlockedExerciseIds(store)).toEqual(['eval-001']);
  });

  it('finalizes a persisted attempt identity only once', () => {
    let store = beginPracticeAttempt(completeLevel0(loadProgress()), 'eval-001');
    const draft = store.practiceDraft!;
    const checked = {
      ...draft,
      phase: 'answered' as const,
      feedbackTag: 'correct' as const,
      attempt: recordAttemptCheck(draft.attempt, true),
    };
    store = recordCheckedPracticeState(store, checked);
    const once = store;
    store = finalizePracticeAttempt(store, checked);
    expect(store.exerciseStats['eval-001']).toEqual(once.exerciseStats['eval-001']);
    expect(store.queue).toEqual(once.queue);
  });

  it('migrates v4 to v5 with level2Complete', () => {
    const { progress: store } = importProgress(
      JSON.stringify({
        version: 4,
        lessonsCompleted: ['level0-01-letters'],
        level0Complete: false,
        level1Complete: false,
        queue: [],
        completed: [],
        resume: {
          mode: 'learn',
          lessonId: 'level0-02-truth',
          updatedAt: new Date().toISOString(),
        },
        skills: {},
        exerciseStats: {},
        errorCounts: {},
        lastVisitedAt: new Date().toISOString(),
      }),
    );
    expect(store.version).toBe(6);
    expect(store.level2Complete).toBe(false);
  });

  it('migrates v4 through v6', () => { const {progress:store}=importProgress(JSON.stringify({version:4,lessonsCompleted:['level0-01-letters'],level0Complete:false,level1Complete:false,queue:[],completed:[],resume:{mode:'learn',lessonId:'level0-02-truth',updatedAt:new Date().toISOString()},skills:{},exerciseStats:{},errorCounts:{},lastVisitedAt:new Date().toISOString()})); expect(store.version).toBe(6); expect(store.onboardingComplete).toBe(true); });
  it('new store needs onboarding', () => expect(loadProgress().onboardingComplete).toBe(false));
  it('rejects invalid import data', () => {
    expect(() => importProgress('not json')).toThrow();
    expect(() => importProgress('{"kind":"externalize-progress-export","exportVersion":99}')).toThrow();
  });
});
