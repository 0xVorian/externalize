import type { PersistedSession } from './session-types';

export const SESSION_STORAGE_KEY = 'externalize-active-session-v1';

function storage(): Storage | null {
  try {
    const candidate = globalThis.localStorage;
    return candidate ?? null;
  } catch {
    return null;
  }
}

function isPersistedSession(value: unknown): value is PersistedSession {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as PersistedSession;
  return (
    typeof record.currentIndex === 'number' &&
    typeof record.startedAt === 'string' &&
    (record.status === 'active' || record.status === 'completed') &&
    Boolean(record.plan) &&
    Array.isArray(record.plan.steps)
  );
}

export function loadActiveSession(): PersistedSession | null {
  const store = storage();
  if (!store) {
    return null;
  }
  try {
    const raw = store.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    return isPersistedSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveActiveSession(session: PersistedSession): void {
  const store = storage();
  if (!store) {
    return;
  }
  try {
    store.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Persistence is best-effort and must not affect mastery storage.
  }
}

export function clearActiveSession(): void {
  const store = storage();
  if (!store) {
    return;
  }
  try {
    store.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}
