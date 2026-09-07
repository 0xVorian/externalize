import type { Locale } from './locale';
import type { ExerciseCopy } from './messages';
import type { LessonCopy } from './lessons';

export const SOURCE_LESSONS: Record<Locale, Record<string, LessonCopy>> = {
  en: {
    'lat-ii-26-context': {
      title: 'Descartes and existential import',
      subtitle: 'Sobel, Logic and Theism, II.2.6–2.8',
      card: {
        title: 'Where this sits in the book',
        body: [
          'This route prepares Chapter II §§2.6–2.8 (pp. 35–40), where Sobel examines Descartes’ ontological argument.',
          'The local logical issue is not whether existence is a property. It is whether a general or hypothetical claim about perfect beings already says that any such being exists.',
          'English “A F is G” can report a rule covering whatever is F, or it can report that at least one F is present. Those readings come apart.',
        ],
      },
    },
    'lat-conditional-bridge': {
      title: 'Conditionals without instances',
      subtitle: 'A true conditional need not supply an example.',
      card: {
        title: 'If–then does not invent an object',
        body: [
          'A material conditional P → Q is true whenever P is false. That is the vacuous case: the implication holds without P being realized.',
          'In predicate form, ∀x (F(x) → G(x)) can be true in a domain that contains no F. Every F is G is then true because there is no counterexample F that fails to be G.',
          'That is why a definition can constrain anything that would satisfy it without guaranteeing that anything does.',
        ],
        example: '∀x (F(x) → G(x))  can hold when nothing is F',
      },
    },
    'lat-quantifier-universal': {
      title: 'Universal quantification',
      subtitle: 'What ∀x says, and what it does not.',
      card: {
        title: '“Every F is G” as a universal conditional',
        body: [
          'The universal quantifier ∀x φ(x) says that the open formula φ holds of every object in the domain.',
          'The standard reading of “Every F is G” is ∀x (F(x) → G(x)): anything that is F is G. It does not, by itself, say that the domain contains an F.',
          'If the domain is empty of Fs, the universal conditional is still true. No existing F is required.',
        ],
        example: '∀x (F(x) → G(x))',
      },
    },
    'lat-quantifier-existential': {
      title: 'Existential quantification',
      subtitle: 'At least one object in the domain.',
      card: {
        title: '“Some F is G” reports an instance',
        body: [
          'The existential quantifier ∃x φ(x) says that at least one object in the domain satisfies φ.',
          '“Some F is G” is ∃x (F(x) ∧ G(x)): there is an object that is both F and G. Conjunction, not implication, carries the existential commitment.',
          'If the domain contains no F, that existential sentence is false. That is the contrast with the universal conditional.',
        ],
        example: '∃x (F(x) ∧ G(x))',
      },
    },
    'lat-ii-26-return': {
      title: 'Return to the passage',
      subtitle: 'What to watch for in II.2.6–2.8',
      card: {
        title: 'Take this distinction back to Sobel',
        body: [
          'A definition can say what would be true of any supremely perfect being without establishing that the domain contains one.',
          'If the premises only support the universal-hypothetical reading, they do not yield existential import. An empty domain of perfect beings can leave those premises true and the existential conclusion false.',
          'Continue in the book at Chapter II §§2.6–2.8 with that validity defect in view, rather than with the side-issue of whether existence is a perfection.',
        ],
      },
    },
  },
  fr: {
    'lat-ii-26-context': {
      title: 'Descartes et l’import existentiel',
      subtitle: 'Sobel, Logic and Theism, II.2.6–2.8',
      card: {
        title: 'Où l’on se trouve dans l’ouvrage',
        body: [
          'Ce parcours prépare les §§2.6–2.8 du chapitre II (p. 35–40), où Sobel examine l’argument ontologique cartésien.',
          'La difficulté logique locale n’est pas de savoir si l’existence est une propriété. C’est de savoir si une assertion générale ou hypothétique sur les êtres parfaits dit déjà qu’il en existe un.',
          'En français comme en anglais, « Un F est G » peut énoncer une règle portant sur tout F, ou rapporter qu’il y a au moins un F. Ces lectures se séparent.',
        ],
      },
    },
    'lat-conditional-bridge': {
      title: 'Implication sans instance',
      subtitle: 'Une implication vraie n’exhibe pas un exemple.',
      card: {
        title: 'Le si–alors n’introduit pas d’objet',
        body: [
          'Une implication matérielle P → Q est vraie dès que P est faux. C’est le cas vacuous : l’implication tient sans que P soit réalisé.',
          'Sous forme prédicative, ∀x (F(x) → G(x)) peut être vraie dans un domaine qui ne contient aucun F. « Tout F est G » est alors vrai faute de contre-exemple.',
          'Une définition peut donc contraindre tout ce qui la satisferait, sans garantir qu’il existe un tel objet.',
        ],
        example: '∀x (F(x) → G(x))  peut valoir sans aucun F',
      },
    },
    'lat-quantifier-universal': {
      title: 'Quantification universelle',
      subtitle: 'Ce que dit ∀x, et ce qu’il ne dit pas.',
      card: {
        title: '« Tout F est G » comme implication universelle',
        body: [
          'Le quantificateur universel ∀x φ(x) affirme que la formule ouverte φ vaut pour tout objet du domaine.',
          'La lecture standard de « Tout F est G » est ∀x (F(x) → G(x)) : tout objet qui est F est G. Cela n’affirme pas, à soi seul, qu’il existe un F.',
          'Si le domaine ne contient aucun F, l’implication universelle reste vraie. Aucune instance n’est exigée.',
        ],
        example: '∀x (F(x) → G(x))',
      },
    },
    'lat-quantifier-existential': {
      title: 'Quantification existentielle',
      subtitle: 'Au moins un objet du domaine.',
      card: {
        title: '« Quelque F est G » rapporte une instance',
        body: [
          'Le quantificateur existentiel ∃x φ(x) affirme qu’au moins un objet du domaine satisfait φ.',
          '« Quelque F est G » s’écrit ∃x (F(x) ∧ G(x)) : il y a un objet à la fois F et G. C’est la conjonction, non l’implication, qui porte l’engagement existentiel.',
          'Si le domaine ne contient aucun F, cette phrase existentielle est fausse. Tel est le contraste avec l’implication universelle.',
        ],
        example: '∃x (F(x) ∧ G(x))',
      },
    },
    'lat-ii-26-return': {
      title: 'Retour au texte',
      subtitle: 'Ce qu’il faut surveiller en II.2.6–2.8',
      card: {
        title: 'Reporter la distinction dans Sobel',
        body: [
          'Une définition peut dire ce qui vaudrait de tout être souverainement parfait, sans établir que le domaine en contient un.',
          'Si les prémisses n’étayent que la lecture universelle-hypothétique, elles ne donnent pas d’import existentiel. Un domaine sans être parfait peut laisser ces prémisses vraies et la conclusion existentielle fausse.',
          'Reprenez le livre au chapitre II, §§2.6–2.8, en visée de ce défaut de validité, plutôt que de la question latérale de savoir si l’existence est une perfection.',
        ],
      },
    },
  },
};

