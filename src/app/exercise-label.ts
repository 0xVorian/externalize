import { getExerciseCopy, progressUi, type Locale } from '../i18n';
import { getExerciseDefinition } from './exercises';
import { skillForExercise } from './progress-tracker';

export function exerciseLabel(locale: Locale, exerciseId: string): string {
  const exercise = getExerciseDefinition(exerciseId);
  if (!exercise) return exerciseId;
  const skill = progressUi(locale).skillLabel(skillForExercise(exercise));
  if (exercise.formula) {
    return `${skill} — ${exercise.formula}`;
  }
  return `${skill} — ${getExerciseCopy(locale, exerciseId).prompt}`;
}
