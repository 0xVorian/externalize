import {
  completeLesson,
  getUnlockedExerciseIds,
  recordResult,
  seedQueue,
  updateResume,
  type ProgressStore,
} from '../../src/app/storage';
import {
  LEVEL_0_LESSONS,
  LEVEL_1_LESSONS,
  PRACTICE_UNLOCK_ORDER,
} from '../../src/app/lessons';

export const STORAGE_KEY = 'externalize-progress-v1';

export function emptyProgress(): ProgressStore {
  return {
    version: 5,
    lessonsCompleted: [],
    level0Complete: false,
    level1Complete: false,
    level2Complete: false,
    onboardingComplete: true,
    queue: [],
    completed: [],
    resume: {
      mode: 'learn',
      lessonId: LEVEL_0_LESSONS[0]!.id,
      updatedAt: new Date().toISOString(),
    },
    skills: {},
    exerciseStats: {},
    errorCounts: {},
    lastVisitedAt: new Date().toISOString(),
  };
}

export function progressAfterLevel0(): ProgressStore {
  let store = emptyProgress();
  for (const lesson of LEVEL_0_LESSONS) {
    store = completeLesson(store, lesson.id);
  }
  return store;
}

export function progressReadyForExercise(exerciseId: string): ProgressStore {
  let store = emptyProgress();
  for (const lesson of LEVEL_0_LESSONS) {
    store = completeLesson(store, lesson.id);
  }
  for (const lesson of LEVEL_1_LESSONS) {
    store = completeLesson(store, lesson.id);
  }

  for (const id of PRACTICE_UNLOCK_ORDER) {
    if (id === exerciseId) {
      break;
    }
    store = recordResult(store, id, true);
  }

  store = seedQueue(store, getUnlockedExerciseIds(store));
  return updateResume(store, { mode: 'practice', exerciseId });
}
