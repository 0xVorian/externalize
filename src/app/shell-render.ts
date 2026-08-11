import type { Locale } from '../i18n';
import { learnUi, getReference, ui } from '../i18n';
import { progressUi } from '../i18n';

export type AppMode = 'learn' | 'practice' | 'progress' | 'explore';

export function renderLanguageToggle(locale: Locale): string {
  const copy = ui(locale);
  const locales = ['en', 'fr'] as const;
  return `
    <div class="language-toggle" role="group" aria-label="${copy.languageToggle(locale)}">
      ${locales
        .map(
          (code) => `
        <button
          type="button"
          class="lang-button ${locale === code ? 'active' : ''}"
          data-action="set-locale"
          data-locale="${code}"
          aria-label="${locale === code ? copy.languageToggle(code) : copy.switchTo(code)}"
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
  mode: AppMode,
  practiceUnlocked: boolean,
): string {
  const learn = learnUi(locale);
  const progress = progressUi(locale);
  return `
    <nav class="mode-nav mode-nav-four" aria-label="Mode">
      <button
        type="button"
        class="mode-button ${mode === 'learn' ? 'active' : ''}"
        data-action="set-mode"
        data-mode="learn"
        aria-label="${learn.modeLearnAria}"
        aria-pressed="${mode === 'learn'}"
      >
        ${learn.learn}
      </button>
      <button
        type="button"
        class="mode-button ${mode === 'explore' ? 'active' : ''}"
        data-action="set-mode"
        data-mode="explore"
        aria-label="${learn.modeExploreAria}"
        aria-pressed="${mode === 'explore'}"
      >
        ${learn.openExplore}
      </button>
      <button
        type="button"
        class="mode-button ${mode === 'practice' ? 'active' : ''}"
        data-action="set-mode"
        data-mode="practice"
        aria-label="${learn.modePracticeAria}"
        aria-pressed="${mode === 'practice'}"
        ${practiceUnlocked ? '' : 'disabled'}
        title="${practiceUnlocked ? '' : learn.practiceLocked}"
      >
        ${learn.practice}
      </button>
      <button
        type="button"
        class="mode-button ${mode === 'progress' ? 'active' : ''}"
        data-action="set-mode"
        data-mode="progress"
        aria-label="${progress.modeProgressAria}"
        aria-pressed="${mode === 'progress'}"
      >
        ${progress.progress}
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
  mode: AppMode;
  practiceUnlocked: boolean;
  title: string;
  meta?: string;
  referenceOpen?: boolean;
}): string {
  const { locale, mode, practiceUnlocked, title, meta, referenceOpen = false } = options;
  return `
    <header class="app-header">
      <div class="header-row">
        <p class="eyebrow">Externalize</p>
        ${renderLanguageToggle(locale)}
      </div>
      ${renderModeNav(locale, mode, practiceUnlocked)}
      <h1>${title}</h1>
      ${meta ? `<p class="queue-meta">${meta}</p>` : ''}
      ${mode === 'learn' ? renderReferencePanel(locale, referenceOpen) : ''}
    </header>
  `;
}
