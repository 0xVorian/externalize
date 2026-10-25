import { sessionUi } from '../i18n';
import type { Locale } from '../i18n';
import { conceptLabel } from './prerequisites';
import type { SessionStep } from './session-types';

export function sessionStepLabel(locale: Locale, step?: SessionStep): string | undefined {
  if (!step?.role || !step.conceptId) {
    return undefined;
  }
  const copy = sessionUi(locale);
  const concept = conceptLabel(locale, step.conceptId);
  if (step.role === 'warmup') {
    return copy.warmupLabel(concept);
  }
  if (step.role === 'repair') {
    return copy.repairLabel(concept);
  }
  return undefined;
}

export function renderSessionChrome(options: {
  locale: Locale;
  current: number;
  total: number;
}): string {
  const copy = sessionUi(options.locale);
  return `
    <header class="session-chrome">
      <button type="button" class="session-exit" data-action="session-exit" data-testid="session-exit">${copy.exit}</button>
      <p
        class="session-position"
        data-testid="session-position"
        aria-label="${copy.positionAria(options.current, options.total)}"
      >${copy.position(options.current, options.total)}</p>
    </header>
  `;
}

export function renderSessionFrame(options: {
  locale: Locale;
  current: number;
  total: number;
  body: string;
  actions: string;
  label?: string;
}): string {
  const label = options.label
    ? `<p class="session-step-label" data-testid="session-step-label">${options.label}</p>`
    : '';
  return `
    <main class="app session-active" lang="${options.locale}" data-testid="session-active">
      ${renderSessionChrome({
        locale: options.locale,
        current: options.current,
        total: options.total,
      })}
      ${label}
      ${options.body}
      <div class="actions">${options.actions}</div>
    </main>
  `;
}
