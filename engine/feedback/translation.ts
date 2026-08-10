import type { Formula } from '../ast/types';
import { collectAtoms } from '../ast/types';
import { equivalent, type EquivalenceOptions } from '../equiv/equivalent';

export type TranslationFeedbackTag =
  | 'correct'
  | 'reversed-conditional'
  | 'negation-scope'
  | 'missing-parens'
  | 'extra-parens'
  | 'wrong-main-connective'
  | 'wrong-operator'
  | 'wrong-atom'
  | 'equivalent-but-noncanonical'
  | 'incomplete'
  | 'unbalanced-parens';

export type TranslationFeedbackTemplate = Partial<Record<TranslationFeedbackTag, string>>;

export type TranslationFeedbackResult = {
  correct: boolean;
  tag: TranslationFeedbackTag;
  message: string;
};

const DEFAULT_TEMPLATES: Record<TranslationFeedbackTag, string> = {
  correct: 'Correct.',
  'reversed-conditional':
    'The conditional runs the wrong way: the antecedent and consequent are swapped.',
  'negation-scope':
    'Negation is attached to the wrong subformula. Check what the ¬ applies to.',
  'missing-parens':
    'Grouping is missing — the main connective does not match the English structure.',
  'extra-parens': 'Extra parentheses do not change meaning here, but the shape is not canonical.',
  'wrong-main-connective': 'The outermost connective does not match the sentence structure.',
  'wrong-operator': 'One connective in your formula should be different.',
  'wrong-atom': 'A sentence letter does not match the prompt.',
  'equivalent-but-noncanonical':
    'Your formula is logically equivalent, but use the connective structure from the prompt.',
  incomplete: 'The formula is incomplete — keep building with the palette.',
  'unbalanced-parens': 'Parentheses are unbalanced. Add or remove ( ) so pairs match.',
};

export function resolveTranslationFeedback(
  tag: TranslationFeedbackTag,
  templates: TranslationFeedbackTemplate = {},
  vars: Record<string, string> = {},
): string {
  const template = templates[tag] ?? DEFAULT_TEMPLATES[tag];
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`);
}

function isReversedBinary(expected: Formula, learner: Formula, kind: 'imp' | 'iff'): boolean {
  if (expected.kind !== kind || learner.kind !== kind) {
    return false;
  }
  return (
    equivalent(expected.left, learner.right, {}) &&
    equivalent(expected.right, learner.left, {})
  );
}

function detectNegationScope(expected: Formula, learner: Formula): boolean {
  if (expected.kind !== 'not' || (expected.operand.kind === 'pred' && expected.operand.args.length === 0)) {
    return false;
  }
  if (learner.kind === 'and' || learner.kind === 'or') {
    if (learner.left.kind === 'not' || learner.right.kind === 'not') {
      return !equivalent(expected, learner, {});
    }
    return false;
  }
  if (learner.kind === 'not') {
    return !equivalent(expected, learner, {});
  }
  return false;
}

function detectMissingParens(expected: Formula, learner: Formula): boolean {
  if (expected.kind === 'and' && learner.kind === 'imp' && expected.left.kind === 'imp') {
    return true;
  }
  if (expected.kind === 'and' && learner.kind === 'or' && expected.left.kind === 'imp') {
    return true;
  }
  return false;
}


function detectWrongAtom(expected: Formula, learner: Formula): boolean {
  const expectedAtoms = collectAtoms(expected);
  const learnerAtoms = collectAtoms(learner);
  if (expectedAtoms.size !== learnerAtoms.size) {
    return true;
  }
  for (const atom of expectedAtoms) {
    if (!learnerAtoms.has(atom)) {
      return true;
    }
  }
  return false;
}

export function classifyTranslation(
  expected: Formula,
  learner: Formula,
  options: EquivalenceOptions = {},
): TranslationFeedbackResult {
  const structuralOptions: EquivalenceOptions = {
    allowCommutativeAnd: options.allowCommutativeAnd,
    allowCommutativeOr: options.allowCommutativeOr,
  };

  if (
    equivalent(expected, learner, structuralOptions) ||
    isReversedBinary(expected, learner, 'iff')
  ) {
    return {
      correct: true,
      tag: 'correct',
      message: resolveTranslationFeedback('correct'),
    };
  }

  if (isReversedBinary(expected, learner, 'imp')) {
    return {
      correct: false,
      tag: 'reversed-conditional',
      message: resolveTranslationFeedback('reversed-conditional'),
    };
  }

  if (detectNegationScope(expected, learner)) {
    return {
      correct: false,
      tag: 'negation-scope',
      message: resolveTranslationFeedback('negation-scope'),
    };
  }

  if (detectMissingParens(expected, learner)) {
    return {
      correct: false,
      tag: 'missing-parens',
      message: resolveTranslationFeedback('missing-parens'),
    };
  }

  if (detectWrongAtom(expected, learner)) {
    return {
      correct: false,
      tag: 'wrong-atom',
      message: resolveTranslationFeedback('wrong-atom'),
    };
  }

  if (options.allowSemantic && equivalent(expected, learner, { ...options, allowSemantic: true })) {
    return {
      correct: true,
      tag: 'equivalent-but-noncanonical',
      message: resolveTranslationFeedback('equivalent-but-noncanonical'),
    };
  }

  if (expected.kind !== learner.kind) {
    return {
      correct: false,
      tag: 'wrong-main-connective',
      message: resolveTranslationFeedback('wrong-main-connective'),
    };
  }

  return {
    correct: false,
    tag: 'wrong-operator',
    message: resolveTranslationFeedback('wrong-operator'),
  };
}
