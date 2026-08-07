import { describe, expect, it } from 'vitest';
import { LEVEL_1_LESSONS } from './lessons';
import {
  loadProgress,
  recordResult,
  completeLesson,
  getUnlockedExerciseIds,
  isLevel1PracticeUnlocked,
  exerciseLockReason,
  serializeProgressExport,
  importProgress,
} from './storage';

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

  it('records skill stats on incorrect answer', () => {
    let store = loadProgress();
    store = completeLevel0(store);
    store = recordResult(store, 'scope-001', false, 'selected-subconnective');
    expect(store.skills['practice:identify-main-connective']?.attempts).toBe(1);
    expect(store.skills['practice:identify-main-connective']?.successes).toBe(0);
    expect(store.errorCounts['selected-subconnective']).toBe(1);
  });

  it('unlocks Unit 0 exercises progressively after level0Complete', () => {
    let store = completeLevel0(loadProgress());
    expect(getUnlockedExerciseIds(store)).toEqual(['eval-001']);
    store = recordResult(store, 'eval-001', true);
    expect(getUnlockedExerciseIds(store)).toEqual(['eval-001', 'scope-012']);
    store = recordResult(store, 'scope-012', true);
    expect(getUnlockedExerciseIds(store)).toEqual(['eval-001', 'scope-012']);
  });

  it('keeps Unit 1 exercises locked until all Level 1 lessons are complete', () => {
    let store = completeLevel0(loadProgress());
    store = recordResult(store, 'eval-001', true);
    store = recordResult(store, 'scope-012', true);
    expect(isLevel1PracticeUnlocked(store)).toBe(false);
    expect(getUnlockedExerciseIds(store)).toEqual(['eval-001', 'scope-012']);
    expect(exerciseLockReason(store, 'eval-010')).toBe('unit1');
    expect(exerciseLockReason(store, 'eval-003')).toBe('unit1');
  });

  it('unlocks Unit 1 exercises progressively after Level 1 complete', () => {
    let store = completeLevel0(loadProgress());
    for (const lesson of LEVEL_1_LESSONS) {
      store = completeLesson(store, lesson.id);
    }
    expect(isLevel1PracticeUnlocked(store)).toBe(true);
    expect(getUnlockedExerciseIds(store)).toEqual(['eval-001', 'eval-010']);
    store = recordResult(store, 'eval-001', true);
    expect(getUnlockedExerciseIds(store)).toEqual(['eval-001', 'scope-012', 'eval-010']);
    store = recordResult(store, 'eval-010', true);
    expect(getUnlockedExerciseIds(store)).toEqual(['eval-001', 'scope-012', 'eval-010', 'eval-003']);
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
    for (const id of [...LEVEL_0_IDS, ...LEVEL_1_LESSONS.map((l) => l.id)]) {
      store = completeLesson(store, id);
    }
    expect(store.resume.mode).toBe('practice');
  });

  it('round-trips progress through export and import', () => {
    let store = loadProgress();
    store = completeLesson(store, 'level0-01-letters');
    store = { ...store, level0Complete: true };
    store = recordResult(store, 'eval-001', false, 'selected-subconnective');

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
    expect(restored.version).toBe(3);
  });

  it('rejects invalid import data', () => {
    expect(() => importProgress('not json')).toThrow();
    expect(() => importProgress('{"kind":"externalize-progress-export","exportVersion":99}')).toThrow();
  });
});
