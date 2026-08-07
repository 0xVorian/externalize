import { describe, expect, it } from 'vitest';
import { EXERCISE_DEFINITIONS } from './exercises';
import { renderApp } from './render';
import { checkCounterexample, createState, setAtomValue } from './state';

describe('find-counterexample exercises', () => {
  const counterExercises = EXERCISE_DEFINITIONS.filter((exercise) => exercise.type === 'find-counterexample');

  it('defines five counterexample exercises', () => {
    expect(counterExercises.map((exercise) => exercise.id)).toEqual([
      'counter-001',
      'counter-002',
      'counter-003',
      'counter-004',
      'counter-005',
    ]);
  });

  it('renders a check button in ready phase', () => {
    const html = renderApp(createState('en', counterExercises[0]), 0, true);
    expect(html).toContain('check-counterexample');
  });

  it('accepts a valid counterexample assignment', () => {
    let state = createState('en', counterExercises[0]);
    state = setAtomValue(state, 'Q', false);
    state = setAtomValue(state, 'P', true);
    state = checkCounterexample(state);
    expect(state.feedback?.correct).toBe(true);
  });
});
