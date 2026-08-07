import { format } from '../../../engine';
import { proofUi, ui } from '../../i18n';
import type { AppState } from '../state';
import { getProofExerciseConfig } from './exercise-config';

function justificationLabel(
  locale: AppState['locale'],
  line: { hidden: boolean; justification: string | null },
): string {
  const copy = proofUi(locale);
  if (line.hidden) return copy.missingLine;
  if (line.justification === 'premise') return copy.premise;
  if (line.justification === 'mp') return copy.ruleMp;
  return '';
}

export function renderProofExerciseBody(state: AppState): string {
  const config = getProofExerciseConfig(state.exercise.id);
  if (!config) return '';

  const copy = proofUi(state.locale);
  const lines = state.proofLines;
  const rows = lines
    .map((line) => {
      const formula =
        line.hidden && state.phase === 'answered' && state.proofDerivedFormula
          ? state.proofDerivedFormula
          : line.formula
            ? format(line.formula)
            : '?';
      const citeable =
        !line.hidden && line.lineNumber - 1 < config.hiddenLineIndex && state.phase !== 'answered';
      const cited = state.proofCites.includes(line.lineNumber);
      const citeBtn = citeable
        ? `<button type="button" class="proof-cite-chip${cited ? ' selected' : ''}" data-action="proof-toggle-cite" data-line="${line.lineNumber}" aria-pressed="${cited}">${line.lineNumber}</button>`
        : `<span class="proof-line-num">${line.lineNumber}</span>`;
      const just = justificationLabel(state.locale, line);
      return `<li class="proof-line${line.hidden ? ' proof-line-missing' : ''}"><span class="proof-line-head">${citeBtn}<span class="proof-formula">${formula}</span></span><span class="proof-just">${just}</span></li>`;
    })
    .join('');

  const ruleSelected = state.proofRule === 'mp';
  const ruleBtn = `<button type="button" class="proof-rule-btn${ruleSelected ? ' selected' : ''}" data-action="proof-select-rule" data-rule="mp" aria-pressed="${ruleSelected}">${copy.ruleMp}</button>`;

  return `<section class="proof-panel" aria-label="${copy.panelAria}"><ol class="proof-lines">${rows}</ol><div class="proof-palette"><h2 class="panel-title">${copy.ruleTitle}</h2><div class="proof-rule-row">${ruleBtn}</div><p class="proof-hint">${copy.citeHint}</p></div></section>`;
}

export function renderProofActions(state: AppState): string {
  const copy = ui(state.locale);
  if (state.phase === 'answered') {
    return `<button type="button" class="primary" data-action="next">${copy.continue}</button>`;
  }
  return `<button type="button" class="primary" data-action="check-proof">${proofUi(state.locale).check}</button>`;
}