export const SOURCE_EXERCISES: Record<Locale, Record<string, ExerciseCopy>> = {
  en: {
    'lat-retrieve-conditional': {
      prompt:
        'If nothing in the domain is F, can ∀x (F(x) → G(x)) still be true?',
      choices: {
        'vacuous-true': 'Yes — there is no F that fails to be G, so the universal conditional holds.',
        existential: 'No — a true universal claim requires at least one F in the domain.',
      },
      choiceWrong:
        'A universal conditional can hold vacuously. Absence of Fs is not a counterexample; an F that is not G would be.',
      feedback: {
        correct:
          'Correct. With no F in the domain, ∀x (F(x) → G(x)) has no falsifying instance.',
      },
    },
    'lat-check-universal': {
      prompt: 'What does this formula claim?',
      choices: {
        universal: 'Everything in the domain that is F is G — it need not claim that an F exists.',
        existential: 'At least one F exists and is G.',
      },
      choiceWrong:
        'The main operator is universal implication, not existential conjunction. ∀x (F(x) → G(x)) does not assert an instance.',
      feedback: {
        correct: 'Correct. This is the universal-hypothetical reading: any F, if there is one, is G.',
      },
    },
    'lat-check-existential': {
      prompt: 'What does this formula claim?',
      choices: {
        universal: 'If anything is F, it is G — possibly with no F in the domain.',
        existential: 'There is at least one object that is both F and G.',
      },
      choiceWrong:
        'The conjunction inside the existential quantifier requires an actual F that is G. That is not the universal-hypothetical reading.',
      feedback: {
        correct: 'Correct. ∃x (F(x) ∧ G(x)) reports an instance.',
      },
    },
    'lat-classify-triangle': {
      prompt: 'How does “A triangle has three sides” typically function?',
      choices: {
        universal: 'As a general rule: anything that is a triangle has three sides.',
        existential: 'As a report that at least one triangle is present.',
      },
      choiceWrong:
        'The geometric claim is a covering rule for the kind, not an announcement that a triangle occupies the room.',
      feedback: {
        correct:
          'Correct. Here “a triangle” is generic: it constrains the kind, and does not by itself produce an instance.',
      },
    },
    'lat-classify-visitor': {
      prompt: 'How does “A visitor is at the door” typically function?',
      choices: {
        universal: 'As a general rule about whatever would count as a visitor.',
        existential: 'As a report that at least one visitor is present.',
      },
      choiceWrong:
        'This is not a covering generalization about visitors. It locates a particular: someone is at the door.',
      feedback: {
        correct: 'Correct. Here the indefinite reports existence, not a mere hypothetical about visitors.',
      },
    },
    'lat-formalize-readings': {
      prompt: 'Which formula captures the universal-hypothetical reading of “A F is G”?',
      choices: {
        'universal-conditional': '∀x (F(x) → G(x))',
        'existential-conjunctive': '∃x (F(x) ∧ G(x))',
      },
      choiceWrong:
        'The existential-conjunctive form already asserts an instance. The hypothetical reading uses implication under a universal quantifier.',
      feedback: {
        correct: 'Correct. The covering reading is the universal conditional, not the existential conjunction.',
      },
    },
    'lat-predict-descartes': {
      prompt:
        'Descartes needs the conclusion that a supremely perfect being exists. Which reading of “A supremely perfect being exists” would actually report existence?',
      choices: {
        universal: 'The universal-hypothetical reading: anything that was supremely perfect would exist.',
        existential: 'The existential reading: there is at least one supremely perfect being.',
      },
      choiceWrong:
        'A mere covering claim about perfect beings would not yet say that the domain contains one. The conclusion Descartes wants is existential.',
      feedback: {
        correct:
          'Correct. The intended conclusion is existential. A general constraint on the kind would not yet deliver it.',
      },
    },
    'lat-interrogate-premises': {
      prompt:
        'From “every perfect being has every perfection” and “existence is a perfection”, what follows?',
      choices: {
        instance: 'There exists a perfect being.',
        'universal-hypothetical': 'If anything is a perfect being, it exists.',
      },
      choiceWrong:
        'Those premises constrain whatever would be perfect. They do not, without a further existence assumption, put such a being in the domain.',
      feedback: {
        correct:
          'Correct. The premises support a universal-hypothetical result. Existential import is not included.',
      },
    },
    'lat-transfer-kind': {
      prompt:
        'Suppose a hypergonal is defined as a figure that exists and has seventeen sides. Does that definition prove that a hypergonal exists?',
      choices: {
        'proves-instance': 'Yes — existence is written into the definition, so an instance follows.',
        'no-instance': 'No — the definition still only says what would be true of any hypergonal.',
      },
      choiceWrong:
        'Writing existence into a kind does not instantiate the kind. The definition remains a constraint on anything that would satisfy it.',
      feedback: {
        correct:
          'Correct. An invented kind that includes existence by stipulation still does not place an object in the domain.',
      },
    },
    'lat-mastery-empty-domain': {
      prompt:
        'Let the domain contain no perfect being. What can remain true?',
      choices: {
        'universal-can-hold':
          'The universal-hypothetical reading of the premises can remain true, while the existential conclusion is false.',
        'existential-holds': 'The existential conclusion remains true, because existence is a perfection.',
      },
      choiceWrong:
        'With nothing in the domain that is perfect, an existential conclusion is false. The universal conditionals can still hold vacuously.',
      feedback: {
        correct:
          'Correct. That assignment is a countermodel: the covering premises survive, the existential conclusion does not.',
      },
    },
  },
  fr: {
    'lat-retrieve-conditional': {
      prompt:
        'Si le domaine ne contient aucun F, ∀x (F(x) → G(x)) peut-elle encore être vraie ?',
      choices: {
        'vacuous-true':
          'Oui — aucun F n’échoue à être G, donc l’implication universelle tient.',
        existential: 'Non — une assertion universelle vraie exige au moins un F dans le domaine.',
      },
      choiceWrong:
        'Une implication universelle peut valoir à vide. L’absence de F n’est pas un contre-exemple ; un F qui ne serait pas G en serait un.',
      feedback: {
        correct:
          'Exact. Sans F dans le domaine, ∀x (F(x) → G(x)) n’a pas d’instance falsifiante.',
      },
    },
    'lat-check-universal': {
      prompt: 'Que dit cette formule ?',
      choices: {
        universal:
          'Tout objet du domaine qui est F est G — sans affirmer qu’il existe un F.',
        existential: 'Il existe au moins un F, et il est G.',
      },
      choiceWrong:
        'L’opérateur principal est une implication universelle, non une conjonction existentielle. ∀x (F(x) → G(x)) n’affirme pas d’instance.',
      feedback: {
        correct:
          'Exact. C’est la lecture universelle-hypothétique : tout F, s’il y en a un, est G.',
      },
    },
    'lat-check-existential': {
      prompt: 'Que dit cette formule ?',
      choices: {
        universal: 'Si quelque chose est F, alors c’est G — éventuellement sans aucun F.',
        existential: 'Il y a au moins un objet à la fois F et G.',
      },
      choiceWrong:
        'La conjonction sous le quantificateur existentiel exige un F qui est G. Ce n’est pas la lecture universelle-hypothétique.',
      feedback: {
        correct: 'Exact. ∃x (F(x) ∧ G(x)) rapporte une instance.',
      },
    },
    'lat-classify-triangle': {
      prompt: 'Comment fonctionne typiquement « Un triangle a trois côtés » ?',
      choices: {
        universal: 'Comme une règle générale : tout ce qui est triangle a trois côtés.',
        existential: 'Comme le rapport qu’il y a au moins un triangle présent.',
      },
      choiceWrong:
        'L’assertion géométrique couvre le genre ; elle n’annonce pas qu’un triangle occupe la pièce.',
      feedback: {
        correct:
          'Exact. Ici « un triangle » est générique : il contraint le type, sans produire à lui seul une instance.',
      },
    },
    'lat-classify-visitor': {
      prompt: 'Comment fonctionne typiquement « Un visiteur est à la porte » ?',
      choices: {
        universal: 'Comme une règle générale sur ce qui compterait comme visiteur.',
        existential: 'Comme le rapport qu’il y a au moins un visiteur présent.',
      },
      choiceWrong:
        'Ce n’est pas une généralisation couvrante sur les visiteurs. Cela localise un particulier : quelqu’un est à la porte.',
      feedback: {
        correct:
          'Exact. Ici l’indéfini rapporte une existence, non une simple hypothèse sur les visiteurs.',
      },
    },
    'lat-formalize-readings': {
      prompt: 'Quelle formule capture la lecture universelle-hypothétique de « Un F est G » ?',
      choices: {
        'universal-conditional': '∀x (F(x) → G(x))',
        'existential-conjunctive': '∃x (F(x) ∧ G(x))',
      },
      choiceWrong:
        'La forme existentielle-conjonctive affirme déjà une instance. La lecture hypothétique use de l’implication sous un quantificateur universel.',
      feedback: {
        correct:
          'Exact. La lecture couvrante est l’implication universelle, non la conjonction existentielle.',
      },
    },
    'lat-predict-descartes': {
      prompt:
        'Descartes a besoin de la conclusion qu’un être souverainement parfait existe. Quelle lecture de « Un être souverainement parfait existe » rapporterait réellement une existence ?',
      choices: {
        universal:
          'La lecture universelle-hypothétique : tout ce qui serait souverainement parfait existerait.',
        existential:
          'La lecture existentielle : il y a au moins un être souverainement parfait.',
      },
      choiceWrong:
        'Une simple contrainte couvrante sur les êtres parfaits ne dit pas encore que le domaine en contient un. La conclusion visée est existentielle.',
      feedback: {
        correct:
          'Exact. La conclusion visée est existentielle. Une contrainte générale sur le genre ne la livre pas encore.',
      },
    },
    'lat-interrogate-premises': {
      prompt:
        'De « tout être parfait a toutes les perfections » et « l’existence est une perfection », que s’ensuit-il ?',
      choices: {
        instance: 'Il existe un être parfait.',
        'universal-hypothetical': 'Si quelque chose est un être parfait, alors il existe.',
      },
      choiceWrong:
        'Ces prémisses contraignent ce qui serait parfait. Elles ne placent pas, sans hypothèse d’existence supplémentaire, un tel être dans le domaine.',
      feedback: {
        correct:
          'Exact. Les prémisses étayent un résultat universel-hypothétique. L’import existentiel n’y figure pas.',
      },
    },
    'lat-transfer-kind': {
      prompt:
        'Soit un hypergone défini comme une figure qui existe et qui a dix-sept côtés. Cette définition prouve-t-elle qu’un hypergone existe ?',
      choices: {
        'proves-instance':
          'Oui — l’existence est inscrite dans la définition, donc une instance s’ensuit.',
        'no-instance':
          'Non — la définition dit seulement ce qui vaudrait de tout hypergone.',
      },
      choiceWrong:
        'Inscrire l’existence dans un genre n’instancie pas le genre. La définition reste une contrainte sur tout ce qui la satisferait.',
      feedback: {
        correct:
          'Exact. Un genre inventé qui inclut l’existence par stipulation ne place toujours pas d’objet dans le domaine.',
      },
    },
    'lat-mastery-empty-domain': {
      prompt: 'Le domaine ne contient aucun être parfait. Que peut-il rester vrai ?',
      choices: {
        'universal-can-hold':
          'La lecture universelle-hypothétique des prémisses peut rester vraie, tandis que la conclusion existentielle est fausse.',
        'existential-holds':
          'La conclusion existentielle reste vraie, parce que l’existence est une perfection.',
      },
      choiceWrong:
        'Sans rien de parfait dans le domaine, une conclusion existentielle est fausse. Les implications universelles peuvent encore valoir à vide.',
      feedback: {
        correct:
          'Exact. Cette interprétation est un contre-modèle : les prémisses couvrantes survivent, la conclusion existentielle non.',
      },
    },
  },
};
