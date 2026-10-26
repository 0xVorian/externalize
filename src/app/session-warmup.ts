import { primaryEvidence } from './evidence';
import { getExerciseDefinition } from './exercises';
import { ALL_LEARN_LESSONS } from './lessons';
import { PREREQUISITE_BRIDGES } from './planner';
import { conceptForItem, conceptForLesson } from './prerequisites';
import { SOURCE_LESSONS } from './source-lessons';
import { getUnlockedExerciseIds, type ProgressStore } from './storage';
import { parseEvidenceKey } from './curriculum';
import { expandItemsToUnits, isPracticeItem } from './session-units';
import type { PersistedSession, SessionStep } from './session-types';
import { SESSION_MAX } from './session-types';

const REPAIR_PRACTICE_MAX = 2;

export type WarmupSelection = {
  conceptId: string;
  exerciseId: string;
};

function conceptOfExercise(exerciseId: string): string | undefined {
  return conceptForItem(exerciseId) ?? primaryEvidence(exerciseId)?.concept;
}

function retrieveExerciseForConcept(conceptId: string): string | undefined {
  for (const [key, bridge] of Object.entries(PREREQUISITE_BRIDGES)) {
    if (!key.startsWith(`${conceptId}:`)) {
      continue;
    }
    if (getExerciseDefinition(bridge.retrieve)) {
      return bridge.retrieve;
    }
  }
  return undefined;
}

function canPresentExercise(store: ProgressStore, exerciseId: string): boolean {
  if (!getExerciseDefinition(exerciseId)) {
    return false;
  }
  if (getUnlockedExerciseIds(store).includes(exerciseId)) {
    return true;
  }
  return store.passed.includes(exerciseId);
}

function dueExercisesForConcept(
  store: ProgressStore,
  conceptId: string,
  now: number,
): string[] {
  const allowed = new Set(getUnlockedExerciseIds(store));
  return store.queue
    .filter(
      (entry) =>
        allowed.has(entry.exerciseId) &&
        Date.parse(entry.due) <= now &&
        conceptOfExercise(entry.exerciseId) === conceptId,
    )
    .sort((a, b) => Date.parse(a.due) - Date.parse(b.due))
    .map((entry) => entry.exerciseId);
}

function practisedConceptsByRecency(store: ProgressStore): string[] {
  const ranked: { conceptId: string; at: number }[] = [];
  for (const [key, stat] of Object.entries(store.conceptEvidence)) {
    if (!stat || stat.attempts <= 0 || !stat.lastSeenAt) {
      continue;
    }
    const parsed = parseEvidenceKey(key);
    if (!parsed) {
      continue;
    }
    const at = Date.parse(stat.lastSeenAt);
    if (!Number.isFinite(at)) {
      continue;
    }
    ranked.push({ conceptId: parsed.concept, at });
  }
  ranked.sort((a, b) => b.at - a.at || (a.conceptId < b.conceptId ? 1 : -1));
  const ordered: string[] = [];
  const seen = new Set<string>();
  for (const entry of ranked) {
    if (seen.has(entry.conceptId)) {
      continue;
    }
    seen.add(entry.conceptId);
    ordered.push(entry.conceptId);
  }
  for (let index = store.passed.length - 1; index >= 0; index -= 1) {
    const conceptId = conceptOfExercise(store.passed[index]!);
    if (conceptId && !seen.has(conceptId)) {
      seen.add(conceptId);
      ordered.push(conceptId);
    }
  }
  return ordered;
}

export function mostRecentPractisedConcept(store: ProgressStore): string | undefined {
  return practisedConceptsByRecency(store)[0];
}

function hasTeachSiblingsInPlan(itemId: string, itemIds: readonly string[]): boolean {
  for (const bridge of Object.values(PREREQUISITE_BRIDGES)) {
    if (!bridge.teach.includes(itemId)) {
      continue;
    }
    return itemIds.some((other) => other !== itemId && bridge.teach.includes(other));
  }
  return false;
}

