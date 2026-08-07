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
    id: 'scope-004',
    type: 'identify-main-connective',
    formula: 'P ∨ (Q ∧ R)',
  },
  {
    id: 'scope-005',
    type: 'identify-main-connective',
    formula: '(P ∨ Q) → R',
  },
  {
    id: 'scope-006',
    type: 'identify-main-connective',
    formula: '¬(P → Q)',
  },
  {
    id: 'scope-007',
    type: 'identify-main-connective',
    formula: '(P ∧ Q) ∨ R',
  },
  {
    id: 'scope-008',
    type: 'identify-main-connective',
    formula: 'P → (Q ∨ R)',
  },
  {
    id: 'scope-009',
    type: 'identify-main-connective',
    formula: '¬P ∧ Q',
  },
  {
    id: 'scope-010',
    type: 'identify-main-connective',
    formula: '(P → Q) → R',
  },
  {
    id: 'scope-011',
    type: 'identify-main-connective',
    formula: 'P ↔ (Q → R)',
  },
  {
    id: 'scope-012',
    type: 'identify-main-connective',
    formula: '(P ∧ Q) ∧ R',
  },
  {
    id: 'eval-001',
    type: 'evaluate-formula',
    formula: 'P ∧ Q',
    initialAssignment: { P: true, Q: false },
  },
  {
    id: 'eval-010',
    type: 'evaluate-formula',
    formula: '¬P',
    initialAssignment: { P: false },
  },
  {
    id: 'eval-002',
    type: 'evaluate-formula',
    formula: '(P → Q) ↔ ¬R',
    initialAssignment: { P: true, Q: false, R: true },
  },
  {
    id: 'eval-003',
    type: 'evaluate-formula',
    formula: 'P ∨ Q',
    initialAssignment: { P: false, Q: true },
  },
  {
    id: 'eval-004',
    type: 'evaluate-formula',
    formula: 'P → Q',
    initialAssignment: { P: true, Q: false },
  },
  {
    id: 'eval-005',
    type: 'evaluate-formula',
    formula: 'P ↔ Q',
    initialAssignment: { P: true, Q: false },
  },
  {
    id: 'eval-006',
    type: 'evaluate-formula',
    formula: '(P ∨ Q) → R',
    initialAssignment: { P: false, Q: false, R: true },
  },
  {
    id: 'eval-007',
    type: 'evaluate-formula',
    formula: 'P ∧ (Q ∨ R)',
    initialAssignment: { P: true, Q: false, R: true },
  },
  {
    id: 'eval-008',
    type: 'evaluate-formula',
    formula: '¬(P ∧ Q)',
    initialAssignment: { P: true, Q: true },
  },
  {
    id: 'eval-009',
    type: 'evaluate-formula',
    formula: '(P → Q) ∧ R',
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
