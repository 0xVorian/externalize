import type { TreeNode } from '../../engine';
import { getExerciseHint, ui, progressUi, formatTruthValue, visibilityUi, learnUi } from '../i18n';
import type { AppState } from './state';
import { renderShellHeader } from './shell-render';
import { renderLiveTruthRow, renderPartialTruthTable, renderCompleteTruthTable, renderTautologyChoice, usesLiveTruthRow } from './truth-table-render';
import { cellSubmissionCorrect, tautologySubmissionCorrect } from './state';
import { renderAtomPanel } from './atom-toggles-render';
import { renderTranslationExerciseBody, renderTranslationActions } from './translation/translation-render';
import { renderProofExerciseBody, renderProofActions } from './proof/proof-render';
import { treeFocusNodeId } from './tree-keyboard';
import { skillForExercise } from './progress-tracker';
import {
  describeProgressMoment,
  type CapabilityState,
  type ProgressMoment,
} from './progress-visibility';
import type { PracticeSessionSummary } from './practice-session';
import { exerciseLabel } from './exercise-label';

export type PracticeViewContext = {
  capabilityState: CapabilityState;
  sessionCompleted: number;
  sessionTarget: number;
  sessionComplete: boolean;
  sessionSummary?: PracticeSessionSummary | null;
  progressMoment?: ProgressMoment | null;
  progressMomentLive?: boolean;
  scaffoldLevel?: number;
  unitCompleteNotice?: string | null;
};

function showsEvaluatedTree(type: AppState['exercise']['type']): boolean {
  return type === 'evaluate-formula' || type === 'find-counterexample';
}

function hidesAssessmentRoot(state: AppState, node: TreeNode): boolean {
  if (state.phase !== 'ready' || node.id !== state.tree.id) {
    return false;
  }
  return state.exercise.type === 'evaluate-formula' || state.exercise.type === 'find-counterexample';
}

function displayNodeValue(state: AppState, node: TreeNode): boolean | undefined {
  if (hidesAssessmentRoot(state, node)) {
    return undefined;
  }
  if (state.learnerValues[node.id] !== undefined) {
    return state.learnerValues[node.id];
  }
  if (
    state.exercise.type === 'evaluate-formula' &&
    state.scaffoldNodeIds.includes(node.id) &&
    state.phase === 'ready'
  ) {
    return undefined;
  }
  return node.value;
}

function nodeValueClass(state: AppState, node: TreeNode): string {
  if (state.learnerValues[node.id] !== undefined) {
    return 'node-value node-value-learner';
  }
  return node.kind === 'pred' ? 'node-value node-value-assigned' : 'node-value node-value-computed';
}

function renderLearnerNodeInput(state: AppState, node: TreeNode): string {
  const copy = ui(state.locale);
  return `<div class="cell-segments learner-node-input" role="group" aria-label="${copy.evaluationChoiceAria}">
    <button type="button" class="cell-segment true" data-action="select-learner-node-value" data-node-id="${node.id}" data-value="true">${copy.trueLabel}</button>
    <button type="button" class="cell-segment false" data-action="select-learner-node-value" data-node-id="${node.id}" data-value="false">${copy.falseLabel}</button>
  </div>`;
}

function renderTreeNode(node: TreeNode, state: AppState, focusNodeId?: string): string {
  const copy = ui(state.locale);
  const isTappable = state.exercise.type === 'identify-main-connective';
  const isSelectable = isTappable && state.attempt.status !== 'finalized';
  const selected = state.selectedNodeId === node.id;
  const classes = ['tree-node', `kind-${node.kind}`];
  if (selected) classes.push('selected');
  if (isSelectable) classes.push('tappable');
  const truthLabel = formatTruthValue(state.locale, displayNodeValue(state, node));
  const isLearnerInput =
    state.exercise.type === 'evaluate-formula' &&
    state.phase === 'ready' &&
    state.activeLearnerNodeId === node.id;
  const valueHtml = showsEvaluatedTree(state.exercise.type)
    ? isLearnerInput
      ? renderLearnerNodeInput(state, node)
      : `<span class="${nodeValueClass(state, node)}" aria-label="${copy.valueAria(truthLabel)}">${truthLabel}</span>`
    : '';
  const nodeContent = `<span class="node-label">${node.label}</span>${valueHtml}`;
  const hasChildren = node.children.length > 0;
  const tabIndexAttr = isSelectable ? ` tabindex="${node.id === focusNodeId ? '0' : '-1'}"` : '';
  const nodeInner = isTappable
    ? `<button type="button" class="node-button" data-action="select-node" data-node-id="${node.id}"${tabIndexAttr} aria-pressed="${selected}" aria-label="${node.kind === 'pred' ? copy.treeNodeSelectAtomAria(node.label) : copy.treeNodeSelectConnectiveAria(node.label)}"${isSelectable ? '' : ' disabled'}>${nodeContent}</button>`
    : `<div class="node-button node-readonly" aria-label="${copy.treeNodeDisplayAria(node.label, showsEvaluatedTree(state.exercise.type) ? truthLabel : undefined)}">${nodeContent}</div>`;
  const children = node.children.map((c) => renderTreeNode(c, state, focusNodeId)).join('');
  return `<li class="${classes.join(' ')}" role="treeitem" data-node-id="${node.id}"${hasChildren ? ' aria-expanded="true"' : ''}${selected ? ' aria-selected="true"' : ''}>${nodeInner}${children ? `<ul class="tree-children" role="group">${children}</ul>` : ''}</li>`;
}

