import { describe, expect, it } from 'vitest';
import { EXERCISE_DEFINITIONS } from '../app/exercises';
import { getExerciseCopy, getFeedbackTemplates, ui, formatTruthValue, formatAssignmentLine } from './messages';

describe('i18n', () => {
  for (const locale of ['en', 'fr'] as const) {
    it(`provides UI copy for ${locale}`, () => {
      expect(ui(locale).practice).toBeTruthy();
      expect(ui(locale).continue).toBeTruthy();
      expect(ui(locale).assignmentHint).toBeTruthy();
    });

    it(`provides exercise copy for every definition in ${locale}`, () => {
      for (const exercise of EXERCISE_DEFINITIONS) {
        const copy = getExerciseCopy(locale, exercise.id);
        expect(copy.prompt.length).toBeGreaterThan(0);
        expect(getFeedbackTemplates(locale, exercise.id).correct).toBeTruthy();
      }
    });

    it(`uses locale truth labels in ${locale}`, () => {
      expect(formatTruthValue(locale, true)).toBe(ui(locale).trueLabel);
      expect(formatTruthValue(locale, false)).toBe(ui(locale).falseLabel);
    });
  }

  it('formats assignment line with locale labels', () => {
    expect(formatAssignmentLine('en', { P: true, Q: false })).toBe(
      'Truth assignment: P ↦ T , Q ↦ F',
    );
    expect(formatAssignmentLine('fr', { P: true, Q: false })).toBe(
      'Interprétation: P ↦ V , Q ↦ F',
    );
  });
});
