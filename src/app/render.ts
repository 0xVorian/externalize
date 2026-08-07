import type { TreeNode } from '../../engine';
import { ui } from '../i18n';
import type { AppState } from './state';

function truthLabel(value: boolean | undefined): string {
  if (value === undefined) {
    return '—';
  }
  return value ? 'T' : 'F';
}

function formatTruthWord(state: AppState, value: boolean): string {
  const copy = ui(state.locale);
  return value ? copy.trueLabel : copy.falseLabel;
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
      ? `<span class="node-value" aria-label="${ui(state.locale).valueAria(truthLabel(node.value))}">${truthLabel(node.value)}</span>`
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
  const copy = ui(state.locale);
  const atoms = Object.keys(state.assignment).sort();
  return `
    <section class="atom-panel" aria-label="${copy.assignmentAria}">
      <h2 class="panel-title">${copy.assignment}</h2>
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
            <span class="atom-value">${formatTruthWord(state, state.assignment[atom])}</span>
          </button>
        `,
          )
          .join('')}
      </div>
    </section>
  `;
}

function renderLanguageToggle(state: AppState): string {
  const locales = ['en', 'fr'] as const;
  return `
    <div class="language-toggle" role="group" aria-label="Language">
      ${locales
        .map(
          (locale) => `
        <button
          type="button"
          class="lang-button ${state.locale === locale ? 'active' : ''}"
          data-action="set-locale"
          data-locale="${locale}"
          aria-pressed="${state.locale === locale}"
          title="${ui(state.locale).switchTo(locale)}"
        >
          ${locale.toUpperCase()}
        </button>
      `,
        )
        .join('')}
    </div>
  `;
}

export function renderApp(state: AppState, queueSize: number): string {
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
      <header class="app-header">
        <div class="header-row">
          <p class="eyebrow">${copy.eyebrow}</p>
          ${renderLanguageToggle(state)}
        </div>
        <h1>${copy.practice}</h1>
        <p class="queue-meta">${copy.queueMeta(queueSize)}</p>
      </header>

      <article class="exercise-card">
        <p class="exercise-prompt">${state.prompt}</p>
        <p class="formula-display" aria-label="Formula">${state.exercise.formula}</p>

        <section class="tree-panel" aria-label="${copy.formulaTreeAria}">
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
