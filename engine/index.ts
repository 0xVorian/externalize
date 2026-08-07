export type {
  Formula,
  Atom,
  Not,
  And,
  Or,
  Imp,
  Iff,
  Assignment,
  TreeNode,
  ConnectiveKind,
} from './ast/types';

export {
  atom,
  not,
  and,
  or,
  imp,
  iff,
  isAtom,
  collectAtoms,
} from './ast/types';

export { parse, mainConnective, ParseError } from './parse/parse';
export { format, connectiveLabel } from './render/display';
export { toVerticalTree, findNodeById, annotateTreeValues, resetTreeIds } from './render/tree';
export { evaluate, evaluateWithNodes, allAssignments } from './eval/evaluate';
export type { EvaluationResult } from './eval/evaluate';
export { equivalent, distinct, semanticallyEquivalent } from './equiv/equivalent';
export type { EquivalenceOptions } from './equiv/equivalent';
export {
  resolveFeedback,
  checkMainConnectiveSelection,
  expectedMainConnectiveNodeId,
  classifyTranslation,
  resolveTranslationFeedback,
} from './feedback';
export type {
  FeedbackTag,
  FeedbackTemplate,
  FeedbackResult,
  TranslationFeedbackTag,
  TranslationFeedbackTemplate,
  TranslationFeedbackResult,
} from './feedback';
export {
  generateTruthTable,
  maskTruthTableRows,
  expectedCellValue,
  validateCell, classifyFormula, isTautology, findFalsifyingAssignment, validateTautologyAnswer, MAX_TAUTOLOGY_ATOMS,
} from './truth-table';
export type {
  TruthTable,
  TruthTableRow,
  PartialTruthTable,
  PartialTruthTableRow,
  CellValidation, FormulaClassification, TautologyValidation,
} from './truth-table';
