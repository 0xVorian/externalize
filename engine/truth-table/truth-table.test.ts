import { describe, expect, it } from 'vitest';
import { parse } from '../parse/parse';
import { evaluate } from '../eval/evaluate';
import {
  expectedCellValue,
  generateTruthTable,
  maskTruthTableRows,
  validateCell, classifyFormula, isTautology, findFalsifyingAssignment, validateTautologyAnswer,
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

describe('classifyFormula', () => {
  it('identifies a tautology', () => { expect(classifyFormula(parse('P ∨ ¬P'))).toBe('tautology'); expect(isTautology(parse('P → P'))).toBe(true); });
  it('identifies a contradiction', () => { expect(classifyFormula(parse('P ∧ ¬P'))).toBe('contradiction'); });
  it('identifies contingency', () => { expect(classifyFormula(parse('P ∧ Q'))).toBe('contingency'); });
  it('handles three atoms', () => { expect(classifyFormula(parse('(P → Q) ∧ R'))).toBe('contingency'); });
  it('rejects more than three atoms', () => { expect(() => classifyFormula(parse('P ∧ Q'), ['P','Q','R','S'])).toThrow(/at most 3 atoms/); });
});
describe('validateTautologyAnswer', () => {
  it('accepts yes for a tautology', () => { const r = validateTautologyAnswer(parse('P ∨ ¬P'), true); expect(r.correct).toBe(true); expect(r.counterexample).toBeNull(); });
  it('accepts no for a non-tautology', () => { const r = validateTautologyAnswer(parse('P ∧ Q'), false); expect(r.correct).toBe(true); expect(r.counterexample).toEqual({ P: false, Q: false }); });
  it('rejects wrong yes', () => { expect(validateTautologyAnswer(parse('P ∧ Q'), true).correct).toBe(false); });
  it('rejects wrong no', () => { expect(validateTautologyAnswer(parse('(P → Q) ∨ (Q → P)'), false).correct).toBe(false); });
});
describe('findFalsifyingAssignment', () => {
  it('returns null for a tautology', () => { expect(findFalsifyingAssignment(parse('P → P'))).toBeNull(); });
  it('returns a counterexample for a contradiction', () => {
    const ce = findFalsifyingAssignment(parse('P ∧ ¬P'));
    expect(ce).not.toBeNull();
    expect(evaluate(parse('P ∧ ¬P'), ce!)).toBe(false);
  });
});

