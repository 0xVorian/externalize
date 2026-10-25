import {
  LEVEL_0_LESSONS,
  LEVEL_1_LESSONS,
  LEVEL_2_LESSONS,
  isLevel1Complete,
  isLevel2Complete,
} from './lessons';
import {
  PREREQUISITE_BRIDGES,
  isEvidenceStale,
  plannedItemIds,
} from './planner';
import { conceptForItem } from './prerequisites';
import { LOGIC_AND_THEISM_READING_ROUTE_ID } from './routes';
import { plannedSourceItems, sourcePlan } from './source-route';
import { getUnlockedExerciseIds, isPracticeUnlocked, type ProgressStore } from './storage';
import {
  SESSION_MAX,
  SESSION_TARGET,
  type OpeningOffer,
  type PersistedSession,
  type SessionKind,
  type SessionPlan,
  type SessionStep,
} from './session-types';
import { expandItemsToUnits, isTeachingItem } from './session-units';
import {
  bodyItemIdsWithoutWarmupDuplicate,
  fillWarmupBodyItemIds,
  repairStepsForWarmup,
  selectWarmup,
  warmupSteps,
} from './session-warmup';

export {
  applyWarmupMiss,
  applyWarmupMissAfterCheck,
  mostRecentPractisedConcept,
  selectWarmup,
} from './session-warmup';

export {
  SESSION_MAX,
  SESSION_MIN,
  SESSION_TARGET,
} from './session-types';
export type {
  OpeningKind,
  OpeningOffer,
  PersistedSession,
  SessionKind,
  SessionPlan,
  SessionStep,
  SessionStepRole,
} from './session-types';

export function takeEnvelope<T>(items: T[]): T[] {
  if (items.length === 0) {
    return [];
  }
  if (items.length <= SESSION_MAX) {
    return items;
  }
  return items.slice(0, SESSION_TARGET);
}

/**
 * Cluster key for teach–practice cohesion. Planner teach sequences stay
 * together even when an in-sequence check uses a different concept; otherwise
 * consecutive items share a concept, or a single item id.
 */
export function sessionClusterKey(itemId: string): string {
  for (const [requirement, bridge] of Object.entries(PREREQUISITE_BRIDGES)) {
    if (bridge.teach.includes(itemId)) {
      return `teach:${requirement}`;
    }
  }
  return conceptForItem(itemId) ?? `item:${itemId}`;
}

export function groupSessionSteps(steps: SessionStep[]): SessionStep[][] {
  const groups: SessionStep[][] = [];
  for (const step of steps) {
    const key = sessionClusterKey(step.itemId);
    const current = groups[groups.length - 1];
    if (current && sessionClusterKey(current[0]!.itemId) === key) {
      current.push(step);
    } else {
      groups.push([step]);
    }
  }
  return groups;
}

function capSteps(steps: SessionStep[], max: number, target: number): SessionStep[] {
  if (steps.length === 0) {
    return [];
  }
  if (steps.length <= max) {
    return steps;
  }
  return steps.slice(0, Math.min(target, max));
}

/**
 * Cap a step list at 5–7, preferring 6, without ending on a teaching step
 * whose practice in the same cluster was pushed to a later round.
 */
export function takeSessionEnvelope(
  steps: SessionStep[],
  limits?: { max?: number; target?: number },
): SessionStep[] {
  const max = limits?.max ?? SESSION_MAX;
  const target = Math.min(limits?.target ?? SESSION_TARGET, max);
  if (steps.length === 0 || max <= 0) {
    return [];
  }
  if (steps.length <= max) {
    return steps;
  }
  if (!steps.some((step) => isTeachingItem(step.itemId))) {
    return capSteps(steps, max, target);
  }

  const groups = groupSessionSteps(steps);
  const taken: SessionStep[] = [];
  for (const group of groups) {
    const nextCount = taken.length + group.length;
    if (nextCount > max) {
      if (taken.length === 0) {
        // A cluster that still fits the global 7-step max must stay intact even
        // when the body budget is 6 to leave room for a later warm-up prepend.
        if (group.some((step) => isTeachingItem(step.itemId)) && group.length <= SESSION_MAX) {
          return group;
        }
        return capSteps(group, max, target);
      }
      break;
    }
    taken.push(...group);
    if (taken.length >= target) {
      break;
    }
  }
  return taken;
}

export function estimateMinutes(stepCount: number): number {
  if (stepCount <= 0) {
    return 0;
  }
  return Math.max(2, Math.round(stepCount * 0.5));
}

