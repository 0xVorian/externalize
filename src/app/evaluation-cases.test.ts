import { describe, expect, it, vi } from 'vitest';
import {
  allAssignmentsForFormula,
  assignmentKey,
  selectEvaluationAssignment,
} from './evaluation-cases';

describe('evaluation-cases', () => {
  it('lists every truth-table row for a two-atom formula', () => {
    const pool = allAssignmentsForFormula('P ∧ Q');
    expect(pool).toHaveLength(4);
    expect(pool.map((row) => assignmentKey(row, ['P', 'Q'])).sort()).toEqual([
      'FF',
      'FT',
      'TF',
      'TT',
    ]);
  });

  it('prefers unseen assignments before repeats', () => {
    const assignment = selectEvaluationAssignment({
      formula: 'P ∧ Q',
      seenKeys: ['TT', 'TF', 'FT'],
    });
    expect(assignmentKey(assignment, ['P', 'Q'])).toBe('FF');
  });

  it('weights the T,F row higher for implications when emphasizing errors', () => {
    const random = vi.spyOn(Math, 'random');
    const counts: Record<string, number> = {};
    for (let index = 0; index < 80; index += 1) {
      random.mockReturnValue(index / 80);
      const assignment = selectEvaluationAssignment({
        formula: 'P → Q',
        seenKeys: [],
        emphasizeErrors: true,
      });
      const key = assignmentKey(assignment, ['P', 'Q']);
      counts[key] = (counts[key] ?? 0) + 1;
    }
    random.mockRestore();
    expect(counts['TF'] ?? 0).toBeGreaterThan(15);
  });
});
