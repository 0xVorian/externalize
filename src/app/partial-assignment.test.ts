import { describe, expect, it } from 'vitest';
import {
  canYieldFormulaValue,
  determinedFormulaValue,
  formulaValuesUnderCompletions,
  isAtomAssigned,
  uniqueAtomValueForGoal,
} from './partial-assignment';

describe('partial assignment', () => {
  it('treats a missing key as unknown, not false', () => {
    expect(isAtomAssigned({}, 'P')).toBe(false);
    expect(isAtomAssigned({ P: false }, 'P')).toBe(true);
    expect(isAtomAssigned({ P: true }, 'P')).toBe(true);
  });

  it('leaves ¬P undetermined when P is unset', () => {
    expect(determinedFormulaValue('¬P', {})).toBeNull();
    expect(formulaValuesUnderCompletions('¬P', {}).size).toBe(2);
  });

  it('determines P ∧ Q as false when P is false and Q is unknown', () => {
    expect(determinedFormulaValue('P ∧ Q', { P: false })).toBe(false);
  });

  it('leaves P ∧ Q undetermined when P is true and Q is unknown', () => {
    expect(determinedFormulaValue('P ∧ Q', { P: true })).toBeNull();
  });

  it('determines P → Q as true when P is false and Q is unknown', () => {
    expect(determinedFormulaValue('P → Q', { P: false })).toBe(true);
  });

  it('does not compute a result from hidden false defaults', () => {
    expect(determinedFormulaValue('¬P', {})).toBeNull();
    expect(determinedFormulaValue('¬P', { P: false })).toBe(true);
  });

  it('finds the unique atom value forced by a goal', () => {
    expect(uniqueAtomValueForGoal('¬P', {}, 'P', false)).toBe(true);
    expect(uniqueAtomValueForGoal('P ∨ Q', {}, 'P', false)).toBe(false);
    expect(uniqueAtomValueForGoal('P ∨ Q', { P: false }, 'Q', false)).toBe(false);
    expect(uniqueAtomValueForGoal('P → Q', {}, 'P', false)).toBe(true);
    expect(uniqueAtomValueForGoal('P ↔ Q', { P: true }, 'Q', false)).toBe(false);
  });

  it('does not force a unique P for a mismatching biconditional', () => {
    expect(uniqueAtomValueForGoal('P ↔ Q', {}, 'P', false)).toBeNull();
    expect(canYieldFormulaValue('P ↔ Q', { P: true }, false)).toBe(true);
    expect(canYieldFormulaValue('P ↔ Q', { P: false }, false)).toBe(true);
  });
});
