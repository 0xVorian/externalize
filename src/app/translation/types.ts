import type { ConnectiveKind, Formula, Term } from '../../../engine';

/** Token inserted by palette taps; compiled to Formula — not typed text. */
export type BuilderToken =
  | { kind: 'pred'; name: string; args: Term[] }
  | { kind: 'connective'; connective: ConnectiveKind }
  | { kind: 'paren'; side: 'open' | 'close' };

/** 0-place predicate token (propositional sentence letter). */
export function builderPred(name: string): Extract<BuilderToken, { kind: 'pred' }> {
  return { kind: 'pred', name, args: [] };
}

export type TranslationFeedbackTag =
  | 'correct'
  | 'reversed-conditional'
  | 'negation-scope'
  | 'missing-parens'
  | 'extra-parens'
  | 'wrong-main-connective'
  | 'wrong-operator'
  | 'wrong-atom'
  | 'equivalent-but-noncanonical'
  | 'incomplete'
  | 'unbalanced-parens';

/** Mirrors content-model palette block; hand-authored until YAML loader exists. */
export type TranslationPaletteConfig = {
  atoms: Array<{ name: string }>;
  connectives: ConnectiveKind[];
  includeParentheses: boolean;
};

export type TranslationExpected = {
  formula: string;
  acceptEquivalent?: boolean;
  acceptCommutativeAnd?: boolean;
  acceptCommutativeOr?: boolean;
};

/** Draft exercise shape for Phase 3 — not wired to app router yet. */
export type TranslationExerciseConfig = {
  id: string;
  expected: TranslationExpected;
  palette: TranslationPaletteConfig;
  structuralCheck?: {
    type: 'main-connective';
    expected: ConnectiveKind;
  };
};

export type FormulaBuilderState = {
  tokens: BuilderToken[];
  formula?: Formula;
  compileError?: string;
};

/** Example exercise for spike / dev harness. */
export const TRANSLATE_001: TranslationExerciseConfig = {
  id: 'translate-001',
  expected: {
    formula: '(P → Q)',
  },
  palette: {
    atoms: [
      { name: 'P' },
      { name: 'Q' },
    ],
    connectives: ['not', 'and', 'or', 'imp', 'iff'],
    includeParentheses: true,
  },
  structuralCheck: {
    type: 'main-connective',
    expected: 'imp',
  },
};

export const TRANSLATE_002: TranslationExerciseConfig = {
  id: 'translate-002',
  expected: { formula: '¬(P ∧ Q)' },
  palette: {
    atoms: [
      { name: 'P' },
      { name: 'Q' },
    ],
    connectives: ['not', 'and', 'or', 'imp', 'iff'],
    includeParentheses: true,
  },
  structuralCheck: { type: 'main-connective', expected: 'not' },
};

export const TRANSLATE_003: TranslationExerciseConfig = {
  id: 'translate-003',
  expected: { formula: '(P → Q) ∧ R' },
  palette: {
    atoms: [
      { name: 'P' },
      { name: 'Q' },
      { name: 'R' },
    ],
    connectives: ['not', 'and', 'or', 'imp', 'iff'],
    includeParentheses: true,
  },
  structuralCheck: { type: 'main-connective', expected: 'and' },
};

export const TRANSLATE_004: TranslationExerciseConfig = {
  id: 'translate-004',
  expected: { formula: '(P → Q)' },
  palette: {
    atoms: [
      { name: 'P' },
      { name: 'Q' },
    ],
    connectives: ['not', 'and', 'or', 'imp', 'iff'],
    includeParentheses: true,
  },
  structuralCheck: { type: 'main-connective', expected: 'imp' },
};

export const TRANSLATE_005: TranslationExerciseConfig = {
  id: 'translate-005',
  expected: { formula: '(P ↔ Q)' },
  palette: {
    atoms: [
      { name: 'P' },
      { name: 'Q' },
    ],
    connectives: ['not', 'and', 'or', 'imp', 'iff'],
    includeParentheses: true,
  },
  structuralCheck: { type: 'main-connective', expected: 'iff' },
};

export const TRANSLATE_006: TranslationExerciseConfig = {
  id: 'translate-006',
  expected: { formula: '¬(P ∨ Q)' },
  palette: {
    atoms: [
      { name: 'P' },
      { name: 'Q' },
    ],
    connectives: ['not', 'and', 'or', 'imp', 'iff'],
    includeParentheses: true,
  },
  structuralCheck: { type: 'main-connective', expected: 'not' },
};
