import type { ScopeFeedbackTag } from './scope';
import type { TranslationFeedbackTag } from './translation';
export type FeedbackTag = ScopeFeedbackTag | TranslationFeedbackTag;
export type FeedbackTemplate = Partial<Record<FeedbackTag, string>>;
export type FeedbackResult = { correct: boolean; tag: FeedbackTag; message: string };
export { resolveFeedback, checkMainConnectiveSelection, expectedMainConnectiveNodeId } from './scope';
export type { TranslationFeedbackTag, TranslationFeedbackTemplate, TranslationFeedbackResult } from './translation';
export { classifyTranslation, resolveTranslationFeedback } from './translation';
