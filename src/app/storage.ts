export type SrsEntry = {
  exerciseId: string;
  due: string;
  intervalDays: number;
  ease: number;
};

export type ProgressStore = {
  version: 1;
  queue: SrsEntry[];
  completed: string[];
  lastExerciseId?: string;
};

const STORAGE_KEY = 'externalize-progress-v1';

const DAY_MS = 24 * 60 * 60 * 1000;

function defaultStore(): ProgressStore {
  return { version: 1, queue: [], completed: [] };
}

export function loadProgress(): ProgressStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultStore();
    }
    const parsed = JSON.parse(raw) as ProgressStore;
    if (parsed.version !== 1) {
      return defaultStore();
    }
    return parsed;
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
  const now = Date.now();
  const due = store.queue
    .filter((entry) => new Date(entry.due).getTime() <= now)
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

  if (due.length > 0) {
    return due[0].exerciseId;
  }

  if (store.lastExerciseId) {
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
      version: 1,
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
    version: 1,
    completed,
    lastExerciseId: exerciseId,
    queue: store.queue.map((item) => (item.exerciseId === exerciseId ? updated : item)),
  };
}
