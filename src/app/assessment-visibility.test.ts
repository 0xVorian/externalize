import { describe, expect, it } from 'vitest';
import { getExerciseDefinition } from './exercises';
import { renderApp } from './render';
import {
  checkCounterexample,
  checkEvaluation,
  createState,
  selectEvaluationPrediction,
  setAtomValue,
  tryAgainPractice,
} from './state';

function countEmDashResultCells(html: string): number {
  return (html.match(/class="result-cell">—<\/td>/g) ?? []).length;
}

describe('assessment root visibility', () => {
  it('hides evaluation root before Check and reveals it after', () => {
    const exercise = getExerciseDefinition('eval-001')!;
    let state = createState('en', exercise);
    const readyHtml = renderApp(state, 0, true);
    expect(countEmDashResultCells(readyHtml)).toBe(1);
    expect(readyHtml).toContain('<td>T</td><td>F</td>');

    state = selectEvaluationPrediction(state, false);
    state = checkEvaluation(state);
    const answeredHtml = renderApp(state, 0, true);
    expect(answeredHtml).not.toMatch(/class="result-cell">—<\/td>/);
  });

  it('hides counterexample root before Check and reveals it after', () => {
    const exercise = getExerciseDefinition('counter-001')!;
    let state = createState('en', exercise);
    const readyHtml = renderApp(state, 0, true);
    expect(countEmDashResultCells(readyHtml)).toBe(1);

    state = setAtomValue(state, 'Q', false);
    const toggledHtml = renderApp(state, 0, true);
    expect(countEmDashResultCells(toggledHtml)).toBe(1);

    state = checkCounterexample(state);
    const answeredHtml = renderApp(state, 0, true);
    expect(answeredHtml).not.toMatch(/class="result-cell">—<\/td>/);
  });

  it('keeps proper-subformula values visible while counterexample root is hidden', () => {
    const exercise = getExerciseDefinition('counter-005')!;
    let state = createState('en', exercise);
    state = setAtomValue(state, 'P', true);
    state = setAtomValue(state, 'Q', true);
    const html = renderApp(state, 0, true);
    expect(html).toMatch(/node-value-computed"[^>]*>T</);
    expect(html).toMatch(/node-value-computed"[^>]*>—</);
  });

  it('hides counterexample root again during repair without a second attempt', () => {
    const exercise = getExerciseDefinition('counter-001')!;
    let state = createState('en', exercise);
    const attemptId = state.attempt.id;

    state = checkCounterexample(state);
    expect(state.feedback?.correct).toBe(false);

    state = tryAgainPractice(state);
    expect(state.attempt.id).toBe(attemptId);
    expect(state.phase).toBe('ready');
    expect(renderApp(state, 0, true)).toMatch(/class="result-cell">—<\/td>/);
  });
});
