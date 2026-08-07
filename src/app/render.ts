import type { TreeNode } from '../../engine';
import type { AppState } from './state';

function truthLabel(value: boolean | undefined): string {
  if (value === undefined) {
    return '—';
  }
  return value ? 'T' : 'F';
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

  const valueHtml =
    state.exercise.type === 'evaluate-formula'
      ? `<span class="node-value" aria-label="value ${truthLabel(node.value)}">${truthLabel(node.value)}</span>`
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
  const atoms = Object.keys(state.assignment).sort();
  return `
    <section class="atom-panel" aria-label="Truth assignment">
      <h2 class="panel-title">Assignment</h2>
      <div class="atom-toggles">
        ${atoms
          .map(
            (atom) => `
          <button
            type="button"
            class="atom-toggle ${state.assignment[atom] ? 'true' : 'false'}"
            data-action="toggle-atom"
            data-atom="${atom}"
            aria-pressed="${state.assignment[atom]}"
          >
            <span class="atom-name">${atom}</span>
            <span class="atom-value">${state.assignment[atom] ? 'true' : 'false'}</span>
          </button>
        `,
          )
          .join('')}
      </div>
    </section>
  `;
}

export function renderApp(state: AppState, queueSize: number): string {
  const feedbackClass = state.feedback
    ? state.feedback.correct
      ? 'feedback-correct'
      : 'feedback-wrong'
    : state.message
      ? 'feedback-info'
      : '';

  return `
    <main class="app">
      <header class="app-header">
        <p class="eyebrow">Externalize · MVP-0</p>
        <h1>Practice</h1>
        <p class="queue-meta">${queueSize} item${queueSize === 1 ? '' : 's'} in review queue</p>
      </header>

      <article class="exercise-card">
        <p class="exercise-prompt">${state.exercise.prompt}</p>
        <p class="formula-display" aria-label="Formula">${state.exercise.formula}</p>

        <section class="tree-panel" aria-label="Formula tree">
          <ul class="tree-root">${renderTreeNode(state.tree, state)}</ul>
        </section>

        ${state.exercise.type === 'evaluate-formula' ? renderAtomToggles(state) : ''}

        ${
          state.message
            ? `<p class="feedback ${feedbackClass}" role="status">${state.message}</p>`
            : ''
        }

        <div class="actions">
          ${
            state.exercise.type === 'identify-main-connective' && state.phase === 'answered'
              ? `<button type="button" class="primary" data-action="next">Continue</button>`
              : ''
          }
          ${
            state.exercise.type === 'evaluate-formula'
              ? `<button type="button" class="secondary" data-action="next">Next exercise</button>`
              : ''
          }
        </div>
      </article>
    </main>
  `;
}
