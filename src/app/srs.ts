import type { SkillId } from './progress-tracker';
import { skillForExercise } from './progress-tracker';
import { getExerciseDefinition } from './exercises';

export type SrsEntry = {
  exerciseId: string;
  due: string;
  intervalDays: number;
  ease: number;
};

export type SrsSkillProfile = {
  initialIntervalDays: number;
  intervalScale: number;
  defaultEase: number;
  easeDeltaCorrect: number;
  easeDeltaIncorrect: number;
  minEase: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const DEFAULT_PROFILE: SrsSkillProfile = {
  initialIntervalDays: 1,
  intervalScale: 1,
  defaultEase: 2.5,
  easeDeltaCorrect: 0.1,
  easeDeltaIncorrect: 0.2,
  minEase: 1.3,
};

export const SRS_SKILL_PROFILES: Record<SkillId, SrsSkillProfile> = {
  'practice:identify-main-connective': { ...DEFAULT_PROFILE },
  'practice:evaluate-formula': { ...DEFAULT_PROFILE, intervalScale: 0.85 },
  'practice:fill-truth-table-cell': { ...DEFAULT_PROFILE, intervalScale: 0.5 },
  'practice:translate-prose-to-formula': { ...DEFAULT_PROFILE, intervalScale: 0.5 },
  'practice:find-counterexample': { ...DEFAULT_PROFILE, intervalScale: 0.55 },
  'practice:classify-tautology': { ...DEFAULT_PROFILE, intervalScale: 0.55 },
  'practice:proof-fill-step': { ...DEFAULT_PROFILE, intervalScale: 0.75 },
};

export function srsProfileForSkill(skillId: SkillId): SrsSkillProfile {
  return SRS_SKILL_PROFILES[skillId] ?? DEFAULT_PROFILE;
}

export function srsSkillForExerciseId(exerciseId: string): SkillId {
  const exercise = getExerciseDefinition(exerciseId);
  return exercise ? skillForExercise(exercise) : 'practice:identify-main-connective';
}

export function srsProfileForExerciseId(exerciseId: string): SrsSkillProfile {
  return srsProfileForSkill(srsSkillForExerciseId(exerciseId));
}

function isoDaysFromNow(days: number): string {
  return new Date(Date.now() + days * DAY_MS).toISOString();
}

export function createSrsEntry(exerciseId: string, dueNow = true): SrsEntry {
  const profile = srsProfileForExerciseId(exerciseId);
  return {
    exerciseId,
    due: dueNow ? new Date().toISOString() : isoDaysFromNow(profile.initialIntervalDays),
    intervalDays: 0,
    ease: profile.defaultEase,
  };
}

function scaledIntervalDays(rawDays: number, profile: SrsSkillProfile): number {
  return Math.max(1, Math.round(rawDays * profile.intervalScale));
}

export function nextSrsEntryAfterResult(
  entry: SrsEntry | undefined,
  exerciseId: string,
  correct: boolean,
): SrsEntry {
  const profile = srsProfileForExerciseId(exerciseId);
  if (!entry) {
    return {
      exerciseId,
      due: isoDaysFromNow(correct ? profile.initialIntervalDays : 0),
      intervalDays: correct ? profile.initialIntervalDays : 0,
      ease: profile.defaultEase,
    };
  }
  const ease = Math.max(
    profile.minEase,
    entry.ease + (correct ? profile.easeDeltaCorrect : -profile.easeDeltaIncorrect),
  );
  const intervalDays = correct
    ? entry.intervalDays === 0
      ? profile.initialIntervalDays
      : scaledIntervalDays(Math.round(entry.intervalDays * ease), profile)
    : 0;
  return { exerciseId, ease, intervalDays, due: isoDaysFromNow(intervalDays) };
}
