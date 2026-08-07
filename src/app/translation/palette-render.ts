import { connectiveLabel } from '../../../engine';
import type { ConnectiveKind } from '../../../engine';
import type { Locale } from '../../i18n';
import type { TranslationPaletteConfig } from './types';

const CONNECTIVE_ARIA: Record<ConnectiveKind, { en: string; fr: string }> = {
  not: { en: 'Negation', fr: 'Négation' },
  and: { en: 'Conjunction', fr: 'Conjonction' },
  or: { en: 'Disjunction', fr: 'Disjonction' },
  imp: { en: 'Conditional', fr: 'Implication' },
  iff: { en: 'Biconditional', fr: 'Équivalence' },
};

function renderPaletteButton(
  innerHtml: string,
  action: string,
  payload: Record<string, string>,
  ariaLabel: string,
  extraClass = '',
): string {
  const dataAttrs = Object.entries(payload)
    .map(([key, value]) => `data-${key}="${value}"`)
    .join(' ');
  return `
    <button
      type="button"
      class="palette-button ${extraClass}"
      data-action="${action}"
      ${dataAttrs}
      aria-label="${ariaLabel}"
    >
      ${innerHtml}
    </button>
  `;
}

/** Mobile-first symbol palette for translation exercises (HTML string). */
export function renderSymbolPalette(
  locale: Locale,
  config: TranslationPaletteConfig,
): string {
  const atomButtons = config.atoms
    .map((atom) => {
      const gloss = atom.gloss
        ? `<span class="palette-gloss">${atom.gloss}</span>`
        : '';
      const inner = `<span class="palette-symbol">${atom.name}</span>${gloss}`;
      const aria = atom.gloss ? `${atom.name}: ${atom.gloss}` : atom.name;
      return renderPaletteButton(
        inner,
        'palette-insert',
        { token: 'atom', value: atom.name },
        aria,
        'palette-atom',
      );
    })
    .join('');

  const connectiveButtons = config.connectives
    .map((kind) => {
      const symbol = connectiveLabel(kind);
      const aria = CONNECTIVE_ARIA[kind][locale];
      return renderPaletteButton(
        symbol,
        'palette-insert',
        { token: 'connective', value: kind },
        aria,
        'palette-connective',
      );
    })
    .join('');

  const parenButtons = config.includeParentheses
    ? `
      ${renderPaletteButton('(', 'palette-insert', { token: 'paren', value: 'open' }, locale === 'fr' ? 'Parenthèse ouvrante' : 'Open parenthesis', 'palette-paren')}
      ${renderPaletteButton(')', 'palette-insert', { token: 'paren', value: 'close' }, locale === 'fr' ? 'Parenthèse fermante' : 'Close parenthesis', 'palette-paren')}
    `
    : '';

  const editButtons = `
    ${renderPaletteButton('⌫', 'palette-backspace', {}, locale === 'fr' ? 'Effacer le dernier symbole' : 'Delete last symbol', 'palette-edit')}
    ${renderPaletteButton('↶', 'palette-undo', {}, locale === 'fr' ? 'Annuler' : 'Undo', 'palette-edit')}
  `;

  const title = locale === 'fr' ? 'Symboles' : 'Symbols';

  return `
    <section class="symbol-palette" aria-label="${title}">
      <h2 class="panel-title">${title}</h2>
      <div class="palette-row palette-atoms" role="group" aria-label="${locale === 'fr' ? 'Variables propositionnelles' : 'Sentence letters'}">
        ${atomButtons}
      </div>
      <div class="palette-row palette-connectives" role="group" aria-label="${locale === 'fr' ? 'Connecteurs' : 'Connectives'}">
        ${connectiveButtons}
      </div>
      <div class="palette-row palette-structure" role="group" aria-label="${locale === 'fr' ? 'Structure' : 'Structure'}">
        ${parenButtons}
        ${editButtons}
      </div>
    </section>
  `;
}
