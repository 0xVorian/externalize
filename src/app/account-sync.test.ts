import { describe, expect, it } from 'vitest';
import {
  flagAfterSyncFailure,
  learningStateEqual,
  nextSyncFailureCount,
  nextSyncRetryDelay,
  readSyncProgress,
  resolvePushOutcome,
  shouldInvalidateSession,
  SYNC_RETRY_BASE_MS,
  SYNC_RETRY_MAX_MS,
} from './account-sync';
import { mergeProgress } from './progress-merge';
import type { ProgressStore } from './storage';
import { LOGIC_FOUNDATIONS_ROUTE_ID } from './routes';

const T0 = '2026-01-01T00:00:00.000Z';
const T1 = '2026-01-02T00:00:00.000Z';
const T2 = '2026-01-03T00:00:00.000Z';

function store(overrides: Partial<ProgressStore> = {}): ProgressStore {
  return {
    version: 7,
    lessonsCompleted: [],
    level0Complete: false,
    level1Complete: false,
    level2Complete: false,
    queue: [],
    attempted: [],
    passed: [],
    practiceDrafts: {},
    resume: {
      mode: 'learn',
      lessonId: 'level0-01-letters',
      updatedAt: T0,
    },
    skills: {},
    exerciseStats: {},
    errorCounts: {},
    lastVisitedAt: T0,
    onboardingComplete: false,
    activeRouteId: LOGIC_FOUNDATIONS_ROUTE_ID,
    routes: {
      [LOGIC_FOUNDATIONS_ROUTE_ID]: {
        currentStepId: 'unit-0-learn',
        seenItems: [],
      },
    },
    conceptEvidence: {},
    ...overrides,
  };
}

describe('resolvePushOutcome', () => {
  it('keeps a local save made while /api/sync is in flight and leaves a pending push', () => {
    const sent = store({
      lessonsCompleted: ['level0-01-letters'],
      passed: ['eval-001'],
      lastVisitedAt: T0,
    });
    const current = store({
      lessonsCompleted: ['level0-01-letters', 'level0-02-truth'],
      passed: ['eval-001', 'eval-002'],
      lastVisitedAt: T1,
    });
    const server = store({
      lessonsCompleted: ['level0-01-letters'],
      passed: ['eval-001'],
      lastVisitedAt: T0,
    });

    const outcome = resolvePushOutcome({ sent, current, server });

    expect(outcome.merged.lessonsCompleted).toEqual(['level0-01-letters', 'level0-02-truth']);
    expect(outcome.merged.passed).toEqual(['eval-001', 'eval-002']);
    expect(outcome.pendingPush).toBe(true);
  });

  it('does not queue another push when local learning state is unchanged during the request', () => {
    const sent = store({
      lessonsCompleted: ['level0-01-letters'],
      lastVisitedAt: T0,
    });
    const current = store({
      lessonsCompleted: ['level0-01-letters'],
      lastVisitedAt: T1,
    });
    const server = store({
      lessonsCompleted: ['level0-01-letters'],
      lastVisitedAt: T0,
    });

    const outcome = resolvePushOutcome({ sent, current, server });
    expect(outcome.pendingPush).toBe(false);
    expect(outcome.merged.lessonsCompleted).toEqual(['level0-01-letters']);
  });

  it('unions in-flight local work with a concurrent remote completion', () => {
    const sent = store({ lessonsCompleted: ['level0-01-letters'] });
    const current = store({ lessonsCompleted: ['level0-01-letters', 'level0-02-truth'] });
    const server = store({ lessonsCompleted: ['level0-01-letters', 'level0-03-and'] });

    const outcome = resolvePushOutcome({ sent, current, server });
    expect(outcome.merged.lessonsCompleted).toEqual([
      'level0-01-letters',
      'level0-02-truth',
      'level0-03-and',
    ]);
    expect(outcome.pendingPush).toBe(true);
  });
});

