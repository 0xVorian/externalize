import { ui, type Locale } from '../i18n';

export type AtomToggleRenderOptions = {
  locale: Locale;
  assignment: Record<string, boolean>;
  action: string;
  isAtomEnabled?: (atom: string) => boolean;
  disabled?: boolean;
  readOnly?: boolean;
};

export function renderAtomPanel(options: AtomToggleRenderOptions): string {
  const copy = ui(options.locale);
  const atoms = Object.keys(options.assignment).sort();
  const isEnabled = options.isAtomEnabled ?? (() => true);
  const readOnly = options.readOnly ?? false;

  const rows = atoms
    .map((atom) => {
      const enabled = !options.disabled && !readOnly && isEnabled(atom);
      const value = options.assignment[atom] ?? false;
      const trueActive = value;
      const falseActive = !value;
      return `
        <div class="atom-row ${enabled ? '' : 'disabled'}">
          <span class="atom-name">${atom}</span>
          <div class="atom-segments" role="group" aria-label="${copy.atomGroupAria(atom)}">
            <button
              type="button"
              class="atom-segment true ${trueActive ? 'active' : ''}"
              data-action="${options.action}"
              data-atom="${atom}"
              data-value="true"
              aria-label="${copy.atomSetTrueAria(atom)}"
              aria-pressed="${trueActive}"
              ${enabled ? '' : 'disabled'}
            >
              ${copy.trueLabel}
            </button>
            <button
              type="button"
              class="atom-segment false ${falseActive ? 'active' : ''}"
              data-action="${options.action}"
              data-atom="${atom}"
              data-value="false"
              aria-label="${copy.atomSetFalseAria(atom)}"
              aria-pressed="${falseActive}"
              ${enabled ? '' : 'disabled'}
            >
              ${copy.falseLabel}
            </button>
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <section class="atom-panel${readOnly ? ' atom-panel-readonly' : ''}" aria-label="${copy.assignmentAria}">
      <h2 class="panel-title">${copy.assignment}</h2>
      <p class="atom-panel-hint">${readOnly ? copy.assignmentGivenHint : copy.assignmentHint}</p>
      <div class="atom-rows">${rows}</div>
    </section>
  `;
}
