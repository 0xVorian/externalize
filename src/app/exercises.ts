import type { Assignment, FeedbackTemplate } from '../../engine';

export type ExerciseType =
  | 'identify-main-connective'
  | 'evaluate-formula'
  | 'fill-truth-table-cell'
  | 'find-counterexample'
  | 'classify-tautology'
  | 'translate-en-to-formula'
  | 'proof-fill-step';

export type ExerciseDefinition = {
  id: string;
  type: ExerciseType;
  formula?: string;
  initialAssignment?: Assignment;
  hiddenRowIndex?: number;
  targetValue?: boolean;
};

export const EXERCISE_DEFINITIONS: ExerciseDefinition[] = [
  { id: 'scope-001', type: 'identify-main-connective', formula: '(P → Q) ∧ R' },
  { id: 'scope-002', type: 'identify-main-connective', formula: '(P → Q) ↔ ¬R' },
  { id: 'scope-003', type: 'identify-main-connective', formula: '¬(P ∧ Q)' },
  { id: 'scope-004', type: 'identify-main-connective', formula: 'P ∨ (Q ∧ R)' },
  { id: 'scope-005', type: 'identify-main-connective', formula: '(P ∨ Q) → R' },
  { id: 'scope-006', type: 'identify-main-connective', formula: '¬(P → Q)' },
  { id: 'scope-007', type: 'identify-main-connective', formula: '(P ∧ Q) ∨ R' },
  { id: 'scope-008', type: 'identify-main-connective', formula: 'P → (Q ∨ R)' },
  { id: 'scope-009', type: 'identify-main-connective', formula: '¬P ∧ Q' },
  { id: 'scope-010', type: 'identify-main-connective', formula: '(P → Q) → R' },
  { id: 'scope-011', type: 'identify-main-connective', formula: 'P ↔ (Q → R)' },
  { id: 'scope-012', type: 'identify-main-connective', formula: '(P ∧ Q) ∧ R' },
  { id: 'eval-001', type: 'evaluate-formula', formula: 'P ∧ Q', initialAssignment: { P: true, Q: false } },
  { id: 'eval-002', type: 'evaluate-formula', formula: '(P → Q) ↔ ¬R', initialAssignment: { P: true, Q: false, R: true } },
  { id: 'eval-003', type: 'evaluate-formula', formula: 'P ∨ Q', initialAssignment: { P: false, Q: true } },
  { id: 'eval-004', type: 'evaluate-formula', formula: 'P → Q', initialAssignment: { P: true, Q: false } },
  { id: 'eval-005', type: 'evaluate-formula', formula: 'P ↔ Q', initialAssignment: { P: true, Q: false } },
  { id: 'eval-006', type: 'evaluate-formula', formula: '(P ∨ Q) → R', initialAssignment: { P: false, Q: false, R: true } },
  { id: 'eval-007', type: 'evaluate-formula', formula: 'P ∧ (Q ∨ R)', initialAssignment: { P: true, Q: false, R: true } },
  { id: 'eval-008', type: 'evaluate-formula', formula: '¬(P ∧ Q)', initialAssignment: { P: true, Q: true } },
  { id: 'eval-009', type: 'evaluate-formula', formula: '(P → Q) ∧ R', initialAssignment: { P: true, Q: false, R: true } },
  { id: 'eval-010', type: 'evaluate-formula', formula: '¬P', initialAssignment: { P: false } },
  { id: 'eval-011', type: 'evaluate-formula', formula: 'P ∧ Q', initialAssignment: { P: true, Q: true } },
  { id: 'eval-012', type: 'evaluate-formula', formula: 'P ∧ Q', initialAssignment: { P: false, Q: false } },
  { id: 'eval-013', type: 'evaluate-formula', formula: 'P ∨ Q', initialAssignment: { P: false, Q: false } },
  { id: 'eval-014', type: 'evaluate-formula', formula: 'P ∨ Q', initialAssignment: { P: true, Q: false } },
  { id: 'eval-015', type: 'evaluate-formula', formula: 'P → Q', initialAssignment: { P: false, Q: false } },
  { id: 'eval-016', type: 'evaluate-formula', formula: 'P → Q', initialAssignment: { P: false, Q: true } },
  { id: 'eval-017', type: 'evaluate-formula', formula: 'P ↔ Q', initialAssignment: { P: true, Q: true } },
  { id: 'eval-018', type: 'evaluate-formula', formula: 'P ↔ Q', initialAssignment: { P: false, Q: false } },
  { id: 'eval-019', type: 'evaluate-formula', formula: '¬P', initialAssignment: { P: true } },
  { id: 'eval-020', type: 'evaluate-formula', formula: '¬(P ∨ Q)', initialAssignment: { P: true, Q: false } },
  { id: 'eval-021', type: 'evaluate-formula', formula: '¬¬P', initialAssignment: { P: false } },
  { id: 'eval-022', type: 'evaluate-formula', formula: '¬(P ∨ Q)', initialAssignment: { P: true, Q: true } },
  { id: 'scope-013', type: 'identify-main-connective', formula: 'P ∨ Q → R' },
  { id: 'scope-014', type: 'identify-main-connective', formula: '¬(P ∨ Q)' },
  { id: 'tt-001', type: 'fill-truth-table-cell', formula: 'P ∧ Q', hiddenRowIndex: 2 },
  { id: 'tt-002', type: 'fill-truth-table-cell', formula: 'P → Q', hiddenRowIndex: 2 },
  { id: 'tt-003', type: 'fill-truth-table-cell', formula: 'P ∨ Q', hiddenRowIndex: 0 },
  { id: 'tt-004', type: 'fill-truth-table-cell', formula: '(P → Q) ∧ R', hiddenRowIndex: 6 },
  { id: 'tt-005', type: 'fill-truth-table-cell', formula: 'P ↔ Q', hiddenRowIndex: 1 },
  { id: 'tt-006', type: 'fill-truth-table-cell', formula: '¬(P ∨ Q)', hiddenRowIndex: 0 },
  { id: 'counter-001', type: 'find-counterexample', formula: 'P ∧ Q', targetValue: false, initialAssignment: { P: true, Q: true } },
  { id: 'counter-002', type: 'find-counterexample', formula: 'P → Q', targetValue: false, initialAssignment: { P: false, Q: true } },
  { id: 'counter-003', type: 'find-counterexample', formula: 'P ∨ Q', targetValue: false, initialAssignment: { P: true, Q: false } },
  { id: 'counter-004', type: 'find-counterexample', formula: 'P ↔ Q', targetValue: false, initialAssignment: { P: true, Q: true } },
  { id: 'counter-005', type: 'find-counterexample', formula: '¬(P ∨ Q)', targetValue: true, initialAssignment: { P: true, Q: false } },
  { id: 'val-001', type: 'classify-tautology', formula: 'P ∨ ¬P' },
  { id: 'val-002', type: 'classify-tautology', formula: 'P ∧ ¬P' },
  { id: 'val-003', type: 'classify-tautology', formula: 'P → P' },
  { id: 'val-004', type: 'classify-tautology', formula: '(P → Q) ∨ (Q → P)' },
  { id: 'val-005', type: 'classify-tautology', formula: 'P ∧ Q' },
  { id: 'translate-001', type: 'translate-en-to-formula' },
  { id: 'translate-002', type: 'translate-en-to-formula' },
  { id: 'translate-003', type: 'translate-en-to-formula' },
  { id: 'translate-004', type: 'translate-en-to-formula' },
  { id: 'translate-005', type: 'translate-en-to-formula' },
  { id: 'translate-006', type: 'translate-en-to-formula' },
  { id: 'nd-001', type: 'proof-fill-step' },
  { id: 'nd-002', type: 'proof-fill-step' },
];

export function getExerciseDefinition(id: string): ExerciseDefinition | undefined {
  return EXERCISE_DEFINITIONS.find((exercise) => exercise.id === id);
}

export type Exercise = ExerciseDefinition & { prompt: string; feedback?: FeedbackTemplate };
