import { describe, expect, it } from 'vitest';
import { parse } from '../parse/parse';
import { and } from '../ast/types';
import { equivalent, distinct, semanticallyEquivalent } from './equivalent';

describe('equivalent', () => {
  it('detects structural equality', () => {
    const a = parse('P → Q');
    const b = parse('P → Q');
    expect(equivalent(a, b)).toBe(true);
  });

  it('detects distinct scope for negation', () => {
    const a = parse('¬(P ∧ Q)');
    const b = parse('¬P ∧ Q');
    expect(distinct(a, b)).toBe(true);
  });

  it('treats commutative ∧ as equivalent when flagged', () => {
    const a = parse('P ∧ Q');
    const b = parse('Q ∧ P');
    expect(equivalent(a, b)).toBe(false);
    expect(equivalent(a, b, { allowCommutativeAnd: true })).toBe(true);
  });

  it('treats commutative ∨ as equivalent when flagged', () => {
    const a = parse('P ∨ Q');
    const b = parse('Q ∨ P');
    expect(equivalent(a, b, { allowCommutativeOr: true })).toBe(true);
  });

  it('supports semantic equivalence when explicitly allowed', () => {
    const a = parse('P → Q');
    const b = parse('¬P ∨ Q');
    expect(equivalent(a, b)).toBe(false);
    expect(semanticallyEquivalent(a, b)).toBe(true);
  });

  it('does not conflate different AST shapes without semantic flag', () => {
    const a = and(parse('P'), parse('Q'));
    const b = parse('P ∧ Q');
    expect(equivalent(a, b)).toBe(true);
  });
});
