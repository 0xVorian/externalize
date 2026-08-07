import { describe, expect, it } from 'vitest';
import { parseProofLines, validateProofFillStep } from './validate';

const cfg = {
  hiddenLineIndex: 2,
  lines: [
    { formula: 'P → Q', justification: 'premise' as const },
    { formula: 'P', justification: 'premise' as const },
    { hidden: true },
  ],
  expected: { rule: 'mp' as const, cites: [1, 2], formula: 'Q' },
  allowedRules: ['mp' as const],
};

describe('validateProofFillStep', () => {
  const lines = parseProofLines(cfg.lines);

  it('accepts MP', () => {
    expect(validateProofFillStep(cfg, lines, 'mp', [1, 2]).correct).toBe(true);
  });

  it('rejects incomplete', () => {
    expect(validateProofFillStep(cfg, lines, null, []).tag).toBe('incomplete');
  });

  it('rejects citing only the antecedent', () => {
    expect(validateProofFillStep(cfg, lines, 'mp', [1, 1]).tag).toBe('wrong-citation');
  });
});
