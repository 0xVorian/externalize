import type { FeedbackTag, FeedbackTemplate } from '../../engine';
import type { Locale } from './locale';
import type { ResumePoint } from '../app/progress-tracker';

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

export function formatTruthValue(locale: Locale, value: boolean | undefined): string {
  if (value === undefined) {
    return '—';
  }
  const copy = ui(locale);
  return value ? copy.trueLabel : copy.falseLabel;
}

export function formatAssignmentLine(
  locale: Locale,
  assignment: Record<string, boolean>,
): string {
  const copy = ui(locale);
  const parts = Object.keys(assignment)
    .sort()
    .map((atom) => `${atom} ↦ ${formatTruthValue(locale, assignment[atom])}`);
  return `${copy.assignment}: ${parts.join(' , ')}`;
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

export type ProgressUiCopy = {
  progress: string;
  continueTitle: string;
  continueLearn: string;
  continuePractice: string;
  continueProgress: string;
  lastSeen: (when: string) => string;
  level0Heading: string;
  level0Status: (done: number, total: number) => string;
  exercisesHeading: string;
  exercisesStatus: (done: number, unlocked: number) => string;
  reviewDue: (count: number) => string;
  strugglesHeading: string;
  strugglesEmpty: string;
  comfortableHeading: string;
  comfortableEmpty: string;
  errorsHeading: string;
  errorsEmpty: string;
  skillLabel: (id: string) => string;
  errorLabel: (tag: FeedbackTag) => string;
  rateLabel: (rate: number, attempts: number) => string;
  lessonDone: string;
  lessonTodo: string;
  exerciseDone: string;
  exerciseLocked: string;
  syncHeading: string;
  syncHint: string;
  exportProgress: string;
  importProgress: string;
  importSuccess: string;
  importError: string;
};

const PROGRESS_UI: Record<Locale, ProgressUiCopy> = {
  en: {
    progress: 'Progress',
    continueTitle: 'Pick up where you left off',
    continueLearn: 'Continue course',
    continuePractice: 'Continue exercises',
    continueProgress: 'View progress',
    lastSeen: (when) => `Last activity: ${when}`,
    level0Heading: 'Introductory unit',
    level0Status: (done, total) => `${done} of ${total} sections complete`,
    exercisesHeading: 'Exercises',
    exercisesStatus: (done, unlocked) => `${done} completed · ${unlocked} unlocked`,
    reviewDue: (count) => `${count} scheduled for review`,
    strugglesHeading: 'Needs work',
    strugglesEmpty: 'Nothing flagged yet — mistakes on exercises will show up here.',
    comfortableHeading: 'Going well',
    comfortableEmpty: 'Keep practicing — strong areas appear after a few successful attempts.',
    errorsHeading: 'Recurring mistakes',
    errorsEmpty: 'No repeated error patterns yet.',
    skillLabel: (id) =>
      id === 'practice:evaluate-formula'
        ? 'Evaluating formulas'
        : id === 'practice:identify-main-connective'
          ? 'Main connective'
          : id,
    errorLabel: (tag) => FEEDBACK_DEFAULTS_EN[tag].split('.')[0],
    rateLabel: (rate, attempts) => `${Math.round(rate * 100)}% over ${attempts} attempts`,
    lessonDone: 'done',
    lessonTodo: 'remaining',
    exerciseDone: 'done',
    exerciseLocked: 'locked',
    syncHeading: 'Another device',
    syncHint: 'Export on this device, then import the file where you want to continue.',
    exportProgress: 'Export progress',
    importProgress: 'Import progress',
    importSuccess: 'Progress restored. You can pick up where you left off.',
    importError: 'That file could not be read. Choose an Externalize progress export.',
  },
  fr: {
    progress: 'Parcours',
    continueTitle: 'Reprendre',
    continueLearn: 'Reprendre le cours',
    continuePractice: 'Reprendre les exercices',
    continueProgress: 'Voir le parcours',
    lastSeen: (when) => `Dernière activité : ${when}`,
    level0Heading: 'Unité d\'introduction',
    level0Status: (done, total) => `${done} section${done > 1 ? 's' : ''} sur ${total} terminée${done > 1 ? 's' : ''}`,
    exercisesHeading: 'Exercices',
    exercisesStatus: (done, unlocked) => `${done} réussi${done > 1 ? 's' : ''} · ${unlocked} ouvert${unlocked > 1 ? 's' : ''}`,
    reviewDue: (count) => `${count} à revoir`,
    strugglesHeading: 'À consolidér',
    strugglesEmpty: 'Rien pour l\'instant — les erreurs aux exercices s\'afficheront ici.',
    comfortableHeading: 'Acquis solides',
    comfortableEmpty: 'Continuez — les points maîtrisés apparaissent après plusieurs réussites.',
    errorsHeading: 'Erreurs fréquentes',
    errorsEmpty: 'Pas encore de motif d\'erreur répété.',
    skillLabel: (id) =>
      id === 'practice:evaluate-formula'
        ? 'Évaluation de formules'
        : id === 'practice:identify-main-connective'
          ? 'Connecteur principal'
          : id,
    errorLabel: (tag) => FEEDBACK_DEFAULTS_FR[tag].split('.')[0],
    rateLabel: (rate, attempts) => `${Math.round(rate * 100)} % sur ${attempts} essai${attempts > 1 ? 's' : ''}`,
    lessonDone: 'fait',
    lessonTodo: 'reste',
    exerciseDone: 'fait',
    exerciseLocked: 'fermé',
    syncHeading: 'Autre appareil',
    syncHint: 'Exportez ici, puis importez le fichier sur l\'appareil où vous voulez reprendre.',
    exportProgress: 'Exporter le parcours',
    importProgress: 'Importer un parcours',
    importSuccess: 'Parcours restauré. Vous pouvez reprendre.',
    importError: 'Fichier illisible. Choisissez une exportation Externalize.',
  },
};

export function progressUi(locale: Locale): ProgressUiCopy {
  return PROGRESS_UI[locale];
}

export function formatResumeTime(locale: Locale, iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function resumeContinueLabel(locale: Locale, resume: ResumePoint): string {
  const copy = progressUi(locale);
  if (resume.mode === 'learn') {
    return copy.continueLearn;
  }
  if (resume.mode === 'practice') {
    return copy.continuePractice;
  }
  return copy.continueProgress;
}
