import { describe, expect, it } from 'vitest';
import { getExerciseDefinition } from './exercises';
import { beginPracticeAttempt, loadProgress } from './storage';
import {
  checkEvaluation,
  createState,
  selectEvaluationPrediction,
  selectLearnerNodeValue,
} from './state';

function scaffoldState(level: number, assignment = { P: true, Q: false, R: true }) {
  const exercise = getExerciseDefinition('eval-007')!;
  const store = beginPracticeAttempt(loadProgress(), exercise.id);
  return createState('en', exercise, { ...store.practiceDraft!, assignment }, level);
}

describe('evaluation scaffold', () => {
  it('requires learner-filled scaffold nodes before root check at level 1', () => {
    let state = scaffoldState(1);
    expect(state.activeLearnerNodeId).toBe('root.R');
    state = selectLearnerNodeValue(state, 'root.R', true);
    expect(state.activeLearnerNodeId).toBeNull();
    state = selectEvaluationPrediction(state, true);
    const checked = checkEvaluation(state);
    expect(checked.feedback?.correct).toBe(true);
  });

  it('gives intermediate feedback for wrong learner node values', () => {
    let state = scaffoldState(1);
    state = selectLearnerNodeValue(state, 'root.R', false);
    expect(state.feedback?.tag).toBe('incorrect-intermediate');
    expect(state.learnerValues['root.R']).toBeUndefined();
  });
});
