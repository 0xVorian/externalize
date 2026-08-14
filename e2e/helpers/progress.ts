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
  ALL_LEARN_LESSONS,
  LEVEL_0_LESSONS,
  LEVEL_1_LESSONS,
  PRACTICE_UNLOCK_ORDER,
} from '../../src/app/lessons';
import { scaffoldMaxLevel } from '../../src/app/evaluation-scaffold';
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

function passExerciseRepaired(store: ProgressStore, exerciseId: string): ProgressStore {
  const started = beginPracticeAttempt(clearPracticeDraft(store), exerciseId);
  const wrong = started.practiceDraft!;
  const afterWrong = recordCheckedPracticeState(started, {
    ...wrong,
    phase: 'answered',
    feedbackTag: 'incorrect-evaluation',
    attempt: recordAttemptCheck(wrong.attempt, false, 'incorrect-evaluation'),
  });
  const draft = afterWrong.practiceDraft!;
  return recordCheckedPracticeState(afterWrong, {
    ...draft,
    phase: 'answered',
    feedbackTag: 'correct',
    attempt: recordAttemptCheck(draft.attempt, true),
  });
}

function resumePractice(store: ProgressStore, exerciseId: string): ProgressStore {
  return updateResume(clearPracticeDraft(store), { mode: 'practice', exerciseId });
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
  for (const lesson of ALL_LEARN_LESSONS) {
    if (lesson.id === lessonId) {
      break;
    }
    store = completeLesson(store, lesson.id);
  }
  return updateResume(store, { mode: 'learn', lessonId });
}

/**
 * Seed a scaffolded evaluation so the next clean pass advances scaffold
 * without also unlocking a new exercise. A repaired pass counts as passed
 * (so the next cluster item is already unlocked) but does not raise scaffoldLevel.
 */
export function progressReadyForScaffoldAdvance(exerciseId: string): ProgressStore {
  return resumePractice(
    passExerciseRepaired(progressReadyForExercise(exerciseId), exerciseId),
    exerciseId,
  );
}

/** Seed a scaffolded evaluation already at its maximum configured level. */
export function progressAtMaxScaffold(exerciseId: string): ProgressStore {
  let store = progressReadyForScaffoldAdvance(exerciseId);
  const max = scaffoldMaxLevel(exerciseId);
  const current = store.exerciseStats[exerciseId]?.scaffoldLevel ?? 0;
  if (current < max) {
    store = passExercise(store, exerciseId);
  }
  return resumePractice(store, exerciseId);
}
