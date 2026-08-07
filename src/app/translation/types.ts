import type { ConnectiveKind, Formula } from '../../../engine';

/** Token inserted by palette taps; compiled to Formula — not typed text. */
export type BuilderToken =
  | { kind: 'atom'; name: string }
  | { kind: 'connective'; connective: ConnectiveKind }
  | { kind: 'paren'; side: 'open' | 'close' };

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
