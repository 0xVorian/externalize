import {
  parse,
  toVerticalTree,
  evaluateWithNodes,
  checkMainConnectiveSelection,
  classifyTranslation,
  collectAtoms,
  resolveTranslationFeedback,
  type TreeNode,
  type Assignment,
  type FeedbackResult,
} from '../../engine';
import type { Locale } from '../i18n';
import { getExerciseCopy, getFeedbackTemplates, ui } from '../i18n';
import type { ExerciseDefinition } from './exercises';
import {
  createBuilderReducerState,
  builderInsert,
  builderBackspace,
  builderUndo,
  parsePaletteInsert,
  getTranslationExerciseConfig,
  type BuilderReducerState,
} from './translation';

export type AppPhase = 'ready' | 'answered';

export type AppState = {
  locale: Locale;
  exercise: ExerciseDefinition;
  prompt: string;
  phase: AppPhase;
  selectedNodeId: string | null;
  assignment: Assignment;
  tree: TreeNode;
  builder: BuilderReducerState;
  feedback: FeedbackResult | null;
  message: string | null;
};

function placeholderTree(): TreeNode {
  return toVerticalTree(parse('P'));
}

export function createState(locale: Locale, exercise: ExerciseDefinition): AppState {
  const prompt = getExerciseCopy(locale, exercise.id).prompt;

  if (exercise.type === 'translate-en-to-formula') {
    return {
      locale,
      exercise,
      prompt,
      phase: 'ready',
      selectedNodeId: null,
      assignment: {},
      tree: placeholderTree(),
      builder: createBuilderReducerState(),
      feedback: null,
      message: null,
    };
  }

  const formula = parse(exercise.formula);
  const atoms = [...collectAtoms(formula)].sort();
  const assignment =
    exercise.type === 'evaluate-formula' && exercise.initialAssignment ? exercise.initialAssignment : Object.fromEntries(atoms.map((atom) => [atom, false]));

  const tree =
    exercise.type === 'evaluate-formula'
      ? evaluateWithNodes(formula, assignment).tree
      : toVerticalTree(formula);

  return {
    locale,
    exercise,
    prompt,
    phase: 'ready',
    selectedNodeId: null,
    assignment,
    tree,
    builder: createBuilderReducerState(),
    feedback: null,
    message: null,
  };
}

export function selectNode(state: AppState, nodeId: string): AppState {
  if (state.exercise.type !== 'identify-main-connective' || state.phase === 'answered') {
    return state;
  }

  const formula = parse(state.exercise.formula);
  const templates: Record<string, string> = getFeedbackTemplates(state.locale, state.exercise.id) as Record<string, string>;
  const result = checkMainConnectiveSelection(formula, state.tree, nodeId, templates);

  return {
    ...state,
    selectedNodeId: nodeId,
    phase: 'answered',
    feedback: result,
    message: result.message,
  };
}

export function paletteInsertToken(
  state: AppState,
  tokenKind: string | undefined,
  value: string | undefined,
): AppState {
  if (state.exercise.type !== 'translate-en-to-formula' || state.phase === 'answered') {
    return state;
  }
  const token = parsePaletteInsert(tokenKind, value);
  if (!token) {
    return state;
  }
  return {
    ...state,
    builder: builderInsert(state.builder, token),
    feedback: null,
    message: null,
  };
}

export function paletteBackspace(state: AppState): AppState {
  if (state.exercise.type !== 'translate-en-to-formula' || state.phase === 'answered') {
    return state;
  }
  return { ...state, builder: builderBackspace(state.builder), feedback: null, message: null };
}

export function paletteUndo(state: AppState): AppState {
  if (state.exercise.type !== 'translate-en-to-formula' || state.phase === 'answered') {
    return state;
  }
  return { ...state, builder: builderUndo(state.builder), feedback: null, message: null };
}

export function checkTranslation(state: AppState): AppState {
  if (state.exercise.type !== 'translate-en-to-formula' || state.phase === 'answered') {
    return state;
  }

  const config = getTranslationExerciseConfig(state.exercise.id);
  if (!config) {
    return state;
  }

  const templates = getFeedbackTemplates(state.locale, state.exercise.id);

  if (state.builder.compileError === 'unbalanced-parens') {
    const tag = 'unbalanced-parens';
    const message = templates[tag] ?? resolveTranslationFeedback(tag);
    return {
      ...state,
      phase: 'answered',
      feedback: { correct: false, tag, message },
      message,
    };
  }

  if (!state.builder.formula) {
    const tag = 'incomplete';
    const message = templates[tag] ?? resolveTranslationFeedback(tag);
    return {
      ...state,
      phase: 'answered',
      feedback: { correct: false, tag, message },
      message,
    };
  }

  const expected = parse(config.expected.formula);
  const result = classifyTranslation(expected, state.builder.formula, {
    allowCommutativeAnd: config.expected.acceptCommutativeAnd,
    allowCommutativeOr: config.expected.acceptCommutativeOr,
    allowSemantic: config.expected.acceptEquivalent,
  });

  const message = templates[result.tag] ?? result.message;

  return {
    ...state,
    phase: 'answered',
    feedback: { correct: result.correct, tag: result.tag, message },
    message,
  };
}

export function setAtomValue(state: AppState, atom: string, value: boolean): AppState {
  if (state.exercise.type !== 'evaluate-formula') {
    return state;
  }

  const formula = parse(state.exercise.formula);
  const assignment = { ...state.assignment, [atom]: value };
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

  if (state.phase === 'answered' && state.selectedNodeId && state.exercise.type === 'identify-main-connective') {
    const formula = parse(state.exercise.formula);
    const templates = getFeedbackTemplates(locale, state.exercise.id);
    const result = checkMainConnectiveSelection(formula, state.tree, state.selectedNodeId, templates);
    return { ...next, feedback: result, message: result.message };
  }

  if (state.phase === 'answered' && state.exercise.type === 'translate-en-to-formula' && state.feedback) {
    const templates: Record<string, string> = getFeedbackTemplates(locale, state.exercise.id) as Record<string, string>;
    const message = templates[state.feedback.tag] ?? state.feedback.message;
    return { ...next, feedback: { ...state.feedback, message }, message };
  }

  if (state.message === ui(state.locale).valuesUpdated) {
    return { ...next, message: ui(locale).valuesUpdated };
  }

  return { ...next, message: null };
}

export function isExerciseComplete(state: AppState): boolean {
  if (state.exercise.type === 'translate-en-to-formula') {
    return state.feedback?.correct === true;
  }
  return state.exercise.type === 'identify-main-connective' && state.feedback?.correct === true;
}
