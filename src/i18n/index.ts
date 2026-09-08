export type { Locale } from './locale';
export { loadLocale, saveLocale, otherLocale } from './locale';
export {
  progressUi,
  onboardingUi,
  formatResumeTime,
  resumeContinueLabel,
  getExerciseCopy,
  formatEvaluationAssessmentPrompt,
  getAssessmentPrompt,
  getExerciseHint,
  getCellFeedback,
  getCounterFeedback,
  getTautologyFeedback,
  getFeedbackDefaults,
  formatTruthValue,
  formatAssignmentLine,
  translationUi,
  proofUi,
  visibilityUi,
} from './messages';
export { ui, getFeedbackTemplates, formatEvaluationFeedback } from './feedback';
export type { ExerciseCopy, UiCopy, ProgressUiCopy, TranslationUiCopy, OnboardingUiCopy, ProofUiCopy, VisibilityUiCopy } from './messages';
export {
  learnUi,
  getLessonCopy,
  getReference,
  watchCaseCount,
} from './lessons';
export { sessionUi } from './session';
export type { SessionUiCopy } from './session';
export type {
  LessonCopy,
  LearnUiCopy,
  ReferenceEntry,
  WatchStepCopy,
  GuidedStepCopy,
  GuidedHintStep,
} from './lessons';
