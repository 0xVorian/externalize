import type { Locale } from './locale';

export type CardLessonCopy = {
  title: string;
  body: string[];
  example?: string;
};

export type WatchStepCopy = {
  assignment: { P: boolean; Q: boolean };
  explanation: string;
};

export type GuidedStepCopy =
  | { kind: 'hint'; text: string }
  | { kind: 'done'; text: string };

export type LessonCopy = {
  title: string;
  subtitle?: string;
  card?: CardLessonCopy;
  watchSteps?: WatchStepCopy[];
  guidedSteps?: GuidedStepCopy[];
};

export type ReferenceEntry = {
  symbol: string;
  name: string;
  summary: string;
};

export type LearnUiCopy = {
  learn: string;
  practice: string;
  practiceLocked: string;
  level0Title: string;
  lessonProgress: (current: number, total: number) => string;
  nextStep: string;
  startPractice: string;
  level0Complete: string;
  referenceTitle: string;
  referenceToggle: string;
  watchPrompt: string;
  stepLabel: (current: number, total: number) => string;
  truthTableAria: (formula: string) => string;
};

const REFERENCE: Record<Locale, ReferenceEntry[]> = {
  en: [
    {
      symbol: 'P, Q, …',
      name: 'Sentence letter',
      summary: 'Stands for an atomic statement; the smallest unit in propositional logic.',
    },
    {
      symbol: '∧',
      name: 'Conjunction',
      summary: 'Truth-functional connective: true iff both conjuncts are true.',
    },
    {
      symbol: '∨',
      name: 'Disjunction',
      summary: 'True iff at least one disjunct is true (inclusive or).',
    },
    {
      symbol: '¬',
      name: 'Negation',
      summary: 'Truth-functional negation: reverses truth value.',
    },
    {
      symbol: '→',
      name: 'Material conditional',
      summary: 'False only when the antecedent is true and the consequent false.',
    },
    {
      symbol: '↔',
      name: 'Biconditional',
      summary: 'True iff both components share the same truth value.',
    },
    {
      symbol: 'T / F',
      name: 'Truth value',
      summary: 'What a formula receives under a truth assignment to its letters.',
    },
  ],
  fr: [
    {
      symbol: 'P, Q, …',
      name: 'Variable propositionnelle',
      summary: 'Symbole pour une proposition élémentaire — une formule atomique.',
    },
    {
      symbol: '∧',
      name: 'Conjonction',
      summary: 'Connecteur vérité-fonctionnel : vrai ssi les deux arguments sont vrais.',
    },
    {
      symbol: '∨',
      name: 'Disjonction',
      summary: 'Vrai dès qu\'au moins un argument est vrai (ou inclusif).',
    },
    {
      symbol: '¬',
      name: 'Négation',
      summary: 'Nie la valeur de vérité de l\'expression qu\'elle gouverne.',
    },
    {
      symbol: '→',
      name: 'Implication matérielle',
      summary: 'Fausse uniquement si l\'antécédent est vrai et le conséquent faux.',
    },
    {
      symbol: '↔',
      name: 'Équivalence',
      summary: 'Vraie ssi les deux composants ont la même valeur de vérité.',
    },
    {
      symbol: 'V / F',
      name: 'Valeur de vérité',
      summary: 'Ce qu\'une formule reçoit sous une interprétation donnée.',
    },
  ],
};

