import type { Locale } from './locale';
import type { ExerciseCopy } from './messages';
import type { LessonCopy } from './lessons';

export const SOURCE_LESSONS: Record<Locale, Record<string, LessonCopy>> = {
  en: {
    'lat-conditional-bridge': {
      title: 'An empty club',
      subtitle: 'A general claim when nobody is there.',
      card: {
        title: 'Every member signed',
        body: [
          'Imagine a club that currently has no members. Consider the claim: every member signed the register.',
          'Nobody signed, because there is nobody there to sign. Does that make the claim false, or can it still hold?',
          'Stay with the situation as it is: the club is empty.',
        ],
        example: 'Club membership: (empty)\nClaim: every member signed.',
      },
    },
    'lat-empty-no-counterexample': {
      title: 'What would disprove it',
      subtitle: 'Looking for a member who failed to sign.',
      card: {
        title: 'Nobody failed to sign',
        body: [
          'A counterexample would be a member who did not sign. That would show the general claim to be false.',
          'This club has no members, so there is nobody who failed to sign. Nothing in the situation stands against the claim.',
          'That is why a general claim of this shape can still hold when there is nothing of the relevant kind around.',
        ],
      },
    },
    'lat-name-vacuity': {
      title: 'A name for this case',
      subtitle: 'After the empty club, a term of art.',
      card: {
        title: 'Truth by vacuity',
        body: [
          'Return to the empty club. “Every member signed” can still hold, because nobody failed to sign.',
          'Logicians call this truth by vacuity: the general claim is true because there is no counterexample, not because an example was produced.',
          'The name labels an idea you already have. It does not add a new requirement.',
        ],
      },
    },
    'lat-quantifier-universal': {
      title: 'Writing “every”',
      subtitle: 'A symbol for the general claim.',
      card: {
        title: 'The job of ∀',
        body: [
          'The same general claim is written with ∀. “Every F is G” becomes ∀x (F(x) → G(x)): anything that is F is G.',
          'Logicians call ∀ the universal quantifier. Its job is to cover the whole domain: whatever is F, it is G.',
          'That form does not, by itself, say that an F exists.',
        ],
        example: '∀x (F(x) → G(x))',
      },
    },
    'lat-existential-meaning': {
      title: 'At least one',
      subtitle: 'A claim that needs an example.',
      card: {
        title: 'At least one member signed',
        body: [
          'Some claims are different. “At least one member signed” says there is an actual member who signed.',
          'If the club is empty, that claim is false. There is no one to point to.',
          'Unlike the general claim, this one requires an example in the situation.',
        ],
        example: 'Club membership: (empty)\nClaim: at least one member signed.',
      },
    },
    'lat-name-existential': {
      title: 'Naming the demand for an example',
      subtitle: 'After the empty-club contrast.',
      card: {
        title: 'An existential claim',
        body: [
          'Logicians call a claim of that shape an existential claim: it reports that at least one such thing is there.',
          'The point is the demand for an example, not a new puzzle. You already saw it fail in the empty club.',
          'Keep that contrast: a general rule can hold with nobody there; an existential claim cannot.',
        ],
      },
    },
    'lat-quantifier-existential': {
      title: 'Writing “at least one”',
      subtitle: 'A symbol for the existential claim.',
      card: {
        title: 'The job of ∃',
        body: [
          'We write “there is at least one F” with ∃. It looks like this: ∃x F(x).',
          'Logicians call ∃ the existential quantifier. Existential commitment comes from that quantifier: it asserts a witness.',
          'The symbol’s job is existence. Do not yet add extra structure.',
        ],
        example: '∃x F(x)',
      },
    },
    'lat-existential-conjunction': {
      title: 'One and the same',
      subtitle: 'Existence first, then both properties.',
      card: {
        title: 'The same witness for two properties',
        body: [
          'Sometimes we need more than bare existence. ∃x (F(x) ∧ G(x)) says there is at least one object that is both F and G.',
          'Conjunction requires that the same witness have both properties. It does not create existence; ∃ already did that.',
          'By contrast, ∀x (F(x) → G(x)) can still hold when nothing is F.',
        ],
        example: '∃x (F(x) ∧ G(x))',
      },
    },
    'lat-ii-26-context': {
      title: 'Descartes and existential import',
      subtitle: 'Sobel, Logic and Theism, II.2.6–2.8',
      card: {
        title: 'Where this sits in the book',
        body: [
          'This preparation was for Chapter II §§2.6–2.8 (pp. 35–40), where Sobel examines Descartes’ ontological argument.',
          'The local issue is not whether existence is a property. It is whether a general claim about perfect beings already says that one exists.',
          'You have the two readings: a rule for whatever would be F, versus a report that at least one F is present. Those readings come apart.',
        ],
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
    'lat-conditional-bridge': {
      title: 'Un club sans membres',
      subtitle: 'Une phrase générale quand personne n’est là.',
      card: {
        title: 'Tout membre a signé',
        body: [
          'Imaginez un club qui, pour l’heure, n’a aucun membre. On avance que tout membre a signé le registre.',
          'Personne n’a signé, puisqu’il n’y a personne. Cela rend-il la phrase fausse, ou peut-elle encore valoir ?',
          'Tenez-vous-en à la situation telle qu’elle est : le club est vide.',
        ],
        example: 'Membres du club : (aucun)\nPhrase : tout membre a signé.',
      },
    },
    'lat-empty-no-counterexample': {
      title: 'Ce qui la ferait chuter',
      subtitle: 'Chercher un membre qui n’aurait pas signé.',
      card: {
        title: 'Personne n’a manqué de signer',
        body: [
          'Un contre-exemple serait un membre qui n’a pas signé. Cela montrerait que la phrase générale est fausse.',
          'Ce club n’a aucun membre : personne n’a donc manqué de signer. Rien dans la situation ne s’oppose à la phrase.',
          'Voilà pourquoi une phrase générale de cette forme peut encore valoir lorsqu’il n’y a rien du genre pertinent.',
        ],
      },
    },
    'lat-name-vacuity': {
      title: 'Un nom pour ce cas',
      subtitle: 'Après le club vide, un terme de métier.',
      card: {
        title: 'Vérité par vacuité',
        body: [
          'Revenez au club vide. « Tout membre a signé » peut encore valoir, parce que personne n’a manqué de signer.',
          'On appelle cela un cas de vérité par vacuité : la phrase générale est vraie faute de contre-exemple, non parce qu’un exemple a été produit.',
          'Le mot nomme une idée que vous avez déjà. Il n’ajoute pas une exigence nouvelle.',
        ],
      },
    },
    'lat-quantifier-universal': {
      title: 'Écrire « tout »',
      subtitle: 'Un symbole pour la phrase générale.',
      card: {
        title: 'Le rôle de ∀',
        body: [
          'La même phrase générale s’écrit avec ∀. « Tout F est G » devient ∀x (F(x) → G(x)) : tout objet qui est F est G.',
          'On appelle ∀ le quantificateur universel. Il porte sur le domaine tout entier : ce qui est F est G.',
          'Cette forme n’affirme pas, à soi seul, qu’il existe un F.',
        ],
        example: '∀x (F(x) → G(x))',
      },
    },
    'lat-existential-meaning': {
      title: 'Au moins un',
      subtitle: 'Une phrase qui a besoin d’un exemple.',
      card: {
        title: 'Au moins un membre a signé',
        body: [
          'D’autres phrases sont d’un autre type. « Au moins un membre a signé » dit qu’il y a bel et bien un membre qui a signé.',
          'Si le club est vide, cette phrase est fausse. On n’a personne à désigner.',
          'Contrairement à la phrase générale, celle-ci exige un exemple dans la situation.',
        ],
        example: 'Membres du club : (aucun)\nPhrase : au moins un membre a signé.',
      },
    },
    'lat-name-existential': {
      title: 'Nommer l’exigence d’un exemple',
      subtitle: 'Après le contraste du club vide.',
      card: {
        title: 'Une assertion existentielle',
        body: [
          'On parle alors d’une assertion existentielle : elle rapporte qu’il y a au moins une chose de ce genre.',
          'L’enjeu est l’exigence d’un exemple, non une énigme nouvelle. Vous l’avez déjà vue échouer dans le club vide.',
          'Gardez le contraste : une règle générale peut valoir sans personne ; une assertion existentielle, non.',
        ],
      },
    },
    'lat-quantifier-existential': {
      title: 'Écrire « au moins un »',
      subtitle: 'Un symbole pour l’assertion existentielle.',
      card: {
        title: 'Le rôle de ∃',
        body: [
          'On écrit « il existe au moins un F » avec ∃. Cela donne ∃x F(x).',
          'On appelle ∃ le quantificateur existentiel. L’engagement existentiel vient de ce quantificateur : il pose l’existence d’un témoin.',
          'Le symbole sert à l’existence. N’ajoutez pas encore de structure supplémentaire.',
        ],
        example: '∃x F(x)',
      },
    },
    'lat-existential-conjunction': {
      title: 'Un seul et même objet',
      subtitle: 'D’abord l’existence, puis les deux propriétés.',
      card: {
        title: 'Le même témoin pour deux propriétés',
        body: [
          'Parfois l’existence ne suffit pas. ∃x (F(x) ∧ G(x)) dit qu’il y a au moins un objet à la fois F et G.',
          'La conjonction exige que le même témoin ait les deux propriétés. Elle n’instaure pas l’existence ; ∃ l’a déjà posée.',
          'À l’inverse, ∀x (F(x) → G(x)) peut encore valoir sans aucun F.',
        ],
        example: '∃x (F(x) ∧ G(x))',
      },
    },
    'lat-ii-26-context': {
      title: 'Descartes et l’import existentiel',
      subtitle: 'Sobel, Logic and Theism, II.2.6–2.8',
      card: {
        title: 'Où l’on se trouve dans l’ouvrage',
        body: [
          'Cette préparation vise les §§2.6–2.8 du chapitre II (p. 35–40), où Sobel examine l’argument ontologique cartésien.',
          'La difficulté locale n’est pas de savoir si l’existence est une propriété. C’est de savoir si une règle générale sur les êtres parfaits dit déjà qu’il en existe un.',
          'Vous avez les deux lectures : une règle portant sur tout ce qui serait F, contre le rapport qu’il y a au moins un F. Ces lectures se séparent.',
        ],
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
          'Reprenez le livre au chapitre II, §§2.6–2.8, en visant ce défaut de validité, plutôt que la question latérale de savoir si l’existence est une perfection.',
        ],
      },
    },
  },
};

export const SOURCE_EXERCISES: Record<Locale, Record<string, ExerciseCopy>> = {
  en: {
    'lat-retrieve-conditional': {
      prompt:
        'The club has no members. Is “every member signed the register” still true?',
      choices: {
        'vacuous-true': 'Yes — nobody failed to sign, so nothing contradicts the claim.',
        existential: 'No — a true general claim requires at least one member.',
      },
      choiceWrong:
        'Absence of members is not a counterexample. A counterexample would be a member who did not sign.',
      feedback: {
        correct:
          'Correct. With nobody there who failed to sign, the general claim stands.',
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
        'The existential quantifier asserts a witness. Conjunction then requires that this same object be both F and G — unlike the universal-hypothetical reading.',
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
        'The geometric claim is a general rule for the kind, not an announcement that a triangle occupies the room.',
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
        'This is not a general rule about visitors. It locates a particular: someone is at the door.',
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
        correct: 'Correct. The universal-hypothetical reading is the universal conditional, not the existential conjunction.',
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
        'A mere general claim about perfect beings would not yet say that the domain contains one. The conclusion Descartes wants is existential.',
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
          'Correct. That assignment is a countermodel: the universal-hypothetical premises survive, the existential conclusion does not.',
      },
    },
  },
  fr: {
    'lat-retrieve-conditional': {
      prompt:
        'Le club n’a aucun membre. L’assertion « tout membre a signé le registre » reste-t-elle vraie ?',
      choices: {
        'vacuous-true':
          'Oui — personne n’a manqué de signer, donc rien ne contredit l’assertion.',
        existential: 'Non — une phrase générale vraie exige au moins un membre.',
      },
      choiceWrong:
        'L’absence de membres n’est pas un contre-exemple. Un contre-exemple serait un membre qui n’a pas signé.',
      feedback: {
        correct:
          'Exact. Personne n’a manqué de signer : la phrase générale tient.',
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
        'Le quantificateur existentiel pose un témoin. La conjonction exige ensuite que ce même objet soit à la fois F et G, contrairement à la lecture universelle-hypothétique.',
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
        'Ce n’est pas une règle générale sur les visiteurs. Cela localise un particulier : quelqu’un est à la porte.',
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
          'Exact. La lecture universelle-hypothétique est l’implication universelle, non la conjonction existentielle.',
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
        'Une simple contrainte générale sur les êtres parfaits ne dit pas encore que le domaine en contient un. La conclusion visée est existentielle.',
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
          'Exact. Cette interprétation est un contre-modèle : les prémisses universelles-hypothétiques survivent, la conclusion existentielle non.',
      },
    },
  },
};
