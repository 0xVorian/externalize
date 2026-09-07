import { afterEach, describe, expect, it } from 'vitest';
import { startSession } from './session-plan';
import {
  SESSION_STORAGE_KEY,
  clearActiveSession,
  loadActiveSession,
  saveActiveSession,
} from './session-persistence';
import {
  SESSION_EVENTS_KEY,
  clearSessionEvents,
  loadSessionEvents,
  recordSessionEvent,
} from './session-telemetry';
import type { SessionPlan } from './session-types';

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear() {
      data.clear();
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
    key(index) {
      return [...data.keys()][index] ?? null;
    },
  };
}

const plan: SessionPlan = {
  id: 'plan-start-a|b',
  kind: 'start',
  estimatedMinutes: 2,
  steps: [
    { id: 'a', source: 'route', itemId: 'a' },
    { id: 'b', source: 'route', itemId: 'b' },
  ],
};

afterEach(() => {
  // @ts-expect-error test storage
  delete globalThis.localStorage;
});

describe('session persistence', () => {
  it('round-trips an active session without touching progress keys', () => {
    const storage = memoryStorage();
    globalThis.localStorage = storage;
    const session = startSession(plan, '2026-09-07T12:00:00.000Z');
    saveActiveSession(session);
    expect(storage.getItem('externalize-progress-v1')).toBeNull();
    expect(loadActiveSession()).toEqual(session);
    clearActiveSession();
    expect(loadActiveSession()).toBeNull();
    expect(storage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });

  it('returns null for invalid JSON', () => {
    const storage = memoryStorage();
    globalThis.localStorage = storage;
    storage.setItem(SESSION_STORAGE_KEY, '{');
    expect(loadActiveSession()).toBeNull();
  });
});

describe('session telemetry', () => {
  it('records offered/started/completed events without mastery fields', () => {
    const storage = memoryStorage();
    globalThis.localStorage = storage;
    recordSessionEvent({ kind: 'start', action: 'offered', stepCount: 5 });
    recordSessionEvent({ kind: 'start', action: 'started', stepCount: 5, durationMs: 14000 });
    recordSessionEvent({ kind: 'start', action: 'completed', stepCount: 5, durationMs: 185000 });
    const events = loadSessionEvents();
    expect(events).toHaveLength(3);
    expect(events[1]?.durationMs).toBe(10000);
    expect(events[2]?.durationMs).toBe(190000);
    expect(JSON.stringify(events)).not.toContain('conceptEvidence');
    expect(JSON.stringify(events)).not.toContain('cleanPasses');
    clearSessionEvents();
    expect(storage.getItem(SESSION_EVENTS_KEY)).toBeNull();
  });
});
