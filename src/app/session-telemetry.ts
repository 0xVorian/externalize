import type { SessionTelemetryEvent } from './session-types';

export const SESSION_EVENTS_KEY = 'externalize-session-events-v1';
const MAX_EVENTS = 50;

function storage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function roundDuration(durationMs?: number): number | undefined {
  if (durationMs === undefined) {
    return undefined;
  }
  return Math.round(durationMs / 10_000) * 10_000;
}

export function loadSessionEvents(): SessionTelemetryEvent[] {
  const store = storage();
  if (!store) {
    return [];
  }
  try {
    const raw = store.getItem(SESSION_EVENTS_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SessionTelemetryEvent[]) : [];
  } catch {
    return [];
  }
}

export function recordSessionEvent(
  event: Omit<SessionTelemetryEvent, 'at'> & { at?: string; durationMs?: number },
): void {
  const store = storage();
  if (!store) {
    return;
  }
  const next: SessionTelemetryEvent = {
    kind: event.kind,
    action: event.action,
    stepCount: event.stepCount,
    durationMs: roundDuration(event.durationMs),
    at: event.at ?? new Date().toISOString(),
  };
  const events = [...loadSessionEvents(), next].slice(-MAX_EVENTS);
  try {
    store.setItem(SESSION_EVENTS_KEY, JSON.stringify(events));
  } catch {
    // ignore
  }
}

export function clearSessionEvents(): void {
  const store = storage();
  if (!store) {
    return;
  }
  try {
    store.removeItem(SESSION_EVENTS_KEY);
  } catch {
    // ignore
  }
}
