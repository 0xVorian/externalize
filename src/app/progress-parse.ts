import type { ConnectiveKind, Term } from '../../engine';
import type { ConceptCapabilityStat, RouteDepth, RouteProgress } from './curriculum';
import type { PracticeDraft, PracticeAttempt, PracticeErrorTag } from './practice-attempt';
import type { ExerciseStat, ResumePoint, SkillStat } from './progress-tracker';
import type { SrsEntry } from './srs';
import type { ProgressStore } from './storage';
import type { BuilderToken } from './translation/types';

export const MAX_ID_LIST = 4_000;
export const MAX_QUEUE = 2_000;
export const MAX_OBJECT_KEYS = 2_000;
const MAX_ID_LEN = 256;
const MAX_TAG_LIST = 32;
const MAX_ISO_LEN = 40;

/**
 * Deep-parse a progress v7 snapshot. Unknown top-level keys are stripped.
 * Returns null when required fields are missing, mistyped, or oversized.
 */
export function parseProgressStore(value: unknown): ProgressStore | null {
  if (!isPlainObject(value) || value.version !== 7) {
    return null;
  }
  const lessonsCompleted = parseIdList(value.lessonsCompleted);
  const attempted = parseIdList(value.attempted);
  const passed = parseIdList(value.passed);
  const queue = parseQueue(value.queue);
  const practiceDrafts = parseDraftMap(value.practiceDrafts);
  const resume = parseResume(value.resume);
  const skills = parseSkills(value.skills);
  const exerciseStats = parseExerciseStats(value.exerciseStats);
  const errorCounts = parseErrorCounts(value.errorCounts);
  const routes = parseRoutes(value.routes);
  const conceptEvidence = parseConceptEvidence(value.conceptEvidence);
  if (
    !lessonsCompleted ||
    !attempted ||
    !passed ||
    !queue ||
    !practiceDrafts ||
    !resume ||
    !skills ||
    !exerciseStats ||
    !errorCounts ||
    !routes ||
    !conceptEvidence
  ) {
    return null;
  }
  if (
    typeof value.level0Complete !== 'boolean' ||
    typeof value.level1Complete !== 'boolean' ||
    typeof value.level2Complete !== 'boolean' ||
    typeof value.onboardingComplete !== 'boolean' ||
    typeof value.lastVisitedAt !== 'string' ||
    !idString(value.lastVisitedAt, MAX_ISO_LEN) ||
    typeof value.activeRouteId !== 'string' ||
    !idString(value.activeRouteId)
  ) {
    return null;
  }

  const store: ProgressStore = {
    version: 7,
    lessonsCompleted,
    level0Complete: value.level0Complete,
    level1Complete: value.level1Complete,
    level2Complete: value.level2Complete,
    queue,
    attempted,
    passed,
    practiceDrafts,
    resume,
    skills,
    exerciseStats,
    errorCounts,
    lastVisitedAt: value.lastVisitedAt,
    onboardingComplete: value.onboardingComplete,
    activeRouteId: value.activeRouteId,
    routes,
    conceptEvidence,
  };

  if (value.lastExerciseId !== undefined) {
    if (typeof value.lastExerciseId !== 'string' || !idString(value.lastExerciseId)) {
      return null;
    }
    store.lastExerciseId = value.lastExerciseId;
  }
  if (value.practiceDraft !== undefined) {
    const draft = parseDraft(value.practiceDraft);
    if (!draft) {
      return null;
    }
    store.practiceDraft = draft;
  }
  return store;
}

export function isProgressStore(value: unknown): value is ProgressStore {
  return parseProgressStore(value) !== null;
}

function parseIdList(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length > MAX_ID_LIST) {
    return null;
  }
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== 'string' || !idString(item)) {
      return null;
    }
    out.push(item);
  }
  return out;
}

function parseQueue(value: unknown): SrsEntry[] | null {
  if (!Array.isArray(value) || value.length > MAX_QUEUE) {
    return null;
  }
  const out: SrsEntry[] = [];
  for (const item of value) {
    const entry = parseSrs(item);
    if (!entry) {
      return null;
    }
    out.push(entry);
  }
  return out;
}

