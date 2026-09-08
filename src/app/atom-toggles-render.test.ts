import { describe, expect, it } from 'vitest';
import { renderAtomPanel } from './atom-toggles-render';

describe('atom-toggles-render', () => {
  it('marks truth-value segments active according to assignment', () => {
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

  it('keeps compact V/F and T/F notation in assignment controls', () => {
    const fr = renderAtomPanel({ locale: 'fr', assignment: { P: false }, action: 'set-atom-value' });
    const en = renderAtomPanel({ locale: 'en', assignment: { P: false }, action: 'set-atom-value' });

    expect(fr).toMatch(/data-value="true"[\s\S]*?>\s*V\s*<\/button>/);
    expect(fr).toMatch(/data-value="false"[\s\S]*?>\s*F\s*<\/button>/);
    expect(en).toMatch(/data-value="true"[\s\S]*?>\s*T\s*<\/button>/);
    expect(en).toMatch(/data-value="false"[\s\S]*?>\s*F\s*<\/button>/);
    expect(fr).not.toContain('>Vrai<');
    expect(en).not.toContain('>True<');
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
    expect(html).not.toContain('data-action="set-atom-value"');
    expect(html).not.toContain('<button');
    expect(html).toContain('role="img"');
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
