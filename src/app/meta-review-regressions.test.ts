import { describe, expect, it } from 'vitest';
import { getExerciseCopy } from '../i18n/messages';
import { getExerciseDefinition } from './exercises';
import {
  checkEvaluation,
  createState,
  practiceDraftSnapshot,
  selectEvaluationPrediction,
  selectLearnerNodeValue,
  setAtomValue,
  tryAgainPractice,
} from './state';

describe('meta-review regressions', () => {
  it('keeps the actual sentence visible for translation exercises with assessment copy', () => {
    for (const exerciseId of ['translate-002', 'translate-006']) {
      const exercise = getExerciseDefinition(exerciseId)!;
      const state = createState('en', exercise);
      expect(state.prompt).toBe(getExerciseCopy('en', exerciseId).prompt);
      expect(state.prompt).not.toBe(getExerciseCopy('en', exerciseId).assessmentPrompt);
    }
  });

  it('records a wrong intermediate scaffold value as a checked error', () => {
    const exercise = getExerciseDefinition('eval-007')!;
    let state = createState('en', exercise, undefined, 1);

    state = selectLearnerNodeValue(state, 'root.R', false);

    expect(state.attempt.checkedAnswers).toBe(1);
    expect(state.attempt.firstCheckedCorrect).toBe(false);
    expect(state.attempt.lastCheckCorrect).toBe(false);
    expect(state.attempt.errorTags).toContain('incorrect-intermediate');
    expect(state.activeLearnerNodeId).toBe('root.R');
  });

  it('resets scaffold work when an assignment changes during evaluation repair', () => {
    const exercise = getExerciseDefinition('eval-007')!;
    let state = createState('en', exercise, undefined, 1);
    state = selectLearnerNodeValue(state, 'root.R', true);
    state = selectEvaluationPrediction(state, false);
    state = checkEvaluation(state);
    expect(state.feedback?.correct).toBe(false);

    state = setAtomValue(state, 'P', false);
    expect(state.learnerValues).toEqual({});
    expect(state.activeLearnerNodeId).toBe('root.R');
    expect(state.tree.value).toBeUndefined();

    state = tryAgainPractice(state);
    state = selectLearnerNodeValue(state, 'root.R', true);
    state = selectEvaluationPrediction(state, false);
    expect(() => checkEvaluation(state)).not.toThrow();
    state = checkEvaluation(state);
    expect(state.feedback?.correct).toBe(true);
  });

  it('restores committed scaffold values from a saved practice draft', () => {
    const exercise = getExerciseDefinition('eval-007')!;
    let state = createState('en', exercise, undefined, 1);
    state = selectLearnerNodeValue(state, 'root.R', true);
    const draft = practiceDraftSnapshot(state);

    const restored = createState('en', exercise, draft, 1);

    expect(restored.learnerValues).toEqual({ 'root.R': true });
    expect(restored.activeLearnerNodeId).toBeNull();
    expect(restored.tree.children[1]?.value).toBe(true);
    expect(restored.tree.value).toBe(true);
  });
});
