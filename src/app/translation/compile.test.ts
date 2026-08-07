import { describe, expect, it } from 'vitest';
import { pred } from '../../../engine';
import { parsePaletteInsert } from './builder-state';
import { builderPred, type BuilderToken } from './types';
import { compileBuilderTokens } from './compile';

const conditional: BuilderToken[] = [
  { kind: 'paren', side: 'open' },
  builderPred('P'),
  { kind: 'connective', connective: 'imp' },
  builderPred('Q'),
  { kind: 'paren', side: 'close' },
];

describe('compileBuilderTokens', () => {
  it('compiles a parenthesized conditional', () => {
    const result = compileBuilderTokens(conditional);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.formula.kind).toBe('imp');
      if (result.formula.kind === 'imp') {
        expect(result.formula.left).toEqual(pred('P', []));
        expect(result.formula.right).toEqual(pred('Q', []));
      }
    }
  });

  it('rejects unbalanced parentheses', () => {
    const result = compileBuilderTokens([
      { kind: 'paren', side: 'open' },
      builderPred('P'),
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('unbalanced-parens');
  });

  it('rejects an empty builder', () => {
    expect(compileBuilderTokens([]).ok).toBe(false);
  });
});

describe('parsePaletteInsert', () => {
  it('maps pred palette taps to 0-place builder tokens', () => {
    expect(parsePaletteInsert('pred', 'P')).toEqual(builderPred('P'));
  });

  it('accepts legacy atom palette taps during migration', () => {
    expect(parsePaletteInsert('atom', 'Q')).toEqual(builderPred('Q'));
  });
});
