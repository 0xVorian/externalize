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
import {
  LOGIC_AND_THEISM_READING_ROUTE_ID,
  LOGIC_FOUNDATIONS_ROUTE_ID,
} from '../../src/app/routes';
import { evidenceKey } from '../../src/app/curriculum';
import { setActiveRoute } from '../../src/app/source-route';

export const STORAGE_KEY = 'externalize-progress-v1';

export function emptyProgress(): ProgressStore {
  return {
    version: 7,
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
    activeRouteId: LOGIC_FOUNDATIONS_ROUTE_ID,
    routes: {
      [LOGIC_FOUNDATIONS_ROUTE_ID]: {
        currentStepId: 'unit-0-learn',
        seenItems: [],
      },
    },
    conceptEvidence: {},
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

function conjunctionDueQueue(intervalDays: number): ProgressStore['queue'] {
  const due = new Date(Date.now() - 60_000).toISOString();
  return [
    { exerciseId: 'eval-001', due, intervalDays, ease: 2.3 },
    { exerciseId: 'eval-011', due, intervalDays, ease: 2.3 },
  ];
}

function withConjunctionEvidence(store: ProgressStore, extras: Partial<ProgressStore>): ProgressStore {
  const lastSeenAt = new Date().toISOString();
  return {
    ...store,
    passed: ['eval-001', 'eval-011'],
    attempted: ['eval-001', 'eval-011'],
    conceptEvidence: {
      [evidenceKey('conjunction', 'apply')]: {
        attempts: 2,
        cleanPasses: 1,
        transferPasses: 0,
        recentErrors: [],
        lastSeenAt,
      },
    },
    ...extras,
  };
}

/** All lessons done; two conjunction reviews still due (interval 0). */
export function progressCourseCompleteWithRepairedDueReviews(): ProgressStore {
  let store = emptyProgress();
  for (const lesson of ALL_LEARN_LESSONS) {
    store = completeLesson(store, lesson.id);
  }
  return withConjunctionEvidence(store, { queue: conjunctionDueQueue(0) });
}

/** Unit 0 done, remaining Unit 1, two conjunction reviews still due (interval 0). */
export function progressWithLeftoverDueReviews(): ProgressStore {
  return withConjunctionEvidence(progressAfterLevel0(), { queue: conjunctionDueQueue(0) });
}

/** Level 0+1 done, only conjunction eval-001 due; later concepts stay queued. */
export function progressWithOneDueConjunctionReview(): ProgressStore {
  let store = emptyProgress();
  for (const lesson of LEVEL_0_LESSONS) {
    store = completeLesson(store, lesson.id);
  }
  for (const lesson of LEVEL_1_LESSONS) {
    store = completeLesson(store, lesson.id);
  }
  const lastSeenAt = new Date().toISOString();
  const due = new Date(Date.now() - 60_000).toISOString();
  const later = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  return {
    ...store,
    passed: ['eval-001'],
    attempted: ['eval-001'],
    conceptEvidence: {
      [evidenceKey('conjunction', 'apply')]: {
        attempts: 1,
        cleanPasses: 1,
        transferPasses: 0,
        recentErrors: [],
        lastSeenAt,
      },
    },
    queue: [
      { exerciseId: 'eval-001', due, intervalDays: 1, ease: 2.5 },
      { exerciseId: 'eval-010', due: later, intervalDays: 1, ease: 2.5 },
      { exerciseId: 'tt-002', due: later, intervalDays: 1, ease: 2.5 },
    ],
  };
}

function recentConjunctionEvidence() {
  return {
    [evidenceKey('conjunction', 'apply')]: {
      attempts: 2,
      cleanPasses: 2,
      transferPasses: 0,
      recentErrors: [] as string[],
      lastSeenAt: new Date().toISOString(),
    },
  };
}

function staleConditionalEvidence() {
  return {
    [evidenceKey('conditional', 'apply')]: {
      attempts: 4,
      cleanPasses: 4,
      transferPasses: 0,
      recentErrors: [] as string[],
      lastSeenAt: '2025-01-01T00:00:00.000Z',
    },
  };
}

/**
 * All lessons done; conjunction is the recent warm-up, conditional evidence is
 * stale. Home opens a 5-step lapse recovery: warm-up, then lat-retrieve-conditional
 * at 2 / 5 (the FR true/false step from issue #51).
 */
export function progressLapseRetrieveAtStep2(): ProgressStore {
  let store = emptyProgress();
  for (const lesson of ALL_LEARN_LESSONS) {
    store = completeLesson(store, lesson.id);
  }
  return {
    ...store,
    passed: ['eval-001', 'eval-011', 'tt-001', 'counter-001'],
    attempted: ['eval-001', 'eval-011', 'tt-001', 'counter-001'],
    queue: [],
    conceptEvidence: {
      ...recentConjunctionEvidence(),
      ...staleConditionalEvidence(),
    },
  };
}

/**
 * Sobel remaining material after the first five preparation items, with a due
 * conjunction recall. Home offers that recall; chaining then lands on a 5-step
 * continue whose second step is lat-retrieve-conditional.
 */
export function progressSobelChainRetrieveAtStep2(): ProgressStore {
  let store = emptyProgress();
  for (const lesson of LEVEL_0_LESSONS) {
    store = completeLesson(store, lesson.id);
  }
  store = setActiveRoute(store, LOGIC_AND_THEISM_READING_ROUTE_ID);
  const due = new Date(Date.now() - 60_000).toISOString();
  return {
    ...store,
    lessonsCompleted: [
      ...store.lessonsCompleted,
      'lat-conditional-bridge',
      'lat-empty-no-counterexample',
      'lat-name-vacuity',
      'lat-conditional-meaning',
    ],
    passed: ['eval-001', 'lat-predict-empty-club'],
    attempted: ['eval-001', 'lat-predict-empty-club'],
    conceptEvidence: recentConjunctionEvidence(),
    queue: [{ exerciseId: 'eval-001', due, intervalDays: 1, ease: 2.5 }],
    routes: {
      ...store.routes,
      [LOGIC_AND_THEISM_READING_ROUTE_ID]: {
        currentStepId: store.routes[LOGIC_AND_THEISM_READING_ROUTE_ID]?.currentStepId ?? 'ii-26-28',
        seenItems: [
          'lat-conditional-bridge',
          'lat-predict-empty-club',
          'lat-empty-no-counterexample',
          'lat-name-vacuity',
          'lat-conditional-meaning',
        ],
      },
    },
  };
}

export function progressWithConjunctionPractice(): ProgressStore {
  let store = emptyProgress();
  for (const lesson of LEVEL_0_LESSONS) {
    store = completeLesson(store, lesson.id);
  }
  const lastSeenAt = new Date().toISOString();
  const due = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  return {
    ...store,
    passed: ['eval-001'],
    attempted: ['eval-001'],
    conceptEvidence: {
      [evidenceKey('conjunction', 'apply')]: {
        attempts: 1,
        cleanPasses: 1,
        transferPasses: 0,
        recentErrors: [],
        lastSeenAt,
      },
    },
    queue: [{ exerciseId: 'eval-001', due, intervalDays: 1, ease: 2.5 }],
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
