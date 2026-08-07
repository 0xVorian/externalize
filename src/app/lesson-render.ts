import type { TreeNode } from '../../engine';
import { learnUi, getLessonCopy, ui, formatTruthValue, type Locale } from '../i18n';
import { LEVEL_0_LESSONS } from './lessons';
import type { LessonState } from './lesson-state';
import { currentGuidedHint, isGuidedAtomEnabled } from './lesson-state';
import { renderShellHeader } from './shell-render';

function nodeValueClass(kind: TreeNode['kind']): string {
  return kind === 'atom' ? 'node-value node-value-assigned' : 'node-value node-value-computed';
}

function renderTreeNode(node: TreeNode, locale: Locale): string {
  const copy = ui(locale);
  const label = formatTruthValue(locale, node.value);
  const valueHtml = `<span class="${nodeValueClass(node.kind)}" aria-label="${copy.valueAria(label)}">${label}</span>`;
  const children = node.children.map((child) => renderTreeNode(child, locale)).join('');
  return `
    <li class="tree-node kind-${node.kind}">
      <div class="node-button node-readonly">
        <span class="node-label">${node.label}</span>
        ${valueHtml}
      </div>
      ${children ? `<ul class="tree-children">${children}</ul>` : ''}
    </li>
  `;
}

function renderGuidedToggles(state: LessonState): string {
  const copy = ui(state.locale);
  const atoms = ['P', 'Q'] as const;
  return `
    <section class="atom-panel" aria-label="${copy.assignmentAria}">
      <h2 class="panel-title">${copy.assignment}</h2>
      <div class="atom-toggles">
        ${atoms
          .map((atom) => {
            const enabled = isGuidedAtomEnabled(state, atom);
            const value = state.assignment[atom] ?? false;
            return `
          <button
            type="button"
            class="atom-toggle ${value ? 'true' : 'false'} ${enabled ? '' : 'disabled'}"
            data-action="guided-toggle"
            data-atom="${atom}"
            aria-pressed="${value}"
            ${enabled ? '' : 'disabled'}
          >
            <span class="atom-name">${atom}</span>
            <span class="atom-value">${value ? copy.trueLabel : copy.falseLabel}</span>
          </button>
        `;
          })
          .join('')}
      </div>
    </section>
  `;
}

function renderCardLesson(state: LessonState): string {
  const copy = getLessonCopy(state.locale, state.lesson.id);
  const card = copy.card!;
  return `
    <article class="lesson-card">
      <h2 class="lesson-card-title">${card.title}</h2>
      ${card.body.map((paragraph) => `<p class="lesson-body">${paragraph}</p>`).join('')}
      ${card.example ? `<pre class="lesson-example">${card.example}</pre>` : ''}
    </article>
  `;
}

function conjunctionResult(assignment: { P: boolean; Q: boolean }): boolean {
  return assignment.P && assignment.Q;
}

function renderWatchTruthTable(
  state: LessonState,
  steps: Array<{ assignment: { P: boolean; Q: boolean } }>,
  formula: string,
): string {
  const learn = learnUi(state.locale);
  const rows = steps
    .map((step, index) => {
      const active = index === state.watchStep;
      const result = conjunctionResult(step.assignment);
      return `
        <tr class="truth-table-row ${active ? 'active' : ''}">
          <th scope="row" class="sr-only">${learn.stepLabel(index + 1, steps.length)}</th>
          <td>${formatTruthValue(state.locale, step.assignment.P)}</td>
          <td>${formatTruthValue(state.locale, step.assignment.Q)}</td>
          <td class="result-cell">${formatTruthValue(state.locale, result)}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div class="truth-table-wrap">
      <table class="truth-table" aria-label="${learn.truthTableAria(formula)}">
        <thead>
          <tr>
            <th scope="col">P</th>
            <th scope="col">Q</th>
            <th scope="col">${formula}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderWatchLesson(state: LessonState): string {
  const learn = learnUi(state.locale);
  const copy = getLessonCopy(state.locale, state.lesson.id);
  const steps = copy.watchSteps ?? [];
  const formula = state.lesson.formula ?? 'P ∧ Q';
  return `
    <article class="lesson-card">
      <p class="exercise-prompt">${learn.watchPrompt}</p>
      <p class="formula-display">${formula}</p>
      <p class="step-meta">${learn.stepLabel(state.watchStep + 1, steps.length)}</p>
      ${renderWatchTruthTable(state, steps, formula)}
      ${state.message ? `<p class="feedback feedback-info" role="status">${state.message}</p>` : ''}
    </article>
  `;
}

function renderGuidedLesson(state: LessonState): string {
  const formula = state.lesson.formula ?? 'P ∧ Q';
  const hint = currentGuidedHint(state);
  return `
    <article class="lesson-card">
      <p class="formula-display">${formula}</p>
      <section class="tree-panel" aria-label="${ui(state.locale).formulaTreeAria}">
        <ul class="tree-root">${renderTreeNode(state.tree, state.locale)}</ul>
      </section>
      ${renderGuidedToggles(state)}
      ${hint ? `<p class="feedback ${state.complete ? 'feedback-correct' : 'feedback-info'}" role="status">${hint}</p>` : ''}
    </article>
  `;
}

export function renderLessonView(state: LessonState, options: {
  practiceUnlocked: boolean;
  level0Complete: boolean;
}): string {
  const learn = learnUi(state.locale);
  const copy = getLessonCopy(state.locale, state.lesson.id);
  const lessonIndex = LEVEL_0_LESSONS.findIndex((lesson) => lesson.id === state.lesson.id) + 1;

  let body = '';
  if (state.lesson.type === 'card') {
    body = renderCardLesson(state);
  } else if (state.lesson.type === 'watch') {
    body = renderWatchLesson(state);
  } else {
    body = renderGuidedLesson(state);
  }

  const isLast = lessonIndex === LEVEL_0_LESSONS.length;
  const showNext =
    state.lesson.type === 'card' ||
    state.lesson.type === 'watch' ||
    (state.lesson.type === 'guided' && state.complete);

  let nextLabel = learn.nextStep;
  if (state.lesson.type === 'watch' && state.watchStep >= (copy.watchSteps?.length ?? 1) - 1 && !state.complete) {
    nextLabel = learn.nextStep;
  }
  if (options.level0Complete && isLast && state.complete) {
    nextLabel = learn.startPractice;
  }

  return `
    <main class="app" lang="${state.locale}">
      ${renderShellHeader({
        locale: state.locale,
        mode: 'learn',
        practiceUnlocked: options.practiceUnlocked,
        title: learn.level0Title,
        meta: `${copy.subtitle ?? copy.title} · ${learn.lessonProgress(lessonIndex, LEVEL_0_LESSONS.length)}`,
      })}

      ${body}

      <div class="actions">
        ${
          showNext
            ? `<button type="button" class="primary" data-action="lesson-next">${nextLabel}</button>`
            : ''
        }
      </div>
    </main>
  `;
}
