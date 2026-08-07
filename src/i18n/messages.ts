import type { FeedbackTag, FeedbackTemplate } from '../../engine';
import type { Locale } from './locale';

export type ExerciseCopy = {
  prompt: string;
  feedback?: FeedbackTemplate;
};

export type UiCopy = {
  eyebrow: string;
  practice: string;
  queueMeta: (count: number) => string;
  assignment: string;
  assignmentAria: string;
  formulaTreeAria: string;
  continue: string;
  nextExercise: string;
  valuesUpdated: string;
  trueLabel: string;
  falseLabel: string;
  valueAria: (value: string) => string;
  languageToggle: (locale: Locale) => string;
  switchTo: (locale: Locale) => string;
};

const FEEDBACK_DEFAULTS: Record<Locale, Record<FeedbackTag, string>> = {
  en: {
    correct: 'Correct.',
    'wrong-main-connective':
      'That is not the main connective of the whole formula. The main connective has the widest scope.',
    'selected-subconnective':
      '{label} is the main connective of a subformula, but not of the whole formula.',
    'selected-atom': '{label} is a sentence letter, not a connective.',
    'selected-operand-not-connective': 'That node is not a connective.',
  },
  fr: {
    correct: 'Correct.',
    'wrong-main-connective':
      "Ce n'est pas le connecteur principal de la formule entière. Le connecteur principal a la portée la plus large.",
    'selected-subconnective':
      "{label} est le connecteur principal d'une sous-formule, mais pas de la formule entière.",
    'selected-atom': "{label} est une lettre propositionnelle, pas un connecteur.",
    'selected-operand-not-connective': "Ce nœud n'est pas un connecteur.",
  },
};

const EXERCISE_COPY: Record<Locale, Record<string, ExerciseCopy>> = {
  en: {
    'scope-001': {
      prompt: 'Tap the main connective of the whole formula.',
      feedback: {
        'selected-subconnective':
          '→ is the main connective of (P → Q), but not of the whole formula. The outer operator binds last.',
      },
    },
    'scope-002': {
      prompt: 'Tap the main connective of the whole formula.',
    },
    'scope-003': {
      prompt: 'Tap the main connective of the whole formula.',
      feedback: {
        'selected-subconnective':
          '∧ is inside the scope of ¬. The main connective governs the entire formula.',
      },
    },
    'eval-001': {
      prompt: 'Toggle the truth values below. Every node shows its computed value.',
    },
    'eval-002': {
      prompt: 'Toggle atoms and watch intermediate values update.',
    },
  },
  fr: {
    'scope-001': {
      prompt: 'Touchez le connecteur principal de la formule entière.',
      feedback: {
        'selected-subconnective':
          '→ est le connecteur principal de (P → Q), mais pas de la formule entière. L’opérateur extérieur lie en dernier.',
      },
    },
    'scope-002': {
      prompt: 'Touchez le connecteur principal de la formule entière.',
    },
    'scope-003': {
      prompt: 'Touchez le connecteur principal de la formule entière.',
      feedback: {
        'selected-subconnective':
          '∧ est dans la portée de ¬. Le connecteur principal régit la formule entière.',
      },
    },
    'eval-001': {
      prompt: 'Basculez les valeurs de vérité ci-dessous. Chaque nœud affiche sa valeur calculée.',
    },
    'eval-002': {
      prompt: 'Basculez les atomes et observez les valeurs intermédiaires se mettre à jour.',
    },
  },
};

const UI: Record<Locale, UiCopy> = {
  en: {
    eyebrow: 'Externalize · MVP-0',
    practice: 'Practice',
    queueMeta: (count) => `${count} item${count === 1 ? '' : 's'} in review queue`,
    assignment: 'Assignment',
    assignmentAria: 'Truth assignment',
    formulaTreeAria: 'Formula tree',
    continue: 'Continue',
    nextExercise: 'Next exercise',
    valuesUpdated: 'Values updated at every node.',
    trueLabel: 'true',
    falseLabel: 'false',
    valueAria: (value) => `value ${value}`,
    languageToggle: (locale) => (locale === 'en' ? 'English' : 'French'),
    switchTo: (locale) => (locale === 'en' ? 'Switch to English' : 'Passer en français'),
  },
  fr: {
    eyebrow: 'Externalize · MVP-0',
    practice: 'Pratique',
    queueMeta: (count) =>
      `${count} élément${count === 1 ? '' : 's'} dans la file de révision`,
    assignment: 'Valuation',
    assignmentAria: 'Valuation de vérité',
    formulaTreeAria: 'Arbre de formule',
    continue: 'Continuer',
    nextExercise: 'Exercice suivant',
    valuesUpdated: 'Valeurs mises à jour à chaque nœud.',
    trueLabel: 'vrai',
    falseLabel: 'faux',
    valueAria: (value) => `valeur ${value}`,
    languageToggle: (locale) => (locale === 'en' ? 'Anglais' : 'Français'),
    switchTo: (locale) => (locale === 'en' ? 'Switch to English' : 'Passer en français'),
  },
};

export function ui(locale: Locale): UiCopy {
  return UI[locale];
}

export function getExerciseCopy(locale: Locale, exerciseId: string): ExerciseCopy {
  const copy = EXERCISE_COPY[locale][exerciseId];
  if (!copy) {
    throw new Error(`Missing exercise copy for ${exerciseId} (${locale})`);
  }
  return copy;
}

export function getFeedbackTemplates(locale: Locale, exerciseId: string): FeedbackTemplate {
  const exerciseFeedback = EXERCISE_COPY[locale][exerciseId]?.feedback ?? {};
  return { ...FEEDBACK_DEFAULTS[locale], ...exerciseFeedback };
}

export function getFeedbackDefaults(locale: Locale): Record<FeedbackTag, string> {
  return FEEDBACK_DEFAULTS[locale];
}
