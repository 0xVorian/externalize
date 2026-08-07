import {
  parse,
  toVerticalTree,
  evaluateWithNodes,
  checkMainConnectiveSelection,
  classifyTranslation,
  collectAtoms,
  resolveTranslationFeedback,
  generateTruthTable,
  maskTruthTableRows,
  validateCell,
  parseProofLines,
  validateProofFillStep,
  type TreeNode,
  type ProofLine,
  type RuleId,
  type Assignment,
  type FeedbackResult,
  type PartialTruthTable,
} from '../../engine';
import type { Locale } from '../i18n';
import { getExerciseCopy, getCellFeedback, getFeedbackTemplates, ui } from '../i18n';
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
import { getProofExerciseConfig } from './proof/exercise-config';

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
  submittedCell: boolean | null;
  partialTable: PartialTruthTable | null;
  proofLines: ProofLine[];
  proofRule: RuleId | null;
  proofCites: number[];
  proofDerivedFormula: string | null;
};

function placeholderTree(): TreeNode {
  return toVerticalTree(parse('P'));
}

function buildPartialTable(exercise: ExerciseDefinition): PartialTruthTable | null {
  if (exercise.type !== 'fill-truth-table-cell') {
    return null;
  }
  if (exercise.hiddenRowIndex === undefined) {
    throw new Error(`Missing hiddenRowIndex for ${exercise.id}`);
  }
  const formula = parse(exercise.formula!);
  return maskTruthTableRows(
    generateTruthTable(formula, [...collectAtoms(formula)].sort()),
    [exercise.hiddenRowIndex],
  );
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
      submittedCell: null,
      partialTable: null,
      proofLines: [],
      proofRule: null,
      proofCites: [],
      proofDerivedFormula: null,
    };
  }

  if (exercise.type === 'proof-fill-step') {
    const config = getProofExerciseConfig(exercise.id);
    if (!config) {
      throw new Error(`Missing proof config for ${exercise.id}`);
    }
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
      submittedCell: null,
      partialTable: null,
      proofLines: parseProofLines(config.lines),
      proofRule: null,
      proofCites: [],
      proofDerivedFormula: null,
    };
  }

  const formula = parse(exercise.formula!);
  const atoms = [...collectAtoms(formula)].sort();
  const assignment =
    exercise.type === 'evaluate-formula' && exercise.initialAssignment
      ? exercise.initialAssignment
      : Object.fromEntries(atoms.map((atom) => [atom, false]));

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
    submittedCell: null,
    partialTable: buildPartialTable(exercise),
    proofLines: [],
    proofRule: null,
    proofCites: [],
    proofDerivedFormula: null,
  };
}

