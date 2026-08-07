import { format, toVerticalTree, type TreeNode } from '../../../engine';
import { translationUi, ui } from '../../i18n';
import type { AppState } from '../state';
import { getTranslationExerciseConfig } from './exercise-config';
import { renderSymbolPalette } from './palette-render';

function renderTreeList(node: TreeNode, aria: string): string {
  function nodeHtml(n: TreeNode): string {
    const children = n.children.map(nodeHtml).join('');
    return `<li class="tree-node kind-${n.kind}" role="treeitem" data-node-id="${n.id}"><div class="node-button node-readonly"><span class="node-label">${n.label}</span></div>${children ? `<ul class="tree-children" role="group">${children}</ul>` : ''}</li>`;
  }
  return `<section class="tree-panel translation-tree" aria-label="${aria}"><ul class="tree-root" role="tree">${nodeHtml(node)}</ul></section>`;
}

function renderAtomKey(locale: AppState['locale'], atoms: Record<string, string>): string {
  const title = translationUi(locale).atomKeyTitle;
  const entries = Object.entries(atoms)
    .map(
      ([name, gloss]) =>
        `<li><span class="atom-key-letter">${name}</span><span class="atom-key-gloss">${gloss}</span></li>`,
    )
    .join('');
  return `<section class="atom-key" aria-label="${title}"><h2 class="panel-title">${title}</h2><ul class="atom-key-list">${entries}</ul></section>`;
}

export function renderTranslationExerciseBody(state: AppState): string {
  const config = getTranslationExerciseConfig(state.exercise.id);
  if (!config) {
    return '';
  }
  const t = translationUi(state.locale);
  const previewLine = state.builder.formula
    ? format(state.builder.formula)
    : state.builder.compileError
      ? t.compileHint(state.builder.compileError)
      : t.previewEmpty;

  const treeHtml = state.builder.formula
    ? renderTreeList(toVerticalTree(state.builder.formula), ui(state.locale).formulaTreeAria)
    : '';

  return `${renderAtomKey(state.locale, config.prompt.atoms)}<section class="translation-preview" aria-label="${t.previewAria}"><h2 class="panel-title">${t.previewTitle}</h2><p class="built-formula" aria-live="polite">${previewLine}</p>${treeHtml}</section>${renderSymbolPalette(state.locale, config.palette)}`;
}

export function renderTranslationActions(state: AppState): string {
  const copy = ui(state.locale);
  if (state.phase === 'answered') {
    if (state.feedback?.correct) {
      return `<button type="button" class="primary" data-action="next">${copy.continue}</button>`;
    }
    return `<button type="button" class="primary" data-action="try-again">${copy.tryAgain}</button><button type="button" class="secondary" data-action="next">${copy.continue}</button>`;
  }
  return `<button type="button" class="primary" data-action="check-translation">${translationUi(state.locale).check}</button>`;
}