function parseSrs(value: unknown): SrsEntry | null {
  if (!isPlainObject(value)) {
    return null;
  }
  if (
    typeof value.exerciseId !== 'string' ||
    !idString(value.exerciseId) ||
    typeof value.due !== 'string' ||
    !idString(value.due, MAX_ISO_LEN) ||
    !isFiniteNumber(value.intervalDays) ||
    value.intervalDays < 0 ||
    !isFiniteNumber(value.ease) ||
    value.ease <= 0
  ) {
    return null;
  }
  return {
    exerciseId: value.exerciseId,
    due: value.due,
    intervalDays: value.intervalDays,
    ease: value.ease,
  };
}

function parseResume(value: unknown): ResumePoint | null {
  if (!isPlainObject(value) || typeof value.updatedAt !== 'string' || !idString(value.updatedAt, MAX_ISO_LEN)) {
    return null;
  }
  if (
    value.mode !== 'learn' &&
    value.mode !== 'practice' &&
    value.mode !== 'progress' &&
    value.mode !== 'explore'
  ) {
    return null;
  }
  const resume: ResumePoint = {
    mode: value.mode,
    updatedAt: value.updatedAt,
  };
  if (value.lessonId !== undefined) {
    if (typeof value.lessonId !== 'string' || !idString(value.lessonId)) {
      return null;
    }
    resume.lessonId = value.lessonId;
  }
  if (value.exerciseId !== undefined) {
    if (typeof value.exerciseId !== 'string' || !idString(value.exerciseId)) {
      return null;
    }
    resume.exerciseId = value.exerciseId;
  }
  if (value.watchStep !== undefined) {
    if (!isFiniteNumber(value.watchStep) || value.watchStep < 0) {
      return null;
    }
    resume.watchStep = value.watchStep;
  }
  if (value.guidedStep !== undefined) {
    if (!isFiniteNumber(value.guidedStep) || value.guidedStep < 0) {
      return null;
    }
    resume.guidedStep = value.guidedStep;
  }
  if (value.watchComplete !== undefined) {
    if (typeof value.watchComplete !== 'boolean') {
      return null;
    }
    resume.watchComplete = value.watchComplete;
  }
  if (value.guidedComplete !== undefined) {
    if (typeof value.guidedComplete !== 'boolean') {
      return null;
    }
    resume.guidedComplete = value.guidedComplete;
  }
  if (value.guidedAssignment !== undefined) {
    const assignment = parseAssignment(value.guidedAssignment);
    if (!assignment) {
      return null;
    }
    resume.guidedAssignment = assignment;
  }
  return resume;
}

function parseAssignment(value: unknown): Record<string, boolean> | null {
  if (!isPlainObject(value) || objectKeyCount(value) > 64) {
    return null;
  }
  const out: Record<string, boolean> = {};
  for (const [key, item] of Object.entries(value)) {
    if (!isSafeMapKey(key, 32) || typeof item !== 'boolean') {
      return null;
    }
    out[key] = item;
  }
  return out;
}

function parseSkills(value: unknown): Record<string, SkillStat> | null {
  if (!isPlainObject(value) || objectKeyCount(value) > MAX_OBJECT_KEYS) {
    return null;
  }
  const out: Record<string, SkillStat> = {};
  for (const [key, item] of Object.entries(value)) {
    if (!isSafeMapKey(key) || !isPlainObject(item)) {
      return null;
    }
    const tags = parseStringList(item.recentErrorTags, MAX_TAG_LIST);
    if (
      !isFiniteNumber(item.attempts) ||
      item.attempts < 0 ||
      !isFiniteNumber(item.successes) ||
      item.successes < 0 ||
      !tags
    ) {
      return null;
    }
    out[key] = {
      attempts: item.attempts,
      successes: item.successes,
      recentErrorTags: tags,
    };
  }
  return out;
}

