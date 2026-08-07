import { describe, expect, it } from 'vitest';
import { parse, ParseError, mainConnective } from './parse';
import { pred, varTerm, constTerm, forall, exists, not, and, imp, isAtom, collectFreeVariables, collectPredicateSymbols } from '../ast/types';

describe('predicate parse', () => {
  it('parses 0-place predicates (propositional letters)', () => {
    const formula = parse('P');
    expect(formula).toEqual(pred('P', []));
    expect(isAtom(formula)).toBe(true);
  });
  it('parses 1-place and 2-place predicate applications', () => {
    expect(parse('F(x)')).toEqual(pred('F', [varTerm('x')]));
    expect(parse('R(x, y)')).toEqual(pred('R', [varTerm('x'), varTerm('y')]));
    expect(parse('F(a)')).toEqual(pred('F', [constTerm('a')]));
  });
  it('parses universal quantifier', () => {
    expect(parse('∀x F(x)')).toEqual(forall('x', pred('F', [varTerm('x')])));
  });
  it('parses existential quantifier', () => {
    expect(parse('∃x F(x)')).toEqual(exists('x', pred('F', [varTerm('x')])));
  });
  it('parses quantified formula with connectives', () => {
    expect(parse('∃x (F(x) ∧ G(x))')).toEqual(exists('x', and(pred('F', [varTerm('x')]), pred('G', [varTerm('x')]))));
  });
  it('parses nested quantifiers', () => {
    expect(parse('∀x (F(x) → ∃y R(x, y))')).toEqual(forall('x', imp(pred('F', [varTerm('x')]), exists('y', pred('R', [varTerm('x'), varTerm('y')])))));
  });
  it('parses negated quantifier without moving negation', () => {
    expect(parse('¬∃x F(x)')).toEqual(not(exists('x', pred('F', [varTerm('x')]))));
  });
  it('parses quantifier body under negation', () => {
    expect(parse('∀x ¬F(x)')).toEqual(forall('x', not(pred('F', [varTerm('x')]))));
  });
  it('binds quantifiers tighter than implication', () => {
    expect(parse('∀x F(x) → G(a)')).toEqual(imp(forall('x', pred('F', [varTerm('x')])), pred('G', [constTerm('a')])));
  });
  it('binds negation tighter than quantifiers', () => {
    const formula = parse('¬∀x F(x)');
    expect(formula.kind).toBe('not');
    if (formula.kind === 'not') expect(formula.operand.kind).toBe('forall');
  });
  it('identifies main connective for quantified formulas', () => {
    expect(mainConnective(parse('∀x F(x)'))).toBe('forall');
    expect(mainConnective(parse('∃x F(x)'))).toBe('exists');
    expect(mainConnective(parse('F(x)'))).toBe('pred');
  });
  it('collects free variables and predicate symbols', () => {
    const formula = parse('∀x (F(x) → R(x, y))');
    expect([...collectFreeVariables(formula)].sort()).toEqual(['y']);
    const symbols = collectPredicateSymbols(formula);
    expect(symbols.get('F')).toEqual(new Set([1]));
    expect(symbols.get('R')).toEqual(new Set([2]));
  });
  it('throws on invalid predicate input', () => {
    expect(() => parse('F(')).toThrow(ParseError);
    expect(() => parse('∀')).toThrow(ParseError);
    expect(() => parse('F(x')).toThrow(ParseError);
  });
});
