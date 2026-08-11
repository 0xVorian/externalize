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
  buildEvaluationFeedback,
  evaluateWithLearnerOverlay,
  expectedNodeValue,
  findNodeById,
} from '../../engine';
import type { Locale } from '../i18n';
import { getAssessmentPrompt, getExerciseHint, getCellFeedback, getCounterFeedback, getTautologyFeedback, getFeedbackTemplates, formatEvaluationFeedback, ui } from '../i18n';
import type { ExerciseDefinition } from './exercises';
import { scaffoldNodeIdsForLevel } from './evaluation-scaffold';
import { selectEvaluationAssignment } from './evaluation-cases';
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
  hintVisible: boolean;
  learnerValues: Record<string, boolean>;
  scaffoldNodeIds: string[];
  scaffoldLevel: number;
  activeLearnerNodeId: string | null;
};

function isRepairing(state: AppState): boolean {
  return (
    state.phase === 'answered' &&
    state.feedback?.correct === false &&
    state.attempt.status !== 'finalized'
  );
}

function canEditCheckedExercise(state: AppState): boolean {
  return state.phase === 'ready' || isRepairing(state);
}

function editableUpdate(state: AppState, updates: Partial<AppState>): AppState {
  const repairing = isRepairing(state);
  return {
    ...state,
    ...updates,
    phase: repairing ? 'answered' : state.phase,
    feedback: repairing ? state.feedback : null,
    message: repairing ? state.message : null,
  };
}

function evaluationScaffoldState(exerciseId: string, scaffoldLevel: number) {
  const scaffoldNodeIds = scaffoldNodeIdsForLevel(exerciseId, scaffoldLevel);
  return { scaffoldNodeIds, scaffoldLevel, learnerValues: {} as Record<string, boolean>, activeLearnerNodeId: null as string | null };
}

function rebuildEvaluationTree(
  exercise: ExerciseDefinition,
  assignment: Assignment,
  learnerValues: Record<string, boolean>,
  scaffoldNodeIds: string[],
): TreeNode {
  const formula = parse(exercise.formula!);
  if (scaffoldNodeIds.length === 0) {
    return evaluateWithNodes(formula, assignment).tree;
  }
  return evaluateWithLearnerOverlay(formula, assignment, learnerValues, scaffoldNodeIds).tree;
}

function allScaffoldNodesResolved(
  scaffoldNodeIds: string[],
  learnerValues: Record<string, boolean>,
): boolean {
  return scaffoldNodeIds.every((nodeId) => learnerValues[nodeId] !== undefined);
}

function nextPendingScaffoldNode(
  scaffoldNodeIds: string[],
  learnerValues: Record<string, boolean>,
): string | null {
  return scaffoldNodeIds.find((nodeId) => learnerValues[nodeId] === undefined) ?? null;
}

function placeholderTree(): TreeNode {
  return toVerticalTree(parse('P'));
}

