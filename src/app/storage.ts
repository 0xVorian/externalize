import { LEVEL_0_LESSONS, PRACTICE_UNLOCK_ORDER } from './lessons';
import type { FeedbackTag } from '../../engine';
import {
  type SkillStat,
  type ExerciseStat,
  type ResumePoint,
  emptySkillStat,
  recordSkillAttempt,
  skillForExercise,
} from './progress-tracker';
import { getExerciseDefinition } from './exercises';

export type SrsEntry = {
  exerciseId: string;
  due: string;
  intervalDays: number;
  ease: number;
};

export type ProgressStore = {
  version: 3;
  lessonsCompleted: string[];
  level0Complete: boolean;
  queue: SrsEntry[];
  completed: string[];
  lastExerciseId?: string;
  resume: ResumePoint;
  skills: Record<string, SkillStat>;
  exerciseStats: Record<string, ExerciseStat>;
  errorCounts: Partial<Record<FeedbackTag, number>>;
  lastVisitedAt: string;
};

const STORAGE_KEY = 'externalize-progress-v1';

const DAY_MS = 24 * 60 * 60 * 1000;

function nowIso(): string {
  return new Date().toISOString();
}

function defaultResume(): ResumePoint {
  return {
    mode: 'learn',
    lessonId: LEVEL_0_LESSONS[0].id,
    updatedAt: nowIso(),
  };
}

function defaultStore(): ProgressStore {
  return {
    version: 3,
    lessonsCompleted: [],
    level0Complete: false,
    queue: [],
    completed: [],
    resume: defaultResume(),
    skills: {},
    exerciseStats: {},
    errorCounts: {},
    lastVisitedAt: nowIso(),
  };
}

function migrateStore(raw: unknown): ProgressStore {
  if (!raw || typeof raw !== 'object') {
    return defaultStore();
  }
  const store = raw as Record<string, unknown>;

  if (store.version === 3) {
    return normalizeV3(store);
  }

  if (store.version === 2) {
    const lessonsCompleted = (store.lessonsCompleted as string[] | undefined) ?? [];
    const level0Complete = (store.level0Complete as boolean | undefined) ?? false;
    const lastExerciseId = store.lastExerciseId as string | undefined;
    return {
      version: 3,
      lessonsCompleted,
      level0Complete,
      queue: (store.queue as SrsEntry[] | undefined) ?? [],
      completed: (store.completed as string[] | undefined) ?? [],
      lastExerciseId,
      resume: {
        mode: level0Complete ? 'practice' : 'learn',
        lessonId: firstIncompleteLessonId(lessonsCompleted),
        exerciseId: lastExerciseId,
        updatedAt: nowIso(),
      },
      skills: {},
      exerciseStats: {},
      errorCounts: {},
      lastVisitedAt: nowIso(),
    };
  }

  if (store.version === 1) {
    return migrateStore({ ...store, version: 2, lessonsCompleted: [], level0Complete: false });
  }

  return defaultStore();
}

function normalizeV3(store: Record<string, unknown>): ProgressStore {
  return {
    version: 3,
    lessonsCompleted: (store.lessonsCompleted as string[] | undefined) ?? [],
    level0Complete: (store.level0Complete as boolean | undefined) ?? false,
    queue: (store.queue as SrsEntry[] | undefined) ?? [],
    completed: (store.completed as string[] | undefined) ?? [],
    lastExerciseId: store.lastExerciseId as string | undefined,
    resume: (store.resume as ResumePoint | undefined) ?? defaultResume(),
    skills: (store.skills as Record<string, SkillStat> | undefined) ?? {},
    exerciseStats: (store.exerciseStats as Record<string, ExerciseStat> | undefined) ?? {},
    errorCounts: (store.errorCounts as Partial<Record<FeedbackTag, number>> | undefined) ?? {},
    lastVisitedAt: (store.lastVisitedAt as string | undefined) ?? nowIso(),
  };
}

function firstIncompleteLessonId(completed: string[]): string {
  for (const lesson of LEVEL_0_LESSONS) {
    if (!completed.includes(lesson.id)) {
      return lesson.id;
    }
  }
  return LEVEL_0_LESSONS[LEVEL_0_LESSONS.length - 1].id;
}

export function loadProgress(): ProgressStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultStore();
    }
    return migrateStore(JSON.parse(raw));
  } catch {
    return defaultStore();
  }
}

