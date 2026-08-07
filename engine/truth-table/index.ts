export {
  generateTruthTable, maskTruthTableRows, expectedCellValue, validateCell,
  classifyFormula, isTautology, findFalsifyingAssignment, validateTautologyAnswer, MAX_TAUTOLOGY_ATOMS,
} from './truth-table';
export type {
  TruthTable, TruthTableRow, PartialTruthTable, PartialTruthTableRow, CellValidation,
  FormulaClassification, TautologyValidation,
} from './truth-table';
