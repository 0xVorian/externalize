import { EXERCISE_DEFINITIONS, getExerciseDefinition } from './exercises';
import {
  currentScaffoldLevel,
  nextScaffoldLevel,
  scaffoldHidesMoreIntermediates,
} from './evaluation-scaffold';
import { PRACTICE_UNLOCK_ORDER, lessonUnit, lessonsForUnit } from './lessons';
import {
  RELIABLE_MIN_ATTEMPTS,
  RELIABLE_MIN_RATE,
  TRACKED_SKILL_IDS,
  skillForExercise,
  successRate,
  type SkillId,
  type SkillStat,
} from './progress-tracker';
import { getUnlockedExerciseIds, type ProgressStore } from './storage';

export type CapabilityState = 'locked' | 'ready' | 'developing' | 'reliable';

export type ProgressMoment =
  | { kind: 'capability-reliable'; skillId: SkillId }
  | { kind: 'capability-first-pass'; skillId: SkillId }
  | { kind: 'exercise-unlocked'; exerciseId: string }
  | { kind: 'capability-unlocked'; skillId: SkillId }
  | { kind: 'scaffold-advanced'; exerciseId: string; from: number; to: number };

export type ProgressVisibilitySnapshot = {
  capabilities: Record<SkillId, CapabilityState>;
  unlockedExerciseIds: string[];
  scaffoldLevels: Record<string, number>;
};

export type LearnProgressContext = {
  unit: 0 | 1 | 2;
  lessonPosition: number;
  lessonTotal: number;
  completedInUnit: number;
};

const MOMENT_PRIORITY: ProgressMoment['kind'][] = [
  'capability-reliable',
  'capability-unlocked',
  'exercise-unlocked',
  'scaffold-advanced',
  'capability-first-pass',
];

export function deriveCapabilityState(
  skillId: SkillId,
  store: Pick<ProgressStore, 'skills'> & {
    unlockedExerciseIds?: string[];
  },
  unlockedExerciseIds = store.unlockedExerciseIds ?? [],
): CapabilityState {
  const hasUnlockedExercise = EXERCISE_DEFINITIONS.some(
    (exercise) =>
      skillForExercise(exercise) === skillId && unlockedExerciseIds.includes(exercise.id),
  );
  if (!hasUnlockedExercise) {
    return 'locked';
  }
  const stat: SkillStat | undefined = store.skills[skillId];
  const attempts = stat?.attempts ?? 0;
  if (attempts === 0) {
    return 'ready';
  }
  const rate = successRate(stat ?? { attempts: 0, successes: 0, recentErrorTags: [] });
  if (attempts >= RELIABLE_MIN_ATTEMPTS && rate >= RELIABLE_MIN_RATE) {
    return 'reliable';
  }
  return 'developing';
}

export function deriveCapabilityStates(
  store: Pick<ProgressStore, 'skills'> & { unlockedExerciseIds?: string[] },
  unlockedExerciseIds = store.unlockedExerciseIds ?? [],
): Record<SkillId, CapabilityState> {
  const states = {} as Record<SkillId, CapabilityState>;
  for (const skillId of TRACKED_SKILL_IDS) {
    states[skillId] = deriveCapabilityState(skillId, store, unlockedExerciseIds);
  }
  return states;
}

export function snapshotProgressVisibility(
  store: ProgressStore,
): ProgressVisibilitySnapshot {
  const unlockedExerciseIds = getUnlockedExerciseIds(store);
  const scaffoldLevels: Record<string, number> = {};
  for (const [exerciseId, stat] of Object.entries(store.exerciseStats)) {
    scaffoldLevels[exerciseId] = currentScaffoldLevel(stat.scaffoldLevel);
  }
  return {
    capabilities: deriveCapabilityStates(store, unlockedExerciseIds),
    unlockedExerciseIds,
    scaffoldLevels,
  };
}

