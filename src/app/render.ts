import type { TreeNode } from '../../engine';
import { ui, formatTruthValue } from '../i18n';
import type { AppState } from './state';
import { renderShellHeader } from './shell-render';
import { renderLiveTruthRow, usesLiveTruthRow } from './truth-table-render';
import { renderAtomPanel } from './atom-toggles-render';

function nodeValueClass(kind: TreeNode['kind']): string {
  return kind === 'atom' ? 'node-value node-value-assigned' : 'node-value node-value-computed';
}

function renderTreeNode(node: TreeNode, state: AppState): string {
  const copy = ui(state.locale);
  const isTappable = state.exercise.type === 'identify-main-connective';
  const selected = state.selectedNodeId === node.id;
  const classes = ['tree-node', `kind-${node.kind}`];
  if (selected) classes.push('selected');
  if (isTappable) classes.push('tappable');
  const truthLabel = formatTruthValue(state.locale, node.value);
  const valueHtml = state.exercise.type === 'evaluate-formula'
    ? `<span class="${nodeValueClass(node.kind)}" aria-label="${copy.valueAria(truthLabel)}">${truthLabel}</span>` : '';
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

function renderEvaluationBody(state: AppState): string {
  if (usesLiveTruthRow(state.exercise.formula)) {
    return `${renderAtomToggles(state)}${renderLiveTruthRow(state.locale, state.exercise.formula, state.assignment)}`;
  }
  return `<section class="tree-panel" aria-label="${ui(state.locale).formulaTreeAria}"><ul class="tree-root" role="tree">${renderTreeNode(state.tree, state)}</ul></section>${renderAtomToggles(state)}`;
}

export function renderApp(state: AppState, queueSize: number, practiceUnlocked: boolean): string {
  const copy = ui(state.locale);
  const feedbackClass = state.feedback ? (state.feedback.correct ? 'feedback-correct' : 'feedback-wrong') : state.message ? 'feedback-info' : '';
  return `<main class="app" lang="${state.locale}">${renderShellHeader({ locale: state.locale, mode: 'practice', practiceUnlocked, title: copy.practice, meta: copy.queueMeta(queueSize), referenceOpen: false })}<article class="exercise-card"><p class="exercise-prompt">${state.prompt}</p><p class="formula-display" aria-label="${copy.formulaDisplayAria}">${state.exercise.formula}</p>${state.exercise.type === 'evaluate-formula' ? renderEvaluationBody(state) : `<section class="tree-panel" aria-label="${copy.formulaTreeAria}"><ul class="tree-root" role="tree">${renderTreeNode(state.tree, state)}</ul></section>`}${state.message ? `<p class="feedback ${feedbackClass}" role="status">${state.message}</p>` : ''}<div class="actions">${state.exercise.type === 'identify-main-connective' && state.phase === 'answered' ? `<button type="button" class="primary" data-action="next">${copy.continue}</button>` : ''}${state.exercise.type === 'evaluate-formula' ? `<button type="button" class="secondary" data-action="next">${copy.nextExercise}</button>` : ''}</div></article></main>`;
}
