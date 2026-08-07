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

/** English: analytic philosophy / introductory logic (sentence letters, truth assignments, main connective). */
const FEEDBACK_DEFAULTS_EN: Record<FeedbackTag, string> = {
  correct: 'Correct.',
  'wrong-main-connective':
    'That is not the main connective of the formula. The main connective determines the outermost logical form.',
  'selected-subconnective':
    '{label} is the main connective of a proper subformula, not of the entire formula.',
  'selected-atom': '{label} is a sentence letter — an atomic formula — not a connective.',
  'selected-operand-not-connective': 'That expression is not a connective.',
};

/** French: logique propositionnelle (connecteur principal, portée, formule atomique). Independent wording — not a translation of the English strings. */
const FEEDBACK_DEFAULTS_FR: Record<FeedbackTag, string> = {
  correct: 'Exact.',
  'wrong-main-connective':
    "Ce n'est pas le connecteur principal. C'est lui qui détermine la structure logique externe de la formule.",
  'selected-subconnective':
    "Ici, {label} gouverne seulement une sous-formule ; le connecteur principal porte sur l'ensemble de la formule.",
  'selected-atom':
    '{label} est une formule atomique (une variable propositionnelle), pas un connecteur.',
  'selected-operand-not-connective': "Cet élément n'est pas un connecteur logique.",
};

const FEEDBACK_DEFAULTS: Record<Locale, Record<FeedbackTag, string>> = {
  en: FEEDBACK_DEFAULTS_EN,
  fr: FEEDBACK_DEFAULTS_FR,
};

const EXERCISE_COPY: Record<Locale, Record<string, ExerciseCopy>> = {
  en: {
    'scope-001': {
      prompt: 'Select the main connective of the formula.',
      feedback: {
        'selected-subconnective':
          '→ is the main connective of (P → Q), but the formula as a whole is a conjunction. The outermost connective has widest scope.',
      },
    },
    'scope-002': {
      prompt: 'Select the main connective of the formula.',
    },
    'scope-003': {
      prompt: 'Select the main connective of the formula.',
      feedback: {
        'selected-subconnective':
          '∧ falls within the scope of ¬. The main connective applies to the entire well-formed formula.',
      },
    },
    'eval-001': {
      prompt:
        'Assign truth values to the sentence letters. The tree shows how each subformula evaluates under your assignment.',
    },
    'eval-002': {
      prompt:
        'Change the assignment and observe how truth values propagate from the letters through each subformula.',
    },
  },
  fr: {
    'scope-001': {
      prompt: 'Indiquez le connecteur principal de la formule.',
      feedback: {
        'selected-subconnective':
          "L'implication → structure (P → Q), mais la formule entière est une conjonction : le connecteur le plus externe a la portée maximale.",
      },
    },
    'scope-002': {
      prompt: 'Indiquez le connecteur principal de la formule.',
    },
    'scope-003': {
      prompt: 'Indiquez le connecteur principal de la formule.',
      feedback: {
        'selected-subconnective':
          'La conjonction ∧ est dans la portée de la négation ¬ : le connecteur principal s\'applique à la formule bien formée dans son ensemble.',
      },
    },
    'eval-001': {
      prompt:
        'Fixez une valuation des variables propositionnelles. L\'arbre indique comment chaque sous-formule se comporte sous cette interprétation.',
    },
    'eval-002': {
      prompt:
        'Modifiez la valuation et suivez la propagation des valeurs de vérité à travers les sous-formules.',
    },
  },
};

const UI: Record<Locale, UiCopy> = {
  en: {
    eyebrow: 'Externalize',
    practice: 'Exercises',
    queueMeta: (count) =>
      `${count} exercise${count === 1 ? '' : 's'} scheduled for review`,
    assignment: 'Truth assignment',
    assignmentAria: 'Truth assignment to sentence letters',
    formulaTreeAria: 'Parsing tree of the formula',
    continue: 'Continue',
    nextExercise: 'Next exercise',
    valuesUpdated: 'Truth values updated at each subformula.',
    trueLabel: 'T',
    falseLabel: 'F',
    valueAria: (value) => `truth value ${value}`,
    languageToggle: (locale) => (locale === 'en' ? 'English' : 'French'),
    switchTo: (locale) => (locale === 'en' ? 'Switch to English' : 'Passer en français'),
  },
  fr: {
    eyebrow: 'Externalize',
    practice: 'Exercices',
    queueMeta: (count) =>
      `${count} exercice${count === 1 ? '' : 's'} à revoir`,
    assignment: 'Interprétation',
    assignmentAria: 'Interprétation (valuation des variables propositionnelles)',
    formulaTreeAria: 'Arbre de décomposition de la formule',
    continue: 'Continuer',
    nextExercise: 'Exercice suivant',
    valuesUpdated: 'Les valeurs de vérité se mettent à jour à chaque sous-formule.',
    trueLabel: 'V',
    falseLabel: 'F',
    valueAria: (value) => `valeur de vérité ${value}`,
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
