import type { Locale } from './locale';
import type { ExerciseCopy } from './messages';
import type { LessonCopy } from './lessons';

export const SOURCE_LESSONS: Record<Locale, Record<string, LessonCopy>> = {
  en: {
    'lat-conditional-bridge': {
      title: 'An empty club',
      subtitle: 'A general claim when nobody is there.',
      card: {
        title: 'Every member signed the register',
        body: [
          'Imagine a club that currently has no members.',
          'Someone claims: every member signed the register.',
          'Stay with the situation as it is: the club is empty.',
        ],
        example: 'Club membership: (empty)\nClaim: every member signed the register.',
      },
    },
    'lat-empty-no-counterexample': {
      title: 'What would disprove it',
      subtitle: 'Looking for a member who failed to sign.',
      card: {
        title: 'Nobody failed to sign',
        body: [
          'A counterexample would be a member who did not sign the register. That would show the general claim to be false.',
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
          'Return to the empty club. “Every member signed the register” can still hold, because nobody failed to sign the register.',
          'Logicians call this truth by vacuity: the general claim is true because there is no counterexample, not because an example was produced.',
          'The name labels an idea you already have. It does not add a new requirement.',
        ],
      },
    },
    'lat-conditional-meaning': {
      title: 'If someone is a member, they signed the register',
      subtitle: 'The general claim in ordinary language.',
      card: {
        title: 'What “every member signed the register” amounts to',
        body: [
          'Return to the empty club. “Every member signed the register” is a claim about members, if there are any.',
          'In ordinary language: if someone is a member, then that person signed the register. With nobody in the club, there is no member who makes the “if” part true.',
          'That is why the general claim can still hold: it does not require a member; it only constrains members, should there be any.',
        ],
      },
    },
    'lat-conditional-notation': {
      title: 'Writing “if … then …”',
      subtitle: 'A symbol for the ordinary if–then.',
      card: {
        title: 'The arrow →',
        body: [
          'We write “if … then …” with an arrow: →.',
          'If x is F, then x is G becomes F(x) → G(x). For the club: if x is a member, then x signed the register.',
          'The arrow records the if–then you already used. It does not yet say that an F exists.',
        ],
        example: 'F(x) → G(x)',
      },
    },
    'lat-universal-meaning': {
      title: 'For every object',
      subtitle: 'The same if–then, covering each object.',
      card: {
        title: 'The general claim covers each object',
        body: [
          '“Every member signed the register” now has a precise reading: for each object, if it is a member, then it signed the register.',
          'That is the if–then you already wrote, required of every object in the domain.',
          'It still does not say that a member exists. It only says the if–then holds throughout.',
        ],
      },
    },
    'lat-quantifier-universal': {
      title: 'Writing “every”',
      subtitle: 'A symbol for covering the whole domain.',
      card: {
        title: 'The job of ∀',
        body: [
          'We write that covering-every-object claim with ∀. “Every F is G” becomes ∀x (F(x) → G(x)).',
          'Logicians call ∀ the universal quantifier. Its job is to say the if–then holds for every object.',
          'That form does not, by itself, say that an F exists.',
        ],
        example: '∀x (F(x) → G(x))',
      },
    },
    'lat-existential-meaning': {
      title: 'At least one',
      subtitle: 'A claim that needs an example.',
      card: {
        title: 'At least one member signed the register',
        body: [
          'Some claims are different. “At least one member signed the register” says there is an actual member who signed the register.',
          'If the club is empty, that claim is false. There is no one to point to.',
          'Unlike the general claim, this one requires an example in the situation.',
        ],
        example: 'Club membership: (empty)\nClaim: at least one member signed the register.',
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
          'Logicians call ∃ the existential quantifier. It requires at least one F.',
          'The symbol’s job is existence. Extra structure comes later.',
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
          'The existential commitment is in ∃. Conjunction only says that this same witness is both F and G.',
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
        title: 'Tout membre a signé le registre',
        body: [
          'Imaginez un club qui, pour l’heure, n’a aucun membre.',
          'On avance que tout membre a signé le registre.',
          'Tenez-vous-en à la situation telle qu’elle est : le club est vide.',
        ],
        example: 'Membres du club : (aucun)\nPhrase : tout membre a signé le registre.',
      },
    },
    'lat-empty-no-counterexample': {
      title: 'Ce qui la ferait chuter',
      subtitle: 'Chercher un membre qui n’aurait pas signé le registre.',
      card: {
        title: 'Personne n’a manqué de signer le registre',
        body: [
          'Un contre-exemple serait un membre qui n’a pas signé le registre. Cela montrerait que la phrase générale est fausse.',
          'Ce club n’a aucun membre : personne n’a donc manqué de signer le registre. Rien dans la situation ne s’oppose à la phrase.',
          'Voilà pourquoi une phrase générale de cette forme peut encore valoir lorsqu’aucun objet du type concerné n’existe.',
        ],
      },
    },
    'lat-name-vacuity': {
      title: 'Un nom pour ce cas',
      subtitle: 'Après le club vide, un terme de métier.',
      card: {
        title: 'Vérité par vacuité',
        body: [
          'Revenez au club vide. « Tout membre a signé le registre » peut encore valoir, parce que personne n’a manqué de signer le registre.',
          'On appelle cela un cas de vérité par vacuité : la phrase générale est vraie faute de contre-exemple, non parce qu’un exemple a été produit.',
          'Le mot nomme une idée que vous avez déjà. Il n’ajoute pas une exigence nouvelle.',
        ],
      },
    },
    'lat-conditional-meaning': {
      title: 'Si quelqu’un est membre, il a signé le registre',
      subtitle: 'La phrase générale en langue ordinaire.',
      card: {
        title: 'Ce que dit « tout membre a signé le registre »',
        body: [
          'Revenez au club vide. « Tout membre a signé le registre » porte sur les membres, s’il y en a.',
          'En langue ordinaire : si quelqu’un est membre, alors cette personne a signé le registre. Personne n’étant membre, aucune personne ne rend vraie la partie « si ».',
          'Voilà pourquoi la phrase générale peut encore valoir : elle n’exige pas un membre ; elle ne contraint que les membres, s’il y en a.',
        ],
      },
    },
    'lat-conditional-notation': {
      title: 'Écrire « si … alors … »',
      subtitle: 'Un symbole pour le si-alors ordinaire.',
      card: {
        title: 'La flèche →',
        body: [
          'On note « si … alors … » par une flèche : →.',
          'Si x est F, alors x est G s’écrit F(x) → G(x). Pour le club : si x est membre, alors x a signé le registre.',
          'La flèche consigne le si-alors déjà employé. Elle n’affirme pas encore qu’il existe un F.',
        ],
        example: 'F(x) → G(x)',
      },
    },
    'lat-universal-meaning': {
      title: 'Pour tout objet',
      subtitle: 'Le même si-alors, sur chaque objet.',
      card: {
        title: 'La phrase générale porte sur chaque objet',
        body: [
          '« Tout membre a signé le registre » a maintenant une lecture précise : pour chaque objet, s’il est membre, alors il a signé le registre.',
          'C’est le si-alors déjà écrit, exigé de tout objet du domaine.',
          'Cela ne dit toujours pas qu’il existe un membre. Cela dit seulement que le si-alors vaut partout.',
        ],
      },
    },
    'lat-quantifier-universal': {
      title: 'Écrire « tout »',
      subtitle: 'Un symbole pour couvrir le domaine entier.',
      card: {
        title: 'Le rôle de ∀',
        body: [
          'On écrit cette couverture de tout objet avec ∀. « Tout F est G » devient ∀x (F(x) → G(x)).',
          'On appelle ∀ le quantificateur universel. Il dit que le si-alors vaut pour tout objet.',
          'Cette forme n’affirme pas, à soi seul, qu’il existe un F.',
        ],
        example: '∀x (F(x) → G(x))',
      },
    },
    'lat-existential-meaning': {
      title: 'Au moins un',
      subtitle: 'Une phrase qui a besoin d’un exemple.',
      card: {
        title: 'Au moins un membre a signé le registre',
        body: [
          'D’autres phrases sont d’un autre type. « Au moins un membre a signé le registre » dit qu’il y a bel et bien un membre qui a signé le registre.',
          'Si le club est vide, cette phrase est fausse. On n’a personne à désigner.',
          'Contrairement à la phrase générale, celle-ci exige un exemple dans la situation.',
        ],
        example: 'Membres du club : (aucun)\nPhrase : au moins un membre a signé le registre.',
      },
    },
    'lat-name-existential': {
      title: 'Nommer l’exigence d’un exemple',
      subtitle: 'Après le contraste du club vide.',
      card: {
        title: 'Une assertion existentielle',
        body: [
          'On parle alors d’une assertion existentielle : elle affirme qu’au moins un objet de ce type existe.',
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
          'On appelle ∃ le quantificateur existentiel. Il exige au moins un F.',
          'Le symbole sert à l’existence. La structure supplémentaire viendra ensuite.',
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
          'L’engagement existentiel vient de ∃. La conjonction dit seulement que ce même témoin est à la fois F et G.',
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
          'Vous avez les deux lectures : une règle portant sur tout ce qui serait F, contre l’affirmation qu’il y a au moins un F. Ces lectures se séparent.',
        ],
      },
    },
    'lat-ii-26-return': {
      title: 'Retour au texte',
      subtitle: 'Ce qu’il faut surveiller en II.2.6–2.8',
      card: {
        title: 'Reporter la distinction dans Sobel',
        body: [
          'Une définition peut préciser ce qui serait vrai de tout être souverainement parfait, sans établir qu’un tel être existe.',
          'Si les prémisses n’étayent que la lecture universelle-hypothétique, elles ne donnent pas d’import existentiel. Un domaine sans être parfait peut laisser ces prémisses vraies et la conclusion existentielle fausse.',
          'Reprenez le livre au chapitre II, §§2.6–2.8, en visant ce défaut de validité, plutôt que la question latérale de savoir si l’existence est une perfection.',
        ],
      },
    },
  },
};

