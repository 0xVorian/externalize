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
  const selected = state.selectedNodeId === node.id;
  const classes = ['tree-node', `kind-${node.kind}`];
  if (selected) {
    classes.push('selected');
  }
  if (state.exercise.type === 'identify-main-connective') {
    classes.push('tappable');
  }

  const label = formatTruthValue(state.locale, node.value);
  const valueHtml =
    state.exercise.type === 'evaluate-formula'
      ? `<span class="${nodeValueClass(node.kind)}" aria-label="${ui(state.locale).valueAria(label)}">${label}</span>`
      : '';

  const children = node.children.map((child) => renderTreeNode(child, state)).join('');

  return `
    <li class="${classes.join(' ')}" data-node-id="${node.id}">
      <button type="button" class="node-button" data-action="select-node" data-node-id="${node.id}">
        <span class="node-label">${node.label}</span>
        ${valueHtml}
      </button>
      ${children ? `<ul class="tree-children">${children}</ul>` : ''}
    </li>
  `;
}

function renderAtomToggles(state: AppState): string {
  return renderAtomPanel({
    locale: state.locale,
    assignment: state.assignment,
    action: 'set-atom-value',
  });
}

function renderEvaluationBody(state: AppState): string {
  if (usesLiveTruthRow(state.exercise.formula)) {
    return `
      ${renderAtomToggles(state)}
      ${renderLiveTruthRow(state.locale, state.exercise.formula, state.assignment)}
    `;
  }

  return `
    <section class="tree-panel" aria-label="${ui(state.locale).formulaTreeAria}">
      <ul class="tree-root">${renderTreeNode(state.tree, state)}</ul>
    </section>
    ${renderAtomToggles(state)}
  `;
}

export function renderApp(
  state: AppState,
  queueSize: number,
  practiceUnlocked: boolean,
): string {
  const copy = ui(state.locale);
  const feedbackClass = state.feedback
    ? state.feedback.correct
      ? 'feedback-correct'
      : 'feedback-wrong'
    : state.message
      ? 'feedback-info'
      : '';

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
        <p class="formula-display" aria-label="Formula">${state.exercise.formula}</p>

        ${
          state.exercise.type === 'evaluate-formula'
            ? renderEvaluationBody(state)
            : `<section class="tree-panel" aria-label="${copy.formulaTreeAria}">
          <ul class="tree-root">${renderTreeNode(state.tree, state)}</ul>
        </section>`
        }

        ${
          state.message
            ? `<p class="feedback ${feedbackClass}" role="status">${state.message}</p>`
            : ''
        }

        <div class="actions">
          ${
            state.exercise.type === 'identify-main-connective' && state.phase === 'answered'
              ? `<button type="button" class="primary" data-action="next">${copy.continue}</button>`
              : ''
          }
          ${
            state.exercise.type === 'evaluate-formula'
              ? `<button type="button" class="secondary" data-action="next">${copy.nextExercise}</button>`
              : ''
          }
        </div>
      </article>
    </main>
  `;
}