describe('learningStateEqual / session invalidation', () => {
  it('treats queue order and visit timestamps as the same learning state', () => {
    const live = store({
      lessonsCompleted: ['level0-01-letters'],
      lastVisitedAt: T0,
      resume: { mode: 'learn', lessonId: 'level0-01-letters', updatedAt: T0 },
      queue: [
        { exerciseId: 'eval-002', due: T1, intervalDays: 1, ease: 2.5 },
        { exerciseId: 'eval-001', due: T2, intervalDays: 7, ease: 2.6 },
      ],
    });
    const reordered = store({
      lessonsCompleted: ['level0-01-letters'],
      lastVisitedAt: T2,
      resume: { mode: 'learn', lessonId: 'level0-01-letters', updatedAt: T2 },
      queue: [
        { exerciseId: 'eval-001', due: T2, intervalDays: 7, ease: 2.6 },
        { exerciseId: 'eval-002', due: T1, intervalDays: 1, ease: 2.5 },
      ],
    });

    expect(learningStateEqual(live, reordered)).toBe(true);
    expect(shouldInvalidateSession(live, mergeProgress(live, reordered))).toBe(false);
  });

  it('invalidates only when another device actually changed completions or SRS values', () => {
    const local = store({
      lessonsCompleted: ['level0-01-letters'],
      queue: [{ exerciseId: 'eval-001', due: T1, intervalDays: 1, ease: 2.5 }],
    });
    const remote = store({
      lessonsCompleted: ['level0-01-letters', 'level0-02-truth'],
      queue: [{ exerciseId: 'eval-001', due: T2, intervalDays: 7, ease: 2.6 }],
    });

    expect(learningStateEqual(local, remote)).toBe(false);
    expect(shouldInvalidateSession(local, mergeProgress(local, remote))).toBe(true);
  });
});

describe('flagAfterSyncFailure', () => {
  it('keeps a queued push after 401 so sign-in can re-upload', () => {
    expect(flagAfterSyncFailure(401)).toEqual({ signedIn: false, pendingSync: true });
  });

  it('keeps a queued push after a transport or server error', () => {
    expect(flagAfterSyncFailure(500)).toEqual({ signedIn: true, pendingSync: true });
    expect(flagAfterSyncFailure(0)).toEqual({ signedIn: true, pendingSync: true });
  });
});

describe('nextSyncRetryDelay', () => {
  it('uses the 800 ms debounce on a fresh local save and backs off after failures', () => {
    expect(nextSyncRetryDelay(0, 1)).toBe(SYNC_RETRY_BASE_MS);
    expect(nextSyncRetryDelay(1, 1)).toBe(SYNC_RETRY_BASE_MS);
    expect(nextSyncRetryDelay(2, 1)).toBe(SYNC_RETRY_BASE_MS * 2);
    expect(nextSyncRetryDelay(3, 1)).toBe(SYNC_RETRY_BASE_MS * 4);
    expect(nextSyncRetryDelay(20, 1)).toBe(SYNC_RETRY_MAX_MS);
    expect(nextSyncRetryDelay(2, 0)).toBe(SYNC_RETRY_BASE_MS);
    expect(nextSyncFailureCount(0)).toBe(1);
    expect(nextSyncFailureCount(3)).toBe(4);
  });
});

describe('readSyncProgress', () => {
  it('accepts a missing snapshot and rejects a payload that does not parse', () => {
    expect(readSyncProgress({ progress: null })).toEqual({ ok: true, progress: null });
    expect(readSyncProgress({ progress: store() })).toEqual({ ok: true, progress: store() });
    expect(readSyncProgress({ progress: { ...store(), version: 6 } })).toEqual({ ok: false });
    expect(readSyncProgress({ progress: { ...store(), extra: true } }).ok).toBe(true);
    expect(readSyncProgress('nope')).toEqual({ ok: false });
    expect(readSyncProgress({ progress: { version: 7 } })).toEqual({ ok: false });
  });
});
