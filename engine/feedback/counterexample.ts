export type CounterexampleFeedbackTag = 'correct' | 'counterexample-miss';

export type CounterexampleFeedbackTemplate = Partial<Record<CounterexampleFeedbackTag, string>>;

const DEFAULTS: Record<CounterexampleFeedbackTag, string> = {
  correct: 'Correct.',
  'counterexample-miss': 'This assignment does not match the target truth value.',
};

export function resolveCounterexampleFeedback(
  tag: CounterexampleFeedbackTag,
  templates: CounterexampleFeedbackTemplate = {},
): string {
  return templates[tag] ?? DEFAULTS[tag];
}
