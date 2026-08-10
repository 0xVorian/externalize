import {
  LEVEL_0_LESSONS,
  LEVEL_1_LESSONS,
  LEVEL_2_LESSONS,
  ALL_LEARN_LESSONS,
  isLevel0Complete,
  isLevel1Complete,
  isLevel2Complete,
  isLearnPathComplete,
  firstIncompleteLesson,
  PRACTICE_UNLOCK_ORDER,
  LEVEL_0_PRACTICE_UNLOCK_ORDER,
  LEVEL_1_PRACTICE_UNLOCK_ORDER,
  LEVEL_2_PRACTICE_UNLOCK_ORDER,
} from './lessons';
import {
  type SkillStat,
  type ExerciseStat,
  type ResumePoint,
  emptySkillStat,
  recordSkillAttempt,
  skillForExercise,
} from './progress-tracker';
import { UNIT_1_PRACTICE_CLUSTERS, UNIT_1_CLUSTER_ORDER } from './practice-clusters';
import { getExerciseDefinition } from './exercises';
import { hasEvaluationScaffold, maxScaffoldLevel } from './evaluation-scaffold';
import type { Locale } from '../i18n';
import { type SrsEntry, createSrsEntry, nextSrsEntryAfterResult } from './srs';
import {
  createPracticeAttempt,
  type PracticeDraft,
  type PracticeErrorTag,
} from './practice-attempt';

export type { SrsEntry };

export type ProgressStore = {
  version: 6;
  lessonsCompleted: string[];
  level0Complete: boolean;
  level1Complete: boolean;
  level2Complete: boolean;
  queue: SrsEntry[];
  attempted: string[];
  passed: string[];
  practiceDraft?: PracticeDraft;
  practiceDrafts: Record<string, PracticeDraft>;
  lastExerciseId?: string;
  resume: ResumePoint;
  skills: Record<string, SkillStat>;
  exerciseStats: Record<string, ExerciseStat>;
  errorCounts: Partial<Record<PracticeErrorTag, number>>;
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
    version: 6,
    lessonsCompleted: [],
    level0Complete: false,
    level1Complete: false,
    level2Complete: false,
    queue: [],
    attempted: [],
    passed: [],
    practiceDrafts: {},
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

  if (store.version === 6) return normalizeV6(store);
  if (store.version === 5) return migrateV5ToV6(store);
  if (store.version === 4) return migrateV5ToV6(migrateV4ToV5(store));

  if (store.version === 3) {
    return migrateV5ToV6(migrateV4ToV5(migrateV3ToV4(store)));
  }

  if (store.version === 2) {
    const lessonsCompleted = (store.lessonsCompleted as string[] | undefined) ?? [];
    const level0Complete = (store.level0Complete as boolean | undefined) ?? false;
    const lastExerciseId = store.lastExerciseId as string | undefined;
    return migrateV5ToV6(migrateV4ToV5(migrateV3ToV4({
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
    })));
  }

  if (store.version === 1) {
    return migrateStore({ ...store, version: 2, lessonsCompleted: [], level0Complete: false });
  }

  return defaultStore();
}

function normalizeV6(store: Record<string, unknown>): ProgressStore {
  const lessonsCompleted = (store.lessonsCompleted as string[] | undefined) ?? [];
  const practiceDraft = store.practiceDraft as PracticeDraft | undefined;
  const practiceDrafts = {
    ...((store.practiceDrafts as Record<string, PracticeDraft> | undefined) ?? {}),
  };
  if (practiceDraft) {
    practiceDrafts[practiceDraft.attempt.exerciseId] = practiceDraft;
  }
  return {
    version: 6,
    lessonsCompleted,
    level0Complete:
      (store.level0Complete as boolean | undefined) ?? isLevel0Complete(lessonsCompleted),
    level1Complete:
      (store.level1Complete as boolean | undefined) ?? isLevel1Complete(lessonsCompleted),
    level2Complete:
      (store.level2Complete as boolean | undefined) ?? isLevel2Complete(lessonsCompleted),
    queue: (store.queue as SrsEntry[] | undefined) ?? [],
    attempted: (store.attempted as string[] | undefined) ?? [],
    passed: (store.passed as string[] | undefined) ?? [],
    practiceDraft,
    practiceDrafts,
    lastExerciseId: store.lastExerciseId as string | undefined,
    resume: (store.resume as ResumePoint | undefined) ?? defaultResume(),
    skills: (store.skills as Record<string, SkillStat> | undefined) ?? {},
    exerciseStats: (store.exerciseStats as Record<string, ExerciseStat> | undefined) ?? {},
    errorCounts:
      (store.errorCounts as Partial<Record<PracticeErrorTag, number>> | undefined) ?? {},
    lastVisitedAt: (store.lastVisitedAt as string | undefined) ?? nowIso(),
    onboardingComplete: (store.onboardingComplete as boolean | undefined) ?? false,
  };
}

