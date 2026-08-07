import type { Assignment, FeedbackTemplate } from '../../engine';

export type ExerciseType = 'identify-main-connective' | 'evaluate-formula';

export type ExerciseDefinition = {
  id: string;
  type: ExerciseType;
  formula: string;
  initialAssignment?: Assignment;
};

export const EXERCISE_DEFINITIONS: ExerciseDefinition[] = [
  {
    id: 'scope-001',
    type: 'identify-main-connective',
    formula: '(P → Q) ∧ R',
  },
  {
    id: 'scope-002',
    type: 'identify-main-connective',
    formula: '(P → Q) ↔ ¬R',
  },
  {
    id: 'scope-003',
    type: 'identify-main-connective',
    formula: '¬(P ∧ Q)',
  },
  {
    id: 'eval-001',
    type: 'evaluate-formula',
    formula: 'P ∧ Q',
    initialAssignment: { P: true, Q: false },
  },
  {
    id: 'eval-002',
    type: 'evaluate-formula',
    formula: '(P → Q) ↔ ¬R',
    initialAssignment: { P: true, Q: false, R: true },
  },
];

export function getExerciseDefinition(id: string): ExerciseDefinition | undefined {
  return EXERCISE_DEFINITIONS.find((exercise) => exercise.id === id);
}

/** @deprecated Use ExerciseDefinition; kept for internal typing during transition */
export type Exercise = ExerciseDefinition & {
  prompt: string;
  feedback?: FeedbackTemplate;
};
