import { describe, expect, it } from 'vitest';
import { getLessonDefinition } from './lessons';
import { createLessonState, lessonResumeSnapshot, setGuidedAtom, selectGuidedValue, checkGuidedSelection } from './lesson-state';

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

describe('guided select then check', () => {
  it('keeps a selection provisional until Check', () => {
    const lesson = getLessonDefinition('level0-05-guided')!;
    const selected = selectGuidedValue(createLessonState('en', lesson), true);
    expect(selected.guidedSelection).toBe(true);
    expect(selected.assignment.P).toBeUndefined();
    expect(selected.complete).toBe(false);
  });

  it('advances only after a correct Check', () => {
    const lesson = getLessonDefinition('level0-05-guided')!;
    const checked = checkGuidedSelection(
      selectGuidedValue(createLessonState('en', lesson), true),
    );
    expect(checked.assignment.P).toBe(true);
    expect(checked.guidedStep).toBe(1);
    expect(checked.guidedSelection).toBeNull();
  });

  it('does not restore later atoms from stale false defaults', () => {
    const lesson = getLessonDefinition('level0-05-guided')!;
    const state = createLessonState('en', lesson, {
      guidedAssignment: { P: true, Q: false },
      guidedStep: 1,
    });
    expect(state.assignment).toEqual({ P: true });
    expect(state.assignment.Q).toBeUndefined();
  });

  it('ignores a full false snapshot at the first guided step', () => {
    const lesson = getLessonDefinition('level0-05-guided')!;
    const state = createLessonState('en', lesson, {
      guidedAssignment: { P: false, Q: false },
      guidedStep: 0,
    });
    expect(state.assignment).toEqual({});
  });
});