function renderTreePanel(state: AppState, trailing = ''): string {
  const focusNodeId = treeFocusNodeId(state);
  return `<section class="tree-panel" aria-label="${ui(state.locale).formulaTreeAria}"><ul class="tree-root" role="tree">${renderTreeNode(state.tree, state, focusNodeId)}</ul></section>${trailing}`;
}

function renderAtomToggles(state: AppState): string {
  return renderAtomPanel({
    locale: state.locale,
    assignment: state.assignment,
    action: 'set-atom-value',
    disabled: state.attempt.status === 'finalized',
  });
}

function renderFixedEvaluationAssignment(state: AppState): string {
  return renderAtomPanel({
    locale: state.locale,
    assignment: state.assignment,
    action: 'set-atom-value',
    readOnly: true,
  });
}

function renderTautologyBody(state: AppState): string {
  if (!state.exercise.formula) return '';
  return `${renderCompleteTruthTable(state.locale, state.exercise.formula)}${renderTautologyChoice(state.locale, state.submittedCell, state.phase === 'answered')}`;
}

function renderFillTruthTableBody(state: AppState): string {
  if (!state.partialTable || state.exercise.hiddenRowIndex === undefined) {
    return '';
  }
  return renderPartialTruthTable(state.locale, state.exercise.formula!, state.partialTable, {
    hiddenRowIndex: state.exercise.hiddenRowIndex,
    submitted: state.submittedCell,
    answered: state.phase === 'answered',
  });
}

function renderEvaluationBody(state: AppState): string {
  if (state.exercise.type !== 'evaluate-formula') {
    return '';
  }
  const copy = ui(state.locale);
  const scaffoldBlocksPrediction = state.scaffoldNodeIds.length > 0 && state.activeLearnerNodeId !== null;
  const predictionDisabled =
    state.attempt.status === 'finalized' || scaffoldBlocksPrediction;
  const choices = `<section class="prediction-panel" aria-label="${copy.evaluationChoiceAria}"><p class="prediction-label">${copy.evaluationChoiceAria}</p><div class="cell-segments evaluation-prediction" role="group"><button type="button" class="cell-segment true${state.prediction === true ? ' selected' : ''}" data-action="select-evaluation-prediction" data-value="true" aria-pressed="${state.prediction === true}"${predictionDisabled ? ' disabled' : ''}>${copy.trueLabel}</button><button type="button" class="cell-segment false${state.prediction === false ? ' selected' : ''}" data-action="select-evaluation-prediction" data-value="false" aria-pressed="${state.prediction === false}"${predictionDisabled ? ' disabled' : ''}>${copy.falseLabel}</button></div></section>`;
  const visualization = usesLiveTruthRow(state.exercise.formula!)
    ? `${renderFixedEvaluationAssignment(state)}${renderLiveTruthRow(state.locale, state.exercise.formula!, state.assignment, { hideResult: state.phase === 'ready' })}`
    : renderTreePanel(state, renderFixedEvaluationAssignment(state));
  return `${visualization}${choices}`;
}

function renderCounterexampleBody(state: AppState): string {
  if (state.exercise.type !== 'find-counterexample') {
    return '';
  }
  if (usesLiveTruthRow(state.exercise.formula!)) {
    return `${renderAtomToggles(state)}${renderLiveTruthRow(state.locale, state.exercise.formula!, state.assignment, { hideResult: state.phase === 'ready' })}`;
  }
  return renderTreePanel(state, renderAtomToggles(state));
}

function renderScopeBody(state: AppState): string {
  return renderTreePanel(state);
}

