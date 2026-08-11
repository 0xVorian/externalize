import { learnUi, ui } from '../i18n';
import type { ExploreState } from './explore-state';
import { currentExploreFormula, EXPLORE_FORMULAS } from './explore-state';
import { renderShellHeader } from './shell-render';
import { renderAtomPanel } from './atom-toggles-render';
import { renderLiveTruthRow } from './truth-table-render';

export function renderExploreView(state: ExploreState, practiceUnlocked: boolean): string {
  const learn = learnUi(state.locale);
  const copy = ui(state.locale);
  const formula = currentExploreFormula(state);
  const formulaPicker = EXPLORE_FORMULAS.map((candidate, index) => {
    const active = index === state.formulaIndex;
    return `<button type="button" class="formula-chip${active ? ' active' : ''}" data-action="select-explore-formula" data-formula-index="${index}" aria-pressed="${active}">${candidate}</button>`;
  }).join('');

  return `
    <main class="app" lang="${state.locale}">
      ${renderShellHeader({
        locale: state.locale,
        mode: 'explore',
        practiceUnlocked,
        title: learn.exploreTitle,
        meta: learn.exploreMeta,
        referenceOpen: false,
      })}
      <article class="exercise-card">
        <p class="exercise-prompt">${learn.explorePrompt}</p>
        <div class="formula-picker" role="group" aria-label="${learn.exploreFormulaAria}">
          ${formulaPicker}
        </div>
        <p class="formula-display" aria-label="${copy.formulaDisplayAria}">${formula}</p>
        ${renderAtomPanel({
          locale: state.locale,
          assignment: state.assignment,
          action: 'set-explore-atom',
        })}
        ${renderLiveTruthRow(state.locale, formula, state.assignment, { hideResult: false })}
      </article>
      <div class="actions">
        <button type="button" class="secondary" data-action="set-mode" data-mode="learn">${learn.exploreBackToLearn}</button>
      </div>
    </main>
  `;
}