function migrateV5ToV6(store: Record<string, unknown>): ProgressStore {
  const lessonsCompleted = (store.lessonsCompleted as string[] | undefined) ?? [];
  return {
    version: 6,
    lessonsCompleted,
    level0Complete:
      (store.level0Complete as boolean | undefined) ?? isLevel0Complete(lessonsCompleted),
    level1Complete:
      (store.level1Complete as boolean | undefined) ?? isLevel1Complete(lessonsCompleted),
    level2Complete:
      (store.level2Complete as boolean | undefined) ?? isLevel2Complete(lessonsCompleted),
    queue: [],
    attempted: (store.completed as string[] | undefined) ?? [],
    passed: [],
    practiceDrafts: {},
    lastExerciseId: store.lastExerciseId as string | undefined,
    resume: (store.resume as ResumePoint | undefined) ?? defaultResume(),
    skills: {},
    exerciseStats: {},
    errorCounts: {},
    lastVisitedAt: (store.lastVisitedAt as string | undefined) ?? nowIso(),
    onboardingComplete: (store.onboardingComplete as boolean | undefined) ?? true,
  };
}

function migrateV4ToV5(store: Record<string, unknown>): Record<string, unknown> {
  const lessonsCompleted = (store.lessonsCompleted as string[] | undefined) ?? [];
  return {
    version: 5,
    lessonsCompleted,
    level0Complete:
      (store.level0Complete as boolean | undefined) ?? isLevel0Complete(lessonsCompleted),
    level1Complete:
      (store.level1Complete as boolean | undefined) ?? isLevel1Complete(lessonsCompleted),
    level2Complete: isLevel2Complete(lessonsCompleted),
    queue: (store.queue as SrsEntry[] | undefined) ?? [],
    completed: (store.completed as string[] | undefined) ?? [],
    lastExerciseId: store.lastExerciseId as string | undefined,
    resume: (store.resume as ResumePoint | undefined) ?? defaultResume(),
    skills: (store.skills as Record<string, SkillStat> | undefined) ?? {},
    exerciseStats: (store.exerciseStats as Record<string, ExerciseStat> | undefined) ?? {},
    errorCounts:
      (store.errorCounts as Partial<Record<PracticeErrorTag, number>> | undefined) ?? {},
    lastVisitedAt: (store.lastVisitedAt as string | undefined) ?? nowIso(),
    onboardingComplete: (store.onboardingComplete as boolean | undefined) ?? true,
  };
}


