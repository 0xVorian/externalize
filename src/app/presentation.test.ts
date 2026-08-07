import { describe, expect, it } from 'vitest';
import { EXERCISE_DEFINITIONS } from './exercises';
import { LEVEL_0_LESSONS } from './lessons';
import { usesLiveTruthRow } from './truth-table-render';

/** Expected presentation per content id — update when adding lessons/exercises. */
const PRESENTATION: Record<string, string> = {
  'level0-01-letters': 'card',
  'level0-02-truth': 'card',
  'level0-03-and': 'card',
  'level0-04-watch': 'truth-table-multi',
  'level0-05-guided': 'truth-table-live',
  'eval-001': 'truth-table-live',
  'eval-002': 'tree-eval',
  'scope-001': 'tree-scope',
  'scope-002': 'tree-scope',
  'scope-003': 'tree-scope',
};

describe('presentation inventory', () => {
  it('covers every lesson and exercise', () => {
    for (const lesson of LEVEL_0_LESSONS) {
      expect(PRESENTATION[lesson.id], lesson.id).toBeTruthy();
    }
    for (const exercise of EXERCISE_DEFINITIONS) {
      expect(PRESENTATION[exercise.id], exercise.id).toBeTruthy();
    }
  });

  it('routes P ∧ Q eval to live truth row', () => {
    expect(usesLiveTruthRow('P ∧ Q')).toBe(true);
    expect(usesLiveTruthRow('(P → Q) ↔ ¬R')).toBe(false);
    expect(PRESENTATION['eval-001']).toBe('truth-table-live');
  });

  it('keeps nested formulas on tree eval', () => {
    expect(PRESENTATION['eval-002']).toBe('tree-eval');
  });
});
