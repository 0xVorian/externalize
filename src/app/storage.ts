import { LEVEL_0_LESSONS, PRACTICE_UNLOCK_ORDER } from './lessons';

export type SrsEntry = {
  exerciseId: string;
  due: string;
  intervalDays: number;
  ease: number;
};

export type ProgressStore = {
  version: 2;
  lessonsCompleted: string[];
  level0Complete: boolean;
  queue: SrsEntry[];
  completed: string[];
  lastExerciseId?: string;
};

const STORAGE_KEY = 'externalize-progress-v1';

const DAY_MS = 24 * 60 * 60 * 1000;

function defaultStore(): ProgressStore {
  return {
    version: 2,
    lessonsCompleted: [],
    level0Complete: false,
    queue: [],
    completed: [],
  };
}

function migrateStore(raw: unknown): ProgressStore {
  if (!raw || typeof raw !== 'object') {
    return defaultStore();
  }
  const store = raw as Record<string, unknown>;
  if (store.version === 2) {
    return {
      version: 2,
      lessonsCompleted: (store.lessonsCompleted as string[] | undefined) ?? [],
      level0Complete: (store.level0Complete as boolean | undefined) ?? false,
      queue: (store.queue as SrsEntry[] | undefined) ?? [],
      completed: (store.completed as string[] | undefined) ?? [],
      lastExerciseId: store.lastExerciseId as string | undefined,
    };
  }
  if (store.version === 1) {
    return {
      version: 2,
      lessonsCompleted: [],
      level0Complete: false,
      queue: (store.queue as SrsEntry[] | undefined) ?? [],
      completed: (store.completed as string[] | undefined) ?? [],
      lastExerciseId: store.lastExerciseId as string | undefined,
    };
  }
  return defaultStore();
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

export function saveProgress(store: ProgressStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
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

export function completeLesson(store: ProgressStore, lessonId: string): ProgressStore {
  const lessonsCompleted = store.lessonsCompleted.includes(lessonId)
    ? store.lessonsCompleted
    : [...store.lessonsCompleted, lessonId];
  const level0Complete = LEVEL_0_LESSONS.every((lesson) => lessonsCompleted.includes(lesson.id));
  return {
    ...store,
    lessonsCompleted,
    level0Complete,
  };
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
): ProgressStore {
  const entry = store.queue.find((item) => item.exerciseId === exerciseId);
  const completed = store.completed.includes(exerciseId)
    ? store.completed
    : [...store.completed, exerciseId];

  if (!entry) {
    const fresh: SrsEntry = {
      exerciseId,
      due: isoDaysFromNow(correct ? 1 : 0),
      intervalDays: correct ? 1 : 0,
      ease: 2.5,
    };
    return {
      ...store,
      completed,
      lastExerciseId: exerciseId,
      queue: [...store.queue, fresh],
    };
  }

  const ease = Math.max(1.3, entry.ease + (correct ? 0.1 : -0.2));
  const intervalDays = correct
    ? Math.max(1, entry.intervalDays === 0 ? 1 : Math.round(entry.intervalDays * ease))
    : 0;

  const updated: SrsEntry = {
    exerciseId,
    ease,
    intervalDays,
    due: isoDaysFromNow(intervalDays),
  };

  return {
    ...store,
    completed,
    lastExerciseId: exerciseId,
    queue: store.queue.map((item) => (item.exerciseId === exerciseId ? updated : item)),
  };
}
