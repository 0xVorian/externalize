import type { Locale } from '../i18n';
import { learnUi, getReference } from '../i18n';

export function renderLanguageToggle(locale: Locale): string {
  const locales = ['en', 'fr'] as const;
  return `
    <div class="language-toggle" role="group" aria-label="Language">
      ${locales
        .map(
          (code) => `
        <button
          type="button"
          class="lang-button ${locale === code ? 'active' : ''}"
          data-action="set-locale"
          data-locale="${code}"
          aria-pressed="${locale === code}"
        >
          ${code.toUpperCase()}
        </button>
      `,
        )
        .join('')}
    </div>
  `;
}

export function renderModeNav(
  locale: Locale,
  mode: 'learn' | 'practice',
  practiceUnlocked: boolean,
): string {
  const copy = learnUi(locale);
  return `
    <nav class="mode-nav" aria-label="Mode">
      <button
        type="button"
        class="mode-button ${mode === 'learn' ? 'active' : ''}"
        data-action="set-mode"
        data-mode="learn"
        aria-pressed="${mode === 'learn'}"
      >
        ${copy.learn}
      </button>
      <button
        type="button"
        class="mode-button ${mode === 'practice' ? 'active' : ''}"
        data-action="set-mode"
        data-mode="practice"
        aria-pressed="${mode === 'practice'}"
        ${practiceUnlocked ? '' : 'disabled'}
        title="${practiceUnlocked ? '' : copy.practiceLocked}"
      >
        ${copy.practice}
      </button>
    </nav>
  `;
}

export function renderReferencePanel(locale: Locale, open: boolean): string {
  const copy = learnUi(locale);
  const entries = getReference(locale);
  return `
    <details class="reference-panel" ${open ? 'open' : ''}>
      <summary>${copy.referenceToggle}</summary>
      <div class="reference-body">
        <h2 class="panel-title">${copy.referenceTitle}</h2>
        <ul class="reference-list">
          ${entries
            .map(
              (entry) => `
            <li class="reference-item">
              <span class="reference-symbol">${entry.symbol}</span>
              <span class="reference-name">${entry.name}</span>
              <p class="reference-summary">${entry.summary}</p>
            </li>
          `,
            )
            .join('')}
        </ul>
      </div>
    </details>
  `;
}

export function renderShellHeader(options: {
  locale: Locale;
  mode: 'learn' | 'practice';
  practiceUnlocked: boolean;
  title: string;
  meta?: string;
  referenceOpen?: boolean;
}): string {
  const { locale, mode, practiceUnlocked, title, meta, referenceOpen = true } = options;
  return `
    <header class="app-header">
      <div class="header-row">
        <p class="eyebrow">Externalize</p>
        ${renderLanguageToggle(locale)}
      </div>
      ${renderModeNav(locale, mode, practiceUnlocked)}
      <h1>${title}</h1>
      ${meta ? `<p class="queue-meta">${meta}</p>` : ''}
      ${renderReferencePanel(locale, referenceOpen)}
    </header>
  `;
}