function planId(kind: SessionKind, steps: SessionStep[]): string {
  return `plan-${kind}-${steps.map((step) => step.id).join('|')}`;
}

export function composeSessionPlan(
  store: ProgressStore,
  kind: SessionKind,
  itemIds: string[],
  options?: { preparation?: boolean; now?: number },
): SessionPlan {
  const now = options?.now ?? Date.now();
  const warmup = selectWarmup(store, now, itemIds);
  const remainingIds = warmup
    ? fillWarmupBodyItemIds(
        store,
        bodyItemIdsWithoutWarmupDuplicate(itemIds, warmup),
        warmup,
        now,
      )
    : itemIds;
  const expandedBody = expandItemsToUnits(remainingIds, store);
  // Envelope the rest first (max 6 when a warm-up will be prepended) so a
  // following 7-step cluster is the first group, not a blocked second cluster.
  const body = warmup
    ? takeSessionEnvelope(expandedBody, {
        max: SESSION_MAX - 1,
        target: Math.max(1, SESSION_TARGET - 1),
      })
    : takeSessionEnvelope(expandedBody);
  // Exception to “every round opens with a warm-up”: omit it when the next
  // cluster already needs all 7 slots, so that teach–practice group stays intact.
  const opening =
    warmup && warmupSteps(warmup).length + body.length <= SESSION_MAX
      ? warmupSteps(warmup)
      : [];
  const steps = [...opening, ...body];
  const usedWarmup = opening.length > 0 ? warmup : undefined;
  return {
    id: planId(kind, steps),
    kind,
    steps,
    estimatedMinutes: estimateMinutes(steps.length),
    preparation: options?.preparation,
    warmupConceptId: usedWarmup?.conceptId,
    repairSteps: usedWarmup ? repairStepsForWarmup(store, usedWarmup, now) : undefined,
  };
}

function dueExerciseIds(store: ProgressStore, now: number): string[] {
  const allowed = new Set(getUnlockedExerciseIds(store));
  return store.queue
    .filter((entry) => allowed.has(entry.exerciseId) && Date.parse(entry.due) <= now)
    .sort((a, b) => Date.parse(a.due) - Date.parse(b.due))
    .map((entry) => entry.exerciseId);
}

function nextReviewAt(store: ProgressStore, now: number): string | undefined {
  const allowed = new Set(getUnlockedExerciseIds(store));
  const future = store.queue
    .filter((entry) => allowed.has(entry.exerciseId) && Date.parse(entry.due) > now)
    .sort((a, b) => Date.parse(a.due) - Date.parse(b.due));
  return future[0]?.due;
}

function remainingSourceItems(store: ProgressStore): string[] {
  const seen = new Set(store.routes[LOGIC_AND_THEISM_READING_ROUTE_ID]?.seenItems ?? []);
  return plannedSourceItems(store).filter((itemId) => !seen.has(itemId));
}

function remainingFoundationsItems(store: ProgressStore): string[] {
  const done = new Set(store.lessonsCompleted);
  if (!store.level0Complete) {
    return LEVEL_0_LESSONS.map((lesson) => lesson.id).filter((id) => !done.has(id));
  }
  if (!isLevel1Complete(store.lessonsCompleted)) {
    return LEVEL_1_LESSONS.map((lesson) => lesson.id).filter((id) => !done.has(id));
  }
  if (!isLevel2Complete(store.lessonsCompleted)) {
    return LEVEL_2_LESSONS.map((lesson) => lesson.id).filter((id) => !done.has(id));
  }
  return [];
}

function remainingRouteItems(store: ProgressStore): { items: string[]; preparation: boolean } {
  if (store.activeRouteId === LOGIC_AND_THEISM_READING_ROUTE_ID) {
    const items = remainingSourceItems(store);
    const injected = new Set(plannedItemIds(sourcePlan(store)));
    return {
      items,
      preparation: items.some((itemId) => injected.has(itemId)),
    };
  }
  return { items: remainingFoundationsItems(store), preparation: false };
}

function isFreshLearner(store: ProgressStore): boolean {
  const sourceSeen = store.routes[LOGIC_AND_THEISM_READING_ROUTE_ID]?.seenItems ?? [];
  return store.lessonsCompleted.length === 0 && store.passed.length === 0 && sourceSeen.length === 0;
}

function hasStaleEvidence(store: ProgressStore, now: number): boolean {
  return Object.values(store.conceptEvidence).some((stat) => isEvidenceStale(stat, now));
}