function parseExerciseStats(value: unknown): Record<string, ExerciseStat> | null {
  if (!isPlainObject(value) || objectKeyCount(value) > MAX_OBJECT_KEYS) {
    return null;
  }
  const out: Record<string, ExerciseStat> = {};
  for (const [key, item] of Object.entries(value)) {
    if (!isSafeMapKey(key) || !isPlainObject(item)) {
      return null;
    }
    if (
      !isFiniteNumber(item.attempts) ||
      item.attempts < 0 ||
      !isFiniteNumber(item.successes) ||
      item.successes < 0 ||
      !isFiniteNumber(item.repairedPasses) ||
      item.repairedPasses < 0
    ) {
      return null;
    }
    const next: ExerciseStat = {
      attempts: item.attempts,
      successes: item.successes,
      repairedPasses: item.repairedPasses,
    };
    if (item.lastErrorTag !== undefined) {
      if (typeof item.lastErrorTag !== 'string' || !idString(item.lastErrorTag)) {
        return null;
      }
      next.lastErrorTag = item.lastErrorTag as PracticeErrorTag;
    }
    if (item.scaffoldLevel !== undefined) {
      if (!isFiniteNumber(item.scaffoldLevel) || item.scaffoldLevel < 0) {
        return null;
      }
      next.scaffoldLevel = item.scaffoldLevel;
    }
    if (item.seenAssignmentKeys !== undefined) {
      const seen = parseIdList(item.seenAssignmentKeys);
      if (!seen) {
        return null;
      }
      next.seenAssignmentKeys = seen;
    }
    out[key] = next;
  }
  return out;
}

function parseErrorCounts(value: unknown): ProgressStore['errorCounts'] | null {
  if (!isPlainObject(value) || objectKeyCount(value) > MAX_OBJECT_KEYS) {
    return null;
  }
  const out: ProgressStore['errorCounts'] = {};
  for (const [key, item] of Object.entries(value)) {
    if (!isSafeMapKey(key) || !isFiniteNumber(item) || item < 0) {
      return null;
    }
    out[key as PracticeErrorTag] = item;
  }
  return out;
}

function parseRoutes(value: unknown): Record<string, RouteProgress> | null {
  if (!isPlainObject(value) || objectKeyCount(value) > 64) {
    return null;
  }
  const out: Record<string, RouteProgress> = {};
  for (const [key, item] of Object.entries(value)) {
    if (!isSafeMapKey(key) || !isPlainObject(item)) {
      return null;
    }
    const next: RouteProgress = {};
    if (item.currentStepId !== undefined) {
      if (typeof item.currentStepId !== 'string' || !idString(item.currentStepId)) {
        return null;
      }
      next.currentStepId = item.currentStepId;
    }
    if (item.seenItems !== undefined) {
      const seen = parseIdList(item.seenItems);
      if (!seen) {
        return null;
      }
      next.seenItems = seen;
    }
    if (item.completedAt !== undefined) {
      if (typeof item.completedAt !== 'string' || !idString(item.completedAt, MAX_ISO_LEN)) {
        return null;
      }
      next.completedAt = item.completedAt;
    }
    if (item.depthByStep !== undefined) {
      const depth = parseDepth(item.depthByStep);
      if (!depth) {
        return null;
      }
      next.depthByStep = depth;
    }
    out[key] = next;
  }
  return out;
}

function parseDepth(value: unknown): Record<string, RouteDepth> | null {
  if (!isPlainObject(value) || objectKeyCount(value) > MAX_OBJECT_KEYS) {
    return null;
  }
  const out: Record<string, RouteDepth> = {};
  for (const [key, item] of Object.entries(value)) {
    if (!isSafeMapKey(key) || (item !== 'reading' && item !== 'mastery')) {
      return null;
    }
    out[key] = item;
  }
  return out;
}

function parseConceptEvidence(value: unknown): Record<string, ConceptCapabilityStat> | null {
  if (!isPlainObject(value) || objectKeyCount(value) > MAX_OBJECT_KEYS) {
    return null;
  }
  const out: Record<string, ConceptCapabilityStat> = {};
  for (const [key, item] of Object.entries(value)) {
    if (!isSafeMapKey(key) || !isPlainObject(item)) {
      return null;
    }
    const recentErrors = parseStringList(item.recentErrors, MAX_TAG_LIST);
    if (
      !isFiniteNumber(item.attempts) ||
      item.attempts < 0 ||
      !isFiniteNumber(item.cleanPasses) ||
      item.cleanPasses < 0 ||
      !isFiniteNumber(item.transferPasses) ||
      item.transferPasses < 0 ||
      !recentErrors
    ) {
      return null;
    }
    const next: ConceptCapabilityStat = {
      attempts: item.attempts,
      cleanPasses: item.cleanPasses,
      transferPasses: item.transferPasses,
      recentErrors,
    };
    if (item.lastSeenAt !== undefined) {
      if (typeof item.lastSeenAt !== 'string' || !idString(item.lastSeenAt, MAX_ISO_LEN)) {
        return null;
      }
      next.lastSeenAt = item.lastSeenAt;
    }
    out[key] = next;
  }
  return out;
}

