import { formatResumeTime, sessionUi } from '../i18n';
import type { Locale } from '../i18n';
import { renderLanguageToggle } from './shell-render';

export function renderRoundComplete(options: {
  locale: Locale;
  nextReviewAt?: string;
}): string {
  const copy = sessionUi(options.locale);
  const review = options.nextReviewAt
    ? copy.nextReview(formatResumeTime(options.locale, options.nextReviewAt))
    : copy.nextReviewUnknown;
  return `
    <main class="app session-complete" lang="${options.locale}" data-testid="round-complete">
      <div class="header-row">
        <p class="eyebrow">${copy.productName}</p>
        ${renderLanguageToggle(options.locale)}
      </div>
      <h1>${copy.completeHeading}</h1>
      <p class="session-detail">${copy.completeBody}</p>
      <p class="session-review">${review}</p>
      <div class="actions">
        <button type="button" class="primary" data-action="session-done" data-testid="session-done">${copy.doneForNow}</button>
        <button type="button" class="secondary" data-action="session-another" data-testid="session-another">${copy.doAnother}</button>
      </div>
    </main>
  `;
}
