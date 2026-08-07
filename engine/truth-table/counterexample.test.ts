import { describe, expect, it } from 'vitest';
import { collectAtoms } from '../ast/types';
import { parse } from '../parse/parse';
import { hasAssignmentForValue, validateCounterexample } from './counterexample';

describe('validateCounterexample', () => {
  it('accepts when evaluation matches target', () => {
    expect(validateCounterexample(parse('P ∧ Q'), { P: true, Q: false }, false).correct).toBe(true);
  });

  it('rejects when evaluation differs from target', () => {
    expect(validateCounterexample(parse('P → Q'), { P: false, Q: false }, false).correct).toBe(false);
  });

  it('detects when a target value is reachable', () => {
    const formula = parse('P ∨ Q');
    expect(hasAssignmentForValue(formula, [...collectAtoms(formula)].sort(), false)).toBe(true);
  });
});