const LEARN_UI: Record<Locale, LearnUiCopy> = {
  en: {
    learn: 'Course',
    practice: 'Exercises',
    practiceLocked: 'Complete the introductory unit before exercises unlock.',
    level0Title: 'Unit 0 — Propositional syntax',
    lessonProgress: (current, total) => `Section ${current} of ${total}`,
    nextStep: 'Continue',
    startPractice: 'Begin exercises',
    level0Complete:
      'Introductory unit complete. Exercises are unlocked — first up: evaluating P ∧ Q under an assignment.',
    referenceTitle: 'Connectives',
    referenceToggle: 'Connective reference',
    watchPrompt:
      'Each row is one assignment. Read the highlighted row, then continue to the next case.',
    stepLabel: (current, total) => `Case ${current} of ${total}`,
    truthTableAria: (formula) => `Truth table for ${formula}`,
  },
  fr: {
    learn: 'Cours',
    practice: 'Exercices',
    practiceLocked: 'Terminez l\'unité d\'introduction pour accéder aux exercices.',
    level0Title: 'Unité 0 — Syntaxe propositionnelle',
    lessonProgress: (current, total) => `Section ${current} sur ${total}`,
    nextStep: 'Continuer',
    startPractice: 'Passer aux exercices',
    level0Complete:
      'Unité d\'introduction terminée. Les exercices sont ouverts — on commence par l\'évaluation de P ∧ Q sous une interprétation.',
    referenceTitle: 'Connecteurs',
    referenceToggle: 'Référence des connecteurs',
    watchPrompt:
      'Chaque ligne correspond à une interprétation. Lisez la ligne surlignée, puis passez au cas suivant.',
    stepLabel: (current, total) => `Cas ${current} sur ${total}`,
    truthTableAria: (formula) => `Table de vérité de ${formula}`,
  },
};

