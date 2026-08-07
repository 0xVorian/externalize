import { describe, expect, it } from 'vitest';
import type { BuilderToken } from './types';
import { compileBuilderTokens } from './compile';

const conditional: BuilderToken[] = [
  { kind: 'paren', side: 'open' },
  { kind: 'atom', name: 'P' },
  { kind: 'connective', connective: 'imp' },
  { kind: 'atom', name: 'Q' },
  { kind: 'paren', side: 'close' },
];

describe('compileBuilderTokens', () => {
  it('compiles a parenthesized conditional', () => {
    const result = compileBuilderTokens(conditional);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.formula.kind).toBe('imp');
    }
  });

  it('rejects unbalanced parentheses', () => {
    const result = compileBuilderTokens([
      { kind: 'paren', side: 'open' },
      { kind: 'atom', name: 'P' },
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('unbalanced-parens');
    }
  });

  it('rejects an empty builder', () => {
    expect(compileBuilderTokens([]).ok).toBe(false);
  });
});
