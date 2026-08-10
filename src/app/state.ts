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
  validateCounterexample,
  validateTautologyAnswer,
  parseProofLines,
  validateProofFillStep,
  type TreeNode,
  type ProofLine,
  type RuleId,
  type Assignment,
  type PartialTruthTable,
} from '../../engine';
import type { Locale } from '../i18n';
import { getExerciseCopy, getCellFeedback, getCounterFeedback, getTautologyFeedback, getFeedbackTemplates, ui } from '../i18n';
import type { ExerciseDefinition } from './exercises';
import {
  createBuilderReducerState,
  builderInsert,
  builderBackspace,
  builderUndo,
  parsePaletteInsert,
  getTranslationExerciseConfig,
  restoreBuilderReducerState,
  type BuilderReducerState,
} from './translation';
import { getProofExerciseConfig } from './proof/exercise-config';
import {
  createPracticeAttempt,
  recordAttemptCheck,
  type PracticeAttempt,
  type PracticeDraft,
  type PracticeErrorTag,
} from './practice-attempt';

export type AppPhase = 'ready' | 'answered';
export type PracticeFeedback = {
  correct: boolean;
  tag: PracticeErrorTag;
  message: string;
};

export type AppState = {
  locale: Locale;
  exercise: ExerciseDefinition;
  attempt: PracticeAttempt;
  prompt: string;
  phase: AppPhase;
  selectedNodeId: string | null;
  assignment: Assignment;
  tree: TreeNode;
  builder: BuilderReducerState;
  feedback: PracticeFeedback | null;
  message: string | null;
  prediction: boolean | null;
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

function feedbackMessage(
  state: AppState,
  tag: PracticeErrorTag,
  correct: boolean,
): string {
  if (state.exercise.type === 'evaluate-formula') {
    return correct ? ui(state.locale).evaluationCorrect : ui(state.locale).evaluationWrong;
  }
  if (state.exercise.type === 'fill-truth-table-cell') {
    return getCellFeedback(state.locale, state.exercise.id, correct);
  }
  if (state.exercise.type === 'classify-tautology') {
    return getTautologyFeedback(state.locale, state.exercise.id, correct);
  }
  if (state.exercise.type === 'find-counterexample') {
    return getCounterFeedback(state.locale, state.exercise.id, correct);
  }
  const templates = getFeedbackTemplates(state.locale, state.exercise.id) as Record<string, string>;
  return templates[tag] ?? (correct ? templates.correct : '') ?? '';
}

function withCheckedAnswer(
  state: AppState,
  correct: boolean,
  tag: PracticeErrorTag,
  message: string,
  updates: Partial<AppState> = {},
): AppState {
  return {
    ...state,
    ...updates,
    attempt: recordAttemptCheck(state.attempt, correct, correct ? undefined : tag),
    phase: 'answered',
    feedback: { correct, tag, message },
    message,
  };
}

function restoreDraftFeedback(
  state: AppState,
  tag?: PracticeErrorTag,
): AppState {
  if (!tag || state.phase !== 'answered' || state.attempt.lastCheckCorrect === null) {
    return state;
  }
  const correct = state.attempt.lastCheckCorrect;
  if (
    state.exercise.type === 'identify-main-connective' &&
    state.selectedNodeId
  ) {
    const result = checkMainConnectiveSelection(
      parse(state.exercise.formula!),
      state.tree,
      state.selectedNodeId,
      getFeedbackTemplates(state.locale, state.exercise.id),
    );
    return { ...state, feedback: result, message: result.message };
  }
  const message = feedbackMessage(state, tag, correct);
  return { ...state, feedback: { correct, tag, message }, message };
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

function hydrateDraft(state: AppState, draft?: PracticeDraft): AppState {
  if (!draft || draft.attempt.exerciseId !== state.exercise.id) {
    return state;
  }
  let next: AppState = {
    ...state,
    attempt: draft.attempt,
    phase: draft.phase,
    prediction: draft.prediction ?? null,
    selectedNodeId: draft.selectedNodeId ?? null,
    submittedCell: draft.submittedCell ?? null,
    proofRule: draft.proofRule ?? null,
    proofCites: draft.proofCites ?? [],
    proofDerivedFormula: draft.proofDerivedFormula ?? null,
  };
  if (draft.assignment && (state.exercise.type === 'evaluate-formula' || state.exercise.type === 'find-counterexample')) {
    const formula = parse(state.exercise.formula!);
    next = {
      ...next,
      assignment: draft.assignment,
      tree: evaluateWithNodes(formula, draft.assignment).tree,
    };
  }
  if (draft.builderTokens && state.exercise.type === 'translate-en-to-formula') {
    next = { ...next, builder: restoreBuilderReducerState(draft.builderTokens) };
  }
  return restoreDraftFeedback(next, draft.feedbackTag);
}

export function createState(
  locale: Locale,
  exercise: ExerciseDefinition,
  draft?: PracticeDraft,
): AppState {
  const prompt =
    exercise.type === 'evaluate-formula'
      ? ui(locale).evaluationPracticePrompt
      : getExerciseCopy(locale, exercise.id).prompt;
  const attempt =
    draft?.attempt.exerciseId === exercise.id
      ? draft.attempt
      : createPracticeAttempt(exercise.id);

  if (exercise.type === 'translate-en-to-formula') {
    return hydrateDraft({
      locale,
      exercise,
      attempt,
      prompt,
      phase: 'ready',
      selectedNodeId: null,
      assignment: {},
      tree: placeholderTree(),
      builder: createBuilderReducerState(),
      feedback: null,
      message: null,
      prediction: null,
      submittedCell: null,
      partialTable: null,
      proofLines: [],
      proofRule: null,
      proofCites: [],
      proofDerivedFormula: null,
    }, draft);
  }

  if (exercise.type === 'proof-fill-step') {
    const config = getProofExerciseConfig(exercise.id);
    if (!config) {
      throw new Error(`Missing proof config for ${exercise.id}`);
    }
    return hydrateDraft({
      locale,
      exercise,
      attempt,
      prompt,
      phase: 'ready',
      selectedNodeId: null,
      assignment: {},
      tree: placeholderTree(),
      builder: createBuilderReducerState(),
      feedback: null,
      message: null,
      prediction: null,
      submittedCell: null,
      partialTable: null,
      proofLines: parseProofLines(config.lines),
      proofRule: null,
      proofCites: [],
      proofDerivedFormula: null,
    }, draft);
  }

  const formula = parse(exercise.formula!);
  const atoms = [...collectAtoms(formula)].sort();
  const assignment =
    (exercise.type === 'evaluate-formula' || exercise.type === 'find-counterexample') && exercise.initialAssignment
      ? exercise.initialAssignment
      : Object.fromEntries(atoms.map((atom) => [atom, false]));

  const tree =
    exercise.type === 'evaluate-formula' || exercise.type === 'find-counterexample'
      ? evaluateWithNodes(formula, assignment).tree
      : toVerticalTree(formula);

  return hydrateDraft({
    locale,
    exercise,
    attempt,
    prompt,
    phase: 'ready',
    selectedNodeId: null,
    assignment,
    tree,
    builder: createBuilderReducerState(),
    feedback: null,
    message: null,
    prediction: null,
    submittedCell: null,
    partialTable: buildPartialTable(exercise),
    proofLines: [],
    proofRule: null,
    proofCites: [],
    proofDerivedFormula: null,
  }, draft);
}

export function selectNode(state: AppState, nodeId: string): AppState {
  if (state.exercise.type !== 'identify-main-connective' || state.phase === 'answered') {
    return state;
  }

  const formula = parse(state.exercise.formula!);
  const templates: Record<string, string> = getFeedbackTemplates(state.locale, state.exercise.id) as Record<string, string>;
  const result = checkMainConnectiveSelection(formula, state.tree, nodeId, templates);

  return withCheckedAnswer(state, result.correct, result.tag, result.message, {
    selectedNodeId: nodeId,
  });
}


export function submitTautologyAnswer(state: AppState, answerIsTautology: boolean): AppState {
  if (state.exercise.type !== 'classify-tautology' || state.phase === 'answered') return state;
  const formula = state.exercise.formula;
  if (!formula) return state;
  const validation = validateTautologyAnswer(parse(formula), answerIsTautology);
  const tag = validation.correct ? 'correct' : 'incorrect-tautology';
  return withCheckedAnswer(
    state,
    validation.correct,
    tag,
    getTautologyFeedback(state.locale, state.exercise.id, validation.correct),
    { submittedCell: answerIsTautology },
  );
}
export function tautologySubmissionCorrect(state: AppState): boolean | null {
  if (state.exercise.type !== 'classify-tautology' || state.submittedCell === null) return null;
  const formula = state.exercise.formula;
  if (!formula) return null;
  return validateTautologyAnswer(parse(formula), state.submittedCell).correct;
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
  const tag = validation.correct ? 'correct' : 'incorrect-truth-table-cell';
  return withCheckedAnswer(
    state,
    validation.correct,
    tag,
    getCellFeedback(state.locale, state.exercise.id, validation.correct),
    { submittedCell: value },
  );
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
    return withCheckedAnswer(state, false, tag, message);
  }

  if (!state.builder.formula) {
    const tag = 'incomplete';
    const message = templates[tag] ?? resolveTranslationFeedback(tag);
    return withCheckedAnswer(state, false, tag, message);
  }

  const expected = parse(config.expected.formula);
  const result = classifyTranslation(expected, state.builder.formula, {
    allowCommutativeAnd: config.expected.acceptCommutativeAnd,
    allowCommutativeOr: config.expected.acceptCommutativeOr,
    allowSemantic: config.expected.acceptEquivalent,
  });

  const message = templates[result.tag] ?? result.message;

  return withCheckedAnswer(state, result.correct, result.tag, message);
}

export function tryAgainTranslation(state: AppState): AppState {
  if (state.exercise.type !== 'translate-en-to-formula') return state;
  return tryAgainPractice(state);
}

export function selectEvaluationPrediction(
  state: AppState,
  prediction: boolean,
): AppState {
  if (
    state.exercise.type !== 'evaluate-formula' ||
    state.phase === 'answered' ||
    state.attempt.status === 'finalized'
  ) {
    return state;
  }
  return { ...state, prediction, feedback: null, message: null };
}

export function checkEvaluation(state: AppState): AppState {
  if (
    state.exercise.type !== 'evaluate-formula' ||
    state.phase === 'answered' ||
    state.prediction === null
  ) {
    return state;
  }
  const correct = state.prediction === state.tree.value;
  const tag = correct ? 'correct' : 'incorrect-evaluation';
  const message = correct ? ui(state.locale).evaluationCorrect : ui(state.locale).evaluationWrong;
  return withCheckedAnswer(state, correct, tag, message);
}

export function tryAgainPractice(state: AppState): AppState {
  if (
    state.phase !== 'answered' ||
    state.feedback?.correct ||
    state.attempt.status === 'finalized'
  ) {
    return state;
  }
  return {
    ...state,
    phase: 'ready',
    selectedNodeId:
      state.exercise.type === 'identify-main-connective' ? null : state.selectedNodeId,
    submittedCell:
      state.exercise.type === 'fill-truth-table-cell' ||
      state.exercise.type === 'classify-tautology'
        ? null
        : state.submittedCell,
    prediction: state.exercise.type === 'evaluate-formula' ? null : state.prediction,
    proofDerivedFormula: null,
    feedback: null,
    message: null,
  };
}

export function setAtomValue(state: AppState, atom: string, value: boolean): AppState {
  if (state.exercise.type !== 'evaluate-formula' && state.exercise.type !== 'find-counterexample') {
    return state;
  }
  if (state.attempt.status === 'finalized') {
    return state;
  }

  const formula = parse(state.exercise.formula!);
  const assignment = { ...state.assignment, [atom]: value };
  const { tree } = evaluateWithNodes(formula, assignment);

  return {
    ...state,
    assignment,
    tree,
    phase: 'ready',
    prediction: state.exercise.type === 'evaluate-formula' ? null : state.prediction,
    message: state.exercise.type === 'evaluate-formula' ? ui(state.locale).valuesUpdated : null,
    feedback: null,
  };
}

export function checkCounterexample(state: AppState): AppState {
  if (state.exercise.type !== 'find-counterexample' || state.phase === 'answered') {
    return state;
  }
  if (state.exercise.targetValue === undefined) {
    throw new Error(`Missing targetValue for ${state.exercise.id}`);
  }
  const formula = parse(state.exercise.formula!);
  const validation = validateCounterexample(formula, state.assignment, state.exercise.targetValue);
  const message = getCounterFeedback(state.locale, state.exercise.id, validation.correct);
  return withCheckedAnswer(
    state,
    validation.correct,
    validation.correct ? 'correct' : 'counterexample-miss',
    message,
  );
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
  return withCheckedAnswer(state, result.correct, result.tag, result.message, {
    proofDerivedFormula: result.derivedFormula,
  });
}

export function applyLocale(state: AppState, locale: Locale): AppState {
  const prompt =
    state.exercise.type === 'evaluate-formula'
      ? ui(locale).evaluationPracticePrompt
      : getExerciseCopy(locale, state.exercise.id).prompt;
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

  if (state.phase === 'answered' && state.exercise.type === 'classify-tautology' && state.submittedCell !== null) {
    const correct = validateTautologyAnswer(parse(state.exercise.formula!), state.submittedCell).correct;
    return { ...next, message: getTautologyFeedback(locale, state.exercise.id, correct) };
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

  if (state.phase === 'answered' && state.exercise.type === 'find-counterexample' && state.feedback) {
    const message = getCounterFeedback(locale, state.exercise.id, state.feedback.correct);
    return { ...next, feedback: { ...state.feedback, message }, message };
  }

  if (state.phase === 'answered' && state.exercise.type === 'proof-fill-step' && state.feedback) {
    const templates: Record<string, string> = getFeedbackTemplates(locale, state.exercise.id) as Record<string, string>;
    const message = templates[state.feedback.tag] ?? state.feedback.message;
    return { ...next, feedback: { ...state.feedback, message }, message };
  }

  if (state.phase === 'answered' && state.exercise.type === 'evaluate-formula' && state.feedback) {
    const message = state.feedback.correct ? ui(locale).evaluationCorrect : ui(locale).evaluationWrong;
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
  if (state.exercise.type === 'evaluate-formula') {
    return state.attempt.status === 'finalized';
  }
  if (state.exercise.type === 'translate-en-to-formula') {
    return state.feedback?.correct === true;
  }
  if (state.exercise.type === 'fill-truth-table-cell') {
    return cellSubmissionCorrect(state) === true;
  }
  if (state.exercise.type === 'find-counterexample') {
    return state.feedback?.correct === true;
  }
  if (state.exercise.type === 'classify-tautology') return tautologySubmissionCorrect(state) === true;
  if (state.exercise.type === 'proof-fill-step') {
    return state.feedback?.correct === true;
  }
  return state.exercise.type === 'identify-main-connective' && state.feedback?.correct === true;
}

export function practiceDraftSnapshot(state: AppState): PracticeDraft {
  const draft: PracticeDraft = {
    attempt: state.attempt,
    phase: state.phase,
    prediction: state.prediction,
    selectedNodeId: state.selectedNodeId,
    submittedCell: state.submittedCell,
    proofRule: state.proofRule,
    proofCites: state.proofCites,
    proofDerivedFormula: state.proofDerivedFormula,
    feedbackTag: state.feedback?.tag,
  };
  if (
    state.exercise.type === 'evaluate-formula' ||
    state.exercise.type === 'find-counterexample'
  ) {
    draft.assignment = state.assignment;
  }
  if (state.exercise.type === 'translate-en-to-formula') {
    draft.builderTokens = state.builder.tokens;
  }
  return draft;
}
