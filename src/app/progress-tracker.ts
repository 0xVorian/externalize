import type { FeedbackTag } from '../../engine';
import type { ExerciseDefinition } from './exercises';

export type SkillId = 'practice:identify-main-connective' | 'practice:evaluate-formula' | 'practice:fill-truth-table-cell';

export function skillForExercise(exercise: ExerciseDefinition): SkillId {
  if (exercise.type === 'evaluate-formula') return 'practice:evaluate-formula';
  if (exercise.type === 'fill-truth-table-cell') return 'practice:fill-truth-table-cell';
  return 'practice:identify-main-connective';
}

export type SkillStat = {
  attempts: number;
  successes: number;
  recentErrorTags: string[];
};

export type ExerciseStat = {
  attempts: number;
  successes: number;
  lastErrorTag?: FeedbackTag;
};

export type ResumePoint = {
  mode: 'learn' | 'practice' | 'progress';
  lessonId?: string;
  watchStep?: number;
  watchComplete?: boolean;
  guidedStep?: number;
  guidedAssignment?: { P: boolean; Q: boolean };
  guidedComplete?: boolean;
  exerciseId?: string;
  updatedAt: string;
};

export type ProgressSummary = {
  level0Done: number;
  level0Total: number;
  lessonsCompleted: string[];
  exercisesUnlocked: string[];
  exercisesCompleted: string[];
  reviewDue: number;
  resume: ResumePoint | null;
  struggles: Array<{ id: string; labelKey: string; rate: number; attempts: number }>;
  comfortable: Array<{ id: string; labelKey: string; rate: number; attempts: number }>;
  frequentErrors: Array<{ tag: FeedbackTag; count: number }>;
};

export function emptySkillStat(): SkillStat {
  return { attempts: 0, successes: 0, recentErrorTags: [] };
}

export function recordSkillAttempt(
  stat: SkillStat,
  correct: boolean,
  errorTag?: FeedbackTag,
): SkillStat {
  const recentErrorTags =
    !correct && errorTag
      ? [errorTag, ...stat.recentErrorTags.filter((t) => t !== errorTag)].slice(0, 5)
      : stat.recentErrorTags;

  return {
    attempts: stat.attempts + 1,
    successes: stat.successes + (correct ? 1 : 0),
    recentErrorTags,
  };
}

export function successRate(stat: SkillStat): number {
  if (stat.attempts === 0) {
    return 0;
  }
  return stat.successes / stat.attempts;
}

export function buildProgressSummary(input: {
  level0Done: number;
  level0Total: number;
  lessonsCompleted: string[];
  exercisesUnlocked: string[];
  exercisesCompleted: string[];
  reviewDue: number;
  resume: ResumePoint | null;
  skills: Record<string, SkillStat>;
  errorCounts: Partial<Record<FeedbackTag, number>>;
}): ProgressSummary {
  const struggles: ProgressSummary['struggles'] = [];
  const comfortable: ProgressSummary['comfortable'] = [];

  for (const [id, stat] of Object.entries(input.skills)) {
    if (stat.attempts < 2) {
      continue;
    }
    const rate = successRate(stat);
    const entry = { id, labelKey: id, rate, attempts: stat.attempts };
    if (rate < 0.6) {
      struggles.push(entry);
    } else if (rate >= 0.8 && stat.attempts >= 3) {
      comfortable.push(entry);
    }
  }

  struggles.sort((a, b) => a.rate - b.rate);
  comfortable.sort((a, b) => b.rate - a.rate);

  const frequentErrors = Object.entries(input.errorCounts)
    .filter(([, count]) => (count ?? 0) > 0)
    .map(([tag, count]) => ({ tag: tag as FeedbackTag, count: count ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    level0Done: input.level0Done,
    level0Total: input.level0Total,
    lessonsCompleted: input.lessonsCompleted,
    exercisesUnlocked: input.exercisesUnlocked,
    exercisesCompleted: input.exercisesCompleted,
    reviewDue: input.reviewDue,
    resume: input.resume,
    struggles,
    comfortable,
    frequentErrors,
  };
}