function parseDraftMap(value: unknown): Record<string, PracticeDraft> | null {
  if (!isPlainObject(value) || objectKeyCount(value) > MAX_OBJECT_KEYS) {
    return null;
  }
  const out: Record<string, PracticeDraft> = {};
  for (const [key, item] of Object.entries(value)) {
    if (!isSafeMapKey(key)) {
      return null;
    }
    const draft = parseDraft(item);
    if (!draft) {
      return null;
    }
    out[key] = draft;
  }
  return out;
}

function parseDraft(value: unknown): PracticeDraft | null {
  if (!isPlainObject(value)) {
    return null;
  }
  const attempt = parseAttempt(value.attempt);
  if (!attempt) {
    return null;
  }
  if (value.phase !== 'ready' && value.phase !== 'answered') {
    return null;
  }
  const draft: PracticeDraft = {
    attempt,
    phase: value.phase,
  };
  if (value.assignment !== undefined) {
    const assignment = parseAssignment(value.assignment);
    if (!assignment) {
      return null;
    }
    draft.assignment = assignment;
  }
  if (value.prediction !== undefined) {
    if (value.prediction !== null && typeof value.prediction !== 'boolean') {
      return null;
    }
    draft.prediction = value.prediction;
  }
  if (value.selectedNodeId !== undefined) {
    if (value.selectedNodeId !== null && (typeof value.selectedNodeId !== 'string' || !idString(value.selectedNodeId))) {
      return null;
    }
    draft.selectedNodeId = value.selectedNodeId;
  }
  if (value.selectedChoiceId !== undefined) {
    if (
      value.selectedChoiceId !== null &&
      (typeof value.selectedChoiceId !== 'string' || !idString(value.selectedChoiceId))
    ) {
      return null;
    }
    draft.selectedChoiceId = value.selectedChoiceId;
  }
  if (value.submittedCell !== undefined) {
    if (value.submittedCell !== null && typeof value.submittedCell !== 'boolean') {
      return null;
    }
    draft.submittedCell = value.submittedCell;
  }
  if (value.builderTokens !== undefined) {
    const tokens = parseBuilderTokens(value.builderTokens);
    if (!tokens) {
      return null;
    }
    draft.builderTokens = tokens;
  }
  if (value.proofRule !== undefined) {
    if (value.proofRule !== null && (typeof value.proofRule !== 'string' || !idString(value.proofRule))) {
      return null;
    }
    draft.proofRule = value.proofRule as PracticeDraft['proofRule'];
  }
  if (value.proofCites !== undefined) {
    if (!Array.isArray(value.proofCites) || value.proofCites.length > 32) {
      return null;
    }
    if (!value.proofCites.every((item) => isFiniteNumber(item) && item >= 0)) {
      return null;
    }
    draft.proofCites = value.proofCites;
  }
  if (value.proofDerivedFormula !== undefined) {
    if (
      value.proofDerivedFormula !== null &&
      (typeof value.proofDerivedFormula !== 'string' || value.proofDerivedFormula.length > 2_000)
    ) {
      return null;
    }
    draft.proofDerivedFormula = value.proofDerivedFormula;
  }
  if (value.hintVisible !== undefined) {
    if (typeof value.hintVisible !== 'boolean') {
      return null;
    }
    draft.hintVisible = value.hintVisible;
  }
  if (value.learnerValues !== undefined) {
    const values = parseAssignment(value.learnerValues);
    if (!values) {
      return null;
    }
    draft.learnerValues = values;
  }
  if (value.feedbackTag !== undefined) {
    if (typeof value.feedbackTag !== 'string' || !idString(value.feedbackTag)) {
      return null;
    }
    draft.feedbackTag = value.feedbackTag as PracticeErrorTag;
  }
  return draft;
}