function renderExerciseBody(state: AppState): string {
  if (state.exercise.type === 'translate-en-to-formula') {
    return renderTranslationExerciseBody(state);
  }
  if (state.exercise.type === 'evaluate-formula') {
    return renderEvaluationBody(state);
  }
  if (state.exercise.type === 'find-counterexample') {
    return renderCounterexampleBody(state);
  }
  if (state.exercise.type === 'fill-truth-table-cell') {
    return renderFillTruthTableBody(state);
  }
  if (state.exercise.type === 'classify-tautology') return renderTautologyBody(state);
  if (state.exercise.type === 'proof-fill-step') {
    return renderProofExerciseBody(state);
  }
  return renderScopeBody(state);
}

function renderCounterexampleActions(state: AppState, hideContinue: boolean): string {
  const copy = ui(state.locale);
  if (state.attempt.status === 'finalized') {
    return hideContinue ? '' : `<button type="button" class="primary" data-action="next">${copy.continue}</button>`;
  }
  return `<button type="button" class="primary" data-action="check-counterexample">${copy.checkCounterexample}</button>`;
}

function capabilityStateLabel(
  copy: ReturnType<typeof visibilityUi>,
  state: CapabilityState,
): string {
  if (state === 'reliable') return copy.stateReliable;
  if (state === 'developing') return copy.stateDeveloping;
  if (state === 'ready') return copy.stateReady;
  return copy.stateLocked;
}

function renderPracticeChrome(
  state: AppState,
  context: PracticeViewContext,
): string {
  const copy = visibilityUi(state.locale);
  const skillId = skillForExercise(state.exercise);
  const familyLabel = progressUi(state.locale).skillLabel(skillId);
  const stateLabel = capabilityStateLabel(copy, context.capabilityState);
  const moment = context.progressMoment
    ? describeProgressMoment(
        context.progressMoment,
        copy,
        (id) => progressUi(state.locale).skillLabel(id),
        (id) => exerciseLabel(state.locale, id),
      )
    : null;
  const unitNotice = context.unitCompleteNotice
    ? `<section class="unit-complete-card" data-testid="unit-complete" role="status">
        <h2 class="panel-title">${learnUi(state.locale).unitCompleteHeading}</h2>
        <p>${context.unitCompleteNotice}</p>
      </section>`
    : '';
  const momentPanel = moment
    ? `<aside class="progress-moment" data-testid="progress-moment" role="status" aria-live="${context.progressMomentLive ? 'polite' : 'off'}">${moment}</aside>`
    : '';

  return `
    ${unitNotice}
    <div class="practice-progress" data-testid="practice-progress">
      <p class="practice-capability">
        <span class="exercise-family">${familyLabel}</span>
        <span class="capability-chip" data-testid="capability-state">${stateLabel}</span>
      </p>
      <p
        class="practice-session"
        data-testid="practice-session"
        aria-label="${copy.sessionProgressAria(context.sessionCompleted, context.sessionTarget)}"
      >${copy.sessionProgress(context.sessionCompleted, context.sessionTarget)}</p>
    </div>
    ${momentPanel}
  `;
}

function renderSessionComplete(state: AppState, context: PracticeViewContext): string {
  if (!context.sessionComplete) {
    return '';
  }
  const copy = visibilityUi(state.locale);
  const summary = context.sessionSummary;
  const count = summary?.completedCount ?? context.sessionCompleted;
  const momentItems =
    summary && summary.moments.length > 0
      ? `<ul class="session-complete-moments">${summary.moments
          .map(
            (moment) =>
              `<li>${describeProgressMoment(
                moment,
                copy,
                (id) => progressUi(state.locale).skillLabel(id),
                (id) => exerciseLabel(state.locale, id),
              )}</li>`,
          )
          .join('')}</ul>`
      : summary && summary.skillIds.length > 0
        ? `<p>${copy.sessionPractised(
            summary.skillIds.map((id) => progressUi(state.locale).skillLabel(id)).join(', '),
          )}</p>`
        : '';

  return `
    <section class="session-complete-card" data-testid="session-complete" role="status">
      <h2 class="panel-title">${copy.sessionCompleteHeading}</h2>
      <p>${copy.sessionCompleteCount(count)}</p>
      ${momentItems}
      <div class="actions">
        <button type="button" class="primary" data-action="session-continue">${copy.sessionKeepPractising}</button>
        <button type="button" class="secondary" data-action="session-finish">${copy.sessionFinish}</button>
      </div>
    </section>
  `;
}

