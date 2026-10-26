import { mergeProgress, parseProgressStore } from './progress-merge';
import type { ProgressStore } from './storage';
import type { ResumePoint } from './progress-tracker';
import type { SrsEntry } from './srs';

export const SYNC_RETRY_BASE_MS = 800;
export const SYNC_RETRY_MAX_MS = 5 * 60 * 1000;

export type PushOutcome = {
  merged: ProgressStore;
  pendingPush: boolean;
};

/**
 * Re-merge the server snapshot into the *current* local store, not the
 * snapshot that was sent. If local learning state mutated while the request
 * was in flight, keep a pending push so the newer work is uploaded.
 */
export function resolvePushOutcome(input: {
  sent: ProgressStore;
  current: ProgressStore;
  server: ProgressStore;
}): PushOutcome {
  return {
    merged: mergeProgress(input.current, input.server),
    pendingPush: !learningStateEqual(input.sent, input.current),
  };
}

/**
 * Completions, evidence, SRS *values*, drafts, and route state — not
 * `lastVisitedAt`, resume timestamps, or SRS queue order.
 */
export function learningStateEqual(left: ProgressStore, right: ProgressStore): boolean {
  return stableStringify(learningView(left)) === stableStringify(learningView(right));
}

export function shouldInvalidateSession(local: ProgressStore, merged: ProgressStore): boolean {
  return !learningStateEqual(local, merged);
}

export function flagAfterSyncFailure(status: number): { signedIn: boolean; pendingSync: boolean } {
  if (status === 401) {
    return { signedIn: false, pendingSync: true };
  }
  return { signedIn: true, pendingSync: true };
}

/**
 * Delay before the next `/api/sync` POST. `failures === 0` is the local-save
 * debounce (fixed 800 ms). After a failed push the wait doubles each time,
 * with 50–100% jitter, and never exceeds five minutes. A 401 does not use
 * this helper: the queue is kept until the next sign-in.
 */
export function nextSyncRetryDelay(failures: number, random = Math.random()): number {
  if (!Number.isFinite(failures) || failures <= 0) {
    return SYNC_RETRY_BASE_MS;
  }
  const exp = Math.min(Math.floor(failures) - 1, 16);
  const unclamped = SYNC_RETRY_BASE_MS * 2 ** exp;
  const capped = Math.min(unclamped, SYNC_RETRY_MAX_MS);
  return Math.round(capped * (0.5 + random * 0.5));
}

export function nextSyncFailureCount(previous: number): number {
  if (!Number.isFinite(previous) || previous < 0) {
    return 1;
  }
  return previous + 1;
}

/**
 * Parse a `/api/sync` JSON body. `progress: null` is a valid empty snapshot.
 * Anything else that fails `parseProgressStore` is invalid — callers must not
 * write it over local progress.
 */
export function readSyncProgress(
  body: unknown,
): { ok: true; progress: ProgressStore | null } | { ok: false } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false };
  }
  const progress = (body as { progress?: unknown }).progress;
  if (progress === null || progress === undefined) {
    return { ok: true, progress: null };
  }
  const parsed = parseProgressStore(progress);
  if (!parsed) {
    return { ok: false };
  }
  return { ok: true, progress: parsed };
}

function learningView(store: ProgressStore): unknown {
  return {
    version: store.version,
    lessonsCompleted: store.lessonsCompleted,
    level0Complete: store.level0Complete,
    level1Complete: store.level1Complete,
    level2Complete: store.level2Complete,
    queue: queueById(store.queue),
    attempted: store.attempted,
    passed: store.passed,
    practiceDrafts: store.practiceDrafts,
    practiceDraft: store.practiceDraft ?? null,
    lastExerciseId: store.lastExerciseId ?? null,
    resume: resumeWithoutTimestamp(store.resume),
    skills: store.skills,
    exerciseStats: store.exerciseStats,
    errorCounts: store.errorCounts,
    onboardingComplete: store.onboardingComplete,
    activeRouteId: store.activeRouteId,
    routes: store.routes,
    conceptEvidence: store.conceptEvidence,
  };
}

function resumeWithoutTimestamp(resume: ResumePoint): unknown {
  const { updatedAt: _updatedAt, ...rest } = resume;
  return rest;
}

function queueById(queue: SrsEntry[]): Record<string, SrsEntry> {
  const out: Record<string, SrsEntry> = {};
  for (const entry of queue) {
    out[entry.exerciseId] = entry;
  }
  return out;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(record).sort()) {
      out[key] = sortValue(record[key]);
    }
    return out;
  }
  return value;
}