function migrateV3ToV4(store: Record<string, unknown>): Record<string, unknown> {
  const lessonsCompleted = (store.lessonsCompleted as string[] | undefined) ?? [];
  return {
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
    errorCounts:
      (store.errorCounts as Partial<Record<PracticeErrorTag, number>> | undefined) ?? {},
    lastVisitedAt: (store.lastVisitedAt as string | undefined) ?? nowIso(),
  };
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

export function isPracticeUnlocked(store: ProgressStore): boolean {
  return store.level0Complete;
}

export function isLevel1PracticeUnlocked(store: ProgressStore): boolean {
  return store.level0Complete && isLevel1Complete(store.lessonsCompleted);
}


export function isLevel2PracticeUnlocked(store: ProgressStore): boolean {
  return (
    store.level0Complete &&
    isLevel1Complete(store.lessonsCompleted) &&
    isLevel2Complete(store.lessonsCompleted)
  );
}

export type ExerciseLockReason = 'open' | 'done' | 'sequential' | 'unit0' | 'unit1' | 'unit2';

function progressiveUnlock(order: readonly string[], passed: string[]): string[] {
  const unlocked: string[] = [];
  for (const exerciseId of order) {
    unlocked.push(exerciseId);
    if (!passed.includes(exerciseId)) {
      break;
    }
  }
  return unlocked;
}

export function getUnlockedExerciseIds(store: ProgressStore): string[] {
  if (!store.level0Complete) {
    return [];
  }
  const unit0 = progressiveUnlock(LEVEL_0_PRACTICE_UNLOCK_ORDER, store.passed);
  if (!isLevel1Complete(store.lessonsCompleted)) {
    return unit0;
  }
  const unit1 = UNIT_1_CLUSTER_ORDER.flatMap((clusterKey) =>
    progressiveUnlock(UNIT_1_PRACTICE_CLUSTERS[clusterKey], store.passed),
  );
  if (!isLevel2Complete(store.lessonsCompleted)) {
    return [...unit0, ...unit1];
  }
  const unit2 = progressiveUnlock(LEVEL_2_PRACTICE_UNLOCK_ORDER, store.passed);
  return [...unit0, ...unit1, ...unit2];
}

export function exerciseLockReason(
  store: ProgressStore,
  exerciseId: string,
): ExerciseLockReason {
  if (store.passed.includes(exerciseId)) {
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
  if ((LEVEL_2_PRACTICE_UNLOCK_ORDER as readonly string[]).includes(exerciseId)) {
    if (!isLevel2Complete(store.lessonsCompleted)) {
      return 'unit2';
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
  const level2Complete = isLevel2Complete(lessonsCompleted);
  const learnPathComplete = isLearnPathComplete(lessonsCompleted);
  const nextLesson = firstIncompleteLesson(lessonsCompleted);
  const nextStore = { ...store, lessonsCompleted, level0Complete, level1Complete, level2Complete };

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
      nextQueue.push(createSrsEntry(exerciseId));
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

function dueUnlockedEntries(store: ProgressStore, pool: string[]): SrsEntry[] {
  const allowed = new Set(pool);
  const now = Date.now();
  return store.queue
    .filter(
      (entry) => allowed.has(entry.exerciseId) && new Date(entry.due).getTime() <= now,
    )
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
}

function isDueRepairedReview(store: ProgressStore, exerciseId: string): boolean {
  return (
    store.passed.includes(exerciseId) &&
    (store.exerciseStats[exerciseId]?.repairedPasses ?? 0) > 0
  );
}

/** Authoritative next-exercise policy for Continue, What next?, and resume. */
export function selectNextExerciseId(store: ProgressStore): string {
  const pool = getUnlockedExerciseIds(store);
  if (pool.length === 0) {
    throw new Error('No practice exercises unlocked');
  }

  const due = dueUnlockedEntries(store, pool);

  const repairedDue = due.filter((entry) => isDueRepairedReview(store, entry.exerciseId));
  if (repairedDue.length > 0) {
    return repairedDue[0]!.exerciseId;
  }

  const firstUnpassed = pool.find((exerciseId) => !store.passed.includes(exerciseId));
  if (firstUnpassed) {
    return firstUnpassed;
  }

  if (due.length > 0) {
    return due[0]!.exerciseId;
  }

  if (store.resume.exerciseId && pool.includes(store.resume.exerciseId)) {
    return store.resume.exerciseId;
  }

  return pickNextExerciseId(store, pool);
}

export function beginPracticeAttempt(
  store: ProgressStore,
  exerciseId: string,
): ProgressStore {
  if (store.practiceDraft?.attempt.exerciseId === exerciseId) {
    return store;
  }
  const practiceDrafts = { ...store.practiceDrafts };
  if (store.practiceDraft) {
    practiceDrafts[store.practiceDraft.attempt.exerciseId] = store.practiceDraft;
  }
  const practiceDraft =
    practiceDrafts[exerciseId] ?? {
      attempt: createPracticeAttempt(exerciseId),
      phase: 'ready' as const,
    };
  practiceDrafts[exerciseId] = practiceDraft;
  return {
    ...store,
    practiceDraft,
    practiceDrafts,
  };
}

export function persistPracticeDraft(
  store: ProgressStore,
  draft: PracticeDraft,
): ProgressStore {
  if (
    store.practiceDraft &&
    store.practiceDraft.attempt.id !== draft.attempt.id
  ) {
    return store;
  }
  return {
    ...store,
    practiceDraft: draft,
    practiceDrafts: {
      ...store.practiceDrafts,
      [draft.attempt.exerciseId]: draft,
    },
  };
}

export function clearPracticeDraft(store: ProgressStore): ProgressStore {
  const practiceDrafts = { ...store.practiceDrafts };
  if (store.practiceDraft) {
    delete practiceDrafts[store.practiceDraft.attempt.exerciseId];
  }
  const { practiceDraft: _practiceDraft, ...rest } = store;
  return { ...rest, practiceDrafts };
}

export function finalizePracticeAttempt(
  store: ProgressStore,
  draft: PracticeDraft,
): ProgressStore {
  const storedAttempt = store.practiceDraft?.attempt;
  const attempt = draft.attempt;
  if (
    !storedAttempt ||
    storedAttempt.id !== attempt.id ||
    storedAttempt.status === 'finalized' ||
    attempt.status === 'finalized' ||
    attempt.lastCheckCorrect !== true
  ) {
    return store;
  }

  const exerciseId = attempt.exerciseId;
  const exercise = getExerciseDefinition(exerciseId);
  const skillId = exercise ? skillForExercise(exercise) : 'practice:identify-main-connective';
  const prevSkill = store.skills[skillId] ?? emptySkillStat();
  const prevExercise = store.exerciseStats[exerciseId] ?? {
    attempts: 0,
    successes: 0,
    repairedPasses: 0,
  };
  const cleanPass = attempt.firstCheckedCorrect === true;
  const repairedPass = !cleanPass;
  const currentScaffoldLevel = prevExercise.scaffoldLevel ?? 0;
  const nextScaffoldLevel =
    cleanPass && hasEvaluationScaffold(exerciseId)
      ? Math.min(currentScaffoldLevel + 1, maxScaffoldLevel(exerciseId))
      : currentScaffoldLevel;

  const errorCounts = { ...store.errorCounts };
  for (const errorTag of attempt.errorTags) {
    errorCounts[errorTag] = (errorCounts[errorTag] ?? 0) + 1;
  }

  const entry = store.queue.find((item) => item.exerciseId === exerciseId);
  const passed = store.passed.includes(exerciseId)
    ? store.passed
    : [...store.passed, exerciseId];

  // Repaired passes are scheduled like an incorrect response: review remains due
  // immediately and ease decreases. Clean passes advance the interval.
  const nextEntry = nextSrsEntryAfterResult(entry, exerciseId, cleanPass);
  const queue = entry
    ? store.queue.map((item) => (item.exerciseId === exerciseId ? nextEntry : item))
    : [...store.queue, nextEntry];
  const finalizedAttempt = {
    ...attempt,
    status: 'finalized' as const,
    finalizedAt: nowIso(),
  };

  return updateResume(
    {
      ...store,
      passed,
      lastExerciseId: exerciseId,
      queue,
      practiceDraft: { ...draft, attempt: finalizedAttempt },
      practiceDrafts: {
        ...store.practiceDrafts,
        [exerciseId]: { ...draft, attempt: finalizedAttempt },
      },
      skills: {
        ...store.skills,
        [skillId]: recordSkillAttempt(prevSkill, cleanPass, attempt.errorTags),
      },
      exerciseStats: {
        ...store.exerciseStats,
        [exerciseId]: {
          attempts: prevExercise.attempts + 1,
          successes: prevExercise.successes + (cleanPass ? 1 : 0),
          repairedPasses: prevExercise.repairedPasses + (repairedPass ? 1 : 0),
          lastErrorTag:
            attempt.errorTags.at(-1) ?? prevExercise.lastErrorTag,
          scaffoldLevel: nextScaffoldLevel,
        },
      },
      errorCounts,
    },
    { mode: 'practice', exerciseId },
  );
}

export function recordCheckedPracticeState(
  store: ProgressStore,
  draft: PracticeDraft,
): ProgressStore {
  const storedAttempt = store.practiceDraft?.attempt;
  if (
    !storedAttempt ||
    storedAttempt.id !== draft.attempt.id ||
    draft.attempt.checkedAnswers <= storedAttempt.checkedAnswers ||
    storedAttempt.status === 'finalized'
  ) {
    return store;
  }
  const attempted = store.attempted.includes(draft.attempt.exerciseId)
    ? store.attempted
    : [...store.attempted, draft.attempt.exerciseId];
  const withCheck = {
    ...store,
    attempted,
    practiceDraft: draft,
    practiceDrafts: {
      ...store.practiceDrafts,
      [draft.attempt.exerciseId]: draft,
    },
  };
  return draft.attempt.lastCheckCorrect
    ? finalizePracticeAttempt(withCheck, draft)
    : withCheck;
}

export function pickResumeExerciseId(store: ProgressStore): string | null {
  const pool = getUnlockedExerciseIds(store);
  if (pool.length === 0) {
    return null;
  }
  try {
    return selectNextExerciseId(store);
  } catch {
    return null;
  }
}

export {
  LEVEL_0_LESSONS,
  LEVEL_1_LESSONS,
  LEVEL_2_LESSONS,
  ALL_LEARN_LESSONS,
  PRACTICE_UNLOCK_ORDER,
};
