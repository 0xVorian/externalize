import {
  parse, toVerticalTree, evaluateWithNodes, checkMainConnectiveSelection, collectAtoms,
  generateTruthTable, maskTruthTableRows, validateCell,
  type TreeNode, type Assignment, type FeedbackResult, type PartialTruthTable,
} from '../../engine';
import type { Locale } from '../i18n';
import { getExerciseCopy, getCellFeedback, getFeedbackTemplates, ui } from '../i18n';
import type { ExerciseDefinition } from './exercises';

export type AppPhase = 'ready' | 'answered';
export type AppState = {
  locale: Locale; exercise: ExerciseDefinition; prompt: string; phase: AppPhase;
  selectedNodeId: string | null; assignment: Assignment; tree: TreeNode;
  feedback: FeedbackResult | null; message: string | null;
  submittedCell: boolean | null; partialTable: PartialTruthTable | null;
};

function buildPartialTable(exercise: ExerciseDefinition): PartialTruthTable | null {
  if (exercise.type !== 'fill-truth-table-cell') return null;
  if (exercise.hiddenRowIndex === undefined) throw new Error(`Missing hiddenRowIndex for ${exercise.id}`);
  const formula = parse(exercise.formula);
  return maskTruthTableRows(generateTruthTable(formula, [...collectAtoms(formula)].sort()), [exercise.hiddenRowIndex]);
}

export function createState(locale: Locale, exercise: ExerciseDefinition): AppState {
  const formula = parse(exercise.formula);
  const atoms = [...collectAtoms(formula)].sort();
  const assignment = exercise.initialAssignment ?? Object.fromEntries(atoms.map((a) => [a, false]));
  const tree = exercise.type === 'evaluate-formula' ? evaluateWithNodes(formula, assignment).tree : toVerticalTree(formula);
  return { locale, exercise, prompt: getExerciseCopy(locale, exercise.id).prompt, phase: 'ready', selectedNodeId: null, assignment, tree, feedback: null, message: null, submittedCell: null, partialTable: buildPartialTable(exercise) };
}

export function selectNode(state: AppState, nodeId: string): AppState {
  if (state.exercise.type !== 'identify-main-connective' || state.phase === 'answered') return state;
  const result = checkMainConnectiveSelection(parse(state.exercise.formula), state.tree, nodeId, getFeedbackTemplates(state.locale, state.exercise.id));
  return { ...state, selectedNodeId: nodeId, phase: 'answered', feedback: result, message: result.message };
}

export function submitCellValue(state: AppState, value: boolean): AppState {
  if (state.exercise.type !== 'fill-truth-table-cell' || state.phase === 'answered') return state;
  const idx = state.exercise.hiddenRowIndex;
  if (idx === undefined || !state.partialTable) return state;
  const assignment = state.partialTable.rows[idx]?.assignment;
  if (!assignment) return state;
  const validation = validateCell(parse(state.exercise.formula), assignment, value);
  return { ...state, submittedCell: value, phase: 'answered', message: getCellFeedback(state.locale, state.exercise.id, validation.correct) };
}

export function toggleAtom(state: AppState, atom: string): AppState { return setAtomValue(state, atom, !state.assignment[atom]); }

export function setAtomValue(state: AppState, atom: string, value: boolean): AppState {
  if (state.exercise.type !== 'evaluate-formula') return state;
  const formula = parse(state.exercise.formula);
  const assignment = { ...state.assignment, [atom]: value };
  return { ...state, assignment, tree: evaluateWithNodes(formula, assignment).tree, message: ui(state.locale).valuesUpdated };
}

export function applyLocale(state: AppState, locale: Locale): AppState {
  const next = { ...state, locale, prompt: getExerciseCopy(locale, state.exercise.id).prompt };
  if (state.phase === 'answered' && state.selectedNodeId) {
    const result = checkMainConnectiveSelection(parse(state.exercise.formula), state.tree, state.selectedNodeId, getFeedbackTemplates(locale, state.exercise.id));
    return { ...next, feedback: result, message: result.message };
  }
  if (state.phase === 'answered' && state.exercise.type === 'fill-truth-table-cell' && state.submittedCell !== null) {
    const idx = state.exercise.hiddenRowIndex;
    const assignment = idx !== undefined ? state.partialTable?.rows[idx]?.assignment : undefined;
    const correct = assignment !== undefined ? validateCell(parse(state.exercise.formula), assignment, state.submittedCell).correct : false;
    return { ...next, message: getCellFeedback(locale, state.exercise.id, correct) };
  }
  if (state.message === ui(state.locale).valuesUpdated) return { ...next, message: ui(locale).valuesUpdated };
  return { ...next, message: null };
}

export function cellSubmissionCorrect(state: AppState): boolean | null {
  if (state.exercise.type !== 'fill-truth-table-cell' || state.submittedCell === null) return null;
  const idx = state.exercise.hiddenRowIndex;
  if (idx === undefined || !state.partialTable) return null;
  const assignment = state.partialTable.rows[idx]?.assignment;
  if (!assignment) return null;
  return validateCell(parse(state.exercise.formula), assignment, state.submittedCell).correct;
}

export function isExerciseComplete(state: AppState): boolean {
  if (state.exercise.type === 'identify-main-connective') return state.feedback?.correct === true;
  if (state.exercise.type === 'fill-truth-table-cell') return cellSubmissionCorrect(state) === true;
  return false;
}