export function diffProgressVisibility(
  before: ProgressVisibilitySnapshot,
  after: ProgressVisibilitySnapshot,
  exerciseId?: string,
): ProgressMoment[] {
  const moments: ProgressMoment[] = [];

  for (const skillId of TRACKED_SKILL_IDS) {
    const from = before.capabilities[skillId];
    const to = after.capabilities[skillId];
    if (from === to) {
      continue;
    }
    if (to === 'reliable') {
      moments.push({ kind: 'capability-reliable', skillId });
    }
    if (from === 'locked' && to !== 'locked') {
      moments.push({ kind: 'capability-unlocked', skillId });
    }
    if (from === 'ready' && to === 'developing') {
      moments.push({ kind: 'capability-first-pass', skillId });
    }
  }

  const beforeUnlocked = new Set(before.unlockedExerciseIds);
  for (const id of after.unlockedExerciseIds) {
    if (!beforeUnlocked.has(id)) {
      moments.push({ kind: 'exercise-unlocked', exerciseId: id });
    }
  }

  const scaffoldIds = new Set([
    ...Object.keys(before.scaffoldLevels),
    ...Object.keys(after.scaffoldLevels),
    ...(exerciseId ? [exerciseId] : []),
  ]);
  for (const id of scaffoldIds) {
    const from = currentScaffoldLevel(before.scaffoldLevels[id]);
    const to = currentScaffoldLevel(after.scaffoldLevels[id]);
    if (scaffoldHidesMoreIntermediates(id, from, to)) {
      moments.push({ kind: 'scaffold-advanced', exerciseId: id, from, to });
    }
  }

  return moments;
}

export function selectProgressMoment(
  moments: ProgressMoment[],
): ProgressMoment | null {
  for (const kind of MOMENT_PRIORITY) {
    const match = moments.find((moment) => moment.kind === kind);
    if (match) {
      return match;
    }
  }
  return null;
}

export function nextReadySkillId(
  capabilities: Record<SkillId, CapabilityState>,
): SkillId | undefined {
  const seen = new Set<SkillId>();
  for (const exerciseId of PRACTICE_UNLOCK_ORDER) {
    const exercise = getExerciseDefinition(exerciseId);
    if (!exercise) {
      continue;
    }
    const skillId = skillForExercise(exercise);
    if (seen.has(skillId)) {
      continue;
    }
    seen.add(skillId);
    if (capabilities[skillId] === 'ready') {
      return skillId;
    }
  }
  return TRACKED_SKILL_IDS.find((skillId) => capabilities[skillId] === 'ready');
}

export function deriveLearnProgress(
  lessonId: string,
  lessonsCompleted: string[],
): LearnProgressContext {
  const unit = lessonUnit(lessonId);
  const unitLessons = lessonsForUnit(unit);
  const lessonPosition = unitLessons.findIndex((lesson) => lesson.id === lessonId) + 1;
  const completedInUnit = unitLessons.filter((lesson) =>
    lessonsCompleted.includes(lesson.id),
  ).length;
  return {
    unit,
    lessonPosition: Math.max(1, lessonPosition),
    lessonTotal: unitLessons.length,
    completedInUnit,
  };
}

export function reliableFromStat(stat: SkillStat | undefined): boolean {
  if (!stat || stat.attempts < RELIABLE_MIN_ATTEMPTS) {
    return false;
  }
  return successRate(stat) >= RELIABLE_MIN_RATE;
}

export function describeProgressMoment(
  moment: ProgressMoment,
  copy: {
    momentReliable: (capability: string) => string;
    momentCapabilityUnlocked: (capability: string) => string;
    momentExerciseUnlocked: (exercise: string) => string;
    momentScaffoldAdvanced: string;
    momentFirstPass: (capability: string) => string;
  },
  skillLabel: (id: string) => string,
  exerciseName: (id: string) => string,
): string {
  switch (moment.kind) {
    case 'capability-reliable':
      return copy.momentReliable(skillLabel(moment.skillId));
    case 'capability-unlocked':
      return copy.momentCapabilityUnlocked(skillLabel(moment.skillId));
    case 'exercise-unlocked':
      return copy.momentExerciseUnlocked(exerciseName(moment.exerciseId));
    case 'scaffold-advanced':
      return copy.momentScaffoldAdvanced;
    case 'capability-first-pass':
      return copy.momentFirstPass(skillLabel(moment.skillId));
  }
}

export { nextScaffoldLevel };
