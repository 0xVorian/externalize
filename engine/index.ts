export type { Formula, Atom, Pred, Term, Const, Var, Not, And, Or, Imp, Iff, ForAll, Exists, Assignment, TreeNode, ConnectiveKind } from './ast/types';
export { atom, pred, constTerm, varTerm, termFromName, not, and, or, imp, iff, forall, exists, isAtom, isPred, collectAtoms, collectFreeVariables, collectPredicateSymbols } from './ast/types';
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
  ProofFeedbackTag,
} from './feedback';
export {
  parseProofLines,
  validateProofFillStep,
  INFERENCE_RULES,
  applyModusPonens,
  applyRule,
} from './proof';
export type {
  RuleId,
  ProofLineSpec,
  ProofLine,
  ProofFillConfig,
  ProofFillResult,
} from './proof';
export {
  generateTruthTable,
  maskTruthTableRows,
  expectedCellValue,
  validateCell,
  validateCounterexample,
  hasAssignmentForValue,
  classifyFormula,
  isTautology,
  findFalsifyingAssignment,
  validateTautologyAnswer,
  MAX_TAUTOLOGY_ATOMS,
} from './truth-table';
export type {
  TruthTable,
  TruthTableRow,
  PartialTruthTable,
  PartialTruthTableRow,
  CellValidation,
  CounterexampleValidation,
  FormulaClassification,
  TautologyValidation,
} from './truth-table';

