import { describe, expect, it } from 'vitest';
import { parse } from '../parse/parse';
import { evaluate, evaluateWithNodes } from './evaluate';

describe('evaluate', () => {
  it('evaluates under an assignment', () => {
    const formula = parse('(P → Q) ↔ ¬R');
    const assignment = { P: true, Q: false, R: true };
    expect(evaluate(formula, assignment)).toBe(true);
  });

  it('computes truth values at every node', () => {
    const formula = parse('(P → Q) ↔ ¬R');
    const assignment = { P: true, Q: false, R: true };
    const { root, values, tree } = evaluateWithNodes(formula, assignment);

    expect(root).toBe(true);
    expect(values.size).toBeGreaterThan(1);
    expect(tree.value).toBe(true);
    expect(tree.children.every((child) => child.value !== undefined)).toBe(true);
  });

  it('throws when an atom is unassigned', () => {
    expect(() => evaluate(parse('P'), {})).toThrow(/Missing assignment/);
  });
});
