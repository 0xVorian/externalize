import type { ConceptCapabilityStat, RouteDepth, RouteProgress } from './curriculum';
import type { PracticeDraft } from './practice-attempt';
import type { ExerciseStat, ResumePoint, SkillStat } from './progress-tracker';
import type { SrsEntry } from './srs';
import type { ProgressStore } from './storage';

export { isProgressStore, parseProgressStore } from './progress-parse';

/**
 * Deterministic per-item merge of two progress v7 snapshots.
 *
 * Argument order is `(left, right)`. The client passes `(local, remote)`;
 * the server passes `(incoming, stored)`.
 *
 * Rules, chosen so neither device loses completions or evidence:
 * - Lesson / exercise completion, attempted IDs, and onboarding are unions.
 * - Unit-complete flags are OR'd (monotonic).
 * - Skill, exercise, error, and concept-evidence counters take the per-field
 *   maximum so shared history is not double-counted after a later sync.
 * - SRS keeps the more advanced schedule (larger interval, then ease, then
 *   later due). A lagging device's failure does not rewind a more advanced
 *   interval.
 * - Resume, active route, and last exercise follow the later timestamp;
 *   equal timestamps prefer `left`.
 * - Practice drafts are kept per exercise; a finalized attempt beats an
 *   active one; otherwise more checks / later start win.
 * - Bounded sessions (`externalize-active-session-v1`) are not part of this
 *   snapshot. Callers should invalidate a local in-flight session only when
 *   learning state differs (completions, evidence, SRS values, drafts), not
 *   when queue order or visit timestamps change.
 */
export function mergeProgress(left: ProgressStore, right: ProgressStore): ProgressStore {
  const lessonsCompleted = unionIds(left.lessonsCompleted, right.lessonsCompleted);
  const attempted = unionIds(left.attempted, right.attempted);
  const passed = unionIds(left.passed, right.passed);
  const laterLeft = compareIso(left.lastVisitedAt, right.lastVisitedAt) >= 0;
  const practiceDrafts = mergePracticeDrafts(left.practiceDrafts, right.practiceDrafts);
  const lastExerciseId = pickRecencyValue(
    left.lastExerciseId,
    right.lastExerciseId,
    left.lastVisitedAt,
    right.lastVisitedAt,
  );
  const practiceDraft = pickCurrentDraft(practiceDrafts, lastExerciseId, left, right);

  const merged: ProgressStore = {
    version: 7,
    lessonsCompleted,
    level0Complete: left.level0Complete || right.level0Complete,
    level1Complete: left.level1Complete || right.level1Complete,
    level2Complete: left.level2Complete || right.level2Complete,
    queue: mergeQueue(left.queue, right.queue),
    attempted,
    passed,
    practiceDrafts,
    resume: mergeResume(left.resume, right.resume),
    skills: mergeSkills(left.skills, right.skills),
    exerciseStats: mergeExerciseStats(left.exerciseStats, right.exerciseStats),
    errorCounts: mergeErrorCounts(left.errorCounts, right.errorCounts),
    lastVisitedAt: laterIso(left.lastVisitedAt, right.lastVisitedAt),
    onboardingComplete: left.onboardingComplete || right.onboardingComplete,
    activeRouteId: laterLeft ? left.activeRouteId : right.activeRouteId,
    routes: mergeRoutes(left.routes, right.routes, laterLeft),
    conceptEvidence: mergeConceptEvidence(left.conceptEvidence, right.conceptEvidence),
  };

  if (lastExerciseId) {
    merged.lastExerciseId = lastExerciseId;
  }
  if (practiceDraft) {
    merged.practiceDraft = practiceDraft;
  }
  return merged;
}

export function progressSnapshotsEqual(left: ProgressStore, right: ProgressStore): boolean {
  return stableStringify(left) === stableStringify(right);
}

function unionIds(left: string[], right: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of [...left, ...right]) {
    if (seen.has(id)) {
      continue;
    }
    seen.add(id);
    out.push(id);
  }
  return out;
}

function compareIso(left: string, right: string): number {
  if (left === right) {
    return 0;
  }
  return left < right ? -1 : 1;
}

function laterIso(left: string, right: string): string {
  return compareIso(left, right) >= 0 ? left : right;
}

function earlierIso(left: string, right: string): string {
  return compareIso(left, right) <= 0 ? left : right;
}

function pickRecencyValue(
  left: string | undefined,
  right: string | undefined,
  leftAt: string,
  rightAt: string,
): string | undefined {
  if (left && right) {
    return compareIso(leftAt, rightAt) >= 0 ? left : right;
  }
  return left ?? right;
}

