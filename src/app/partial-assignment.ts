import { allAssignments, collectAtoms, evaluate, parse, type Assignment } from '../../engine';

/**
 * Guided assignments treat a missing key as unknown, not false.
 * Full-assignment contexts (Explore, practice, watch) still store every atom.
 */
export type PartialAssignment = Assignment;

export function isAtomAssigned(assignment: PartialAssignment, atom: string): boolean {
  return typeof assignment[atom] === 'boolean';
}

export function formulaValuesUnderCompletions(
  formula: string,
  assignment: PartialAssignment,
): Set<boolean> {
  const parsed = parse(formula);
  const unset = [...collectAtoms(parsed)].filter((atom) => !isAtomAssigned(assignment, atom));
  const values = new Set<boolean>();
  for (const extra of allAssignments(unset)) {
    values.add(evaluate(parsed, { ...assignment, ...extra }));
  }
  return values;
}

/**
 * Partial determination: if every completion of the unset atoms agrees,
 * return that truth value; otherwise return null (result stays blank).
 *
 * Examples: P ∧ Q with P = F is F; ¬P with P unset is undetermined.
 */
export function determinedFormulaValue(
  formula: string,
  assignment: PartialAssignment,
): boolean | null {
  const values = formulaValuesUnderCompletions(formula, assignment);
  if (values.size === 1) {
    return values.has(true);
  }
  return null;
}

export function canYieldFormulaValue(
  formula: string,
  assignment: PartialAssignment,
  goalValue: boolean,
): boolean {
  return formulaValuesUnderCompletions(formula, assignment).has(goalValue);
}

export function uniqueAtomValueForGoal(
  formula: string,
  assignment: PartialAssignment,
  atom: string,
  goalValue: boolean,
): boolean | null {
  const viable = ([true, false] as const).filter((value) =>
    canYieldFormulaValue(formula, { ...assignment, [atom]: value }, goalValue),
  );
  return viable.length === 1 ? viable[0] : null;
}
