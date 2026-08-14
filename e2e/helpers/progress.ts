import {
  completeLesson,
  beginPracticeAttempt,
  clearPracticeDraft,
  getUnlockedExerciseIds,
  recordCheckedPracticeState,
  seedQueue,
  updateResume,
  type ProgressStore,
} from '../../src/app/storage';
import { recordAttemptCheck } from '../../src/app/practice-attempt';
import {
  LEVEL_0_LESSONS,
  LEVEL_1_LESSONS,
  PRACTICE_UNLOCK_ORDER,
} from '../../src/app/lessons';
import type { SkillId } from '../../src/app/progress-tracker';

export const STORAGE_KEY = 'externalize-progress-v1';

export function emptyProgress(): ProgressStore {
  return {
    version: 6,
    lessonsCompleted: [],
    level0Complete: false,
    level1Complete: false,
    level2Complete: false,
    onboardingComplete: true,
    queue: [],
    attempted: [],
    passed: [],
    practiceDrafts: {},
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

function passExercise(store: ProgressStore, exerciseId: string): ProgressStore {
  const started = beginPracticeAttempt(clearPracticeDraft(store), exerciseId);
  const draft = started.practiceDraft!;
  return recordCheckedPracticeState(started, {
    ...draft,
    phase: 'answered',
    feedbackTag: 'correct',
    attempt: recordAttemptCheck(draft.attempt, true),
  });
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
    store = passExercise(store, id);
  }

  store = seedQueue(store, getUnlockedExerciseIds(store));
  return updateResume(store, { mode: 'practice', exerciseId });
}

export function withSkillStats(
  store: ProgressStore,
  skillId: SkillId,
  attempts: number,
  successes: number,
): ProgressStore {
  return {
    ...store,
    skills: {
      ...store.skills,
      [skillId]: { attempts, successes, recentErrorTags: [] },
    },
  };
}

export function progressAtLesson(lessonId: string): ProgressStore {
  let store = emptyProgress();
  for (const lesson of [...LEVEL_0_LESSONS, ...LEVEL_1_LESSONS]) {
    if (lesson.id === lessonId) {
      break;
    }
    store = completeLesson(store, lesson.id);
  }
  return updateResume(store, { mode: 'learn', lessonId });
}
