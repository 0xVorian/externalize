export type { Locale } from './locale';
export { loadLocale, saveLocale, otherLocale } from './locale';
export {
  ui,
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
  getFeedbackTemplates,
  getFeedbackDefaults,
  formatTruthValue,
  formatAssignmentLine,
  formatEvaluationFeedback,
  translationUi,
  proofUi,
  visibilityUi,
} from './messages';
export type { ExerciseCopy, UiCopy, ProgressUiCopy, TranslationUiCopy, OnboardingUiCopy, ProofUiCopy, VisibilityUiCopy } from './messages';
export {
  learnUi,
  getLessonCopy,
  getReference,
} from './lessons';
export type {
  LessonCopy,
  LearnUiCopy,
  ReferenceEntry,
  WatchStepCopy,
  GuidedStepCopy,
} from './lessons';