function feedbackMessage(
  state: AppState,
  tag: PracticeErrorTag,
  correct: boolean,
): string {
  if (state.exercise.type === 'evaluate-formula') {
    if (correct) {
      return ui(state.locale).evaluationCorrect;
    }
    if (state.prediction !== null) {
      return formatEvaluationFeedback(state.locale, buildEvaluationFeedback(state.tree, state.prediction));
    }
    return ui(state.locale).evaluationWrong;
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
  if (!tag || state.attempt.lastCheckCorrect === null) {
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
  const learnerValues =
    state.exercise.type === 'evaluate-formula'
      ? Object.fromEntries(
          state.scaffoldNodeIds.flatMap((nodeId) =>
            typeof draft.learnerValues?.[nodeId] === 'boolean'
              ? [[nodeId, draft.learnerValues[nodeId]]]
              : [],
          ),
        )
      : {};
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
    hintVisible: draft.hintVisible ?? false,
    learnerValues,
    activeLearnerNodeId:
      state.exercise.type === 'evaluate-formula'
        ? nextPendingScaffoldNode(state.scaffoldNodeIds, learnerValues)
        : null,
  };
  if (draft.assignment && (state.exercise.type === 'evaluate-formula' || state.exercise.type === 'find-counterexample')) {
    next = {
      ...next,
      assignment: draft.assignment,
      tree:
        state.exercise.type === 'evaluate-formula'
          ? rebuildEvaluationTree(
              state.exercise,
              draft.assignment,
              next.learnerValues,
              next.scaffoldNodeIds,
            )
          : evaluateWithNodes(parse(state.exercise.formula!), draft.assignment).tree,
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
  scaffoldLevel = 0,
): AppState {
  const scaffold = evaluationScaffoldState(exercise.id, scaffoldLevel);
  const attempt =
    draft?.attempt.exerciseId === exercise.id
      ? draft.attempt
      : createPracticeAttempt(exercise.id);

  if (exercise.type === 'translate-en-to-formula') {
    const prompt = getAssessmentPrompt(locale, exercise.id, exercise.type);
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
      hintVisible: false,
      learnerValues: {},
      scaffoldNodeIds: [],
      scaffoldLevel: 0,
      activeLearnerNodeId: null,
    }, draft);
  }

  if (exercise.type === 'proof-fill-step') {
    const config = getProofExerciseConfig(exercise.id);
    if (!config) {
      throw new Error(`Missing proof config for ${exercise.id}`);
    }
    const prompt = getAssessmentPrompt(locale, exercise.id, exercise.type);
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
      hintVisible: false,
      learnerValues: {},
      scaffoldNodeIds: [],
      scaffoldLevel: 0,
      activeLearnerNodeId: null,
    }, draft);
  }

  const formula = parse(exercise.formula!);
  const atoms = [...collectAtoms(formula)].sort();
  const assignment =
    draft?.assignment ??
    (exercise.type === 'evaluate-formula'
      ? selectEvaluationAssignment({
          formula: exercise.formula!,
          seenKeys: [],
        })
      : exercise.type === 'find-counterexample' && exercise.initialAssignment
        ? exercise.initialAssignment
        : Object.fromEntries(atoms.map((atom) => [atom, false])));

  const prompt = getAssessmentPrompt(
    locale,
    exercise.id,
    exercise.type,
    exercise.type === 'evaluate-formula' ? assignment : undefined,
  );

  const tree =
    exercise.type === 'evaluate-formula'
      ? rebuildEvaluationTree(exercise, assignment, {}, scaffold.scaffoldNodeIds)
      : exercise.type === 'find-counterexample'
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
    hintVisible: false,
    learnerValues: {},
    scaffoldNodeIds: exercise.type === 'evaluate-formula' ? scaffold.scaffoldNodeIds : [],
    scaffoldLevel: exercise.type === 'evaluate-formula' ? scaffold.scaffoldLevel : 0,
    activeLearnerNodeId:
      exercise.type === 'evaluate-formula'
        ? nextPendingScaffoldNode(scaffold.scaffoldNodeIds, {})
        : null,
  }, draft);
}

export function selectNode(state: AppState, nodeId: string): AppState {
  if (state.exercise.type !== 'identify-main-connective' || !canEditCheckedExercise(state)) {
    return state;
  }

  return {
    ...state,
    selectedNodeId: nodeId,
    feedback: null,
    message: null,
  };
}

