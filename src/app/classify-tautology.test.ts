import { describe, expect, it } from 'vitest';
import { getExerciseDefinition } from './exercises';
import { createState, submitTautologyAnswer, tautologySubmissionCorrect } from './state';

describe('classify-tautology validation', () => {
  it('shows a complete truth table', () => {
    const state = createState('en', getExerciseDefinition('val-001')!);
    expect(state.exercise.type).toBe('classify-tautology');
    expect(state.partialTable).toBeNull();
  });
  it('accepts yes for a tautology', () => {
    expect(tautologySubmissionCorrect(submitTautologyAnswer(createState('en', getExerciseDefinition('val-001')!), true))).toBe(true);
  });
  it('accepts no for a contradiction', () => {
    expect(tautologySubmissionCorrect(submitTautologyAnswer(createState('en', getExerciseDefinition('val-002')!), false))).toBe(true);
  });
  it('rejects wrong answer', () => {
    expect(tautologySubmissionCorrect(submitTautologyAnswer(createState('en', getExerciseDefinition('val-005')!), true))).toBe(false);
  });
});
