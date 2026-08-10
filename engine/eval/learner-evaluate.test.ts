import { describe, expect, it } from 'vitest';
import { evaluateWithLearnerOverlay, evaluateWithNodes, parse } from '../../engine';

describe('evaluateWithLearnerOverlay', () => {
  it('hides scaffold node values until learner commits them', () => {
    const formula = parse('P ∧ (Q ∨ R)');
    const assignment = { P: true, Q: false, R: true };
    const { root, tree } = evaluateWithLearnerOverlay(formula, assignment, {}, ['root.R']);
    const orNode = tree.children[1];
    expect(root).toBeUndefined();
    expect(orNode?.value).toBeUndefined();
    expect(orNode?.children[0]?.value).toBe(false);
    expect(orNode?.children[1]?.value).toBe(true);
  });

  it('recomputes parents after learner commits a scaffold value', () => {
    const formula = parse('P ∧ (Q ∨ R)');
    const assignment = { P: true, Q: false, R: true };
    const full = evaluateWithNodes(formula, assignment);
    const { root, tree } = evaluateWithLearnerOverlay(formula, assignment, { 'root.R': true }, ['root.R']);
    expect(tree.children[1]?.value).toBe(true);
    expect(tree.value).toBe(full.tree.value);
    expect(root).toBe(full.root);
  });
});
