export type { Locale } from './locale';
export { loadLocale, saveLocale, otherLocale } from './locale';
export {
  ui,
  progressUi,
  formatResumeTime,
  resumeContinueLabel,
  getExerciseCopy,
  getFeedbackTemplates,
  getFeedbackDefaults,
  formatTruthValue,
  formatAssignmentLine,
} from './messages';
export type { ExerciseCopy, UiCopy, ProgressUiCopy } from './messages';
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
