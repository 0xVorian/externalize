import type { Assignment, Formula } from '../ast/types';
import { allAssignments, evaluate } from '../eval/evaluate';

export type TruthTableRow = {
  assignment: Assignment;
  result: boolean;
};

export type TruthTable = {
  atoms: string[];
  rows: TruthTableRow[];
};

export type PartialTruthTableRow = {
  assignment: Assignment;
  /** `null` marks a cell the learner must fill (Phase 4 exercises). */
  result: boolean | null;
};

export type PartialTruthTable = {
  atoms: string[];
  rows: PartialTruthTableRow[];
};

export type CellValidation = {
  correct: boolean;
  expected: boolean;
};

/** Build the full truth table for `formula` over the given atom list (in column order). */
export function generateTruthTable(formula: Formula, atoms: readonly string[]): TruthTable {
  const atomList = [...atoms];
  const rows = allAssignments(atomList).map((assignment) => ({
    assignment,
    result: evaluate(formula, assignment),
  }));
  return { atoms: atomList, rows };
}

/** Hide result cells at `hiddenRowIndices`, keeping atom assignments visible. */
export function maskTruthTableRows(
  table: TruthTable,
  hiddenRowIndices: Iterable<number>,
): PartialTruthTable {
  const hidden = new Set(hiddenRowIndices);
  return {
    atoms: table.atoms,
    rows: table.rows.map((row, index) => ({
      assignment: row.assignment,
      result: hidden.has(index) ? null : row.result,
    })),
  };
}

/** Expected boolean for one row (locale-agnostic; UI maps to T/V/F). */
export function expectedCellValue(formula: Formula, assignment: Assignment): boolean {
  return evaluate(formula, assignment);
}

/** Check a learner submission for one table cell. */
export function validateCell(
  formula: Formula,
  assignment: Assignment,
  submitted: boolean,
): CellValidation {
  const expected = evaluate(formula, assignment);
  return { correct: submitted === expected, expected };
}
