import { describe, expect, it } from 'vitest';
import { EXERCISE_DEFINITIONS } from './exercises';
import { ALL_LEARN_LESSONS } from './lessons';
import { usesLiveTruthRow, usesWatchGrid } from './truth-table-render';

const PRESENTATION: Record<string, string> = {
  'level0-01-letters': 'card',
  'level0-02-truth': 'card',
  'level0-03-and': 'card',
  'level0-04-watch': 'watch-grid',
  'level0-05-guided': 'truth-table-live',
  'level1-01-neg': 'card',
  'level1-02-neg-watch': 'truth-table-multi',
  'level1-03-neg-guided': 'truth-table-live',
  'level1-04-or': 'card',
  'level1-05-or-watch': 'watch-grid',
  'level1-06-or-guided': 'truth-table-live',
  'level1-07-imp': 'card',
  'level1-08-imp-watch': 'watch-grid',
  'level1-09-imp-guided': 'truth-table-live',
  'level1-10-iff': 'card',
  'level1-11-iff-watch': 'watch-grid',
  'level1-12-iff-guided': 'truth-table-live',
  'eval-001': 'truth-table-live',
  'eval-002': 'tree-eval',
  'eval-003': 'truth-table-live',
  'eval-004': 'truth-table-live',
  'eval-005': 'truth-table-live',
  'tt-001': 'truth-table-partial',
  'tt-002': 'truth-table-partial',
  'tt-003': 'truth-table-partial',
  'eval-006': 'tree-eval',
  'tt-004': 'truth-table-partial',
  'tt-005': 'truth-table-partial',
<<<<<<< HEAD
  'counter-001': 'truth-table-live',
  'counter-002': 'truth-table-live',
  'counter-003': 'truth-table-live',
  'counter-004': 'truth-table-live',
=======
  'val-001': 'truth-table-tautology',
  'val-002': 'truth-table-tautology',
  'val-003': 'truth-table-tautology',
  'val-004': 'truth-table-tautology',
  'val-005': 'truth-table-tautology',
>>>>>>> feature/validity-tautology-challenges
  'eval-007': 'tree-eval',
  'eval-008': 'tree-eval',
  'eval-009': 'tree-eval',
  'scope-001': 'tree-scope',
  'scope-002': 'tree-scope',
  'scope-003': 'tree-scope',
  'scope-004': 'tree-scope',
  'scope-005': 'tree-scope',
  'scope-006': 'tree-scope',
  'scope-007': 'tree-scope',
  'scope-008': 'tree-scope',
  'scope-009': 'tree-scope',
  'scope-010': 'tree-scope',
  'scope-011': 'tree-scope',
  'scope-012': 'tree-scope',
  'eval-010': 'truth-table-live',
  'translate-001': 'translation-palette',
  'translate-002': 'translation-palette',
  'translate-003': 'translation-palette',
  'translate-004': 'translation-palette',
  'translate-005': 'translation-palette',
  'translate-006': 'translation-palette',
};

describe('presentation inventory', () => {
  it('covers every lesson and exercise', () => {
    for (const lesson of ALL_LEARN_LESSONS) expect(PRESENTATION[lesson.id], lesson.id).toBeTruthy();
    for (const exercise of EXERCISE_DEFINITIONS) expect(PRESENTATION[exercise.id], exercise.id).toBeTruthy();
  });

  it('routes flat formulas to live truth row', () => {
    expect(usesLiveTruthRow('P ∧ Q')).toBe(true);
    expect(usesLiveTruthRow('¬P')).toBe(true);
    expect(PRESENTATION['eval-001']).toBe('truth-table-live');
  });

  it('keeps nested formulas on tree eval', () => {
    expect(PRESENTATION['eval-002']).toBe('tree-eval');
  });

  it('routes binary watch lessons to the 2×2 grid', () => {
    expect(usesWatchGrid('P ∧ Q')).toBe(true);
    expect(usesWatchGrid('¬P')).toBe(false);
    expect(PRESENTATION['level0-04-watch']).toBe('watch-grid');
    expect(PRESENTATION['level1-02-neg-watch']).toBe('truth-table-multi');
    expect(PRESENTATION['level1-05-or-watch']).toBe('watch-grid');
    expect(PRESENTATION['level1-08-imp-watch']).toBe('watch-grid');
    expect(PRESENTATION['level1-11-iff-watch']).toBe('watch-grid');
  });
});
