export { generateExercises, loadExerciseTemplates, diffAgainstExisting } from './generate';
export { formatExerciseDefinition, formatJson, formatTypeScript, formatUnlockOrderHint } from './format';
export { presentationForExercise, usesLiveTruthRow } from './presentation';
export type {
  EvalTemplate,
  ExerciseComparable,
  ExercisePattern,
  ExerciseTemplateFile,
  FillTruthTableTemplate,
  GenerateOptions,
  GenerateResult,
  GeneratedExercise,
  ScopeTemplate,
} from './types';
