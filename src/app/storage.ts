import {
  LEVEL_0_LESSONS,
  LEVEL_1_LESSONS,
  ALL_LEARN_LESSONS,
  isLevel0Complete,
  isLevel1Complete,
  isLearnPathComplete,
  firstIncompleteLesson,
  PRACTICE_UNLOCK_ORDER,
  LEVEL_0_PRACTICE_UNLOCK_ORDER,
  LEVEL_1_PRACTICE_UNLOCK_ORDER,
} from './lessons';
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
import type { Locale } from '../i18n';

export type SrsEntry = {
  exerciseId: string;
  due: string;
  intervalDays: number;
  ease: number;
};

export type ProgressStore = {
  version: 5;
  lessonsCompleted: string[];
  level0Complete: boolean;
  level1Complete: boolean;
  queue: SrsEntry[];
  completed: string[];
  lastExerciseId?: string;
  resume: ResumePoint;
  skills: Record<string, SkillStat>;
  exerciseStats: Record<string, ExerciseStat>;
  errorCounts: Partial<Record<FeedbackTag, number>>;
  lastVisitedAt: string;
  onboardingComplete: boolean;
};

const STORAGE_KEY = 'externalize-progress-v1';

export const PROGRESS_EXPORT_KIND = 'externalize-progress-export';
export const PROGRESS_EXPORT_VERSION = 1;

export type ProgressExportBundle = {
  kind: typeof PROGRESS_EXPORT_KIND;
  exportVersion: typeof PROGRESS_EXPORT_VERSION;
  exportedAt: string;
  locale?: Locale;
  progress: unknown;
};

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
    version: 4,
    lessonsCompleted: [],
    level0Complete: false,
    level1Complete: false,
    queue: [],
    completed: [],
    resume: defaultResume(),
    skills: {},
    exerciseStats: {},
    errorCounts: {},
    lastVisitedAt: nowIso(),
    onboardingComplete: false,
  };
}

function migrateStore(raw: unknown): ProgressStore {
  if (!raw || typeof raw !== 'object') {
    return defaultStore();
  }
  const store = raw as Record<string, unknown>;

  if (store.version === 5) return normalizeV5(store);
  if (store.version === 4) return migrateV4ToV5(store);

  if (store.version === 3) {
    return migrateV3ToV4(store);
  }

  if (store.version === 2) {
    const lessonsCompleted = (store.lessonsCompleted as string[] | undefined) ?? [];
    const level0Complete = (store.level0Complete as boolean | undefined) ?? false;
    const lastExerciseId = store.lastExerciseId as string | undefined;
    return migrateV3ToV4({
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
    });
  }

  if (store.version === 1) {
    return migrateStore({ ...store, version: 2, lessonsCompleted: [], level0Complete: false });
  }

  return defaultStore();
}

function normalizeV5(store: Record<string, unknown>): ProgressStore {
  const lessonsCompleted = (store.lessonsCompleted as string[] | undefined) ?? [];
  return {
    version: 5,
    lessonsCompleted,
    level0Complete:
      (store.level0Complete as boolean | undefined) ?? isLevel0Complete(lessonsCompleted),
    level1Complete:
      (store.level1Complete as boolean | undefined) ?? isLevel1Complete(lessonsCompleted),
    queue: (store.queue as SrsEntry[] | undefined) ?? [],
    completed: (store.completed as string[] | undefined) ?? [],
    lastExerciseId: store.lastExerciseId as string | undefined,
    resume: (store.resume as ResumePoint | undefined) ?? defaultResume(),
    skills: (store.skills as Record<string, SkillStat> | undefined) ?? {},
    exerciseStats: (store.exerciseStats as Record<string, ExerciseStat> | undefined) ?? {},
    errorCounts: (store.errorCounts as Partial<Record<FeedbackTag, number>> | undefined) ?? {},
    lastVisitedAt: (store.lastVisitedAt as string | undefined) ?? nowIso(),
    onboardingComplete: (store.onboardingComplete as boolean | undefined) ?? false,
  };
}

function migrateV4ToV5(store: Record<string, unknown>): ProgressStore {
  const lessonsCompleted = (store.lessonsCompleted as string[] | undefined) ?? [];
  return { version:5, lessonsCompleted, level0Complete:(store.level0Complete as boolean|undefined)??isLevel0Complete(lessonsCompleted), level1Complete:(store.level1Complete as boolean|undefined)??isLevel1Complete(lessonsCompleted), queue:(store.queue as SrsEntry[]|undefined)??[], completed:(store.completed as string[]|undefined)??[], lastExerciseId: store.lastExerciseId as string|undefined, resume:(store.resume as ResumePoint|undefined)??defaultResume(), skills:(store.skills as Record<string,SkillStat>|undefined)??{}, exerciseStats:(store.exerciseStats as Record<string,ExerciseStat>|undefined)??{}, errorCounts:(store.errorCounts as Partial<Record<FeedbackTag,number>>|undefined)??{}, lastVisitedAt:(store.lastVisitedAt as string|undefined)??nowIso(), onboardingComplete:true };
}

