import { collectAtoms, parse, type Assignment } from '../../engine';
import type { Locale } from '../i18n';

export const EXPLORE_FORMULAS = [
  'P ∧ Q',
  'P ∨ Q',
  'P → Q',
  'P ↔ Q',
  '¬P',
  '¬(P ∧ Q)',
] as const;

export type ExploreState = {
  locale: Locale;
  formulaIndex: number;
  assignment: Assignment;
};

function defaultAssignment(formula: string): Assignment {
  const atoms = [...collectAtoms(parse(formula))].sort();
  return Object.fromEntries(atoms.map((atom) => [atom, false]));
}

export function createExploreState(locale: Locale, formulaIndex = 0): ExploreState {
  const clamped = Math.min(Math.max(formulaIndex, 0), EXPLORE_FORMULAS.length - 1);
  const formula = EXPLORE_FORMULAS[clamped];
  return {
    locale,
    formulaIndex: clamped,
    assignment: defaultAssignment(formula),
  };
}

export function selectExploreFormula(state: ExploreState, formulaIndex: number): ExploreState {
  const clamped = Math.min(Math.max(formulaIndex, 0), EXPLORE_FORMULAS.length - 1);
  if (clamped === state.formulaIndex) {
    return state;
  }
  const formula = EXPLORE_FORMULAS[clamped];
  return {
    ...state,
    formulaIndex: clamped,
    assignment: defaultAssignment(formula),
  };
}

export function setExploreAtom(state: ExploreState, atom: string, value: boolean): ExploreState {
  if (!(atom in state.assignment)) {
    return state;
  }
  return {
    ...state,
    assignment: { ...state.assignment, [atom]: value },
  };
}

export function applyExploreLocale(state: ExploreState, locale: Locale): ExploreState {
  return locale === state.locale ? state : { ...state, locale };
}

export function currentExploreFormula(state: ExploreState): string {
  return EXPLORE_FORMULAS[state.formulaIndex];
}
