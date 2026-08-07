import { describe, expect, it } from 'vitest';
import { parse } from '../parse/parse';
import { toVerticalTree } from '../render/tree';
import { checkMainConnectiveSelection } from './scope';

describe('checkMainConnectiveSelection', () => {
  it('accepts the root connective', () => {
    const formula = parse('(P → Q) ∧ R');
    const tree = toVerticalTree(formula);
    const result = checkMainConnectiveSelection(formula, tree, 'root');
    expect(result.correct).toBe(true);
    expect(result.tag).toBe('correct');
  });

  it('rejects a subformula connective', () => {
    const formula = parse('(P → Q) ∧ R');
    const tree = toVerticalTree(formula);
    const result = checkMainConnectiveSelection(formula, tree, 'root.L');
    expect(result.correct).toBe(false);
    expect(result.tag).toBe('selected-subconnective');
    expect(result.message).toContain('→');
  });

  it('rejects an atom selection', () => {
    const formula = parse('P ∧ Q');
    const tree = toVerticalTree(formula);
    const result = checkMainConnectiveSelection(formula, tree, 'root.L');
    expect(result.correct).toBe(false);
    expect(result.tag).toBe('selected-atom');
    expect(result.message).toContain('P');
  });

  it('uses custom templates when provided', () => {
    const formula = parse('P ∧ Q');
    const tree = toVerticalTree(formula);
    const result = checkMainConnectiveSelection(formula, tree, 'root.L', {
      'selected-atom': 'Not a connective: {label}',
    });
    expect(result.message).toBe('Not a connective: P');
  });
});
