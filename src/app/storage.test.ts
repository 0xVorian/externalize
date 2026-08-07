import { describe, expect, it } from 'vitest';
import { loadProgress, recordResult, completeLesson, getUnlockedExerciseIds } from './storage';

describe('storage v3', () => {
  it('migrates v2 store to v3 with resume point', () => {
    const v2 = {
      version: 2,
      lessonsCompleted: ['level0-01-letters'],
      level0Complete: false,
      queue: [],
      completed: [],
      lastExerciseId: 'eval-001',
    };
    expect(v2.version).toBe(2);
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
    store = {
      ...store,
      level0Complete: true,
      lessonsCompleted: [
        'level0-01-letters',
        'level0-02-truth',
        'level0-03-and',
        'level0-04-watch',
        'level0-05-guided',
      ],
    };
    store = recordResult(store, 'scope-001', false, 'selected-subconnective');
    expect(store.skills['practice:identify-main-connective']?.attempts).toBe(1);
    expect(store.skills['practice:identify-main-connective']?.successes).toBe(0);
    expect(store.errorCounts['selected-subconnective']).toBe(1);
  });

  it('unlocks exercises progressively', () => {
    let store = loadProgress();
    store = { ...store, level0Complete: true, lessonsCompleted: ['level0-01-letters', 'level0-02-truth', 'level0-03-and', 'level0-04-watch', 'level0-05-guided'] };
    expect(getUnlockedExerciseIds(store)).toEqual(['eval-001']);
    store = recordResult(store, 'eval-001', true);
    expect(getUnlockedExerciseIds(store)).toEqual(['eval-001', 'eval-002']);
  });

  it('marks level 0 complete after final lesson', () => {
    let store = loadProgress();
    for (const id of [
      'level0-01-letters',
      'level0-02-truth',
      'level0-03-and',
      'level0-04-watch',
      'level0-05-guided',
    ]) {
      store = completeLesson(store, id);
    }
    expect(store.level0Complete).toBe(true);
    expect(store.resume.mode).toBe('practice');
  });
});
