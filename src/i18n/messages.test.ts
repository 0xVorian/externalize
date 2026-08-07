import { describe, expect, it } from 'vitest';
import { EXERCISE_DEFINITIONS } from '../app/exercises';
import { getExerciseCopy, getFeedbackTemplates, ui } from './messages';

describe('i18n', () => {
  for (const locale of ['en', 'fr'] as const) {
    it(`provides UI copy for ${locale}`, () => {
      expect(ui(locale).practice).toBeTruthy();
      expect(ui(locale).continue).toBeTruthy();
    });

    it(`provides exercise copy for every definition in ${locale}`, () => {
      for (const exercise of EXERCISE_DEFINITIONS) {
        const copy = getExerciseCopy(locale, exercise.id);
        expect(copy.prompt.length).toBeGreaterThan(0);
        expect(getFeedbackTemplates(locale, exercise.id).correct).toBeTruthy();
      }
    });
  }
});
