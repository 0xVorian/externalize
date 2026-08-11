import { describe, expect, it } from 'vitest';
import { ui } from '../i18n';
import { renderAtomPanel } from './atom-toggles-render';

describe('atom-toggles-render', () => {
  it('marks V/F segments active according to assignment', () => {
    const html = renderAtomPanel({
      locale: 'en',
      assignment: { P: true, Q: false },
      action: 'set-atom-value',
    });

    const pSection = html.split('<span class="atom-name">P</span>')[1].split(
      '<span class="atom-name">Q</span>',
    )[0];
    const qSection = html.split('<span class="atom-name">Q</span>')[1];

    expect(pSection).toContain('class="atom-segment true active"');
    expect(qSection).toContain('class="atom-segment false active"');
  });

  it('uses V/F labels in French and T/F in English', () => {
    const fr = renderAtomPanel({ locale: 'fr', assignment: { P: false }, action: 'set-atom-value' });
    const en = renderAtomPanel({ locale: 'en', assignment: { P: false }, action: 'set-atom-value' });

    expect(fr).toContain(ui('fr').trueLabel);
    expect(en).toContain(ui('en').trueLabel);
    expect(ui('fr').trueLabel).toBe('V');
    expect(ui('en').trueLabel).toBe('T');
  });

  it('disables all rows in read-only mode', () => {
    const html = renderAtomPanel({
      locale: 'en',
      assignment: { P: true, Q: false },
      action: 'set-atom-value',
      readOnly: true,
    });
    expect(html).toContain('atom-panel-readonly');
    expect(html).toContain('These truth values are fixed for this exercise.');
    expect(html.match(/disabled/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
  });

  it('disables rows when isAtomEnabled returns false', () => {
    const html = renderAtomPanel({
      locale: 'en',
      assignment: { P: false, Q: true },
      action: 'set-atom-value',
      isAtomEnabled: (atom) => atom === 'Q',
    });

    expect(html).toContain('<div class="atom-row disabled">');
    const pSection = html.split('<span class="atom-name">P</span>')[1].split(
      '<span class="atom-name">Q</span>',
    )[0];
    expect(pSection).toContain('disabled');
  });
});