export function selectNode(state: AppState, nodeId: string): AppState {
  if (state.exercise.type !== 'identify-main-connective' || state.phase === 'answered') {
    return state;
  }

  const formula = parse(state.exercise.formula!);
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

export function submitCellValue(state: AppState, value: boolean): AppState {
  if (state.exercise.type !== 'fill-truth-table-cell' || state.phase === 'answered') {
    return state;
  }
  const idx = state.exercise.hiddenRowIndex;
  if (idx === undefined || !state.partialTable) {
    return state;
  }
  const assignment = state.partialTable.rows[idx]?.assignment;
  if (!assignment) {
    return state;
  }
  const validation = validateCell(parse(state.exercise.formula!), assignment, value);
  return {
    ...state,
    submittedCell: value,
    phase: 'answered',
    message: getCellFeedback(state.locale, state.exercise.id, validation.correct),
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

  const formula = parse(state.exercise.formula!);
  const assignment = { ...state.assignment, [atom]: value };
  const { tree } = evaluateWithNodes(formula, assignment);

  return {
    ...state,
    assignment,
    tree,
    message: ui(state.locale).valuesUpdated,
  };
}

export function selectProofRule(state: AppState, rule: RuleId): AppState {
  if (state.exercise.type !== 'proof-fill-step' || state.phase === 'answered') return state;
  return { ...state, proofRule: state.proofRule === rule ? null : rule, feedback: null, message: null };
}

export function toggleProofCitation(state: AppState, lineNumber: number): AppState {
  if (state.exercise.type !== 'proof-fill-step' || state.phase === 'answered') return state;
  const cites = state.proofCites.includes(lineNumber)
    ? state.proofCites.filter((n) => n !== lineNumber)
    : [...state.proofCites, lineNumber];
  return { ...state, proofCites: cites, feedback: null, message: null };
}

export function checkProofStep(state: AppState): AppState {
  if (state.exercise.type !== 'proof-fill-step' || state.phase === 'answered') return state;
  const config = getProofExerciseConfig(state.exercise.id);
  if (!config) return state;
  const templates = getFeedbackTemplates(state.locale, state.exercise.id);
  const result = validateProofFillStep(config, state.proofLines, state.proofRule, state.proofCites, templates);
  return {
    ...state,
    phase: 'answered',
    feedback: { correct: result.correct, tag: result.tag, message: result.message },
    message: result.message,
    proofDerivedFormula: result.derivedFormula,
  };
}

export function applyLocale(state: AppState, locale: Locale): AppState {
  const prompt = getExerciseCopy(locale, state.exercise.id).prompt;
  const next: AppState = { ...state, locale, prompt };

  if (state.phase === 'answered' && state.selectedNodeId && state.exercise.type === 'identify-main-connective') {
    const formula = parse(state.exercise.formula!);
    const templates = getFeedbackTemplates(locale, state.exercise.id);
    const result = checkMainConnectiveSelection(formula, state.tree, state.selectedNodeId, templates);
    return { ...next, feedback: result, message: result.message };
  }

  if (state.phase === 'answered' && state.exercise.type === 'translate-en-to-formula' && state.feedback) {
    const templates: Record<string, string> = getFeedbackTemplates(locale, state.exercise.id) as Record<string, string>;
    const message = templates[state.feedback.tag] ?? state.feedback.message;
    return { ...next, feedback: { ...state.feedback, message }, message };
  }

  if (state.phase === 'answered' && state.exercise.type === 'fill-truth-table-cell' && state.submittedCell !== null) {
    const idx = state.exercise.hiddenRowIndex;
    const assignment = idx !== undefined ? state.partialTable?.rows[idx]?.assignment : undefined;
    const correct =
      assignment !== undefined
        ? validateCell(parse(state.exercise.formula!), assignment, state.submittedCell).correct
        : false;
    return { ...next, message: getCellFeedback(locale, state.exercise.id, correct) };
  }

  if (state.phase === 'answered' && state.exercise.type === 'proof-fill-step' && state.feedback) {
    const templates: Record<string, string> = getFeedbackTemplates(locale, state.exercise.id) as Record<string, string>;
    const message = templates[state.feedback.tag] ?? state.feedback.message;
    return { ...next, feedback: { ...state.feedback, message }, message };
  }

  if (state.message === ui(state.locale).valuesUpdated) {
    return { ...next, message: ui(locale).valuesUpdated };
  }

  return { ...next, message: null };
}

export function cellSubmissionCorrect(state: AppState): boolean | null {
  if (state.exercise.type !== 'fill-truth-table-cell' || state.submittedCell === null) {
    return null;
  }
  const idx = state.exercise.hiddenRowIndex;
  if (idx === undefined || !state.partialTable) {
    return null;
  }
  const assignment = state.partialTable.rows[idx]?.assignment;
  if (!assignment) {
    return null;
  }
  return validateCell(parse(state.exercise.formula!), assignment, state.submittedCell).correct;
}

export function isExerciseComplete(state: AppState): boolean {
  if (state.exercise.type === 'translate-en-to-formula') {
    return state.feedback?.correct === true;
  }
  if (state.exercise.type === 'fill-truth-table-cell') {
    return cellSubmissionCorrect(state) === true;
  }
  if (state.exercise.type === 'proof-fill-step') {
    return state.feedback?.correct === true;
  }
  return state.exercise.type === 'identify-main-connective' && state.feedback?.correct === true;
}
