import { describe, expect, it } from 'vitest';
import { CasConflictError, mergeWithCasRetry } from './progress-cas';
import type { ProgressStore } from './storage';
import { LOGIC_FOUNDATIONS_ROUTE_ID } from './routes';

const T0 = '2026-01-01T00:00:00.000Z';

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
      [LOGIC_FOUNDATIONS_ROUTE_ID]: { currentStepId: 'unit-0-learn', seenItems: [] },
    },
    conceptEvidence: {},
    ...overrides,
  };
}

describe('mergeWithCasRetry', () => {
  it('retries a lost compare-and-swap and keeps both devices’ completions', async () => {
    let revision = 1;
    let snapshot = store({ lessonsCompleted: ['level0-01-letters'] });
    let writes = 0;

    const merged = await mergeWithCasRetry({
      incoming: store({ lessonsCompleted: ['level0-02-truth'] }),
      read: async () => ({ snapshot, revision }),
      write: async (next, expected) => {
        writes += 1;
        if (writes === 1) {
          snapshot = store({ lessonsCompleted: ['level0-01-letters', 'level0-03-and'] });
          revision = 2;
          return expected === 1 ? false : false;
        }
        if (expected !== revision) {
          return false;
        }
        snapshot = next;
        revision += 1;
        return true;
      },
    });

    expect(writes).toBe(2);
    expect(merged.lessonsCompleted).toEqual([
      'level0-02-truth',
      'level0-01-letters',
      'level0-03-and',
    ]);
    expect(snapshot.lessonsCompleted).toEqual(merged.lessonsCompleted);
  });

  it('inserts when there is no stored row', async () => {
    const box: { row: { snapshot: ProgressStore; revision: number } | null } = { row: null };
    const incoming = store({ lessonsCompleted: ['level0-01-letters'] });
    const merged = await mergeWithCasRetry({
      incoming,
      read: async () => box.row,
      write: async (next, expected) => {
        if (expected !== null || box.row) {
          return false;
        }
        box.row = { snapshot: next, revision: 1 };
        return true;
      },
    });
    expect(merged).toEqual(incoming);
    expect(box.row).toEqual({ snapshot: incoming, revision: 1 });
  });

  it('throws after repeated conflicts', async () => {
    await expect(
      mergeWithCasRetry({
        incoming: store(),
        read: async () => ({ snapshot: store(), revision: 1 }),
        write: async () => false,
        maxAttempts: 3,
      }),
    ).rejects.toBeInstanceOf(CasConflictError);
  });
});
