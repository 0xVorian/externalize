import type { Locale } from './locale';

export type CardLessonCopy = {
  title: string;
  body: string[];
  example?: string;
};

export type WatchStepCopy = {
  assignment: Record<string, boolean>;
  explanation: string;
};

export type GuidedStepCopy =
  | { kind: 'hint'; text: string; atom: string; value: boolean }
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
  level1Title: string;
  continueUnit1: string;
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
    level1Title: 'Unit 1 — Connectives',
    continueUnit1: 'Continue to Unit 1',
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
    level1Title: 'Unité 1 — Connecteurs',
    continueUnit1: 'Passer à l\'unité 1',
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
          'On exercises, tap V or F next to each letter to set its value; the table or tree updates immediately.',
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
        { kind: 'hint', text: 'Tap T for P.', atom: 'P', value: true },
        { kind: 'hint', text: 'Good. Now tap F for Q.', atom: 'Q', value: false },
        {
          kind: 'done',
          text: 'Under P ↦ T and Q ↦ F, the conjunction P ∧ Q evaluates to F. Confirm the result column.',
        },
      ],
    },
    'level1-01-neg': {
      title: 'Negation',
      subtitle: 'The connective ¬ reverses truth value.',
      card: {
        title: '¬P — truth-functional not',
        body: [
          'Negation applies to exactly one operand. If P is true, then ¬P is false; if P is false, then ¬P is true.',
          'The negation symbol ¬ governs the expression immediately to its right — its scope is that subformula alone.',
          'Double negation returns the original value: ¬¬P has the same truth value as P under every assignment.',
        ],
        example: 'T  ⇒  F\nF  ⇒  T',
      },
    },
    'level1-02-neg-watch': {
      title: 'Worked cases: ¬P',
      subtitle: 'Two assignments for a single letter.',
      watchSteps: [
        {
          assignment: { P: true },
          explanation:
            'P is true, so negation reverses it: ¬P evaluates to F. Only the P column matters here.',
        },
        {
          assignment: { P: false },
          explanation: 'P is false; negation yields T. The highlighted row shows ¬P = T.',
        },
      ],
    },
    'level1-03-neg-guided': {
      title: 'Guided evaluation: ¬P',
      subtitle: 'Set P and read the negated result.',
      guidedSteps: [
        { kind: 'hint', text: 'Tap T for P.', atom: 'P', value: true },
        {
          kind: 'done',
          text: 'Under P ↦ T, negation gives ¬P = F. The result column should show F.',
        },
      ],
    },
    'level1-04-or': {
      title: 'Disjunction',
      subtitle: 'The connective ∨ (inclusive or).',
      card: {
        title: 'P ∨ Q — at least one disjunct true',
        body: [
          'An inclusive disjunction is true when at least one disjunct is true.',
          'It is false only when both disjuncts are false — the bottom row of a two-letter table.',
          'This is the truth-functional “or” of logic: inclusive, not exclusive. Both disjuncts may be true.',
        ],
        example: 'T ∨ T  ⇒  T\nT ∨ F  ⇒  T\nF ∨ T  ⇒  T\nF ∨ F  ⇒  F',
      },
    },
    'level1-05-or-watch': {
      title: 'Worked cases: P ∨ Q',
      subtitle: 'Four assignments; note the single falsifying row.',
      watchSteps: [
        {
          assignment: { P: true, Q: true },
          explanation: 'Both disjuncts true — certainly P ∨ Q evaluates to T.',
        },
        {
          assignment: { P: true, Q: false },
          explanation: 'P alone is true; one true disjunct suffices. The disjunction is T.',
        },
        {
          assignment: { P: false, Q: true },
          explanation: 'Q is true; again one true disjunct is enough. P ∨ Q is T.',
        },
        {
          assignment: { P: false, Q: false },
          explanation:
            'Both disjuncts false — the only case where an inclusive disjunction is F.',
        },
      ],
    },
    'level1-06-or-guided': {
      title: 'Guided evaluation: P ∨ Q',
      subtitle: 'Find the falsifying assignment.',
      guidedSteps: [
        { kind: 'hint', text: 'Tap F for P.', atom: 'P', value: false },
        { kind: 'hint', text: 'Now tap F for Q.', atom: 'Q', value: false },
        {
          kind: 'done',
          text: 'Both disjuncts false: P ∨ Q evaluates to F. This is the sole falsifying row.',
        },
      ],
    },
    'level1-07-imp': {
      title: 'Material conditional',
      subtitle: 'The connective → (if … then …, truth-functionally).',
      card: {
        title: 'P → Q — false only when P is true and Q false',
        body: [
          'A material conditional P → Q is false in exactly one case: antecedent true, consequent false.',
          'When the antecedent P is false, the conditional is true regardless of Q — including when Q is false.',
          'This truth-functional reading differs from everyday “if … then …” in some contexts; in logic it is the standard.',
        ],
        example: 'T → T  ⇒  T\nT → F  ⇒  F\nF → T  ⇒  T\nF → F  ⇒  T',
      },
    },
    'level1-08-imp-watch': {
      title: 'Worked cases: P → Q',
      subtitle: 'Four assignments; watch the T→F row.',
      watchSteps: [
        {
          assignment: { P: true, Q: true },
          explanation: 'Antecedent and consequent both true — the material conditional evaluates to T.',
        },
        {
          assignment: { P: true, Q: false },
          explanation:
            'Antecedent true, consequent false — the defining falsity case for →. P → Q is F.',
        },
        {
          assignment: { P: false, Q: true },
          explanation: 'A false antecedent makes the conditional true, even when Q is true.',
        },
        {
          assignment: { P: false, Q: false },
          explanation:
            'P false and Q false: the conditional is still T. A false antecedent does not falsify →.',
        },
      ],
    },
    'level1-09-imp-guided': {
      title: 'Guided evaluation: P → Q',
      subtitle: 'Construct the falsifying assignment.',
      guidedSteps: [
        { kind: 'hint', text: 'Tap T for P.', atom: 'P', value: true },
        { kind: 'hint', text: 'Now tap F for Q.', atom: 'Q', value: false },
        {
          kind: 'done',
          text: 'Antecedent true, consequent false — P → Q evaluates to F. Confirm the result column.',
        },
      ],
    },
    'level1-10-iff': {
      title: 'Biconditional',
      subtitle: 'The connective ↔ (if and only if).',
      card: {
        title: 'P ↔ Q — same truth value on both sides',
        body: [
          'A biconditional is true when P and Q share the same truth value — both true or both false.',
          'It is false when the components differ: one true, one false.',
          'Biconditional is often read “P if and only if Q”; it expresses mutual truth-conditional equivalence.',
        ],
        example: 'T ↔ T  ⇒  T\nT ↔ F  ⇒  F\nF ↔ T  ⇒  F\nF ↔ F  ⇒  T',
      },
    },
    'level1-11-iff-watch': {
      title: 'Worked cases: P ↔ Q',
      subtitle: 'Four assignments; matching values give T.',
      watchSteps: [
        {
          assignment: { P: true, Q: true },
          explanation: 'Both components true — same value, so P ↔ Q evaluates to T.',
        },
        {
          assignment: { P: true, Q: false },
          explanation: 'Values differ (T vs F); the biconditional is F.',
        },
        {
          assignment: { P: false, Q: true },
          explanation: 'Again the components differ; P ↔ Q is F.',
        },
        {
          assignment: { P: false, Q: false },
          explanation: 'Both false — same value — so the biconditional evaluates to T.',
        },
      ],
    },
    'level1-12-iff-guided': {
      title: 'Guided evaluation: P ↔ Q',
      subtitle: 'Build a mismatching assignment.',
      guidedSteps: [
        { kind: 'hint', text: 'Tap T for P.', atom: 'P', value: true },
        { kind: 'hint', text: 'Now tap F for Q.', atom: 'Q', value: false },
        {
          kind: 'done',
          text: 'P true, Q false — values differ, so P ↔ Q evaluates to F.',
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
          'Aux exercices, toucher V ou F à côté de chaque variable ; le tableau ou l\'arbre se met à jour aussitôt.',
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
        { kind: 'hint', text: 'Toucher V pour P.', atom: 'P', value: true },
        { kind: 'hint', text: 'Très bien. Toucher F pour Q.', atom: 'Q', value: false },
        {
          kind: 'done',
          text: 'Sous P ↦ V et Q ↦ F, la conjonction P ∧ Q est F. Vérifiez la colonne résultat.',
        },
      ],
    },
    'level1-01-neg': {
      title: 'La négation',
      subtitle: 'Le connecteur ¬ inverse la valeur de vérité.',
      card: {
        title: '¬P — la négation truth-fonctionnelle',
        body: [
          'La négation s\'applique à un seul argument. Si P est vrai, ¬P est faux ; si P est faux, ¬P est vrai.',
          'Le symbole ¬ gouverne l\'expression immédiatement à sa droite — sa portée est cette sous-formule seule.',
          'La double négation restitue la valeur initiale : ¬¬P a la même valeur que P sous toute interprétation.',
        ],
        example: 'V  ⇒  F\nF  ⇒  V',
      },
    },
    'level1-02-neg-watch': {
      title: 'Cas typiques : ¬P',
      subtitle: 'Deux interprétations pour une seule variable.',
      watchSteps: [
        {
          assignment: { P: true },
          explanation:
            'P est vrai : la négation l\'inverse, donc ¬P vaut F. Seule la colonne P compte ici.',
        },
        {
          assignment: { P: false },
          explanation: 'P est faux ; la négation donne V. La ligne surlignée montre ¬P = V.',
        },
      ],
    },
    'level1-03-neg-guided': {
      title: 'À vous : évaluer ¬P',
      subtitle: 'Fixez P et lisez le résultat nié.',
      guidedSteps: [
        { kind: 'hint', text: 'Toucher V pour P.', atom: 'P', value: true },
        {
          kind: 'done',
          text: 'Sous P ↦ V, la négation donne ¬P = F. La colonne résultat doit afficher F.',
        },
      ],
    },
    'level1-04-or': {
      title: 'La disjonction',
      subtitle: 'Le connecteur ∨ (ou inclusif).',
      card: {
        title: 'P ∨ Q — au moins un argument vrai',
        body: [
          'Une disjonction inclusive est vraie dès qu\'au moins un argument est vrai.',
          'Elle est fausse uniquement lorsque les deux arguments sont faux — la dernière ligne d\'un tableau à deux variables.',
          'C\'est le « ou » truth-fonctionnel de la logique : inclusif, non exclusif. Les deux arguments peuvent être vrais.',
        ],
        example: 'V ∨ V  ⇒  V\nV ∨ F  ⇒  V\nF ∨ V  ⇒  V\nF ∨ F  ⇒  F',
      },
    },
    'level1-05-or-watch': {
      title: 'Cas typiques : P ∨ Q',
      subtitle: 'Quatre interprétations ; une seule ligne fausse.',
      watchSteps: [
        {
          assignment: { P: true, Q: true },
          explanation: 'Les deux arguments vrais : P ∨ Q vaut V.',
        },
        {
          assignment: { P: true, Q: false },
          explanation: 'P seul est vrai ; un argument vrai suffit. La disjonction est V.',
        },
        {
          assignment: { P: false, Q: true },
          explanation: 'Q est vrai ; encore une fois, un argument vrai suffit. P ∨ Q est V.',
        },
        {
          assignment: { P: false, Q: false },
          explanation:
            'Les deux arguments faux — le seul cas où une disjonction inclusive est F.',
        },
      ],
    },
    'level1-06-or-guided': {
      title: 'À vous : évaluer P ∨ Q',
      subtitle: 'Trouvez l\'interprétation falsifiante.',
      guidedSteps: [
        { kind: 'hint', text: 'Toucher F pour P.', atom: 'P', value: false },
        { kind: 'hint', text: 'Toucher F pour Q.', atom: 'Q', value: false },
        {
          kind: 'done',
          text: 'Les deux arguments faux : P ∨ Q est F. C\'est la seule ligne falsifiante.',
        },
      ],
    },
    'level1-07-imp': {
      title: 'L\'implication matérielle',
      subtitle: 'Le connecteur → (si … alors …, au sens truth-fonctionnel).',
      card: {
        title: 'P → Q — fausse seulement si P vrai et Q faux',
        body: [
          'Une implication matérielle P → Q est fausse dans un seul cas : antécédent vrai, conséquent faux.',
          'Si l\'antécédent P est faux, l\'implication est vraie quelle que soit la valeur de Q — y compris si Q est faux.',
          'Ce sens truth-fonctionnel diffère parfois du « si … alors … » du langage courant ; en logique formelle, c\'est la convention.',
        ],
        example: 'V → V  ⇒  V\nV → F  ⇒  F\nF → V  ⇒  V\nF → F  ⇒  V',
      },
    },
    'level1-08-imp-watch': {
      title: 'Cas typiques : P → Q',
      subtitle: 'Quatre interprétations ; observez la ligne V→F.',
      watchSteps: [
        {
          assignment: { P: true, Q: true },
          explanation: 'Antécédent et conséquent vrais : l\'implication matérielle vaut V.',
        },
        {
          assignment: { P: true, Q: false },
          explanation:
            'Antécédent vrai, conséquent faux — le cas définitoire de falsité pour →. P → Q est F.',
        },
        {
          assignment: { P: false, Q: true },
          explanation: 'Un antécédent faux rend l\'implication vraie, même si Q est vrai.',
        },
        {
          assignment: { P: false, Q: false },
          explanation:
            'P faux et Q faux : l\'implication reste V. Un antécédent faux ne falsifie pas →.',
        },
      ],
    },
    'level1-09-imp-guided': {
      title: 'À vous : évaluer P → Q',
      subtitle: 'Construisez l\'interprétation falsifiante.',
      guidedSteps: [
        { kind: 'hint', text: 'Toucher V pour P.', atom: 'P', value: true },
        { kind: 'hint', text: 'Toucher F pour Q.', atom: 'Q', value: false },
        {
          kind: 'done',
          text: 'Antécédent vrai, conséquent faux — P → Q est F. Vérifiez la colonne résultat.',
        },
      ],
    },
    'level1-10-iff': {
      title: 'L\'équivalence',
      subtitle: 'Le connecteur ↔ (si et seulement si).',
      card: {
        title: 'P ↔ Q — mêmes valeurs de vérité',
        body: [
          'Une équivalence est vraie lorsque P et Q ont la même valeur — tous deux vrais ou tous deux faux.',
          'Elle est fausse lorsque les composants diffèrent : l\'un vrai, l\'autre faux.',
          'On lit souvent « P si et seulement si Q » ; c\'est une équivalence truth-fonctionnelle mutuelle.',
        ],
        example: 'V ↔ V  ⇒  V\nV ↔ F  ⇒  F\nF ↔ V  ⇒  F\nF ↔ F  ⇒  V',
      },
    },
    'level1-11-iff-watch': {
      title: 'Cas typiques : P ↔ Q',
      subtitle: 'Quatre interprétations ; valeurs identiques → V.',
      watchSteps: [
        {
          assignment: { P: true, Q: true },
          explanation: 'Les deux composants vrais — même valeur, donc P ↔ Q vaut V.',
        },
        {
          assignment: { P: true, Q: false },
          explanation: 'Valeurs différentes (V vs F) ; l\'équivalence est F.',
        },
        {
          assignment: { P: false, Q: true },
          explanation: 'Encore des valeurs différentes ; P ↔ Q est F.',
        },
        {
          assignment: { P: false, Q: false },
          explanation: 'Tous deux faux — même valeur — l\'équivalence vaut V.',
        },
      ],
    },
    'level1-12-iff-guided': {
      title: 'À vous : évaluer P ↔ Q',
      subtitle: 'Construisez une interprétation discordante.',
      guidedSteps: [
        { kind: 'hint', text: 'Toucher V pour P.', atom: 'P', value: true },
        { kind: 'hint', text: 'Toucher F pour Q.', atom: 'Q', value: false },
        {
          kind: 'done',
          text: 'P vrai, Q faux — valeurs différentes, donc P ↔ Q est F.',
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
