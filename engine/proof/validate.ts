import { parse } from '../parse/parse';
import { format } from '../render/display';
import { equivalent } from '../equiv/equivalent';
import { applyRule, INFERENCE_RULES } from './rules';
import type { ProofFillConfig, ProofLine, ProofLineSpec, RuleId } from './types';

export type ProofFeedbackTag =
  | 'correct'
  | 'incomplete'
  | 'wrong-rule-for-premises'
  | 'wrong-citation'
  | 'conclusion-does-not-follow';

export type ProofFillResult = {
  correct: boolean;
  tag: ProofFeedbackTag;
  message: string;
  derivedFormula: string | null;
};

const DEF: Record<ProofFeedbackTag, string> = {
  correct: 'Correct — modus ponens derives the missing line.',
  incomplete: 'Choose a rule and cite the required lines.',
  'wrong-rule-for-premises':
    'Modus ponens needs a conditional and its antecedent on the cited lines.',
  'wrong-citation': 'Those line numbers do not match what this rule requires.',
  'conclusion-does-not-follow': 'That step does not yield the expected formula.',
};

const same = (a: number[], b: number[]) =>
  a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

export function parseProofLines(specs: ProofLineSpec[]): ProofLine[] {
  return specs.map((spec, i) => ({
    lineNumber: i + 1,
    formula: spec.hidden || !spec.formula ? null : parse(spec.formula),
    justification: spec.hidden ? null : (spec.justification ?? 'premise'),
    cites: spec.cites ?? [],
    subproofLevel: spec.subproofLevel ?? 0,
    hidden: spec.hidden === true,
  }));
}

export function validateProofFillStep(
  config: ProofFillConfig,
  lines: ProofLine[],
  selectedRule: RuleId | null,
  selectedCites: number[],
  templates: Partial<Record<ProofFeedbackTag, string>> = {},
): ProofFillResult {
  const m = (tag: ProofFeedbackTag) => templates[tag] ?? DEF[tag];

  if (!selectedRule) {
    return { correct: false, tag: 'incomplete', message: m('incomplete'), derivedFormula: null };
  }

  const rule = INFERENCE_RULES[selectedRule];
  if (!rule || !config.allowedRules.includes(selectedRule)) {
    return {
      correct: false,
      tag: 'wrong-rule-for-premises',
      message: m('wrong-rule-for-premises'),
      derivedFormula: null,
    };
  }

  if (selectedCites.length < rule.arity) {
    return { correct: false, tag: 'incomplete', message: m('incomplete'), derivedFormula: null };
  }

  if (!lines[config.hiddenLineIndex]?.hidden) {
    throw new Error('missing hidden line');
  }

  if (new Set(selectedCites).size !== selectedCites.length) {
    return { correct: false, tag: 'wrong-citation', message: m('wrong-citation'), derivedFormula: null };
  }

  for (const cite of selectedCites) {
    const cited = lines[cite - 1];
    if (
      !Number.isInteger(cite) ||
      cite < 1 ||
      cite > lines.length ||
      !cited ||
      cited.hidden ||
      cite - 1 >= config.hiddenLineIndex ||
      !cited.formula
    ) {
      return { correct: false, tag: 'wrong-citation', message: m('wrong-citation'), derivedFormula: null };
    }
  }

  const derived = applyRule(
    selectedRule,
    selectedCites.map((c) => lines[c - 1]!.formula!),
  );

  if (!derived) {
    return {
      correct: false,
      tag: 'wrong-rule-for-premises',
      message: m('wrong-rule-for-premises'),
      derivedFormula: null,
    };
  }

  if (!equivalent(derived, parse(config.expected.formula))) {
    return {
      correct: false,
      tag: 'conclusion-does-not-follow',
      message: m('conclusion-does-not-follow'),
      derivedFormula: format(derived),
    };
  }

  if (selectedRule !== config.expected.rule || !same(selectedCites, config.expected.cites)) {
    return {
      correct: false,
      tag: 'wrong-citation',
      message: m('wrong-citation'),
      derivedFormula: format(derived),
    };
  }

  return {
    correct: true,
    tag: 'correct',
    message: m('correct'),
    derivedFormula: format(derived),
  };
}
