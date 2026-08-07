import { learnUi, getLessonCopy } from '../i18n';
import { lessonsForUnit, lessonUnit, ALL_LEARN_LESSONS } from './lessons';
import type { LessonState } from './lesson-state';
import { currentGuidedHint, isGuidedAtomEnabled } from './lesson-state';
import { renderShellHeader } from './shell-render';
import { renderLiveTruthRow, renderTruthTable } from './truth-table-render';
import { renderAtomPanel } from './atom-toggles-render';

function renderGuidedToggles(state: LessonState): string {
  return renderAtomPanel({
    locale: state.locale,
    assignment: state.assignment,
    action: 'set-atom-value',
    isAtomEnabled: (atom) => isGuidedAtomEnabled(state, atom),
  });
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

function renderWatchTruthTable(
  state: LessonState,
  steps: Array<{ assignment: Record<string, boolean> }>,
  formula: string,
): string {
  const learn = learnUi(state.locale);
  return renderTruthTable(
    state.locale,
    formula,
    steps.map((step, index) => ({
      assignment: step.assignment,
      active: index === state.watchStep,
      srLabel: learn.stepLabel(index + 1, steps.length),
    })),
  );
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
      ${renderLiveTruthRow(state.locale, formula, state.assignment)}
      ${hint ? `<p class="feedback ${state.complete ? 'feedback-correct' : 'feedback-info'}" role="status">${hint}</p>` : ''}
    </article>
  `;
}

function renderUnitPicker(state: LessonState, unit0Complete: boolean): string {
  if (!unit0Complete) {
    return '';
  }
  const learn = learnUi(state.locale);
  const unit = lessonUnit(state.lesson.id);
  return `
    <nav class="unit-picker" role="tablist" aria-label="${learn.unitPickerLabel}">
      <button type="button" class="unit-button ${unit === 0 ? 'active' : ''}" role="tab" aria-selected="${unit === 0}" data-action="select-unit" data-unit="0">${learn.level0Title}</button>
      <button type="button" class="unit-button ${unit === 1 ? 'active' : ''}" role="tab" aria-selected="${unit === 1}" data-action="select-unit" data-unit="1">${learn.level1Title}</button>
    </nav>
  `;
}

function renderCompletionToast(state: LessonState): string {
  const learn = learnUi(state.locale);
  const unit = lessonUnit(state.lesson.id);
  const unitLessons = lessonsForUnit(unit);
  const isLastInUnit = unitLessons[unitLessons.length - 1]?.id === state.lesson.id;
  if (!state.complete || !isLastInUnit || state.lesson.type !== 'guided') {
    return '';
  }
  const message = unit === 0 ? learn.level0Complete : learn.level1Complete;
  return `<p class="completion-toast" role="status">${message}</p>`;
}

export function renderLessonView(state: LessonState, options: {
  practiceUnlocked: boolean;
  level0Complete: boolean;
  learnPathComplete: boolean;
}): string {
  const learn = learnUi(state.locale);
  const copy = getLessonCopy(state.locale, state.lesson.id);
  const unit = lessonUnit(state.lesson.id);
  const unitLessons = lessonsForUnit(unit);
  const lessonIndex = unitLessons.findIndex((lesson) => lesson.id === state.lesson.id) + 1;
  const unitTitle = unit === 1 ? learn.level1Title : learn.level0Title;

  let body = '';
  if (state.lesson.type === 'card') {
    body = renderCardLesson(state);
  } else if (state.lesson.type === 'watch') {
    body = renderWatchLesson(state);
  } else {
    body = renderGuidedLesson(state);
  }

  const isLastInUnit = lessonIndex === unitLessons.length;
  const isLastInPath =
    ALL_LEARN_LESSONS.findIndex((lesson) => lesson.id === state.lesson.id) ===
    ALL_LEARN_LESSONS.length - 1;
  const showNext =
    state.lesson.type === 'card' ||
    state.lesson.type === 'watch' ||
    (state.lesson.type === 'guided' && state.complete);

  let nextLabel = learn.nextStep;
  if (unit === 0 && isLastInUnit && state.complete && options.level0Complete && !options.learnPathComplete) {
    nextLabel = learn.continueUnit1;
  } else if (options.level0Complete && isLastInPath && state.complete) {
    nextLabel = learn.startPractice;
  }

  return `
    <main class="app" lang="${state.locale}">
      ${renderShellHeader({
        locale: state.locale,
        mode: 'learn',
        practiceUnlocked: options.practiceUnlocked,
        title: unitTitle,
        meta: `${copy.subtitle ?? copy.title} · ${learn.lessonProgress(lessonIndex, unitLessons.length)}`,
      })}

      ${renderUnitPicker(state, options.level0Complete)}
      ${renderCompletionToast(state)}

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
