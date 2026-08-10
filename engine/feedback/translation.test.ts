import { describe, expect, it } from 'vitest';
import { parse } from '../parse/parse';
import { classifyTranslation } from './translation';

const EXERCISES = {
  'translate-001': {
    expected: '(P → Q)',
    accept: ['(P → Q)'],
    reject: [{ learner: '(Q → P)', tag: 'reversed-conditional' as const }],
  },
  'translate-002': {
    expected: '¬(P ∧ Q)',
    accept: ['¬(P ∧ Q)'],
    reject: [{ learner: '¬P ∧ Q', tag: 'negation-scope' as const }],
  },
  'translate-003': {
    expected: '(P → Q) ∧ R',
    options: { allowCommutativeAnd: true },
    accept: ['(P → Q) ∧ R', 'R ∧ (P → Q)'],
    reject: [{ learner: 'P → Q ∧ R', tag: 'missing-parens' as const }],
  },
  'translate-004': {
    expected: '(P → Q)',
    accept: ['(P → Q)'],
    reject: [{ learner: '(Q → P)', tag: 'reversed-conditional' as const }],
  },
  'translate-005': {
    expected: '(P ↔ Q)',
    accept: ['(P ↔ Q)', '(Q ↔ P)'],
    reject: [],
  },
  'translate-006': {
    expected: '¬(P ∨ Q)',
    accept: ['¬(P ∨ Q)'],
    reject: [
      { learner: '¬P ∨ Q', tag: 'negation-scope' as const },
      { learner: 'P ∨ Q', tag: 'negation-scope' as const },
    ],
  },
} as const;

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

  it('accepts swapped biconditional operands', () => {
    const result = classifyTranslation(parse('(P ↔ Q)'), parse('(Q ↔ P)'));
    expect(result.correct).toBe(true);
    expect(result.tag).toBe('correct');
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

  it('accepts commutative ∧ when flagged', () => {
    const expected = parse('P ∧ Q');
    const learner = parse('Q ∧ P');
    expect(classifyTranslation(expected, learner).correct).toBe(false);
    const accepted = classifyTranslation(expected, learner, { allowCommutativeAnd: true });
    expect(accepted.correct).toBe(true);
    expect(accepted.tag).toBe('correct');
  });

  it('accepts semantic equivalence only when allowSemantic is set', () => {
    const expected = parse('P → Q');
    const learner = parse('¬P ∨ Q');
    expect(classifyTranslation(expected, learner).correct).toBe(false);
    const accepted = classifyTranslation(expected, learner, { allowSemantic: true });
    expect(accepted.correct).toBe(true);
    expect(accepted.tag).toBe('equivalent-but-noncanonical');
  });

  it('rejects reversed conditional even when allowSemantic is set', () => {
    const result = classifyTranslation(parse('(P → Q)'), parse('(Q → P)'), { allowSemantic: true });
    expect(result.correct).toBe(false);
    expect(result.tag).toBe('reversed-conditional');
  });

  it('rejects negation-scope mistakes even when allowSemantic is set', () => {
    const result = classifyTranslation(parse('¬(P ∧ Q)'), parse('¬P ∧ Q'), { allowSemantic: true });
    expect(result.correct).toBe(false);
    expect(result.tag).toBe('negation-scope');
  });

  it('detects wrong atom names before generic connective feedback', () => {
    const result = classifyTranslation(parse('(P → Q)'), parse('(P → R)'));
    expect(result.correct).toBe(false);
    expect(result.tag).toBe('wrong-atom');
  });

  describe.each(Object.entries(EXERCISES))('%s', (_id, spec) => {
    const expected = parse(spec.expected);
    const options = 'options' in spec ? spec.options : {};

    it.each(spec.accept)('accepts %s', (learnerText) => {
      const result = classifyTranslation(expected, parse(learnerText), options);
      expect(result.correct).toBe(true);
      expect(result.tag).toBe('correct');
    });

    for (const { learner, tag } of spec.reject) {
      it(`rejects ${learner} as ${tag}`, () => {
        const result = classifyTranslation(expected, parse(learner), options);
        expect(result.correct).toBe(false);
        expect(result.tag).toBe(tag);
      });
    }
  });
});
