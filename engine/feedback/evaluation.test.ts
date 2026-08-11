import { describe, expect, it } from 'vitest';
import { evaluateWithNodes, parse } from '../index';
import { buildEvaluationFeedback } from './evaluation';

describe('buildEvaluationFeedback', () => {
  it('marks matching root prediction as correct', () => {
    const { tree } = evaluateWithNodes(parse('P ∧ Q'), { P: true, Q: false });
    const result = buildEvaluationFeedback(tree, false);
    expect(result.correct).toBe(true);
    expect(result.tag).toBe('correct');
  });

  it('explains wrong biconditional predictions with child values', () => {
    const { tree } = evaluateWithNodes(parse('(P → Q) ↔ ¬R'), { P: true, Q: false, R: true });
    const result = buildEvaluationFeedback(tree, false);
    expect(result.correct).toBe(false);
    expect(result.connectiveKind).toBe('iff');
    expect(result.childParts.length).toBe(2);
  });

  it('explains wrong conjunction predictions', () => {
    const { tree } = evaluateWithNodes(parse('P ∧ Q'), { P: true, Q: false });
    const result = buildEvaluationFeedback(tree, true);
    expect(result.correct).toBe(false);
    expect(result.connectiveKind).toBe('and');
  });
});
