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
  | 'reversed-biconditional'
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
  atoms: Array<{ name: string; gloss?: string }>;
  connectives: ConnectiveKind[];
  includeParentheses: boolean;
};

export type TranslationPrompt = {
  english: string;
  atoms: Record<string, string>;
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
  prompt: TranslationPrompt;
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
  prompt: {
    english: 'If it rains, then the game is cancelled.',
    atoms: {
      P: 'It rains.',
      Q: 'The game is cancelled.',
    },
  },
  expected: {
    formula: '(P → Q)',
  },
  palette: {
    atoms: [
      { name: 'P', gloss: 'It rains.' },
      { name: 'Q', gloss: 'The game is cancelled.' },
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
  prompt: {
    english: 'It is not the case that both the gate is open and the alarm is on.',
    atoms: { P: 'The gate is open.', Q: 'The alarm is on.' },
  },
  expected: { formula: '¬(P ∧ Q)' },
  palette: {
    atoms: [
      { name: 'P', gloss: 'The gate is open.' },
      { name: 'Q', gloss: 'The alarm is on.' },
    ],
    connectives: ['not', 'and', 'or', 'imp', 'iff'],
    includeParentheses: true,
  },
  structuralCheck: { type: 'main-connective', expected: 'not' },
};

export const TRANSLATE_003: TranslationExerciseConfig = {
  id: 'translate-003',
  prompt: {
    english: 'If it rains, then the game is cancelled, and the field is closed.',
    atoms: { P: 'It rains.', Q: 'The game is cancelled.', R: 'The field is closed.' },
  },
  expected: { formula: '(P → Q) ∧ R' },
  palette: {
    atoms: [
      { name: 'P', gloss: 'It rains.' },
      { name: 'Q', gloss: 'The game is cancelled.' },
      { name: 'R', gloss: 'The field is closed.' },
    ],
    connectives: ['not', 'and', 'or', 'imp', 'iff'],
    includeParentheses: true,
  },
  structuralCheck: { type: 'main-connective', expected: 'and' },
};

export const TRANSLATE_004: TranslationExerciseConfig = {
  id: 'translate-004',
  prompt: {
    english: 'If the alarm sounds, then there is smoke.',
    atoms: { P: 'The alarm sounds.', Q: 'There is smoke.' },
  },
  expected: { formula: '(P → Q)' },
  palette: {
    atoms: [
      { name: 'P', gloss: 'The alarm sounds.' },
      { name: 'Q', gloss: 'There is smoke.' },
    ],
    connectives: ['not', 'and', 'or', 'imp', 'iff'],
    includeParentheses: true,
  },
  structuralCheck: { type: 'main-connective', expected: 'imp' },
};

export const TRANSLATE_005: TranslationExerciseConfig = {
  id: 'translate-005',
  prompt: {
    english: 'The door is locked if and only if the key is missing.',
    atoms: { P: 'The door is locked.', Q: 'The key is missing.' },
  },
  expected: { formula: '(P ↔ Q)' },
  palette: {
    atoms: [
      { name: 'P', gloss: 'The door is locked.' },
      { name: 'Q', gloss: 'The key is missing.' },
    ],
    connectives: ['not', 'and', 'or', 'imp', 'iff'],
    includeParentheses: true,
  },
  structuralCheck: { type: 'main-connective', expected: 'iff' },
};

export const TRANSLATE_006: TranslationExerciseConfig = {
  id: 'translate-006',
  prompt: {
    english: 'It is not the case that the gate is open or the window is open.',
    atoms: { P: 'The gate is open.', Q: 'The window is open.' },
  },
  expected: { formula: '¬(P ∨ Q)' },
  palette: {
    atoms: [
      { name: 'P', gloss: 'The gate is open.' },
      { name: 'Q', gloss: 'The window is open.' },
    ],
    connectives: ['not', 'and', 'or', 'imp', 'iff'],
    includeParentheses: true,
  },
  structuralCheck: { type: 'main-connective', expected: 'not' },
};
