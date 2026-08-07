import type { FeedbackTag, FeedbackTemplate } from '../../engine';
import type { Locale } from './locale';
import type { ResumePoint } from '../app/progress-tracker';

export type ExerciseCopy = {
  prompt: string;
  feedback?: FeedbackTemplate;
  cellCorrect?: string;
  cellWrong?: string;
  counterCorrect?: string;
  counterWrong?: string;
};

export type UiCopy = {
  eyebrow: string;
  practice: string;
  queueMeta: (count: number) => string;
  assignment: string;
  assignmentAria: string;
  assignmentHint: string;
  atomGroupAria: (atom: string) => string;
  atomSetTrueAria: (atom: string) => string;
  atomSetFalseAria: (atom: string) => string;
  cellFillAria: (rowNumber: number) => string;
  formulaTreeAria: string;
  formulaDisplayAria: string;
  treeNodeSelectAria: (label: string) => string;
  treeNodeDisplayAria: (label: string, value?: string) => string;
  continue: string;
  nextExercise: string;
  checkCounterexample: string;
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
  'reversed-conditional': 'The conditional runs the wrong way.',
  'reversed-biconditional': 'The biconditional is reversed.',
  'negation-scope': 'Negation is on the wrong subformula.',
  'missing-parens': 'Grouping is missing.',
  'extra-parens': 'Extra parentheses.',
  'wrong-operator': 'One connective should be different.',
  'wrong-atom': 'Wrong sentence letter.',
  'equivalent-but-noncanonical': 'Equivalent but not canonical.',
  incomplete: 'Formula incomplete.',
  'counterexample-miss': 'This assignment does not match the target truth value.',
  'unbalanced-parens': 'Unbalanced parentheses.',
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
  'reversed-conditional': "Implication inversée.",
  'reversed-biconditional': 'Biconditionnelle inversée.',
  'negation-scope': 'Mauvaise portée de la négation.',
  'missing-parens': 'Parenthèses manquantes.',
  'extra-parens': 'Parenthèses en trop.',
  'wrong-operator': 'Mauvais connecteur.',
  'wrong-atom': 'Mauvaise variable.',
  'equivalent-but-noncanonical': 'Équivalent mais non canonique.',
  incomplete: 'Formule incomplète.',
  'counterexample-miss': "Cette interprétation ne correspond pas à la valeur de vérité demandée.",
  'unbalanced-parens': 'Parenthèses déséquilibrées.',
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
    'scope-004': {
      prompt: 'Select the main connective of the formula.',
      feedback: {
        'selected-subconnective':
          '∧ combines Q and R on the right, but ∨ is the main connective — it joins the left disjunct to the whole right-hand subformula.',
      },
    },
    'scope-005': {
      prompt: 'Select the main connective of the formula.',
      feedback: {
        'selected-subconnective':
          '∨ is the main connective of (P ∨ Q), yet the entire formula is a material conditional. → has the outermost scope.',
      },
    },
    'scope-006': {
      prompt: 'Select the main connective of the formula.',
      feedback: {
        'selected-subconnective':
          '→ structures (P → Q) inside the parentheses, but ¬ applies to that entire subformula. The main connective governs the whole expression.',
      },
    },
    'scope-007': {
      prompt: 'Select the main connective of the formula.',
      feedback: {
        'selected-subconnective':
          '∧ is the main connective of (P ∧ Q), not of the full formula. ∨ links that conjunction to R at the top level.',
      },
    },
    'scope-008': {
      prompt: 'Select the main connective of the formula.',
      feedback: {
        'selected-subconnective':
          '∨ is the main connective of (Q ∨ R) in the consequent, but → is the main connective of the entire conditional.',
      },
    },
    'scope-009': {
      prompt: 'Select the main connective of the formula.',
      feedback: {
        'selected-subconnective':
          '¬ applies only to P. ∧ is the main connective — it conjoins ¬P with Q across the full formula.',
      },
    },
    'scope-010': {
      prompt: 'Select the main connective of the formula.',
      feedback: {
        'selected-subconnective':
          'The inner → forms (P → Q), but the outer → is the main connective — it takes that subformula as its antecedent.',
      },
    },
    'scope-011': {
      prompt: 'Select the main connective of the formula.',
      feedback: {
        'selected-subconnective':
          '→ is the main connective of (Q → R) on the right, but ↔ is the main connective of the entire biconditional.',
      },
    },
    'scope-012': {
      prompt: 'Select the main connective of the formula.',
      feedback: {
        'selected-subconnective':
          '∧ binds P and Q inside the parentheses, but the outer ∧ is the main connective — it joins (P ∧ Q) to R for the whole formula.',
      },
    },
    'eval-001': {
      prompt:
        'Tap V or F for each letter. The table row shows how P ∧ Q evaluates under your assignment.',
    },
    'eval-002': {
      prompt:
        'Change the assignment and observe how truth values propagate from the letters through each subformula.',
    },
    'eval-003': {
      prompt:
        'Set P and Q, then read the result column: disjunction is true when at least one disjunct is true.',
    },
    'eval-004': {
      prompt:
        'Assign truth values to P and Q. Material implication P → Q is false only when P is true and Q is false.',
    },
    'eval-005': {
      prompt:
        'Toggle P and Q. The biconditional P ↔ Q is true exactly when both sides share the same truth value.',
    },
    'eval-006': {
      prompt:
        'With three letters, trace how the disjunction (P ∨ Q) feeds the conditional before R is evaluated.',
    },
    'eval-007': {
      prompt:
        'Watch how the value of (Q ∨ R) propagates upward before P ∧ … is computed.',
    },
    'eval-008': {
      prompt:
        'Negation applies after the conjunction inside the parentheses is evaluated. Follow the tree from the atoms outward.',
    },
    'eval-009': {
      prompt:
        'Each conjunct is evaluated separately. The conjunction is true only when both (P → Q) and R are true.',
    },
    'eval-010': {
      prompt:
        'Set the truth value of P. The live row shows how negation flips it: ¬P is true exactly when P is false.',
    },
    'tt-001': { prompt: 'The table is almost complete. Tap T or F to fill the missing entry for P ∧ Q when P is true and Q is false.', cellCorrect: 'Correct — conjunction requires both conjuncts to be true.', cellWrong: 'Under this assignment, P is true and Q is false, so P ∧ Q is false.' },
    'tt-002': { prompt: 'Fill the blank result for P → Q when P is true and Q is false.', cellCorrect: 'Correct — a material conditional is false only in this case.', cellWrong: 'When the antecedent is true and the consequent is false, P → Q is false.' },
    'tt-003': { prompt: 'Complete the table: what is P ∨ Q when both P and Q are false?', cellCorrect: 'Correct — disjunction is false only when both disjuncts are false.', cellWrong: 'With neither disjunct true, P ∨ Q is false.' },
    'tt-004': { prompt: 'Three letters, one blank. Fill the result for (P → Q) ∧ R when P and Q are true and R is false.', cellCorrect: 'Correct — the implication is true, but the conjunction fails because R is false.', cellWrong: 'When P and Q are true, (P → Q) is true; with R false, the whole conjunction is false.' },
    'tt-005': { prompt: 'Fill the missing biconditional value: P ↔ Q when P is false and Q is true.', cellCorrect: 'Correct — a biconditional is true only when both sides match.', cellWrong: 'P and Q have different truth values here, so P ↔ Q is false.' },
    'counter-001': { prompt: 'Find a truth assignment that makes P ∧ Q false. Toggle P and Q, then check.', counterCorrect: 'Correct — at least one conjunct is false.', counterWrong: 'Both conjuncts are still true.' },
    'counter-002': { prompt: 'Find an assignment where P → Q is false.', counterCorrect: 'Correct — true antecedent, false consequent.', counterWrong: 'This assignment still makes P → Q true.' },
    'counter-003': { prompt: 'Find an assignment that makes P ∨ Q false.', counterCorrect: 'Correct — both disjuncts false.', counterWrong: 'At least one disjunct is still true.' },
    'counter-004': { prompt: 'Find an assignment where P ↔ Q is false.', counterCorrect: 'Correct — P and Q differ.', counterWrong: 'P and Q still match.' },
    'translate-001': { prompt: 'If it rains, then the game is cancelled. Build the matching formula with the palette.', feedback: { 'reversed-conditional': 'Rain is the antecedent (P).' } },
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
    'scope-004': {
      prompt: 'Indiquez le connecteur principal de la formule.',
      feedback: {
        'selected-subconnective':
          'La conjonction ∧ lie Q et R à droite, mais la disjonction ∨ est le connecteur principal : elle unit le membre gauche à toute la sous-formule de droite.',
      },
    },
    'scope-005': {
      prompt: 'Indiquez le connecteur principal de la formule.',
      feedback: {
        'selected-subconnective':
          'La disjonction ∨ gouverne (P ∨ Q), mais la formule entière est une implication matérielle : c\'est → qui a la portée externe.',
      },
    },
    'scope-006': {
      prompt: 'Indiquez le connecteur principal de la formule.',
      feedback: {
        'selected-subconnective':
          'L\'implication → structure (P → Q) entre parenthèses, mais la négation ¬ s\'applique à cette sous-formule entière. Le connecteur principal porte sur l\'expression globale.',
      },
    },
    'scope-007': {
      prompt: 'Indiquez le connecteur principal de la formule.',
      feedback: {
        'selected-subconnective':
          'La conjonction ∧ est le connecteur principal de (P ∧ Q), pas de la formule complète. La disjonction ∨ relie cette conjonction à R au niveau supérieur.',
      },
    },
    'scope-008': {
      prompt: 'Indiquez le connecteur principal de la formule.',
      feedback: {
        'selected-subconnective':
          'La disjonction ∨ gouverne (Q ∨ R) dans le conséquent, mais l\'implication → est le connecteur principal de la conditionnelle entière.',
      },
    },
    'scope-009': {
      prompt: 'Indiquez le connecteur principal de la formule.',
      feedback: {
        'selected-subconnective':
          'La négation ¬ ne porte que sur P. C\'est la conjonction ∧ qui est le connecteur principal — elle assemble ¬P et Q sur toute la formule.',
      },
    },
    'scope-010': {
      prompt: 'Indiquez le connecteur principal de la formule.',
      feedback: {
        'selected-subconnective':
          'L\'implication interne → forme (P → Q), mais l\'implication externe → est le connecteur principal : elle prend cette sous-formule comme antécédent.',
      },
    },
    'scope-011': {
      prompt: 'Indiquez le connecteur principal de la formule.',
      feedback: {
        'selected-subconnective':
          'L\'implication → gouverne (Q → R) à droite, mais l\'équivalence ↔ est le connecteur principal de la biconditionnelle entière.',
      },
    },
    'scope-012': {
      prompt: 'Indiquez le connecteur principal de la formule.',
      feedback: {
        'selected-subconnective':
          'La conjonction ∧ lie P et Q entre parenthèses, mais c\'est la ∧ externe qui est le connecteur principal — elle unit (P ∧ Q) à R pour toute la formule.',
      },
    },
    'eval-001': {
      prompt:
        'Toucher V ou F pour chaque variable. La ligne du tableau indique la valeur de P ∧ Q sous cette interprétation.',
    },
    'eval-002': {
      prompt:
        'Modifiez la valuation et suivez la propagation des valeurs de vérité à travers les sous-formules.',
    },
    'eval-003': {
      prompt:
        'Fixez P et Q, puis lisez la colonne résultat : une disjonction est vraie dès qu\'au moins un disjonct est vrai.',
    },
    'eval-004': {
      prompt:
        'Attribuez des valeurs à P et Q. L\'implication matérielle P → Q est fausse seulement lorsque P est vrai et Q est faux.',
    },
    'eval-005': {
      prompt:
        'Basculez P et Q. La biconditionnelle P ↔ Q est vraie exactement quand les deux côtés ont la même valeur de vérité.',
    },
    'eval-006': {
      prompt:
        'Avec trois variables, suivez comment la disjonction (P ∨ Q) alimente la conditionnelle avant l\'évaluation de R.',
    },
    'eval-007': {
      prompt:
        'Observez comment la valeur de (Q ∨ R) remonte dans l\'arbre avant le calcul de P ∧ …',
    },
    'eval-008': {
      prompt:
        'La négation s\'applique après l\'évaluation de la conjonction entre parenthèses. Remontez l\'arbre depuis les variables.',
    },
    'eval-009': {
      prompt:
        'Chaque conjoint est évalué séparément. La conjonction n\'est vraie que si (P → Q) et R le sont tous deux.',
    },
    'eval-010': {
      prompt:
        'Fixez la valeur de P. La ligne en direct montre la négation : ¬P est vrai exactement lorsque P est faux.',
    },
    'tt-001': { prompt: 'Le tableau est presque complet. Toucher V ou F pour la case manquante de P ∧ Q lorsque P est vrai et Q est faux.', cellCorrect: 'Exact — une conjonction exige que les deux conjoints soient vrais.', cellWrong: 'Sous cette interprétation, P est vrai et Q est faux, donc P ∧ Q est faux.' },
    'tt-002': { prompt: 'Complétez la case vide pour P → Q lorsque P est vrai et Q est faux.', cellCorrect: 'Exact — l\'implication matérielle n\'est fausse que dans ce cas.', cellWrong: 'Quand l\'antécédent est vrai et le conséquent faux, P → Q est faux.' },
    'tt-003': { prompt: 'Complétez le tableau : quelle est la valeur de P ∨ Q lorsque P et Q sont tous deux faux ?', cellCorrect: 'Exact — une disjonction n\'est fausse que si les deux disjonctes le sont.', cellWrong: 'Aucun disjonct n\'étant vrai, P ∨ Q est faux.' },
    'tt-004': { prompt: 'Trois variables, une case vide. Donnez le résultat de (P → Q) ∧ R lorsque P et Q sont vrais et R est faux.', cellCorrect: 'Exact — l\'implication est vraie, mais la conjonction échoue car R est faux.', cellWrong: 'Quand P et Q sont vrais, (P → Q) est vrai ; avec R faux, la conjonction entière est fausse.' },
    'tt-005': { prompt: 'Complétez la biconditionnelle manquante : P ↔ Q lorsque P est faux et Q est vrai.', cellCorrect: 'Exact — une biconditionnelle n\'est vraie que si les deux côtés coïncident.', cellWrong: 'P et Q ont ici des valeurs différentes, donc P ↔ Q est faux.' },
    'counter-001': { prompt: 'Trouvez une interprétation qui rend P ∧ Q faux.', counterCorrect: 'Exact — au moins un conjoint est faux.', counterWrong: 'Les deux conjoints sont encore vrais.' },
    'counter-002': { prompt: 'Trouvez une interprétation où P → Q est faux.', counterCorrect: 'Exact — antécédent vrai, conséquent faux.', counterWrong: 'P → Q reste vrai.' },
    'counter-003': { prompt: 'Trouvez une interprétation qui rend P ∨ Q faux.', counterCorrect: 'Exact — les deux disjonctes sont faux.', counterWrong: 'Au moins un disjonct est encore vrai.' },
    'counter-004': { prompt: 'Trouvez une interprétation où P ↔ Q est faux.', counterCorrect: 'Exact — P et Q diffèrent.', counterWrong: 'P et Q ont encore la même valeur.' },
    'translate-001': { prompt: 'S\'il pleut, le match est annulé. Construisez la formule avec la palette.', feedback: { 'reversed-conditional': 'La pluie est P (antécédent).' } },
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
    assignmentHint: 'Tap V or F for each letter to set its truth value.',
    atomGroupAria: (atom) => `Truth value for ${atom}`,
    atomSetTrueAria: (atom) => `Set ${atom} to true`,
    atomSetFalseAria: (atom) => `Set ${atom} to false`,
    cellFillAria: (rowNumber) => `Fill result for row ${rowNumber}`,
    formulaTreeAria: 'Parsing tree of the formula',
    formulaDisplayAria: 'Formula',
    treeNodeSelectAria: (label) => `Select connective ${label}`,
    treeNodeDisplayAria: (label, value) =>
      value ? `${label}, ${value}` : label,
    continue: 'Continue',
    nextExercise: 'Next exercise',
    checkCounterexample: 'Check assignment',
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
    assignmentHint: 'Toucher V ou F pour fixer la valeur de chaque variable.',
    atomGroupAria: (atom) => `Valeur de vérité de ${atom}`,
    atomSetTrueAria: (atom) => `Mettre ${atom} à vrai (V)`,
    atomSetFalseAria: (atom) => `Mettre ${atom} à faux (F)`,
    cellFillAria: (rowNumber) => `Remplir le résultat de la ligne ${rowNumber}`,
    formulaTreeAria: 'Arbre de décomposition de la formule',
    formulaDisplayAria: 'Formule',
    treeNodeSelectAria: (label) => `Sélectionner le connecteur ${label}`,
    treeNodeDisplayAria: (label, value) =>
      value ? `${label}, ${value}` : label,
    continue: 'Continuer',
    nextExercise: 'Exercice suivant',
    checkCounterexample: 'Vérifier l\'interprétation',
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

export type TranslationUiCopy={atomKeyTitle:string;previewTitle:string;previewAria:string;previewEmpty:string;check:string;compileHint:(c:string)=>string};const TRANSLATION_UI:Record<Locale,TranslationUiCopy>={en:{atomKeyTitle:'Sentence letters',previewTitle:'Your formula',previewAria:'Preview',previewEmpty:'Tap symbols below.',check:'Check',compileHint:(c)=>c==='unbalanced-parens'?'Unbalanced parentheses.':'Keep building.'},fr:{atomKeyTitle:'Variables',previewTitle:'Votre formule',previewAria:'Aperçu',previewEmpty:'Touchez les symboles.',check:'Vérifier',compileHint:(c)=>c==='unbalanced-parens'?'Parenthèses déséquilibrées.':'Continuez.'}};export function translationUi(l:Locale){return TRANSLATION_UI[l];}
export function getExerciseCopy(locale: Locale, exerciseId: string): ExerciseCopy {
  const copy = EXERCISE_COPY[locale][exerciseId];
  if (!copy) {
    throw new Error(`Missing exercise copy for ${exerciseId} (${locale})`);
  }
  return copy;
}

export function getCellFeedback(locale: Locale, exerciseId: string, correct: boolean): string {
  const copy = getExerciseCopy(locale, exerciseId);
  return correct
    ? (copy.cellCorrect ?? FEEDBACK_DEFAULTS[locale].correct)
    : (copy.cellWrong ?? FEEDBACK_DEFAULTS[locale].correct);
}

export function getCounterFeedback(locale: Locale, exerciseId: string, correct: boolean): string {
  const copy = getExerciseCopy(locale, exerciseId);
  return correct
    ? (copy.counterCorrect ?? FEEDBACK_DEFAULTS[locale].correct)
    : (copy.counterWrong ?? FEEDBACK_DEFAULTS[locale]['counterexample-miss']);
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
  level1Heading: string;
  level1Status: (done: number, total: number) => string;
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
  exerciseLockedUnit1: string;
  level0ExercisesHeading: string;
  level1ExercisesHeading: string;
  syncHeading: string;
  syncHint: string;
  exportProgress: string;
  importProgress: string;
  importSuccess: string;
  importError: string;
  progressItemAria: (label: string, status: string) => string;
  modeProgressAria: string;
  whatNextTitle: string;
  whatNextWeakestSkill: (skill: string, rate: number) => string;
  whatNextNextExercise: (exerciseId: string) => string;
  whatNextReviewDue: (count: number) => string;
  whatNextResumeLesson: (lesson: string) => string;
  whatNextResumePractice: string;
  whatNextResumeProgress: string;
  whatNextPracticeSkill: string;
  whatNextStartExercise: string;
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
    level1Heading: 'Connectives unit',
    level1Status: (done, total) => `${done} of ${total} sections complete`,
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
        : id === 'practice:fill-truth-table-cell'
          ? 'Truth-table cells'
          : id === 'practice:translate-en-to-formula'
            ? 'English to formula'
            : id === 'practice:identify-main-connective'
              ? 'Main connective'
              : id,
    errorLabel: (tag) => FEEDBACK_DEFAULTS_EN[tag].split('.')[0],
    rateLabel: (rate, attempts) => `${Math.round(rate * 100)}% over ${attempts} attempts`,
    lessonDone: 'done',
    lessonTodo: 'remaining',
    exerciseDone: 'done',
    exerciseLocked: 'locked',
    exerciseLockedUnit1: 'Unit 1',
    level0ExercisesHeading: 'Unit 0 exercises',
    level1ExercisesHeading: 'Unit 1 exercises',
    syncHeading: 'Another device',
    syncHint: 'Export on this device, then import the file where you want to continue.',
    exportProgress: 'Export progress',
    importProgress: 'Import progress',
    importSuccess: 'Progress restored. You can pick up where you left off.',
    importError: 'That file could not be read. Choose an Externalize progress export.',
    progressItemAria: (label, status) => `${label}, ${status}`,
    modeProgressAria: 'Progress',
    whatNextTitle: 'What next?',
    whatNextWeakestSkill: (skill, rate) => `${skill} is at ${rate}% — a few targeted exercises should help.`,
    whatNextNextExercise: (id) => `Next up: ${id}.`,
    whatNextReviewDue: (count) => `${count} exercise${count === 1 ? '' : 's'} scheduled for review.`,
    whatNextResumeLesson: (lesson) => `Continue the course at “${lesson}”.`,
    whatNextResumePractice: 'Pick up your last exercise session.',
    whatNextResumeProgress: 'Start or continue the introductory unit.',
    whatNextPracticeSkill: 'Practice this skill',
    whatNextStartExercise: 'Start exercise',
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
    level1Heading: 'Unité connecteurs',
    level1Status: (done, total) => `${done} section${done > 1 ? 's' : ''} sur ${total} terminée${done > 1 ? 's' : ''}`,
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
        : id === 'practice:fill-truth-table-cell'
          ? 'Cases de table de vérité'
          : id === 'practice:translate-en-to-formula'
            ? 'Anglais → formule'
            : id === 'practice:identify-main-connective'
              ? 'Connecteur principal'
              : id,
    errorLabel: (tag) => FEEDBACK_DEFAULTS_FR[tag].split('.')[0],
    rateLabel: (rate, attempts) => `${Math.round(rate * 100)} % sur ${attempts} essai${attempts > 1 ? 's' : ''}`,
    lessonDone: 'fait',
    lessonTodo: 'reste',
    exerciseDone: 'fait',
    exerciseLocked: 'fermé',
    exerciseLockedUnit1: 'Unité 1',
    level0ExercisesHeading: 'Exercices — unité 0',
    level1ExercisesHeading: 'Exercices — unité 1',
    syncHeading: 'Autre appareil',
    syncHint: 'Exportez ici, puis importez le fichier sur l\'appareil où vous voulez reprendre.',
    exportProgress: 'Exporter le parcours',
    importProgress: 'Importer un parcours',
    importSuccess: 'Parcours restauré. Vous pouvez reprendre.',
    importError: 'Fichier illisible. Choisissez une exportation Externalize.',
    progressItemAria: (label, status) => `${label}, ${status}`,
    modeProgressAria: 'Parcours',
    whatNextTitle: 'Et ensuite ?',
    whatNextWeakestSkill: (skill, rate) => `${skill} : ${rate} % — quelques exercices ciblés devraient aider.`,
    whatNextNextExercise: (id) => `Prochain exercice : ${id}.`,
    whatNextReviewDue: (count) => `${count} exercice${count > 1 ? 's' : ''} à revoir.`,
    whatNextResumeLesson: (lesson) => `Reprendre le cours à « ${lesson} ».`,
    whatNextResumePractice: "Reprendre la dernière session d'exercices.",
    whatNextResumeProgress: "Commencer ou poursuivre l'unité d'introduction.",
    whatNextPracticeSkill: 'Travailler cette compétence',
    whatNextStartExercise: "Commencer l'exercice",
  },
};

