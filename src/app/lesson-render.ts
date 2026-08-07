import { learnUi, getLessonCopy, ui, formatTruthValue } from '../i18n';
import { LEVEL_0_LESSONS } from './lessons';
import type { LessonState } from './lesson-state';
import { currentGuidedHint, isGuidedAtomEnabled } from './lesson-state';
import { renderShellHeader } from './shell-render';

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

function renderTruthTable(
  state: LessonState,
  formula: string,
  rows: Array<{ assignment: { P: boolean; Q: boolean }; active: boolean; srLabel?: string }>,
): string {
  const learn = learnUi(state.locale);
  const body = rows
    .map((row) => {
      const result = conjunctionResult(row.assignment);
      return `
        <tr class="truth-table-row ${row.active ? 'active' : ''}">
          ${row.srLabel ? `<th scope="row" class="sr-only">${row.srLabel}</th>` : ''}
          <td>${formatTruthValue(state.locale, row.assignment.P)}</td>
          <td>${formatTruthValue(state.locale, row.assignment.Q)}</td>
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
        <tbody>${body}</tbody>
      </table>
    </div>
  `;
}

function renderWatchTruthTable(
  state: LessonState,
  steps: Array<{ assignment: { P: boolean; Q: boolean } }>,
  formula: string,
): string {
  const learn = learnUi(state.locale);
  return renderTruthTable(
    state,
    formula,
    steps.map((step, index) => ({
      assignment: step.assignment,
      active: index === state.watchStep,
      srLabel: learn.stepLabel(index + 1, steps.length),
    })),
  );
}

function renderLiveTruthRow(state: LessonState, formula: string): string {
  const assignment = {
    P: state.assignment.P ?? false,
    Q: state.assignment.Q ?? false,
  };
  return renderTruthTable(state, formula, [{ assignment, active: true }]);
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
      ${renderGuidedToggles(state)}
      ${renderLiveTruthRow(state, formula)}
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
