import type { Assignment, FeedbackTemplate } from '../../engine';

export type ExerciseType = 'identify-main-connective' | 'evaluate-formula';

export type Exercise = {
  id: string;
  type: ExerciseType;
  formula: string;
  prompt: string;
  initialAssignment?: Assignment;
  feedback?: FeedbackTemplate;
};

export const EXERCISES: Exercise[] = [
  {
    id: 'scope-001',
    type: 'identify-main-connective',
    formula: '(P → Q) ∧ R',
    prompt: 'Tap the main connective of the whole formula.',
    feedback: {
      'selected-subconnective':
        '→ is the main connective of (P → Q), but not of the whole formula. The outer operator binds last.',
    },
  },
  {
    id: 'scope-002',
    type: 'identify-main-connective',
    formula: '(P → Q) ↔ ¬R',
    prompt: 'Tap the main connective of the whole formula.',
  },
  {
    id: 'scope-003',
    type: 'identify-main-connective',
    formula: '¬(P ∧ Q)',
    prompt: 'Tap the main connective of the whole formula.',
    feedback: {
      'selected-subconnective':
        '∧ is inside the scope of ¬. The main connective governs the entire formula.',
    },
  },
  {
    id: 'eval-001',
    type: 'evaluate-formula',
    formula: 'P ∧ Q',
    prompt: 'Toggle the truth values below. Every node shows its computed value.',
    initialAssignment: { P: true, Q: false },
  },
  {
    id: 'eval-002',
    type: 'evaluate-formula',
    formula: '(P → Q) ↔ ¬R',
    prompt: 'Toggle atoms and watch intermediate values update.',
    initialAssignment: { P: true, Q: false, R: true },
  },
];

export function getExercise(id: string): Exercise | undefined {
  return EXERCISES.find((exercise) => exercise.id === id);
}
