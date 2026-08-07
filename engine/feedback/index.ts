import type { ScopeFeedbackTag } from './scope';
import type { TranslationFeedbackTag } from './translation';
import type { CounterexampleFeedbackTag } from './counterexample';

export type FeedbackTag = ScopeFeedbackTag | TranslationFeedbackTag | CounterexampleFeedbackTag;
export type FeedbackTemplate = Partial<Record<FeedbackTag, string>>;
export type FeedbackResult = { correct: boolean; tag: FeedbackTag; message: string };
export { resolveFeedback, checkMainConnectiveSelection, expectedMainConnectiveNodeId } from './scope';
export type { TranslationFeedbackTag, TranslationFeedbackTemplate, TranslationFeedbackResult } from './translation';
export { classifyTranslation, resolveTranslationFeedback } from './translation';
export type { CounterexampleFeedbackTag, CounterexampleFeedbackTemplate } from './counterexample';
export { resolveCounterexampleFeedback } from './counterexample';
