import { describe, expect, it } from 'vitest';
import { EXERCISE_DEFINITIONS } from '../app/exercises';
import { getExerciseCopy, getFeedbackTemplates, getCellFeedback, ui, formatTruthValue, formatAssignmentLine, formatEvaluationAssessmentPrompt, visibilityUi } from './messages';

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

  it('uses T/F instructions in English and V/F in French', () => {
    expect(ui('en').assignmentHint).toContain('T or F');
    expect(ui('en').assignmentHint).not.toContain('V or F');
    expect(ui('fr').assignmentHint).toContain('V ou F');
  });

  it('authors translation atom glosses in each locale', () => {
    expect(getExerciseCopy('en', 'translate-003').atoms).toEqual({
      P: 'It rains.',
      Q: 'The game is cancelled.',
      R: 'The field is closed.',
    });
    expect(getExerciseCopy('fr', 'translate-003').atoms).toEqual({
      P: 'Il pleut.',
      Q: 'Le match est annulé.',
      R: 'Le terrain est fermé.',
    });
  });

  it('uses wrong fallback for missing cellWrong', () => {
    expect(getCellFeedback('en', 'scope-001', false)).not.toContain('Correct');
    expect(getCellFeedback('fr', 'scope-001', false)).not.toContain('Exact');
  });

  it('formats evaluation assessment prompts from fixed assignments', () => {
    expect(formatEvaluationAssessmentPrompt('en', { P: true, Q: false })).toContain('P = T');
    expect(formatEvaluationAssessmentPrompt('en', { P: true, Q: false })).toContain('Q = F');
    expect(formatEvaluationAssessmentPrompt('fr', { P: true, Q: false })).toContain('P = V');
    expect(formatEvaluationAssessmentPrompt('fr', { P: true, Q: false })).toContain('Q = F');
  });

  it('provides assessmentPrompt for every evaluate-formula exercise in both locales', () => {
    const evalExercises = EXERCISE_DEFINITIONS.filter((e) => e.type === 'evaluate-formula');
    for (const locale of ['en', 'fr'] as const) {
      for (const exercise of evalExercises) {
        const copy = getExerciseCopy(locale, exercise.id);
        expect(copy.assessmentPrompt?.length).toBeGreaterThan(0);
      }
    }
  });

  it('authors EN/FR progress-visibility copy independently', () => {
    const en = visibilityUi('en');
    const fr = visibilityUi('fr');
    expect(Object.keys(en).sort()).toEqual(Object.keys(fr).sort());
    for (const locale of ['en', 'fr'] as const) {
      const copy = visibilityUi(locale);
      expect(copy.stateReady).toBeTruthy();
      expect(copy.stateDeveloping).toBeTruthy();
      expect(copy.stateReliable).toBeTruthy();
      expect(copy.sessionProgress(0, 5)).toMatch(/0/);
      expect(copy.sessionCompleteHeading).toBeTruthy();
      expect(copy.sessionKeepPractising).toBeTruthy();
      expect(copy.sessionFinish).toBeTruthy();
      expect(copy.youCanNowHeading).toBeTruthy();
      expect(copy.inProgressHeading).toBeTruthy();
      expect(copy.upNextHeading).toBeTruthy();
      expect(copy.youCanNowEmpty).toBeTruthy();
      expect(copy.inProgressEmpty).toBeTruthy();
      expect(copy.upNextEmpty).toBeTruthy();
      expect(copy.momentReliable('Evaluating formulas')).toBeTruthy();
      expect(copy.momentCapabilityUnlocked('Counterexamples')).toBeTruthy();
      expect(copy.momentExerciseUnlocked('eval-011')).toBeTruthy();
      expect(copy.momentScaffoldAdvanced).toBeTruthy();
      expect(copy.momentFirstPass('Evaluating formulas')).toBeTruthy();
      expect(copy.sessionCompleteCount(5)).toBeTruthy();
      expect(copy.capabilityStatusAria('Evaluating formulas', copy.stateReady)).toBeTruthy();
    }
    expect(visibilityUi('en').stateReady).toBe('Ready');
    expect(visibilityUi('fr').stateReady).toBe('Disponible');
    expect(visibilityUi('en').youCanNowHeading).not.toBe(visibilityUi('fr').youCanNowHeading);
  });
});