export function saveProgress(store: ProgressStore): ProgressStore {
  const next = { ...store, lastVisitedAt: nowIso() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

function isoDaysFromNow(days: number): string {
  return new Date(Date.now() + days * DAY_MS).toISOString();
}

export function isPracticeUnlocked(store: ProgressStore): boolean {
  return store.level0Complete;
}

export function getUnlockedExerciseIds(store: ProgressStore): string[] {
  if (!store.level0Complete) {
    return [];
  }
  const unlocked: string[] = [];
  for (const exerciseId of PRACTICE_UNLOCK_ORDER) {
    unlocked.push(exerciseId);
    if (!store.completed.includes(exerciseId)) {
      break;
    }
  }
  return unlocked;
}

export function countReviewDue(store: ProgressStore): number {
  const allowed = new Set(getUnlockedExerciseIds(store));
  const now = Date.now();
  return store.queue.filter(
    (entry) => allowed.has(entry.exerciseId) && new Date(entry.due).getTime() <= now,
  ).length;
}

export function updateResume(store: ProgressStore, resume: Partial<ResumePoint>): ProgressStore {
  return {
    ...store,
    resume: {
      ...store.resume,
      ...resume,
      updatedAt: nowIso(),
    },
  };
}

export function completeLesson(store: ProgressStore, lessonId: string): ProgressStore {
  const lessonsCompleted = store.lessonsCompleted.includes(lessonId)
    ? store.lessonsCompleted
    : [...store.lessonsCompleted, lessonId];
  const level0Complete = LEVEL_0_LESSONS.every((lesson) => lessonsCompleted.includes(lesson.id));
  const nextLesson = LEVEL_0_LESSONS.find((lesson) => !lessonsCompleted.includes(lesson.id));
  const nextStore = { ...store, lessonsCompleted, level0Complete };

  return updateResume(nextStore, {
    mode: level0Complete ? 'practice' : 'learn',
    lessonId: nextLesson?.id ?? lessonId,
    exerciseId: level0Complete ? getUnlockedExerciseIds(nextStore)[0] : undefined,
  });
}

export function seedQueue(store: ProgressStore, exerciseIds: string[]): ProgressStore {
  const existing = new Set(store.queue.map((entry) => entry.exerciseId));
  const nextQueue = [...store.queue];
  for (const exerciseId of exerciseIds) {
    if (!existing.has(exerciseId)) {
      nextQueue.push({
        exerciseId,
        due: new Date().toISOString(),
        intervalDays: 0,
        ease: 2.5,
      });
    }
  }
  return { ...store, queue: nextQueue };
}

export function pickNextExerciseId(store: ProgressStore, fallbackIds: string[]): string {
  const allowed = new Set(fallbackIds);
  const now = Date.now();
  const due = store.queue
    .filter(
      (entry) => allowed.has(entry.exerciseId) && new Date(entry.due).getTime() <= now,
    )
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

  if (due.length > 0) {
    return due[0].exerciseId;
  }

  if (store.lastExerciseId && allowed.has(store.lastExerciseId)) {
    const index = fallbackIds.indexOf(store.lastExerciseId);
    if (index >= 0) {
      return fallbackIds[(index + 1) % fallbackIds.length];
    }
  }

  return fallbackIds[0];
}

export function recordResult(
  store: ProgressStore,
  exerciseId: string,
  correct: boolean,
  errorTag?: FeedbackTag,
): ProgressStore {
  const exercise = getExerciseDefinition(exerciseId);
  const skillId = exercise ? skillForExercise(exercise) : 'practice:identify-main-connective';
  const prevSkill = store.skills[skillId] ?? emptySkillStat();
  const prevExercise = store.exerciseStats[exerciseId] ?? { attempts: 0, successes: 0 };

  const errorCounts = { ...store.errorCounts };
  if (!correct && errorTag) {
    errorCounts[errorTag] = (errorCounts[errorTag] ?? 0) + 1;
  }

  const entry = store.queue.find((item) => item.exerciseId === exerciseId);
  const completed = store.completed.includes(exerciseId)
    ? store.completed
    : [...store.completed, exerciseId];

  let queue = store.queue;
  if (!entry) {
    queue = [
      ...queue,
      {
        exerciseId,
        due: isoDaysFromNow(correct ? 1 : 0),
        intervalDays: correct ? 1 : 0,
        ease: 2.5,
      },
    ];
  } else {
    const ease = Math.max(1.3, entry.ease + (correct ? 0.1 : -0.2));
    const intervalDays = correct
      ? Math.max(1, entry.intervalDays === 0 ? 1 : Math.round(entry.intervalDays * ease))
      : 0;
    queue = queue.map((item) =>
      item.exerciseId === exerciseId
        ? {
            exerciseId,
            ease,
            intervalDays,
            due: isoDaysFromNow(intervalDays),
          }
        : item,
    );
  }

  return updateResume(
    {
      ...store,
      completed,
      lastExerciseId: exerciseId,
      queue,
      skills: {
        ...store.skills,
        [skillId]: recordSkillAttempt(prevSkill, correct, errorTag),
      },
      exerciseStats: {
        ...store.exerciseStats,
        [exerciseId]: {
          attempts: prevExercise.attempts + 1,
          successes: prevExercise.successes + (correct ? 1 : 0),
          lastErrorTag: correct ? prevExercise.lastErrorTag : errorTag,
        },
      },
      errorCounts,
    },
    { mode: 'practice', exerciseId },
  );
}

export function pickResumeExerciseId(store: ProgressStore): string | null {
  const pool = getUnlockedExerciseIds(store);
  if (pool.length === 0) {
    return null;
  }
  if (store.resume.exerciseId && pool.includes(store.resume.exerciseId)) {
    return store.resume.exerciseId;
  }
  return pickNextExerciseId(store, pool);
}

export { LEVEL_0_LESSONS, PRACTICE_UNLOCK_ORDER };
