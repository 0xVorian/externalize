import { formatResumeTime, sessionUi } from '../i18n';
import type { Locale } from '../i18n';
import type { OpeningOffer } from './session-types';
import { renderLanguageToggle } from './shell-render';

function primaryLabel(
  locale: Locale,
  kind: OpeningOffer['kind'],
): string {
  const copy = sessionUi(locale);
  if (kind === 'resume') return copy.resume;
  if (kind === 'continue') return copy.continue;
  if (kind === 'quick-review' || kind === 'lapse-recovery' || kind === 'start') {
    return copy.start;
  }
  return copy.start;
}

function renderMoreNav(locale: Locale, practiceUnlocked: boolean): string {
  const copy = sessionUi(locale);
  return `
    <details class="session-more" data-testid="session-more">
      <summary class="session-more-summary">${copy.more}</summary>
      <nav class="session-more-nav" aria-label="${copy.moreAria}">
        <button type="button" data-action="set-mode" data-mode="learn">${copy.browseLearn}</button>
        <button type="button" data-action="set-mode" data-mode="explore">${copy.browseExplore}</button>
        <button type="button" data-action="set-mode" data-mode="practice" ${practiceUnlocked ? '' : 'disabled'}>${copy.browsePractice}</button>
        <button type="button" data-action="set-mode" data-mode="progress">${copy.browseProgress}</button>
      </nav>
    </details>
  `;
}

export function renderSessionOpening(options: {
  locale: Locale;
  offer: OpeningOffer;
  practiceUnlocked: boolean;
}): string {
  const copy = sessionUi(options.locale);
  const offer = options.offer;
  const reviewLine = offer.nextReviewAt
    ? `<p class="session-review">${copy.nextReview(formatResumeTime(options.locale, offer.nextReviewAt))}</p>`
    : '';

  if (offer.kind === 'idle' || !offer.plan) {
    return `
      <main class="app session-opening" lang="${options.locale}" data-testid="session-opening">
        <div class="header-row">
          <p class="eyebrow">${copy.productName}</p>
          ${renderLanguageToggle(options.locale)}
        </div>
        <h1>${copy.idleHeading}</h1>
        <p class="session-detail">${copy.idleBody}</p>
        ${reviewLine || `<p class="session-review">${copy.nextReviewUnknown}</p>`}
        ${renderMoreNav(options.locale, options.practiceUnlocked)}
      </main>
    `;
  }

  const detail = offer.plan.preparation ? copy.preparationDetail : copy.detail(offer.kind);
  return `
    <main class="app session-opening" lang="${options.locale}" data-testid="session-opening">
      <div class="header-row">
        <p class="eyebrow">${copy.productName}</p>
        ${renderLanguageToggle(options.locale)}
      </div>
      <h1>${copy.heading(offer.kind)}</h1>
      <p class="session-detail">${detail}</p>
      <p class="session-effort">${copy.effort(offer.plan.steps.length, offer.plan.estimatedMinutes)}</p>
      <div class="actions">
        <button
          type="button"
          class="primary"
          data-action="session-begin"
          data-testid="session-primary-action"
          aria-label="${copy.primaryAria(offer.kind)}"
        >${primaryLabel(options.locale, offer.kind)}</button>
      </div>
      ${renderMoreNav(options.locale, options.practiceUnlocked)}
    </main>
  `;
}
