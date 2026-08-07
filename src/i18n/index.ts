export type { Locale } from './locale';
export { loadLocale, saveLocale, otherLocale } from './locale';
export {
  ui,
  getExerciseCopy,
  getFeedbackTemplates,
  getFeedbackDefaults,
} from './messages';
export type { ExerciseCopy, UiCopy } from './messages';
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