function renderExerciseActions(state: AppState, hideContinue: boolean): string {
  const copy = ui(state.locale);
  const continueButton = hideContinue
    ? ''
    : `<button type="button" class="primary" data-action="next">${copy.continue}</button>`;
  const tryAgain = `<button type="button" class="primary" data-action="try-again">${copy.tryAgain}</button>`;
  const scaffoldBlocksPrediction =
    state.exercise.type === 'evaluate-formula' &&
    state.scaffoldNodeIds.length > 0 &&
    state.activeLearnerNodeId !== null;

  return `
        <div class="actions">
          ${state.exercise.type === 'identify-main-connective' && state.phase === 'ready' ? `<button type="button" class="primary" data-action="check-scope"${state.selectedNodeId === null ? ' disabled' : ''}>${copy.checkScope}</button>` : ''}
          ${state.exercise.type === 'identify-main-connective' && state.phase === 'answered' ? (state.attempt.status === 'finalized' ? continueButton : tryAgain) : ''}
          ${(state.exercise.type === 'fill-truth-table-cell' || state.exercise.type === 'classify-tautology') && state.phase === 'answered' ? (state.attempt.status === 'finalized' ? continueButton : tryAgain) : ''}
          ${state.exercise.type === 'evaluate-formula' && state.attempt.status === 'finalized' ? continueButton : ''}
          ${state.exercise.type === 'evaluate-formula' && state.phase === 'answered' && state.attempt.status !== 'finalized' ? tryAgain : ''}
          ${state.exercise.type === 'evaluate-formula' && state.phase === 'ready' && getExerciseHint(state.locale, state.exercise.id) && !state.hintVisible ? `<button type="button" class="secondary" data-action="show-hint">${copy.showHint}</button>` : ''}
          ${state.exercise.type === 'evaluate-formula' && state.phase === 'ready' && state.attempt.status !== 'finalized' ? `<button type="button" class="primary" data-action="check-evaluation"${state.prediction === null || scaffoldBlocksPrediction ? ' disabled' : ''}>${copy.checkEvaluation}</button>` : ''}
          ${state.exercise.type === 'find-counterexample' ? renderCounterexampleActions(state, hideContinue) : ''}
          ${state.exercise.type === 'translate-en-to-formula' ? renderTranslationActions(state, hideContinue) : ''}
          ${state.exercise.type === 'proof-fill-step' ? renderProofActions(state, hideContinue) : ''}
        </div>
  `;
}

export function renderApp(
  state: AppState,
  queueSize: number,
  practiceUnlocked: boolean,
  context?: PracticeViewContext,
): string {
  const copy = ui(state.locale);
  const familyLabel = progressUi(state.locale).skillLabel(skillForExercise(state.exercise));
  const cellCorrect = cellSubmissionCorrect(state);
  const tautologyCorrect = tautologySubmissionCorrect(state);
  const feedbackClass = state.feedback
    ? state.feedback.correct
      ? 'feedback-correct'
      : 'feedback-wrong'
    : state.message && (cellCorrect === false || tautologyCorrect === false)
      ? 'feedback-wrong'
      : state.message && (cellCorrect === true || tautologyCorrect === true)
        ? 'feedback-correct'
        : state.message
          ? 'feedback-info'
          : '';

  const formulaLine =
    state.exercise.type === 'translate-en-to-formula' || state.exercise.type === 'fill-truth-table-cell' || state.exercise.type === 'classify-tautology' || state.exercise.type === 'proof-fill-step'
      ? ''
      : `<p class="formula-display" aria-label="${copy.formulaDisplayAria}">${state.exercise.formula}</p>`;

  const hideContinue = Boolean(context?.sessionComplete);
  const chrome = context ? renderPracticeChrome(state, context) : '';

  return `
    <main class="app" lang="${state.locale}">
      ${renderShellHeader({
        locale: state.locale,
        mode: 'practice',
        practiceUnlocked,
        title: copy.practice,
        meta: copy.queueMeta(queueSize),
        referenceOpen: false,
      })}
      ${chrome}
      <article class="exercise-card">
        ${context ? '' : `<p class="exercise-family">${familyLabel}</p>`}
        <p class="exercise-prompt">${state.prompt}</p>
        ${state.hintVisible && getExerciseHint(state.locale, state.exercise.id) ? `<aside class="exercise-hint" role="note"><strong>${copy.hintHeading}</strong> ${getExerciseHint(state.locale, state.exercise.id)}</aside>` : ''}
        ${formulaLine}
        ${renderExerciseBody(state)}
        ${state.message ? `<p class="feedback ${feedbackClass}" role="status">${state.message}</p>` : ''}
        ${renderExerciseActions(state, hideContinue)}
      </article>
      ${context ? renderSessionComplete(state, context) : ''}
    </main>
  `;
}