const LESSONS: Record<Locale, Record<string, LessonCopy>> = {
  en: {
    'level0-01-letters': {
      title: 'Sentence letters',
      subtitle: 'Atomic statements and schematic letters.',
      card: {
        title: 'Letters stand for statements',
        body: [
          'Propositional logic treats whole statements as units. A sentence letter such as P schematically represents some statement — we leave its content unspecified.',
          'Example: P might translate “It is snowing.” Q might translate “The lecture is cancelled.” The logic concerns how statements combine, not their subject matter.',
          'Using letters lets us display form clearly: the same pattern (P ∧ Q) can represent countless pairs of statements.',
        ],
        example: 'P  ⊃  “It is snowing.”',
      },
    },
    'level0-02-truth': {
      title: 'Truth assignments',
      subtitle: 'Every statement is true or false under an interpretation.',
      card: {
        title: 'Truth values',
        body: [
          'Classical propositional logic assumes bivalence: each statement is true (T) or false (F), not both.',
          'A truth assignment specifies, for each sentence letter, which truth value it receives.',
          'Evaluating a formula means computing its truth value from the assignment, using the rules for each connective.',
        ],
        example: 'Assignment:  P ↦ T ,  Q ↦ F',
      },
    },
    'level0-03-and': {
      title: 'Conjunction',
      subtitle: 'The connective ∧ (truth-functional and).',
      card: {
        title: 'P ∧ Q — both conjuncts must be true',
        body: [
          'A conjunction is true if and only if both of its conjuncts are true.',
          'If either conjunct is false, the conjunction is false — even when the other conjunct is true.',
          'This is the truth-functional reading of “and” used in logic, not every ordinary-language use of the word.',
        ],
        example: 'T ∧ T  ⇒  T\nT ∧ F  ⇒  F\nF ∧ T  ⇒  F\nF ∧ F  ⇒  F',
      },
    },
    'level0-04-watch': {
      title: 'Worked cases: P ∧ Q',
      subtitle: 'Four assignments, displayed explicitly.',
      watchSteps: [
        {
          assignment: { P: true, Q: true },
          explanation:
            'Both conjuncts are true; therefore P ∧ Q evaluates to T. The highlighted row shows the result.',
        },
        {
          assignment: { P: true, Q: false },
          explanation:
            'Q is false, so one conjunct fails. A conjunction requires both; the formula evaluates to F.',
        },
        {
          assignment: { P: false, Q: true },
          explanation:
            'P is false. Even with Q true, the conjunction is F — falsity in either conjunct suffices.',
        },
        {
          assignment: { P: false, Q: false },
          explanation: 'Both conjuncts false; P ∧ Q evaluates to F.',
        },
      ],
    },
    'level0-05-guided': {
      title: 'Guided evaluation: P ∧ Q',
      subtitle: 'Fix an assignment yourself.',
      guidedSteps: [
        { kind: 'hint', text: 'Assign T to P (select P below).' },
        { kind: 'hint', text: 'Good. Now assign F to Q.' },
        {
          kind: 'done',
          text: 'Under P ↦ T and Q ↦ F, the conjunction P ∧ Q evaluates to F. Confirm the result column.',
        },
      ],
    },
  },
  fr: {
    'level0-01-letters': {
      title: 'Variables propositionnelles',
      subtitle: 'Propositions atomiques et schémas formels.',
      card: {
        title: 'Des lettres pour des propositions',
        body: [
          'En logique propositionnelle, on traite une proposition entière comme un bloc. Une variable P représente schématiquement une proposition dont on ne précise pas le contenu.',
          'Exemple : P pourrait se lire « Il neige. » et Q « Le cours est annulé. » La logique étudie les combinaisons de propositions, indépendamment de leur thème.',
          'Les symboles rendent la forme visible : un même schéma (P ∧ Q) peut instancier des paires de propositions très différentes.',
        ],
        example: 'P  ⊃  « Il neige. »',
      },
    },
    'level0-02-truth': {
      title: 'Interprétations et valeurs de vérité',
      subtitle: 'Vrai ou faux, sous une valuation donnée.',
      card: {
        title: 'Bivalence',
        body: [
          'En logique classique, toute proposition est vraie (V) ou fausse (F) — principe de bivalence.',
          'Une interprétation (ou valuation) attribue à chaque variable propositionnelle une valeur de vérité.',
          'Évaluer une formule, c\'est calculer sa valeur à partir de cette interprétation et des règles des connecteurs.',
        ],
        example: 'Interprétation :  P ↦ V ,  Q ↦ F',
      },
    },
    'level0-03-and': {
      title: 'La conjonction',
      subtitle: 'Le connecteur ∧ (et truth-fonctionnel).',
      card: {
        title: 'P ∧ Q — les deux arguments doivent être vrais',
        body: [
          'Une conjonction est vraie si et seulement si ses deux arguments sont vrais.',
          'Dès qu\'un argument est faux, la conjonction est fausse — même si l\'autre est vrai.',
          'C\'est le sens truth-fonctionnel de « et », celui retenu en logique formelle (distinct de certains emplois du français courant).',
        ],
        example: 'V ∧ V  ⇒  V\nV ∧ F  ⇒  F\nF ∧ V  ⇒  F\nF ∧ F  ⇒  F',
      },
    },
    'level0-04-watch': {
      title: 'Cas typiques : P ∧ Q',
      subtitle: 'Quatre interprétations, présentées une à une.',
      watchSteps: [
        {
          assignment: { P: true, Q: true },
          explanation:
            'Les deux arguments sont vrais : P ∧ Q vaut V. La ligne surlignée indique le résultat.',
        },
        {
          assignment: { P: true, Q: false },
          explanation:
            'Q est faux : la conjonction exige la véracité des deux arguments ; la formule est donc F.',
        },
        {
          assignment: { P: false, Q: true },
          explanation:
            'P est faux. Même avec Q vrai, la conjonction est F — un seul argument faux suffit.',
        },
        {
          assignment: { P: false, Q: false },
          explanation: 'Les deux arguments sont faux ; P ∧ Q est F.',
        },
      ],
    },
    'level0-05-guided': {
      title: 'À vous : évaluer P ∧ Q',
      subtitle: 'Construisez une interprétation pas à pas.',
      guidedSteps: [
        { kind: 'hint', text: 'Attribuez V à P (sélectionnez P ci-dessous).' },
        { kind: 'hint', text: 'Très bien. Attribuez maintenant F à Q.' },
        {
          kind: 'done',
          text: 'Sous P ↦ V et Q ↦ F, la conjonction P ∧ Q est F. Vérifiez la colonne résultat.',
        },
      ],
    },
  },
};

export function learnUi(locale: Locale): LearnUiCopy {
  return LEARN_UI[locale];
}

export function getLessonCopy(locale: Locale, lessonId: string): LessonCopy {
  const copy = LESSONS[locale][lessonId];
  if (!copy) {
    throw new Error(`Missing lesson copy for ${lessonId} (${locale})`);
  }
  return copy;
}

export function getReference(locale: Locale): ReferenceEntry[] {
  return REFERENCE[locale];
}