function plannedExerciseForConcept(
  candidateIds: readonly string[] | undefined,
  conceptId: string,
): string | undefined {
  return candidateIds?.find(
    (itemId) =>
      Boolean(getExerciseDefinition(itemId)) &&
      conceptOfExercise(itemId) === conceptId &&
      !hasTeachSiblingsInPlan(itemId, candidateIds),
  );
}

export function selectWarmupExercise(
  store: ProgressStore,
  conceptId: string,
  now = Date.now(),
  candidateIds?: readonly string[],
): string | undefined {
  const planned = plannedExerciseForConcept(candidateIds, conceptId);
  if (planned) {
    return planned;
  }
  const due = dueExercisesForConcept(store, conceptId, now);
  if (due[0] && canPresentExercise(store, due[0])) {
    return due[0];
  }
  const retrieve = retrieveExerciseForConcept(conceptId);
  if (retrieve && canPresentExercise(store, retrieve)) {
    return retrieve;
  }
  for (let index = store.passed.length - 1; index >= 0; index -= 1) {
    const exerciseId = store.passed[index]!;
    if (conceptOfExercise(exerciseId) === conceptId && canPresentExercise(store, exerciseId)) {
      return exerciseId;
    }
  }
  return getUnlockedExerciseIds(store).find((exerciseId) => conceptOfExercise(exerciseId) === conceptId);
}

export function selectWarmup(
  store: ProgressStore,
  now = Date.now(),
  candidateIds?: readonly string[],
): WarmupSelection | undefined {
  for (const conceptId of practisedConceptsByRecency(store)) {
    const exerciseId = selectWarmupExercise(store, conceptId, now, candidateIds);
    if (exerciseId) {
      return { conceptId, exerciseId };
    }
  }
  return undefined;
}

function lessonsOfType(conceptId: string, type: 'card' | 'guided'): string[] {
  return [...ALL_LEARN_LESSONS, ...SOURCE_LESSONS]
    .filter((lesson) => lesson.type === type && conceptForLesson(lesson.id) === conceptId)
    .map((lesson) => lesson.id);
}

function explanationLessonId(store: ProgressStore, conceptId: string): string | undefined {
  const cards = lessonsOfType(conceptId, 'card');
  const seen = cards.find((id) => store.lessonsCompleted.includes(id));
  return seen ?? cards[0];
}

function extraPracticeExercise(
  store: ProgressStore,
  conceptId: string,
  excluded: Set<string>,
  now: number,
): string | undefined {
  const due = dueExercisesForConcept(store, conceptId, now).find((id) => !excluded.has(id));
  if (due) {
    return due;
  }
  const fromPassed = [...store.passed].reverse().find((id) => {
    return !excluded.has(id) && conceptOfExercise(id) === conceptId && canPresentExercise(store, id);
  });
  if (fromPassed) {
    return fromPassed;
  }
  return getUnlockedExerciseIds(store).find(
    (id) => !excluded.has(id) && conceptOfExercise(id) === conceptId,
  );
}

export function repairItemIds(
  store: ProgressStore,
  conceptId: string,
  warmupExerciseId: string,
  now = Date.now(),
): string[] {
  const excluded = new Set<string>([warmupExerciseId]);
  const ids: string[] = [];
  const explanation = explanationLessonId(store, conceptId);
  if (explanation) {
    ids.push(explanation);
    excluded.add(explanation);
  }
  const guided = lessonsOfType(conceptId, 'guided').find((id) => !excluded.has(id));
  if (guided) {
    ids.push(guided);
    excluded.add(guided);
  }
  const practiceCount = ids.filter((id) => isPracticeItem(id)).length;
  if (practiceCount < REPAIR_PRACTICE_MAX) {
    const extra = extraPracticeExercise(store, conceptId, excluded, now);
    if (extra) {
      ids.push(extra);
    }
  }
  return ids;
}

function tagSteps(
  steps: SessionStep[],
  role: 'warmup' | 'repair',
  conceptId: string,
): SessionStep[] {
  return steps.map((step) => ({
    ...step,
    id: `${role}:${step.id}`,
    role,
    conceptId,
  }));
}

