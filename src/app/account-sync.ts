import { mergeProgress } from './progress-merge';
import type { ProgressStore } from './storage';
import type { ResumePoint } from './progress-tracker';
import type { SrsEntry } from './srs';

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
