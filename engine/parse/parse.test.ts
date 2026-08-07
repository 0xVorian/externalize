import { describe, expect, it } from 'vitest';
import { parse, ParseError, mainConnective } from './parse';
import { format } from '../render/display';
import { toVerticalTree, findNodeById } from '../render/tree';
import { evaluateWithNodes } from '../eval/evaluate';

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

  it('parses chained implications left-associatively', () => {
    const formula = parse('P → Q → R');
    expect(mainConnective(formula)).toBe('imp');
    expect(format(formula)).toBe('P → Q → R');
    if (formula.kind === 'imp' && formula.left.kind === 'imp') {
      expect(format(formula.left)).toBe('P → Q');
    }
  });

  it('parses double negation', () => {
    expect(format(parse('¬¬P'))).toBe('¬¬P');
  });

  it('throws on invalid input', () => {
    expect(() => parse('P ∧')).toThrow(ParseError);
    expect(() => parse('')).toThrow(ParseError);
    expect(() => parse('(P')).toThrow(ParseError);
  });

  it('identifies the main connective', () => {
    expect(mainConnective(parse('P → Q'))).toBe('imp');
    expect(mainConnective(parse('(P → Q) ∧ R'))).toBe('and');
  });
});

describe('toVerticalTree', () => {
  it('uses stable path-based ids', () => {
    const tree = toVerticalTree(parse('P ∧ Q'));
    expect(tree.id).toBe('root');
    expect(tree.children[0].id).toBe('root.L');
    expect(tree.children[1].id).toBe('root.R');
  });

  it('builds ids for nested formulas', () => {
    const tree = toVerticalTree(parse('(P → Q) ↔ ¬R'));
    expect(tree.id).toBe('root');
    expect(tree.kind).toBe('iff');
    expect(findNodeById(tree, 'root.L')?.kind).toBe('imp');
    expect(findNodeById(tree, 'root.R.O')?.kind).toBe('pred');
    expect(findNodeById(tree, 'root.R.O')?.label).toBe('R');
  });

  it('produces identical ids across repeated builds', () => {
    const formula = parse('P ∨ Q');
    expect(toVerticalTree(formula)).toEqual(toVerticalTree(formula));
  });
});

describe('golden tree evaluation', () => {
  it('assigns exact per-node values for (P → Q) ↔ ¬R', () => {
    const formula = parse('(P → Q) ↔ ¬R');
    const assignment = { P: true, Q: false, R: true };
    const { root, values } = evaluateWithNodes(formula, assignment);

    expect(root).toBe(true);
    expect(values.get('root')).toBe(true);
    expect(values.get('root.L')).toBe(false);
    expect(values.get('root.L.L')).toBe(true);
    expect(values.get('root.L.R')).toBe(false);
    expect(values.get('root.R')).toBe(false);
    expect(values.get('root.R.O')).toBe(true);
  });
});
