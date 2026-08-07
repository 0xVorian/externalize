export type { Locale } from './locale';
export { loadLocale, saveLocale, otherLocale } from './locale';
export {
  ui,
  progressUi,
  formatResumeTime,
  resumeContinueLabel,
  getExerciseCopy,
  getCellFeedback,
  getFeedbackTemplates,
  getFeedbackDefaults,
  formatTruthValue,
  formatAssignmentLine,
  translationUi,
  proofUi,
} from './messages';
export type { ExerciseCopy, UiCopy, ProgressUiCopy, TranslationUiCopy, ProofUiCopy } from './messages';
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