function mergeQueue(left: SrsEntry[], right: SrsEntry[]): SrsEntry[] {
  const byId = new Map<string, SrsEntry>();
  for (const entry of left) {
    byId.set(entry.exerciseId, entry);
  }
  const extras: SrsEntry[] = [];
  for (const entry of right) {
    const existing = byId.get(entry.exerciseId);
    if (existing) {
      byId.set(entry.exerciseId, pickSrs(existing, entry));
    } else {
      byId.set(entry.exerciseId, entry);
      extras.push(entry);
    }
  }
  const out: SrsEntry[] = [];
  const seen = new Set<string>();
  for (const entry of left) {
    if (seen.has(entry.exerciseId)) {
      continue;
    }
    seen.add(entry.exerciseId);
    out.push(byId.get(entry.exerciseId)!);
  }
  for (const entry of extras) {
    out.push(byId.get(entry.exerciseId)!);
  }
  return out;
}

function pickSrs(left: SrsEntry, right: SrsEntry): SrsEntry {
  if (left.intervalDays !== right.intervalDays) {
    return left.intervalDays > right.intervalDays ? left : right;
  }
  if (left.ease !== right.ease) {
    return left.ease > right.ease ? left : right;
  }
  if (left.due !== right.due) {
    return compareIso(left.due, right.due) >= 0 ? left : right;
  }
  return left;
}

function mergeResume(left: ResumePoint, right: ResumePoint): ResumePoint {
  return compareIso(left.updatedAt, right.updatedAt) >= 0 ? left : right;
}

function mergeSkills(
  left: Record<string, SkillStat>,
  right: Record<string, SkillStat>,
): Record<string, SkillStat> {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  const out: Record<string, SkillStat> = {};
  for (const key of keys) {
    const a = left[key];
    const b = right[key];
    if (!a) {
      out[key] = b!;
      continue;
    }
    if (!b) {
      out[key] = a;
      continue;
    }
    const attempts = Math.max(a.attempts, b.attempts);
    const successes = Math.min(attempts, Math.max(a.successes, b.successes));
    const preferred = a.attempts >= b.attempts ? a.recentErrorTags : b.recentErrorTags;
    const other = a.attempts >= b.attempts ? b.recentErrorTags : a.recentErrorTags;
    out[key] = {
      attempts,
      successes,
      recentErrorTags: mergeRecent(preferred, other, 5),
    };
  }
  return out;
}

function mergeExerciseStats(
  left: Record<string, ExerciseStat>,
  right: Record<string, ExerciseStat>,
): Record<string, ExerciseStat> {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  const out: Record<string, ExerciseStat> = {};
  for (const key of keys) {
    const a = left[key];
    const b = right[key];
    if (!a) {
      out[key] = b!;
      continue;
    }
    if (!b) {
      out[key] = a;
      continue;
    }
    const successes = Math.max(a.successes, b.successes);
    const repairedPasses = Math.max(a.repairedPasses, b.repairedPasses);
    const attempts = Math.max(a.attempts, b.attempts, successes + repairedPasses);
    const preferred = a.attempts >= b.attempts ? a : b;
    const seen = unionIds(a.seenAssignmentKeys ?? [], b.seenAssignmentKeys ?? []);
    const next: ExerciseStat = {
      attempts,
      successes,
      repairedPasses,
    };
    const scaffoldLevel = Math.max(a.scaffoldLevel ?? 0, b.scaffoldLevel ?? 0);
    if (scaffoldLevel > 0) {
      next.scaffoldLevel = scaffoldLevel;
    }
    if (seen.length > 0) {
      next.seenAssignmentKeys = seen;
    }
    if (preferred.lastErrorTag) {
      next.lastErrorTag = preferred.lastErrorTag;
    }
    out[key] = next;
  }
  return out;
}

function mergeErrorCounts(
  left: ProgressStore['errorCounts'],
  right: ProgressStore['errorCounts'],
): ProgressStore['errorCounts'] {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  const out: ProgressStore['errorCounts'] = {};
  for (const key of keys) {
    const tag = key as keyof ProgressStore['errorCounts'];
    out[tag] = Math.max(left[tag] ?? 0, right[tag] ?? 0);
  }
  return out;
}

