import { describe, expect, it } from 'vitest';
import { formatTruthValue, ui } from './index';

describe('truth-value control language', () => {
  it('uses ordinary English words for answer controls while formal notation stays compact', () => {
    expect(ui('en').trueLabel).toBe('True');
    expect(ui('en').falseLabel).toBe('False');
    expect(formatTruthValue('en', true)).toBe('T');
    expect(formatTruthValue('en', false)).toBe('F');
  });

  it('uses ordinary French words for answer controls while formal notation stays compact', () => {
    expect(ui('fr').trueLabel).toBe('Vrai');
    expect(ui('fr').falseLabel).toBe('Faux');
    expect(formatTruthValue('fr', true)).toBe('V');
    expect(formatTruthValue('fr', false)).toBe('F');
  });
});
