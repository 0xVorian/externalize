import { describe, expect, it } from 'vitest';
import { parse } from '../parse/parse';
import {
  expectedCellValue,
  generateTruthTable,
  maskTruthTableRows,
  validateCell,
} from './truth-table';

describe('generateTruthTable', () => {
  it('builds a 4-row table for two atoms', () => {
    const formula = parse('P ∧ Q');
    const table = generateTruthTable(formula, ['P', 'Q']);

    expect(table.atoms).toEqual(['P', 'Q']);
    expect(table.rows).toHaveLength(4);
    expect(table.rows.map((row) => row.result)).toEqual([false, false, false, true]);
    expect(table.rows[3].assignment).toEqual({ P: true, Q: true });
  });

  it('builds an 8-row table for three atoms with nested connectives', () => {
    const formula = parse('(P → Q) ↔ ¬R');
    const table = generateTruthTable(formula, ['P', 'Q', 'R']);

    expect(table.atoms).toEqual(['P', 'Q', 'R']);
    expect(table.rows).toHaveLength(8);

    const assignment = { P: true, Q: false, R: true };
    const row = table.rows.find(
      (candidate) =>
        candidate.assignment.P === assignment.P &&
        candidate.assignment.Q === assignment.Q &&
        candidate.assignment.R === assignment.R,
    );
    expect(row?.result).toBe(true);
  });

  it('respects the atom column order supplied by the caller', () => {
    const formula = parse('P ∧ Q');
    const table = generateTruthTable(formula, ['Q', 'P']);

    expect(table.atoms).toEqual(['Q', 'P']);
    expect(table.rows[0].assignment).toEqual({ Q: false, P: false });
    expect(table.rows[3].assignment).toEqual({ Q: true, P: true });
  });

  it('evaluates deeply nested connectives', () => {
    const formula = parse('¬(P ∨ (Q ∧ ¬R))');
    const table = generateTruthTable(formula, ['P', 'Q', 'R']);
    const row = table.rows.find(
      (candidate) =>
        candidate.assignment.P === false &&
        candidate.assignment.Q === true &&
        candidate.assignment.R === false,
    );

    expect(row?.result).toBe(false);
  });
});

describe('maskTruthTableRows', () => {
  it('hides selected result cells for partial-table exercises', () => {
    const table = generateTruthTable(parse('P ∧ Q'), ['P', 'Q']);
    const partial = maskTruthTableRows(table, [1, 3]);

    expect(partial.rows[0].result).toBe(false);
    expect(partial.rows[1].result).toBeNull();
    expect(partial.rows[2].result).toBe(false);
    expect(partial.rows[3].result).toBeNull();
    expect(partial.rows.every((row) => row.assignment.P !== undefined)).toBe(true);
  });
});

describe('validateCell', () => {
  it('accepts a correct submission', () => {
    const formula = parse('P → Q');
    const assignment = { P: true, Q: false };
    const validation = validateCell(formula, assignment, false);

    expect(validation.correct).toBe(true);
    expect(validation.expected).toBe(false);
  });

  it('rejects an incorrect submission', () => {
    const formula = parse('P → Q');
    const assignment = { P: false, Q: true };
    const validation = validateCell(formula, assignment, false);

    expect(validation.correct).toBe(false);
    expect(validation.expected).toBe(true);
  });

  it('matches expectedCellValue', () => {
    const formula = parse('P ∨ ¬Q');
    const assignment = { P: false, Q: false };

    expect(expectedCellValue(formula, assignment)).toBe(true);
    expect(validateCell(formula, assignment, true).correct).toBe(true);
    expect(validateCell(formula, assignment, false).correct).toBe(false);
  });
});