function migrateV3ToV4(store: Record<string, unknown>): ProgressStore {
  const lessonsCompleted = (store.lessonsCompleted as string[] | undefined) ?? [];
  return migrateV4ToV5({
    version: 4,
    lessonsCompleted,
    level0Complete:
      (store.level0Complete as boolean | undefined) ?? isLevel0Complete(lessonsCompleted),
    level1Complete: isLevel1Complete(lessonsCompleted),
    queue: (store.queue as SrsEntry[] | undefined) ?? [],
    completed: (store.completed as string[] | undefined) ?? [],
    lastExerciseId: store.lastExerciseId as string | undefined,
    resume: (store.resume as ResumePoint | undefined) ?? defaultResume(),
    skills: (store.skills as Record<string, SkillStat> | undefined) ?? {},
    exerciseStats: (store.exerciseStats as Record<string, ExerciseStat> | undefined) ?? {},
    errorCounts: (store.errorCounts as Partial<Record<FeedbackTag, number>> | undefined) ?? {},
    lastVisitedAt: (store.lastVisitedAt as string | undefined) ?? nowIso(),
  });
}

function firstIncompleteLessonId(completed: string[]): string {
  return firstIncompleteLesson(completed).id;
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

export function serializeProgressExport(store: ProgressStore, locale?: Locale): string {
  const bundle: ProgressExportBundle = {
    kind: PROGRESS_EXPORT_KIND,
    exportVersion: PROGRESS_EXPORT_VERSION,
    exportedAt: nowIso(),
    locale,
    progress: store,
  };
  return JSON.stringify(bundle, null, 2);
}

export function parseProgressImport(raw: string): { progress: ProgressStore; locale?: Locale } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Invalid JSON');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid export');
  }

  const record = parsed as Record<string, unknown>;

  if (record.kind === PROGRESS_EXPORT_KIND) {
    if (record.exportVersion !== PROGRESS_EXPORT_VERSION) {
      throw new Error('Unsupported export version');
    }
    const locale = record.locale;
    if (locale !== undefined && locale !== 'en' && locale !== 'fr') {
      throw new Error('Invalid locale in export');
    }
    return {
      progress: migrateStore(record.progress),
      locale: locale as Locale | undefined,
    };
  }

  return { progress: migrateStore(parsed) };
}

export function importProgress(raw: string): { progress: ProgressStore; locale?: Locale } {
  return parseProgressImport(raw);
}

function isoDaysFromNow(days: number): string {
  return new Date(Date.now() + days * DAY_MS).toISOString();
}

export function isPracticeUnlocked(store: ProgressStore): boolean {
  return store.level0Complete;
}

export function isLevel1PracticeUnlocked(store: ProgressStore): boolean {
  return store.level0Complete && isLevel1Complete(store.lessonsCompleted);
}

export type ExerciseLockReason = 'open' | 'done' | 'sequential' | 'unit0' | 'unit1';

function progressiveUnlock(order: readonly string[], completed: string[]): string[] {
  const unlocked: string[] = [];
  for (const exerciseId of order) {
    unlocked.push(exerciseId);
    if (!completed.includes(exerciseId)) {
      break;
    }
  }
  return unlocked;
}

export function getUnlockedExerciseIds(store: ProgressStore): string[] {
  if (!store.level0Complete) {
    return [];
  }
  const unit0 = progressiveUnlock(LEVEL_0_PRACTICE_UNLOCK_ORDER, store.completed);
  if (!isLevel1Complete(store.lessonsCompleted)) {
    return unit0;
  }
  const unit1 = progressiveUnlock(LEVEL_1_PRACTICE_UNLOCK_ORDER, store.completed);
  return [...unit0, ...unit1];
}

export function exerciseLockReason(
  store: ProgressStore,
  exerciseId: string,
): ExerciseLockReason {
  if (store.completed.includes(exerciseId)) {
    return 'done';
  }
  if (getUnlockedExerciseIds(store).includes(exerciseId)) {
    return 'open';
  }
  if ((LEVEL_1_PRACTICE_UNLOCK_ORDER as readonly string[]).includes(exerciseId)) {
    if (!isLevel1Complete(store.lessonsCompleted)) {
      return 'unit1';
    }
    return 'sequential';
  }
  if (!store.level0Complete) {
    return 'unit0';
  }
  return 'sequential';
}

export function countReviewDue(store: ProgressStore): number {
  const allowed = new Set(getUnlockedExerciseIds(store));
  const now = Date.now();
  return store.queue.filter(
    (entry) => allowed.has(entry.exerciseId) && new Date(entry.due).getTime() <= now,
  ).length;
}

export function completeOnboarding(store: ProgressStore): ProgressStore { return { ...store, onboardingComplete: true }; }
export function needsOnboarding(store: ProgressStore): boolean { return !store.onboardingComplete; }
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
  const level0Complete = isLevel0Complete(lessonsCompleted);
  const level1Complete = isLevel1Complete(lessonsCompleted);
  const learnPathComplete = isLearnPathComplete(lessonsCompleted);
  const nextLesson = firstIncompleteLesson(lessonsCompleted);
  const nextStore = { ...store, lessonsCompleted, level0Complete, level1Complete };

  return updateResume(nextStore, {
    mode: learnPathComplete ? 'practice' : 'learn',
    lessonId: nextLesson.id,
    exerciseId: learnPathComplete ? getUnlockedExerciseIds(nextStore)[0] : undefined,
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

export { LEVEL_0_LESSONS, LEVEL_1_LESSONS, ALL_LEARN_LESSONS, PRACTICE_UNLOCK_ORDER };