function mergeConceptEvidence(
  left: Record<string, ConceptCapabilityStat>,
  right: Record<string, ConceptCapabilityStat>,
): Record<string, ConceptCapabilityStat> {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  const out: Record<string, ConceptCapabilityStat> = {};
  for (const key of keys) {
    const a = left[key];
    const b = right[key];
    if (!a) {
      out[key] = b!;
      continue;
    }
    if (!b) {
      out[key] = a;
      continue;
    }
    const attempts = Math.max(a.attempts, b.attempts);
    const cleanPasses = Math.min(attempts, Math.max(a.cleanPasses, b.cleanPasses));
    const transferPasses = Math.min(attempts, Math.max(a.transferPasses, b.transferPasses));
    const preferred = a.attempts >= b.attempts ? a.recentErrors : b.recentErrors;
    const other = a.attempts >= b.attempts ? b.recentErrors : a.recentErrors;
    const lastSeenAt =
      a.lastSeenAt && b.lastSeenAt
        ? laterIso(a.lastSeenAt, b.lastSeenAt)
        : (a.lastSeenAt ?? b.lastSeenAt);
    const next: ConceptCapabilityStat = {
      attempts,
      cleanPasses,
      transferPasses,
      recentErrors: mergeRecent(preferred, other, 5),
    };
    if (lastSeenAt) {
      next.lastSeenAt = lastSeenAt;
    }
    out[key] = next;
  }
  return out;
}

function mergeRoutes(
  left: Record<string, RouteProgress>,
  right: Record<string, RouteProgress>,
  preferLeftCurrent: boolean,
): Record<string, RouteProgress> {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  const out: Record<string, RouteProgress> = {};
  for (const key of keys) {
    const a = left[key];
    const b = right[key];
    if (!a) {
      out[key] = b!;
      continue;
    }
    if (!b) {
      out[key] = a;
      continue;
    }
    const seenItems = unionIds(a.seenItems ?? [], b.seenItems ?? []);
    const currentStepId = preferLeftCurrent
      ? (a.currentStepId ?? b.currentStepId)
      : (b.currentStepId ?? a.currentStepId);
    const completedAt =
      a.completedAt && b.completedAt
        ? earlierIso(a.completedAt, b.completedAt)
        : (a.completedAt ?? b.completedAt);
    const depthByStep = mergeDepth(a.depthByStep, b.depthByStep);
    const next: RouteProgress = {};
    if (currentStepId) {
      next.currentStepId = currentStepId;
    }
    next.seenItems = seenItems;
    if (completedAt) {
      next.completedAt = completedAt;
    }
    if (Object.keys(depthByStep).length > 0) {
      next.depthByStep = depthByStep;
    }
    out[key] = next;
  }
  return out;
}

function mergeDepth(
  left: Record<string, RouteDepth> | undefined,
  right: Record<string, RouteDepth> | undefined,
): Record<string, RouteDepth> {
  const keys = new Set([...Object.keys(left ?? {}), ...Object.keys(right ?? {})]);
  const out: Record<string, RouteDepth> = {};
  for (const key of keys) {
    const a = left?.[key];
    const b = right?.[key];
    if (a === 'mastery' || b === 'mastery') {
      out[key] = 'mastery';
    } else {
      out[key] = a ?? b ?? 'reading';
    }
  }
  return out;
}

function mergePracticeDrafts(
  left: Record<string, PracticeDraft>,
  right: Record<string, PracticeDraft>,
): Record<string, PracticeDraft> {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  const out: Record<string, PracticeDraft> = {};
  for (const key of keys) {
    const a = left[key];
    const b = right[key];
    if (!a) {
      out[key] = b!;
      continue;
    }
    if (!b) {
      out[key] = a;
      continue;
    }
    out[key] = pickDraft(a, b);
  }
  return out;
}

function pickDraft(left: PracticeDraft, right: PracticeDraft): PracticeDraft {
  if (left.attempt.status !== right.attempt.status) {
    return left.attempt.status === 'finalized' ? left : right;
  }
  if (left.attempt.checkedAnswers !== right.attempt.checkedAnswers) {
    return left.attempt.checkedAnswers > right.attempt.checkedAnswers ? left : right;
  }
  if (left.attempt.startedAt !== right.attempt.startedAt) {
    return compareIso(left.attempt.startedAt, right.attempt.startedAt) >= 0 ? left : right;
  }
  return left;
}

function pickCurrentDraft(
  drafts: Record<string, PracticeDraft>,
  lastExerciseId: string | undefined,
  left: ProgressStore,
  right: ProgressStore,
): PracticeDraft | undefined {
  if (lastExerciseId && drafts[lastExerciseId]) {
    return drafts[lastExerciseId];
  }
  if (left.practiceDraft && drafts[left.practiceDraft.attempt.exerciseId]) {
    return drafts[left.practiceDraft.attempt.exerciseId];
  }
  if (right.practiceDraft && drafts[right.practiceDraft.attempt.exerciseId]) {
    return drafts[right.practiceDraft.attempt.exerciseId];
  }
  return undefined;
}

function mergeRecent(preferred: string[], other: string[], cap: number): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const tag of [...preferred, ...other]) {
    if (seen.has(tag)) {
      continue;
    }
    seen.add(tag);
    out.push(tag);
    if (out.length >= cap) {
      break;
    }
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
