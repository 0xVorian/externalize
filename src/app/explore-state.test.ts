import { describe, expect, it } from 'vitest';
import { createExploreState, selectExploreFormula, setExploreAtom } from './explore-state';

describe('explore-state', () => {
  it('resets assignment when the formula changes', () => {
    const initial = createExploreState('en', 0);
    const switched = selectExploreFormula(initial, 2);
    expect(switched.formulaIndex).toBe(2);
    expect(switched.assignment).toEqual({ P: false, Q: false });
  });

  it('updates atom values without recording progress metadata', () => {
    let state = createExploreState('en', 0);
    state = setExploreAtom(state, 'P', true);
    expect(state.assignment.P).toBe(true);
  });
});
