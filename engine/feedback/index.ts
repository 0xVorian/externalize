import type { ScopeFeedbackTag } from './scope';
import type { TranslationFeedbackTag } from './translation';
import type { CounterexampleFeedbackTag } from './counterexample';
import type { ProofFeedbackTag } from './proof';

export type FeedbackTag = ScopeFeedbackTag | TranslationFeedbackTag | CounterexampleFeedbackTag | ProofFeedbackTag;
export type FeedbackTemplate = Partial<Record<FeedbackTag, string>>;
export type FeedbackResult = { correct: boolean; tag: FeedbackTag; message: string };
export { resolveFeedback, checkMainConnectiveSelection, expectedMainConnectiveNodeId } from './scope';
export type { TranslationFeedbackTag, TranslationFeedbackTemplate, TranslationFeedbackResult } from './translation';
export { classifyTranslation, resolveTranslationFeedback } from './translation';
export type { CounterexampleFeedbackTag, CounterexampleFeedbackTemplate } from './counterexample';
export { resolveCounterexampleFeedback } from './counterexample';
export type { ProofFeedbackTag } from './proof';
export { resolveProofFeedback } from './proof';
export { buildEvaluationFeedback } from './evaluation';
export type { EvaluationFeedbackResult } from './evaluation';
