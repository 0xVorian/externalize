import type { ProofFeedbackTag } from '../proof';

export type { ProofFeedbackTag };

export function resolveProofFeedback(tag: ProofFeedbackTag): string {
  const d: Record<ProofFeedbackTag, string> = {
    correct: 'Correct — modus ponens derives the missing line.',
    incomplete: 'Choose a rule and cite the required lines.',
    'wrong-rule-for-premises':
      'Modus ponens needs a conditional and its antecedent on the cited lines.',
    'wrong-citation': 'Those line numbers do not match what this rule requires.',
    'conclusion-does-not-follow': 'That step does not yield the expected formula.',
  };
  return d[tag];
}
