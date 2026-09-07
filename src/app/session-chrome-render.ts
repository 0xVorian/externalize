import { sessionUi } from '../i18n';
import type { Locale } from '../i18n';

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
}): string {
  return `
    <main class="app session-active" lang="${options.locale}" data-testid="session-active">
      ${renderSessionChrome({
        locale: options.locale,
        current: options.current,
        total: options.total,
      })}
      ${options.body}
      <div class="actions">${options.actions}</div>
    </main>
  `;
}
