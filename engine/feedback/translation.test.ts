import { describe, expect, it } from 'vitest';
import { parse } from '../parse/parse';
import { classifyTranslation } from './translation';

describe('classifyTranslation', () => {
  it('accepts a structurally matching conditional', () => {
    const expected = parse('(P → Q)');
    const learner = parse('(P → Q)');
    const result = classifyTranslation(expected, learner);
    expect(result.correct).toBe(true);
    expect(result.tag).toBe('correct');
  });

  it('detects reversed conditional', () => {
    const result = classifyTranslation(parse('(P → Q)'), parse('(Q → P)'));
    expect(result.correct).toBe(false);
    expect(result.tag).toBe('reversed-conditional');
  });

  it('detects negation scope errors', () => {
    const result = classifyTranslation(parse('¬(P ∧ Q)'), parse('¬P ∧ Q'));
    expect(result.correct).toBe(false);
    expect(result.tag).toBe('negation-scope');
  });

  it('detects missing parentheses via precedence', () => {
    const result = classifyTranslation(parse('(P → Q) ∧ R'), parse('P → Q ∧ R'));
    expect(result.correct).toBe(false);
    expect(result.tag).toBe('missing-parens');
  });
});