function parseAttempt(value: unknown): PracticeAttempt | null {
  if (!isPlainObject(value)) {
    return null;
  }
  if (
    typeof value.id !== 'string' ||
    !idString(value.id) ||
    typeof value.exerciseId !== 'string' ||
    !idString(value.exerciseId) ||
    (value.status !== 'active' && value.status !== 'finalized') ||
    !isFiniteNumber(value.checkedAnswers) ||
    value.checkedAnswers < 0 ||
    typeof value.repairOccurred !== 'boolean' ||
    typeof value.startedAt !== 'string' ||
    !idString(value.startedAt, MAX_ISO_LEN)
  ) {
    return null;
  }
  if (value.firstCheckedCorrect !== null && typeof value.firstCheckedCorrect !== 'boolean') {
    return null;
  }
  if (value.lastCheckCorrect !== null && typeof value.lastCheckCorrect !== 'boolean') {
    return null;
  }
  const errorTags = parseStringList(value.errorTags, MAX_TAG_LIST);
  if (!errorTags) {
    return null;
  }
  const attempt: PracticeAttempt = {
    id: value.id,
    exerciseId: value.exerciseId,
    status: value.status,
    checkedAnswers: value.checkedAnswers,
    firstCheckedCorrect: value.firstCheckedCorrect,
    lastCheckCorrect: value.lastCheckCorrect,
    repairOccurred: value.repairOccurred,
    errorTags: errorTags as PracticeErrorTag[],
    startedAt: value.startedAt,
  };
  if (value.finalizedAt !== undefined) {
    if (typeof value.finalizedAt !== 'string' || !idString(value.finalizedAt, MAX_ISO_LEN)) {
      return null;
    }
    attempt.finalizedAt = value.finalizedAt;
  }
  return attempt;
}

function parseStringList(value: unknown, cap: number): string[] | null {
  if (!Array.isArray(value) || value.length > cap) {
    return null;
  }
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== 'string' || !idString(item)) {
      return null;
    }
    out.push(item);
  }
  return out;
}

function parseBuilderTokens(value: unknown): BuilderToken[] | null {
  if (!Array.isArray(value) || value.length > 200) {
    return null;
  }
  const out: BuilderToken[] = [];
  for (const item of value) {
    const token = parseBuilderToken(item);
    if (!token) {
      return null;
    }
    out.push(token);
  }
  return out;
}

function parseBuilderToken(value: unknown): BuilderToken | null {
  if (!isPlainObject(value)) {
    return null;
  }
  if (value.kind === 'paren') {
    if (value.side !== 'open' && value.side !== 'close') {
      return null;
    }
    return { kind: 'paren', side: value.side };
  }
  if (value.kind === 'connective') {
    if (!isConnectiveKind(value.connective)) {
      return null;
    }
    return { kind: 'connective', connective: value.connective };
  }
  if (value.kind === 'pred') {
    if (typeof value.name !== 'string' || !idString(value.name, 32)) {
      return null;
    }
    if (!Array.isArray(value.args) || value.args.length > 8) {
      return null;
    }
    const args: Term[] = [];
    for (const arg of value.args) {
      const term = parseTerm(arg);
      if (!term) {
        return null;
      }
      args.push(term);
    }
    return { kind: 'pred', name: value.name, args };
  }
  return null;
}

function parseTerm(value: unknown): Term | null {
  if (!isPlainObject(value)) {
    return null;
  }
  if ((value.kind === 'const' || value.kind === 'var') && typeof value.name === 'string' && idString(value.name, 32)) {
    return { kind: value.kind, name: value.name };
  }
  return null;
}

function isConnectiveKind(value: unknown): value is ConnectiveKind {
  return (
    value === 'not' ||
    value === 'and' ||
    value === 'or' ||
    value === 'imp' ||
    value === 'iff' ||
    value === 'forall' ||
    value === 'exists'
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isSafeMapKey(value: string, max = MAX_ID_LEN): boolean {
  return value !== '__proto__' && value !== 'constructor' && value !== 'prototype' && idString(value, max);
}

function objectKeyCount(value: Record<string, unknown>): number {
  return Object.keys(value).length;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function idString(value: string, max = MAX_ID_LEN): boolean {
  return value.length > 0 && value.length <= max;
}
