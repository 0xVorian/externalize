import type { TreeNode } from '../../engine';
import { ui, formatTruthValue } from '../i18n';
import type { AppState } from './state';
import { renderShellHeader } from './shell-render';
import { renderLiveTruthRow, renderPartialTruthTable, usesLiveTruthRow } from './truth-table-render';
import { cellSubmissionCorrect } from './state';
import { renderAtomPanel } from './atom-toggles-render';
import { renderTranslationExerciseBody, renderTranslationActions } from './translation/translation-render';

function nodeValueClass(kind: TreeNode['kind']): string {
  return kind === 'pred' ? 'node-value node-value-assigned' : 'node-value node-value-computed';
}

function renderTreeNode(node: TreeNode, state: AppState): string {
  const copy = ui(state.locale);
  const isTappable = state.exercise.type === 'identify-main-connective';
  const selected = state.selectedNodeId === node.id;
  const classes = ['tree-node', `kind-${node.kind}`];
  if (selected) classes.push('selected');
  if (isTappable) classes.push('tappable');
  const truthLabel = formatTruthValue(state.locale, node.value);
  const valueHtml =
    state.exercise.type === 'evaluate-formula'
      ? `<span class="${nodeValueClass(node.kind)}" aria-label="${copy.valueAria(truthLabel)}">${truthLabel}</span>`
      : '';
  const nodeContent = `<span class="node-label">${node.label}</span>${valueHtml}`;
  const hasChildren = node.children.length > 0;
  const nodeInner = isTappable
    ? `<button type="button" class="node-button" data-action="select-node" data-node-id="${node.id}" aria-pressed="${selected}" aria-label="${copy.treeNodeSelectAria(node.label)}">${nodeContent}</button>`
    : `<div class="node-button node-readonly" aria-label="${copy.treeNodeDisplayAria(node.label, state.exercise.type === 'evaluate-formula' ? truthLabel : undefined)}">${nodeContent}</div>`;
  const children = node.children.map((c) => renderTreeNode(c, state)).join('');
  return `<li class="${classes.join(' ')}" role="treeitem" data-node-id="${node.id}"${hasChildren ? ' aria-expanded="true"' : ''}>${nodeInner}${children ? `<ul class="tree-children" role="group">${children}</ul>` : ''}</li>`;
}

function renderAtomToggles(state: AppState): string {
  return renderAtomPanel({ locale: state.locale, assignment: state.assignment, action: 'set-atom-value' });
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
  if (usesLiveTruthRow(state.exercise.formula!)) {
    return `${renderAtomToggles(state)}${renderLiveTruthRow(state.locale, state.exercise.formula!, state.assignment)}`;
  }
  return `<section class="tree-panel" aria-label="${ui(state.locale).formulaTreeAria}"><ul class="tree-root" role="tree">${renderTreeNode(state.tree, state)}</ul></section>${renderAtomToggles(state)}`;
}

function renderScopeBody(state: AppState): string {
  return `<section class="tree-panel" aria-label="${ui(state.locale).formulaTreeAria}"><ul class="tree-root" role="tree">${renderTreeNode(state.tree, state)}</ul></section>`;
}

function renderExerciseBody(state: AppState): string {
  if (state.exercise.type === 'translate-en-to-formula') {
    return renderTranslationExerciseBody(state);
  }
  if (state.exercise.type === 'evaluate-formula') {
    return renderEvaluationBody(state);
  }
  if (state.exercise.type === 'fill-truth-table-cell') {
    return renderFillTruthTableBody(state);
  }
  return renderScopeBody(state);
}

export function renderApp(state: AppState, queueSize: number, practiceUnlocked: boolean): string {
  const copy = ui(state.locale);
  const cellCorrect = cellSubmissionCorrect(state);
  const feedbackClass = state.feedback
    ? state.feedback.correct
      ? 'feedback-correct'
      : 'feedback-wrong'
    : state.message && cellCorrect === false
      ? 'feedback-wrong'
      : state.message && cellCorrect === true
        ? 'feedback-correct'
        : state.message
          ? 'feedback-info'
          : '';

  const formulaLine =
    state.exercise.type === 'translate-en-to-formula' || state.exercise.type === 'fill-truth-table-cell'
      ? ''
      : `<p class="formula-display" aria-label="${copy.formulaDisplayAria}">${state.exercise.formula}</p>`;

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
      <article class="exercise-card">
        <p class="exercise-prompt">${state.prompt}</p>
        ${formulaLine}
        ${renderExerciseBody(state)}
        ${state.message ? `<p class="feedback ${feedbackClass}" role="status">${state.message}</p>` : ''}
        <div class="actions">
          ${state.exercise.type === 'identify-main-connective' && state.phase === 'answered' ? `<button type="button" class="primary" data-action="next">${copy.continue}</button>` : ''}
          ${state.exercise.type === 'fill-truth-table-cell' && state.phase === 'answered' ? `<button type="button" class="primary" data-action="next">${copy.continue}</button>` : ''}
          ${state.exercise.type === 'evaluate-formula' ? `<button type="button" class="secondary" data-action="next">${copy.nextExercise}</button>` : ''}
          ${state.exercise.type === 'translate-en-to-formula' ? renderTranslationActions(state) : ''}
        </div>
      </article>
    </main>
  `;
}