function lapseItemIds(store: ProgressStore, now: number): string[] {
  const ids: string[] = [];
  for (const [key, stat] of Object.entries(store.conceptEvidence)) {
    if (!isEvidenceStale(stat, now)) {
      continue;
    }
    const bridge = PREREQUISITE_BRIDGES[key];
    if (bridge && !ids.includes(bridge.retrieve)) {
      ids.push(bridge.retrieve);
    }
  }
  const unlocked = new Set(getUnlockedExerciseIds(store));
  for (const id of store.passed) {
    if (unlocked.has(id) && !ids.includes(id)) {
      ids.push(id);
    }
  }
  return ids;
}

function withReview(
  offer: OpeningOffer,
  store: ProgressStore,
  now: number,
): OpeningOffer {
  return { ...offer, nextReviewAt: offer.nextReviewAt ?? nextReviewAt(store, now) };
}

export function offerOpening(
  store: ProgressStore,
  persisted: PersistedSession | null,
  now = Date.now(),
): OpeningOffer {
  if (
    persisted?.status === 'active' &&
    persisted.currentIndex < persisted.plan.steps.length
  ) {
    return withReview(
      {
        kind: 'resume',
        plan: persisted.plan,
        resumeIndex: persisted.currentIndex,
      },
      store,
      now,
    );
  }

  if (isPracticeUnlocked(store)) {
    const due = dueExerciseIds(store, now);
    if (due.length > 0) {
      return withReview(
        {
          kind: 'quick-review',
          plan: composeSessionPlan(store, 'quick-review', due, { now }),
        },
        store,
        now,
      );
    }
  }

  if (hasStaleEvidence(store, now)) {
    const remaining = remainingRouteItems(store);
    const remainingIds = new Set(remaining.items);
    const lapse = lapseItemIds(store, now).filter((itemId) => {
      if (store.activeRouteId === LOGIC_AND_THEISM_READING_ROUTE_ID && remainingIds.has(itemId)) {
        return false;
      }
      return true;
    });
    if (lapse.length > 0) {
      return withReview(
        {
          kind: 'lapse-recovery',
          plan: composeSessionPlan(store, 'lapse-recovery', lapse, { now }),
        },
        store,
        now,
      );
    }
  }

  const remaining = remainingRouteItems(store);
  if (remaining.items.length > 0) {
    const kind: SessionKind = isFreshLearner(store) ? 'start' : 'continue';
    return withReview(
      {
        kind,
        plan: composeSessionPlan(store, kind, remaining.items, {
          preparation: remaining.preparation,
          now,
        }),
      },
      store,
      now,
    );
  }

  return withReview({ kind: 'idle', plan: null }, store, now);
}

export function startSession(plan: SessionPlan, nowIso: string): PersistedSession {
  return {
    plan: {
      ...plan,
      steps: plan.steps.map((step) => ({ ...step })),
    },
    currentIndex: 0,
    startedAt: nowIso,
    segmentStartedAt: nowIso,
    status: 'active',
  };
}

export function resumeSession(persisted: PersistedSession, nowIso?: string): PersistedSession {
  if (!nowIso) {
    return persisted;
  }
  return { ...persisted, segmentStartedAt: nowIso };
}

export function sessionSegmentMs(session: PersistedSession, now = Date.now()): number {
  const start = Date.parse(session.segmentStartedAt ?? session.startedAt);
  if (!Number.isFinite(start)) {
    return 0;
  }
  return Math.max(0, now - start);
}

export function currentSessionStep(persisted: PersistedSession): SessionStep | undefined {
  return persisted.plan.steps[persisted.currentIndex];
}

export function sessionPosition(persisted: PersistedSession): { current: number; total: number } {
  return {
    current: Math.min(persisted.currentIndex + 1, persisted.plan.steps.length),
    total: persisted.plan.steps.length,
  };
}

export function isSessionComplete(persisted: PersistedSession): boolean {
  return persisted.status === 'completed' || persisted.currentIndex >= persisted.plan.steps.length;
}

export function completeCurrentStep(persisted: PersistedSession): PersistedSession {
  if (isSessionComplete(persisted)) {
    return persisted.status === 'completed'
      ? persisted
      : { ...persisted, status: 'completed' };
  }
  const currentIndex = persisted.currentIndex + 1;
  return {
    ...persisted,
    currentIndex,
    status: currentIndex >= persisted.plan.steps.length ? 'completed' : 'active',
  };
}
