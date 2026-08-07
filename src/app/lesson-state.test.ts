import { describe, expect, it } from 'vitest';
import { getLessonDefinition } from './lessons';
import { createLessonState, lessonResumeSnapshot, setGuidedAtom } from './lesson-state';

describe('lesson resume snapshot', () => {
  it('stores formula-aware guided assignment for unary negation', () => {
    const lesson = getLessonDefinition('level1-03-neg-guided')!;
    let state = createLessonState('en', lesson);
    state = setGuidedAtom(state, 'P', true);
    expect(lessonResumeSnapshot(state).guidedAssignment).toEqual({ P: true });
  });

  it('restores unary assignment from resume snapshot', () => {
    const lesson = getLessonDefinition('level1-03-neg-guided')!;
    const state = createLessonState('en', lesson, {
      guidedAssignment: { P: true },
      guidedStep: 1,
    });
    expect(state.assignment).toEqual({ P: true });
  });
});