export function warmupSteps(selection: WarmupSelection): SessionStep[] {
  return tagSteps(expandItemsToUnits([selection.exerciseId]), 'warmup', selection.conceptId);
}

export function repairStepsForWarmup(
  store: ProgressStore,
  selection: WarmupSelection,
  now = Date.now(),
): SessionStep[] {
  const ids = repairItemIds(store, selection.conceptId, selection.exerciseId, now);
  const steps = tagSteps(expandItemsToUnits(ids), 'repair', selection.conceptId);
  const room = SESSION_MAX - 1;
  return steps.slice(0, room);
}

/**
 * Consume only the exercise chosen as the warm-up. Other due items — including
 * different skills on the same concept — stay in the body. Short lists are not
 * padded with unrelated exercises.
 */
export function bodyItemIdsWithoutWarmupDuplicate(
  itemIds: string[],
  selection: WarmupSelection,
): string[] {
  return itemIds.filter((itemId) => itemId !== selection.exerciseId);
}

function takeRepairTail(repairSteps: SessionStep[], room: number): SessionStep[] {
  if (room <= 0) {
    return [];
  }
  const prefix = repairSteps.slice(0, room).map((step) => ({ ...step }));
  if (prefix.some((step) => isPracticeItem(step.itemId))) {
    return prefix;
  }
  const practice = repairSteps.find((step) => isPracticeItem(step.itemId));
  if (!practice) {
    return prefix;
  }
  if (room === 1) {
    return [{ ...practice }];
  }
  return [...prefix.slice(0, room - 1), { ...practice }];
}

/**
 * Replace the remaining tail with same-concept repair. Longer rounds keep
 * advertised `m` (they may shrink). A short due-review may grow into
 * explanation plus 1–2 practice on that concept, still within SESSION_MAX.
 */
export function applyWarmupMiss(session: PersistedSession): PersistedSession {
  const plan = session.plan;
  const current = plan.steps[session.currentIndex];
  if (plan.repairApplied || current?.role !== 'warmup' || !plan.repairSteps?.length) {
    return session;
  }
  const kept = plan.steps.slice(0, session.currentIndex + 1).map((step) => ({ ...step }));
  const originalTotal = plan.steps.length;
  const frozenRoom = Math.max(0, originalTotal - kept.length);
  const maxRepairRoom = Math.max(0, SESSION_MAX - kept.length);
  const frozen = takeRepairTail(plan.repairSteps, frozenRoom);
  const wanted = takeRepairTail(plan.repairSteps, maxRepairRoom);
  const hasRepairShape =
    frozen.length >= 2 && frozen.some((step) => isPracticeItem(step.itemId));
  const tail = hasRepairShape ? frozen : wanted;
  if (tail.length === 0) {
    return session;
  }
  return {
    ...session,
    plan: {
      ...plan,
      steps: [...kept, ...tail],
      repairApplied: true,
      repairPending: false,
    },
    status: 'active',
  };
}

/**
 * A warm-up Check miss marks repair pending. The remaining steps (and the
 * advertised `n / m`) stay unchanged until the learner leaves the Try again
 * screen; `completeCurrentStep` then applies the tail.
 *
 * Repair is the first submitted Check on the warm-up step, not the first
 * graded cell or scaffold node (`firstCheckedCorrect` can flip before Check).
 */
export function applyWarmupMissAfterCheck(
  session: PersistedSession,
  options: { isFinalCheck: boolean; firstCheckedCorrect: boolean | null },
): PersistedSession {
  if (!options.isFinalCheck || options.firstCheckedCorrect !== false) {
    return session;
  }
  const plan = session.plan;
  const current = plan.steps[session.currentIndex];
  if (
    plan.repairApplied ||
    plan.repairPending ||
    current?.role !== 'warmup' ||
    !plan.repairSteps?.length
  ) {
    return session;
  }
  return {
    ...session,
    plan: {
      ...plan,
      repairPending: true,
    },
  };
}
