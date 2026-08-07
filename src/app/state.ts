import {
  parse,
  toVerticalTree,
  evaluateWithNodes,
  checkMainConnectiveSelection,
  collectAtoms,
  type TreeNode,
  type Assignment,
  type FeedbackResult,
} from '../../engine';
import type { Locale } from '../i18n';
import { getExerciseCopy, getFeedbackTemplates, ui } from '../i18n';
import type { ExerciseDefinition } from './exercises';

export type AppPhase = 'ready' | 'answered';

export type AppState = {
  locale: Locale;
  exercise: ExerciseDefinition;
  prompt: string;
  phase: AppPhase;
  selectedNodeId: string | null;
  assignment: Assignment;
  tree: TreeNode;
  feedback: FeedbackResult | null;
  message: string | null;
};

export function createState(locale: Locale, exercise: ExerciseDefinition): AppState {
  const formula = parse(exercise.formula);
  const atoms = [...collectAtoms(formula)].sort();
  const assignment =
    exercise.initialAssignment ?? Object.fromEntries(atoms.map((atom) => [atom, false]));

  const tree =
    exercise.type === 'evaluate-formula'
      ? evaluateWithNodes(formula, assignment).tree
      : toVerticalTree(formula);

  return {
    locale,
    exercise,
    prompt: getExerciseCopy(locale, exercise.id).prompt,
    phase: 'ready',
    selectedNodeId: null,
    assignment,
    tree,
    feedback: null,
    message: null,
  };
}

export function selectNode(state: AppState, nodeId: string): AppState {
  if (state.exercise.type !== 'identify-main-connective' || state.phase === 'answered') {
    return state;
  }

  const formula = parse(state.exercise.formula);
  const templates = getFeedbackTemplates(state.locale, state.exercise.id);
  const result = checkMainConnectiveSelection(formula, state.tree, nodeId, templates);

  return {
    ...state,
    selectedNodeId: nodeId,
    phase: 'answered',
    feedback: result,
    message: result.message,
  };
}

export function toggleAtom(state: AppState, atom: string): AppState {
  if (state.exercise.type !== 'evaluate-formula') {
    return state;
  }

  const formula = parse(state.exercise.formula);
  const assignment = {
    ...state.assignment,
    [atom]: !state.assignment[atom],
  };
  const { tree } = evaluateWithNodes(formula, assignment);

  return {
    ...state,
    assignment,
    tree,
    message: ui(state.locale).valuesUpdated,
  };
}

export function applyLocale(state: AppState, locale: Locale): AppState {
  const prompt = getExerciseCopy(locale, state.exercise.id).prompt;
  const next: AppState = { ...state, locale, prompt };

  if (state.phase === 'answered' && state.selectedNodeId) {
    const formula = parse(state.exercise.formula);
    const templates = getFeedbackTemplates(locale, state.exercise.id);
    const result = checkMainConnectiveSelection(
      formula,
      state.tree,
      state.selectedNodeId,
      templates,
    );
    return {
      ...next,
      feedback: result,
      message: result.message,
    };
  }

  if (state.message === ui(state.locale).valuesUpdated) {
    return { ...next, message: ui(locale).valuesUpdated };
  }

  return { ...next, message: null };
}

export function isExerciseComplete(state: AppState): boolean {
  return state.exercise.type === 'identify-main-connective' && state.feedback?.correct === true;
}
