import { getExerciseCopy, ui } from '../i18n';
import type { AppState } from './state';

export function renderClassifyChoiceBody(state: AppState): string {
  const copy = getExerciseCopy(state.locale, state.exercise.id);
  const uiCopy = ui(state.locale);
  const choiceIds = state.exercise.choiceIds ?? [];
  const formula = state.exercise.formula
    ? `<p class="formula-display" aria-label="${uiCopy.formulaDisplayAria}">${state.exercise.formula}</p>`
    : '';
  const disabled = state.phase === 'answered' || state.attempt.status === 'finalized';
  const options = choiceIds
    .map((choiceId) => {
      const label = copy.choices?.[choiceId] ?? choiceId;
      const selected = state.selectedChoiceId === choiceId;
      return `
        <button
          type="button"
          class="choice-option ${selected ? 'selected' : ''}"
          data-action="select-choice"
          data-choice-id="${choiceId}"
          aria-pressed="${selected}"
          ${disabled ? 'disabled' : ''}
        >${label}</button>
      `;
    })
    .join('');
  return `
    ${formula}
    <div class="choice-list" role="group" aria-label="${copy.prompt}">
      ${options}
    </div>
  `;
}

export function renderClassifyChoiceActions(state: AppState, hideContinue = false): string {
  const copy = ui(state.locale);
  if (state.phase === 'ready') {
    return `<button type="button" class="primary" data-action="check-classification"${state.selectedChoiceId ? '' : ' disabled'}>${copy.checkScope}</button>`;
  }
  if (state.attempt.status === 'finalized') {
    return hideContinue
      ? ''
      : `<button type="button" class="primary" data-action="next-exercise">${copy.continue}</button>`;
  }
  return `<button type="button" class="secondary" data-action="try-again" data-testid="try-again">${copy.tryAgain}</button>`;
}