export function progressUi(locale: Locale): ProgressUiCopy {
  return PROGRESS_UI[locale];
}

export type OnboardingScreenCopy={title:string;body:string;visual?:string};
export type OnboardingUiCopy={stepLabel:(c:number,t:number)=>string;next:string;skip:string;getStarted:string;screens:OnboardingScreenCopy[]};
const ONBOARDING_UI:Record<Locale,OnboardingUiCopy>={en:{stepLabel:(c,t)=>`${c} of ${t}`,next:'Next',skip:'Skip intro',getStarted:'Get started',screens:[{title:'See the structure',body:'Formulas are easier when structure is visible. Externalize shows how connectives bind sub-expressions and how truth values flow — so you do not have to hold it all in memory.',visual:'<div class="onboarding-tree-demo"><span class="onboarding-tree-node root">∧</span><div class="onboarding-tree-row"><span class="onboarding-tree-node">P</span><span class="onboarding-tree-node">Q</span></div></div>'},{title:'Tap V or F',body:'Each sentence letter gets True/False segments. Tap to set values and watch the formula evaluate step by step in the vertical tree.',visual:'<div class="onboarding-segment-demo"><span class="onboarding-segment-label">P</span><span class="onboarding-segment active">T</span><span class="onboarding-segment">F</span></div>'},{title:'Your progress stays here',body:'The Progress tab tracks lessons, exercises, and skills that need work. Everything is stored on this device — export anytime to move to another phone.',visual:'<div class="onboarding-nav-demo"><span class="onboarding-nav-item">Course</span><span class="onboarding-nav-item">Exercises</span><span class="onboarding-nav-item active">Progress</span></div>'}]},fr:{stepLabel:(c,t)=>`${c} sur ${t}`,next:'Suivant',skip:"Passer l'intro",getStarted:'Commencer',screens:[{title:'Voir la structure',body:"Une formule est plus lisible quand sa structure est externalisée. Externalize montre comment les connecteurs lient les sous-formules et comment les valeurs de vérité se propagent — sans tout retenir en mémoire.",visual:'<div class="onboarding-tree-demo"><span class="onboarding-tree-node root">∧</span><div class="onboarding-tree-row"><span class="onboarding-tree-node">P</span><span class="onboarding-tree-node">Q</span></div></div>'},{title:'Appuyez sur V ou F',body:"Chaque variable propositionnelle a des segments V/F. Touchez pour fixer une interprétation et suivre l'évaluation dans l'arbre vertical.",visual:'<div class="onboarding-segment-demo"><span class="onboarding-segment-label">P</span><span class="onboarding-segment active">V</span><span class="onboarding-segment">F</span></div>'},{title:'Votre parcours ici',body:"L'onglet Parcours suit les sections, les exercices et les compétences à consolider. Tout reste sur cet appareil — exportez pour continuer ailleurs.",visual:'<div class="onboarding-nav-demo"><span class="onboarding-nav-item">Cours</span><span class="onboarding-nav-item">Exercices</span><span class="onboarding-nav-item active">Parcours</span></div>'}]}};
export function onboardingUi(locale: Locale): OnboardingUiCopy { return ONBOARDING_UI[locale]; }
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
