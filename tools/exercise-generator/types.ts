import type { Assignment } from '../../engine';

export type ExercisePattern = 'scope' | 'eval' | 'fill-truth-table';

export type ScopeTemplate = {
  formula: string;
  id?: string;
};

export type EvalTemplate = {
  formula: string;
  initialAssignment: Assignment;
  id?: string;
};

export type FillTruthTableTemplate = {
  formula: string;
  hiddenRowIndex: number;
  id?: string;
};

export type ExerciseTemplateFile = {
  scope: ScopeTemplate[];
  eval: EvalTemplate[];
  fillTruthTable: FillTruthTableTemplate[];
};

export type GeneratedExercise = {
  id: string;
  type: 'identify-main-connective' | 'evaluate-formula' | 'fill-truth-table-cell';
  formula: string;
  initialAssignment?: Assignment;
  hiddenRowIndex?: number;
};

export type GenerateOptions = {
  patterns?: ExercisePattern[];
  startIds?: Partial<Record<'scope' | 'eval' | 'tt', number>>;
};

export type GenerateResult = {
  exercises: GeneratedExercise[];
  presentation: Record<string, string>;
  warnings: string[];
};

export type ExerciseComparable = {
  id?: string;
  type: string;
  formula?: string;
  initialAssignment?: Assignment;
  hiddenRowIndex?: number;
};
