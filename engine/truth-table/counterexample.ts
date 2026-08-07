import type { Assignment, Formula } from '../ast/types';
import { allAssignments, evaluate } from '../eval/evaluate';

export type CounterexampleValidation = { correct: boolean; actual: boolean; target: boolean };

export function validateCounterexample(
  formula: Formula,
  assignment: Assignment,
  target: boolean,
): CounterexampleValidation {
  const actual = evaluate(formula, assignment);
  return { correct: actual === target, actual, target };
}

export function hasAssignmentForValue(
  formula: Formula,
  atoms: readonly string[],
  target: boolean,
): boolean {
  return allAssignments([...atoms]).some((assignment) => evaluate(formula, assignment) === target);
}
