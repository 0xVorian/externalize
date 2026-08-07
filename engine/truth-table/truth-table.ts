import type { Assignment, Formula } from '../ast/types';
import { collectAtoms } from '../ast/types';
import { allAssignments, evaluate } from '../eval/evaluate';

export const MAX_TAUTOLOGY_ATOMS = 3;

export type FormulaClassification = 'tautology' | 'contradiction' | 'contingency';

export type TautologyValidation = {
  correct: boolean;
  expectedIsTautology: boolean;
  classification: FormulaClassification;
  counterexample: Assignment | null;
};

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

function resolveTautologyAtoms(formula: Formula, atoms?: readonly string[]): string[] {
  const atomList = atoms ? [...atoms] : [...collectAtoms(formula)].sort();
  if (atomList.length > MAX_TAUTOLOGY_ATOMS) {
    throw new Error(`Tautology check supports at most ${MAX_TAUTOLOGY_ATOMS} atoms`);
  }
  return atomList;
}

export function classifyFormula(formula: Formula, atoms?: readonly string[]): FormulaClassification {
  const table = generateTruthTable(formula, resolveTautologyAtoms(formula, atoms));
  if (table.rows.every((row) => row.result)) return 'tautology';
  if (table.rows.every((row) => !row.result)) return 'contradiction';
  return 'contingency';
}

export function isTautology(formula: Formula, atoms?: readonly string[]): boolean {
  return classifyFormula(formula, atoms) === 'tautology';
}

export function findFalsifyingAssignment(formula: Formula, atoms?: readonly string[]): Assignment | null {
  const table = generateTruthTable(formula, resolveTautologyAtoms(formula, atoms));
  return table.rows.find((row) => !row.result)?.assignment ?? null;
}

export function validateTautologyAnswer(formula: Formula, answerIsTautology: boolean, atoms?: readonly string[]): TautologyValidation {
  const classification = classifyFormula(formula, atoms);
  const expectedIsTautology = classification === 'tautology';
  return {
    correct: answerIsTautology === expectedIsTautology,
    expectedIsTautology,
    classification,
    counterexample: expectedIsTautology ? null : findFalsifyingAssignment(formula, atoms),
  };
}

