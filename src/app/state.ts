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
import type { Exercise } from './exercises';

export type AppPhase = 'ready' | 'answered';

export type AppState = {
  exercise: Exercise;
  phase: AppPhase;
  selectedNodeId: string | null;
  assignment: Assignment;
  tree: TreeNode;
  feedback: FeedbackResult | null;
  message: string | null;
};

export function createState(exercise: Exercise): AppState {
  const formula = parse(exercise.formula);
  const atoms = [...collectAtoms(formula)].sort();
  const assignment = exercise.initialAssignment ?? Object.fromEntries(atoms.map((atom) => [atom, false]));

  const tree =
    exercise.type === 'evaluate-formula'
      ? evaluateWithNodes(formula, assignment).tree
      : toVerticalTree(formula);

  return {
    exercise,
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
  const result = checkMainConnectiveSelection(
    formula,
    state.tree,
    nodeId,
    state.exercise.feedback,
  );

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
    message: 'Values updated at every node.',
  };
}

export function isExerciseComplete(state: AppState): boolean {
  return state.exercise.type === 'identify-main-connective' && state.feedback?.correct === true;
}