export const SOURCE_EXERCISES: Record<Locale, Record<string, ExerciseCopy>> = {
  en: {
    'lat-predict-empty-club': {
      progressLabel: 'Empty-club general claim',
      prompt:
        'The club has no members. Is “every member signed the register” still true?',
      choices: {
        'still-true': 'Yes — it is still true.',
        'needs-instance': 'No — there must be at least one member.',
      },
      choiceWrong:
        'Absence of members is not a counterexample. A counterexample would be a member who did not sign the register.',
      feedback: {
        correct:
          'Correct. With nobody there who failed to sign the register, the general claim stands.',
      },
    },
    'lat-retrieve-conditional': {
      context: [
        'Alex is not a club member. Alex did not sign the club register.',
        'F(x): x is a club member. G(x): x signed the club register. a refers to Alex.',
      ],
      prompt: 'Is F(a) → G(a) true or false?',
      choices: {
        holds: 'True',
        fails: 'False',
      },
      choiceWrong:
        'A conditional is false only when the if-clause is true and the then-clause is false. Here F(a) is false, so F(a) → G(a) is true.',
      feedback: {
        correct:
          'Correct. F(a) is false, so the conditional is true. A conditional is false only when the if-clause is true and the then-clause is false.',
      },
    },
    'lat-check-universal': {
      prompt: 'What does this formula claim?',
      choices: {
        universal: 'Everything in the domain that is F is G — it need not claim that an F exists.',
        existential: 'At least one F exists and is G.',
      },
      choiceWrong:
        'The outer quantifier is universal; inside its scope is an implication. ∀x (F(x) → G(x)) does not assert that any F exists.',
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
        'The existential quantifier says that at least one object satisfies what follows. The conjunction then requires that same object to be both F and G — unlike the universal-hypothetical reading.',
      feedback: {
        correct: 'Correct. ∃x (F(x) ∧ G(x)) says that at least one object is both F and G.',
      },
    },
    'lat-classify-triangle': {
      progressLabel: 'Generic “a” — triangle',
      prompt: 'How does “A triangle has three sides” typically function?',
      choices: {
        universal: 'As a general rule: anything that is a triangle has three sides.',
        existential: 'As a report that at least one triangle is present.',
      },
      choiceWrong:
        'The geometric claim states a general fact about triangles; it does not say that a triangle is present.',
      feedback: {
        correct:
          'Correct. Here “a triangle” is generic: the sentence states a general fact about triangles without asserting that any triangle is present.',
      },
    },
    'lat-classify-visitor': {
      progressLabel: 'Existential “a” — visitor',
      prompt: 'How does “A visitor is at the door” typically function?',
      choices: {
        universal: 'As a general rule about visitors in general.',
        existential: 'As a report that at least one visitor is present.',
      },
      choiceWrong:
        'This is not a general rule about visitors. It reports a particular situation: someone is at the door.',
      feedback: {
        correct: 'Correct. Here the indefinite says that a visitor exists; it is not merely a hypothetical about visitors.',
      },
    },
    'lat-formalize-readings': {
      progressLabel: 'Universal vs existential form',
      prompt: 'Which formula expresses the universal-hypothetical reading of “An F is G”?',
      choices: {
        'universal-conditional': '∀x (F(x) → G(x))',
        'existential-conjunctive': '∃x (F(x) ∧ G(x))',
      },
      choiceWrong:
        'The existential-conjunctive form already asserts that at least one F exists. The hypothetical reading uses implication under a universal quantifier.',
      feedback: {
        correct: 'Correct. The universal-hypothetical reading is the universal conditional, not the existential conjunction.',
      },
    },
    'lat-predict-descartes': {
      progressLabel: 'Descartes — existential reading',
      context: ['Descartes needs to conclude that a supremely perfect being exists.'],
      prompt: 'Which reading of “A supremely perfect being exists” actually asserts existence?',
      choices: {
        universal: 'The universal-hypothetical reading: anything supremely perfect would exist.',
        existential: 'The existential reading: there is at least one supremely perfect being.',
      },
      choiceWrong:
        'A mere general claim about perfect beings would not yet say that the domain contains one. The conclusion Descartes wants is existential.',
      feedback: {
        correct:
          'Correct. The intended conclusion is existential. A general statement about perfect beings would not by itself establish that one exists.',
      },
    },
    'lat-interrogate-premises': {
      progressLabel: 'Descartes — what the premises entail',
      prompt:
        'From “every perfect being has every perfection” and “existence is a perfection”, what follows?',
      choices: {
        instance: 'There exists a perfect being.',
        'universal-hypothetical': 'If anything is a perfect being, it exists.',
      },
      choiceWrong:
        'Those premises constrain whatever would be perfect. Without a further existence assumption, they do not show that any perfect being exists.',
      feedback: {
        correct:
          'Correct. The premises support a universal-hypothetical result. Existential import is not included.',
      },
    },
    'lat-transfer-kind': {
      progressLabel: 'Definition and existence',
      context: ['A hypergonal is defined as a figure that exists and has seventeen sides.'],
      prompt: 'Does that definition prove that a hypergonal exists?',
      choices: {
        'proves-instance': 'Yes — existence is written into the definition, so at least one hypergonal must exist.',
        'no-instance': 'No — the definition still only says what would be true of any hypergonal.',
      },
      choiceWrong:
        'Including existence in a definition does not make a corresponding object exist. The definition still only says what would be true of anything that satisfied it.',
      feedback: {
        correct:
          'Correct. Even if existence is included by stipulation, the definition still does not show that any such object exists.',
      },
    },
    'lat-mastery-empty-domain': {
      progressLabel: 'Empty-domain countermodel',
      context: ['Keep the two premises in view: every perfect being has every perfection, and existence is a perfection.'],
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
    'lat-predict-empty-club': {
      progressLabel: 'Phrase générale — club vide',
      prompt:
        'Le club n’a aucun membre. L’assertion « tout membre a signé le registre » reste-t-elle vraie ?',
      choices: {
        'still-true': 'Oui — elle reste vraie.',
        'needs-instance': 'Non — il faut au moins un membre.',
      },
      choiceWrong:
        'L’absence de membres n’est pas un contre-exemple. Un contre-exemple serait un membre qui n’a pas signé le registre.',
      feedback: {
        correct:
          'Exact. Personne n’a manqué de signer le registre : la phrase générale tient.',
      },
    },
    'lat-retrieve-conditional': {
      context: [
        'Alex n’est pas membre du club. Alex n’a pas signé le registre du club.',
        'F(x) : x est membre du club. G(x) : x a signé le registre du club. a désigne Alex.',
      ],
      prompt: 'F(a) → G(a) est-elle vraie ou fausse ?',
      choices: {
        holds: 'Vraie',
        fails: 'Fausse',
      },
      choiceWrong:
        'Une implication est fausse seulement lorsque son « si » est vrai et son « alors » est faux. Ici F(a) est faux : F(a) → G(a) est donc vraie.',
      feedback: {
        correct:
          'Exact. F(a) est faux : l’implication est donc vraie. Une implication est fausse seulement lorsque le « si » est vrai et le « alors » est faux.',
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
        'Le quantificateur extérieur est universel ; dans sa portée se trouve une implication. ∀x (F(x) → G(x)) n’affirme pas qu’un F existe.',
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
        'Le quantificateur existentiel affirme qu’au moins un objet satisfait ce qui suit. La conjonction exige ensuite que ce même objet soit à la fois F et G, contrairement à la lecture universelle-hypothétique.',
      feedback: {
        correct: 'Exact. ∃x (F(x) ∧ G(x)) affirme qu’il existe un objet qui satisfait les deux propriétés.',
      },
    },
    'lat-classify-triangle': {
      progressLabel: '« Un » générique — triangle',
      prompt: 'Comment fonctionne typiquement « Un triangle a trois côtés » ?',
      choices: {
        universal: 'Comme une règle générale : tout ce qui est triangle a trois côtés.',
        existential: 'Comme l’affirmation qu’au moins un triangle est présent.',
      },
      choiceWrong:
        'L’énoncé géométrique exprime une règle générale sur les triangles ; il n’affirme pas qu’un triangle est présent.',
      feedback: {
        correct:
          'Exact. Ici « un triangle » est générique : la phrase énonce une propriété générale des triangles sans affirmer qu’un triangle est présent.',
      },
    },
    'lat-classify-visitor': {
      progressLabel: '« Un » existentiel — visiteur',
      prompt: 'Comment fonctionne typiquement « Un visiteur est à la porte » ?',
      choices: {
        universal: 'Comme une règle générale sur les visiteurs en général.',
        existential: 'Comme l’affirmation qu’au moins un visiteur est présent.',
      },
      choiceWrong:
        'Ce n’est pas une règle générale sur les visiteurs. La phrase décrit une situation particulière : quelqu’un est à la porte.',
      feedback: {
        correct:
          'Exact. Ici, l’indéfini affirme qu’un visiteur existe ; ce n’est pas une simple hypothèse sur les visiteurs.',
      },
    },
    'lat-formalize-readings': {
      progressLabel: 'Forme universelle ou existentielle',
      prompt: 'Quelle formule formalise la lecture universelle-hypothétique de « Un F est G » ?',
      choices: {
        'universal-conditional': '∀x (F(x) → G(x))',
        'existential-conjunctive': '∃x (F(x) ∧ G(x))',
      },
      choiceWrong:
        'La forme existentielle-conjonctive affirme déjà qu’un objet existe. La lecture hypothétique utilise l’implication sous un quantificateur universel.',
      feedback: {
        correct:
          'Exact. La lecture universelle-hypothétique est l’implication universelle, non la conjonction existentielle.',
      },
    },
    'lat-predict-descartes': {
      progressLabel: 'Descartes — lecture existentielle',
      context: ['Descartes doit conclure qu’un être souverainement parfait existe.'],
      prompt: 'Quelle lecture de « Un être souverainement parfait existe » affirme réellement son existence ?',
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
          'Exact. La conclusion visée est existentielle. Une contrainte générale sur ce type d’être ne suffit pas à l’établir.',
      },
    },
    'lat-interrogate-premises': {
      progressLabel: 'Descartes — portée des prémisses',
      prompt:
        'De « tout être parfait a toutes les perfections » et « l’existence est une perfection », que s’ensuit-il ?',
      choices: {
        instance: 'Il existe un être parfait.',
        'universal-hypothetical': 'Si quelque chose est un être parfait, alors il existe.',
      },
      choiceWrong:
        'Ces prémisses contraignent ce qui serait parfait. Sans hypothèse d’existence supplémentaire, elles ne montrent pas qu’un être parfait existe.',
      feedback: {
        correct:
          'Exact. Les prémisses étayent un résultat universel-hypothétique. L’import existentiel n’y figure pas.',
      },
    },
    'lat-transfer-kind': {
      progressLabel: 'Définition et existence',
      context: ['Un hypergone est défini comme une figure qui existe et qui a dix-sept côtés.'],
      prompt: 'Cette définition prouve-t-elle qu’un hypergone existe ?',
      choices: {
        'proves-instance':
          'Oui — l’existence est inscrite dans la définition, donc il doit en exister au moins un.',
        'no-instance':
          'Non — la définition dit seulement ce qui serait vrai de tout hypergone.',
      },
      choiceWrong:
        'Inclure l’existence dans une définition ne fait pas exister un objet correspondant. La définition dit seulement ce qui serait vrai de tout objet qui la satisferait.',
      feedback: {
        correct:
          'Exact. Même si l’existence est incluse par stipulation, la définition ne montre toujours pas qu’un tel objet existe.',
      },
    },
    'lat-mastery-empty-domain': {
      progressLabel: 'Contre-modèle sans être parfait',
      context: ['Gardez les deux prémisses en vue : tout être parfait a toutes les perfections, et l’existence est une perfection.'],
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
          'Exact. Cette interprétation est un contre-modèle : les prémisses universelles-hypothétiques restent vraies, tandis que la conclusion existentielle est fausse.',
      },
    },
  },
};
