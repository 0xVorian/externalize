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
  forall: { en: 'Universal quantifier', fr: 'Quantificateur universel' },
  exists: { en: 'Existential quantifier', fr: 'Quantificateur existentiel' },
};

function renderPaletteButton(
  innerHtml: string,
  action: string,
  payload: Record<string, string>,
  ariaLabel: string,
  extraClass = '',
  disabled = false,
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
      ${disabled ? 'disabled' : ''}
    >
      ${innerHtml}
    </button>
  `;
}

/** Mobile-first symbol palette for translation exercises (HTML string). */
export function renderSymbolPalette(
  locale: Locale,
  config: TranslationPaletteConfig,
  glosses: Record<string, string> = {},
  disabled = false,
): string {
  const atomButtons = config.atoms
    .map((atom) => {
      const atomGloss = glosses[atom.name];
      const gloss = atomGloss
        ? `<span class="palette-gloss">${atomGloss}</span>`
        : '';
      const inner = `<span class="palette-symbol">${atom.name}</span>${gloss}`;
      const aria = atomGloss ? `${atom.name}: ${atomGloss}` : atom.name;
      return renderPaletteButton(
        inner,
        'palette-insert',
        { token: 'pred', value: atom.name },
        aria,
        'palette-atom',
        disabled,
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
        disabled,
      );
    })
    .join('');

  const parenButtons = config.includeParentheses
    ? `
      ${renderPaletteButton('(', 'palette-insert', { token: 'paren', value: 'open' }, locale === 'fr' ? 'Parenthèse ouvrante' : 'Open parenthesis', 'palette-paren', disabled)}
      ${renderPaletteButton(')', 'palette-insert', { token: 'paren', value: 'close' }, locale === 'fr' ? 'Parenthèse fermante' : 'Close parenthesis', 'palette-paren', disabled)}
    `
    : '';

  const editButtons = `
    ${renderPaletteButton('⌫', 'palette-backspace', {}, locale === 'fr' ? 'Effacer le dernier symbole' : 'Delete last symbol', 'palette-edit', disabled)}
    ${renderPaletteButton('↶', 'palette-undo', {}, locale === 'fr' ? 'Annuler' : 'Undo', 'palette-edit', disabled)}
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
