import { describe, expect, it } from 'vitest';
import { getExerciseDefinition } from './exercises';
import {
  checkEvaluation,
  createState,
  selectEvaluationPrediction,
  selectLearnerNodeValue,
} from './state';

describe('evaluation scaffold', () => {
  it('requires learner-filled scaffold nodes before root check at level 1', () => {
    let state = createState('en', getExerciseDefinition('eval-007')!, undefined, 1);
    expect(state.activeLearnerNodeId).toBe('root.R');
    state = selectLearnerNodeValue(state, 'root.R', true);
    expect(state.activeLearnerNodeId).toBeNull();
    state = selectEvaluationPrediction(state, true);
    const checked = checkEvaluation(state);
    expect(checked.feedback?.correct).toBe(true);
  });

  it('gives intermediate feedback for wrong learner node values', () => {
    let state = createState('en', getExerciseDefinition('eval-007')!, undefined, 1);
    state = selectLearnerNodeValue(state, 'root.R', false);
    expect(state.feedback?.tag).toBe('incorrect-intermediate');
    expect(state.learnerValues['root.R']).toBeUndefined();
  });
});
