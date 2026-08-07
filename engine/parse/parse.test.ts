import { describe, expect, it } from 'vitest';
import { parse, ParseError, mainConnective } from './parse';
import { format } from '../render/display';
import { toVerticalTree } from '../render/tree';

describe('parse', () => {
  it('parses a mixed formula with Unicode operators', () => {
    const formula = parse('(P → Q) ↔ ¬R');
    expect(format(formula)).toBe('(P → Q) ↔ ¬R');
  });

  it('respects operator precedence without extra parentheses', () => {
    expect(format(parse('¬P ∧ Q'))).toBe('¬P ∧ Q');
    expect(format(parse('P ∨ Q → R'))).toBe('(P ∨ Q) → R');
    expect(format(parse('¬P ∧ Q ∨ R'))).toBe('(¬P ∧ Q) ∨ R');
  });

  it('parses ASCII operator alternatives', () => {
    expect(format(parse('P -> Q'))).toBe('P → Q');
    expect(format(parse('P <-> Q'))).toBe('P ↔ Q');
    expect(format(parse('P & Q | R'))).toBe('(P ∧ Q) ∨ R');
  });

  it('throws on invalid input', () => {
    expect(() => parse('P ∧')).toThrow(ParseError);
  });

  it('identifies the main connective', () => {
    expect(mainConnective(parse('P → Q'))).toBe('imp');
    expect(mainConnective(parse('(P → Q) ∧ R'))).toBe('and');
  });
});

describe('toVerticalTree', () => {
  it('builds a binary tree with stable ids', () => {
    const tree = toVerticalTree(parse('P ∧ Q'));
    expect(tree.kind).toBe('and');
    expect(tree.children).toHaveLength(2);
    expect(tree.children[0].label).toBe('P');
    expect(tree.children[1].label).toBe('Q');
  });
});