export function checkScope(state: AppState): AppState {
  if (
    state.exercise.type !== 'identify-main-connective' ||
    state.phase === 'answered' ||
    state.selectedNodeId === null
  ) {
    return state;
  }

  const formula = parse(state.exercise.formula!);
  const templates: Record<string, string> = getFeedbackTemplates(state.locale, state.exercise.id) as Record<string, string>;
  const result = checkMainConnectiveSelection(formula, state.tree, state.selectedNodeId, templates);

  return withCheckedAnswer(state, result.correct, result.tag, result.message, {
    selectedNodeId: state.selectedNodeId,
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
  if (state.exercise.type !== 'translate-en-to-formula' || !canEditCheckedExercise(state)) {
    return state;
  }
  const token = parsePaletteInsert(tokenKind, value);
  if (!token) {
    return state;
  }
  return editableUpdate(state, { builder: builderInsert(state.builder, token) });
}

export function paletteBackspace(state: AppState): AppState {
  if (state.exercise.type !== 'translate-en-to-formula' || !canEditCheckedExercise(state)) {
    return state;
  }
  return editableUpdate(state, { builder: builderBackspace(state.builder) });
}

export function paletteUndo(state: AppState): AppState {
  if (state.exercise.type !== 'translate-en-to-formula' || !canEditCheckedExercise(state)) {
    return state;
  }
  return editableUpdate(state, { builder: builderUndo(state.builder) });
}

export function checkTranslation(state: AppState): AppState {
  if (state.exercise.type !== 'translate-en-to-formula' || !canEditCheckedExercise(state)) {
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
    !canEditCheckedExercise(state) ||
    state.attempt.status === 'finalized'
  ) {
    return state;
  }
  return editableUpdate(state, { prediction });
}

export function selectLearnerNodeValue(state: AppState, nodeId: string, value: boolean): AppState {
  if (
    state.exercise.type !== 'evaluate-formula' ||
    state.phase === 'answered' ||
    !state.scaffoldNodeIds.includes(nodeId) ||
    state.learnerValues[nodeId] !== undefined
  ) {
    return state;
  }

  const formula = parse(state.exercise.formula!);
  const expected = expectedNodeValue(formula, state.assignment, nodeId);
  const subNode = findNodeById(state.tree, nodeId);
  if (value !== expected) {
    const explanationNode = subNode ? { ...subNode, value: expected } : state.tree;
    const message = formatEvaluationFeedback(
      state.locale,
      buildEvaluationFeedback(explanationNode, value),
    );
    return {
      ...state,
      attempt: recordAttemptCheck(state.attempt, false, 'incorrect-intermediate'),
      feedback: { correct: false, tag: 'incorrect-intermediate', message },
      message,
    };
  }

  const learnerValues = { ...state.learnerValues, [nodeId]: value };
  const tree = rebuildEvaluationTree(state.exercise, state.assignment, learnerValues, state.scaffoldNodeIds);
  return {
    ...state,
    learnerValues,
    tree,
    activeLearnerNodeId: nextPendingScaffoldNode(state.scaffoldNodeIds, learnerValues),
    prediction: null,
    feedback: null,
    message: null,
  };
}

export function showHint(state: AppState): AppState {
  if (state.phase === 'answered' || !getExerciseHint(state.locale, state.exercise.id)) {
    return state;
  }
  return { ...state, hintVisible: true };
}

export function checkEvaluation(state: AppState): AppState {
  if (
    state.exercise.type !== 'evaluate-formula' ||
    !canEditCheckedExercise(state) ||
    state.prediction === null ||
    !allScaffoldNodesResolved(state.scaffoldNodeIds, state.learnerValues)
  ) {
    return state;
  }
  const correct = state.prediction === state.tree.value;
  const tag = correct ? 'correct' : 'incorrect-evaluation';
  const evalResult = buildEvaluationFeedback(state.tree, state.prediction);
  const message = formatEvaluationFeedback(state.locale, evalResult);
  const checked = withCheckedAnswer(state, correct, tag, message);
  return correct ? checked : { ...checked, hintVisible: Boolean(getExerciseHint(state.locale, state.exercise.id)) };
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
    hintVisible: false,
    feedback: state.feedback,
    message: state.message,
  };
}

export function setAtomValue(state: AppState, atom: string, value: boolean): AppState {
  if (state.exercise.type === 'evaluate-formula') {
    return state;
  }
  if (state.exercise.type !== 'find-counterexample') {
    return state;
  }
  if (state.attempt.status === 'finalized') {
    return state;
  }

  const assignment = { ...state.assignment, [atom]: value };
  const { tree } = evaluateWithNodes(parse(state.exercise.formula!), assignment);
  const repairing = isRepairing(state);

  return {
    ...state,
    assignment,
    tree,
    phase: repairing ? 'answered' : 'ready',
    prediction: null,
    message: repairing ? state.message : null,
    feedback: repairing ? state.feedback : null,
  };
}

export function checkCounterexample(state: AppState): AppState {
  if (state.exercise.type !== 'find-counterexample' || !canEditCheckedExercise(state)) {
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
  if (state.exercise.type !== 'proof-fill-step' || !canEditCheckedExercise(state)) return state;
  return editableUpdate(state, {
    proofRule: state.proofRule === rule ? null : rule,
    proofDerivedFormula: null,
  });
}

export function toggleProofCitation(state: AppState, lineNumber: number): AppState {
  if (state.exercise.type !== 'proof-fill-step' || !canEditCheckedExercise(state)) return state;
  const cites = state.proofCites.includes(lineNumber)
    ? state.proofCites.filter((n) => n !== lineNumber)
    : [...state.proofCites, lineNumber];
  return editableUpdate(state, { proofCites: cites, proofDerivedFormula: null });
}

export function checkProofStep(state: AppState): AppState {
  if (state.exercise.type !== 'proof-fill-step' || !canEditCheckedExercise(state)) return state;
  const config = getProofExerciseConfig(state.exercise.id);
  if (!config) return state;
  const templates = getFeedbackTemplates(state.locale, state.exercise.id);
  const result = validateProofFillStep(config, state.proofLines, state.proofRule, state.proofCites, templates);
  return withCheckedAnswer(state, result.correct, result.tag, result.message, {
    proofDerivedFormula: result.derivedFormula,
  });
}

export function applyLocale(state: AppState, locale: Locale): AppState {
  const prompt = getAssessmentPrompt(
    locale,
    state.exercise.id,
    state.exercise.type,
    state.exercise.type === 'evaluate-formula' ? state.assignment : undefined,
  );
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

  if (state.phase === 'answered' && state.exercise.type === 'evaluate-formula' && state.feedback && state.prediction !== null) {
    const message = formatEvaluationFeedback(locale, buildEvaluationFeedback(state.tree, state.prediction));
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
  if (state.exercise.type === 'evaluate-formula') {
    draft.hintVisible = state.hintVisible;
    draft.learnerValues = state.learnerValues;
  }
  if (state.exercise.type === 'translate-en-to-formula') {
    draft.builderTokens = state.builder.tokens;
  }
  return draft;
}
