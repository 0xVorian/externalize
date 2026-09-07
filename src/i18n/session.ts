import type { Locale } from './locale';
import type { OpeningKind } from '../app/session-types';

export type SessionUiCopy = {
  productName: string;
  start: string;
  continue: string;
  resume: string;
  exit: string;
  doneForNow: string;
  doAnother: string;
  more: string;
  moreAria: string;
  position: (current: number, total: number) => string;
  positionAria: (current: number, total: number) => string;
  effort: (steps: number, minutes: number) => string;
  heading: (kind: OpeningKind) => string;
  detail: (kind: OpeningKind) => string;
  preparationDetail: string;
  completeHeading: string;
  completeBody: string;
  nextReview: (when: string) => string;
  nextReviewUnknown: string;
  idleHeading: string;
  idleBody: string;
  primaryAria: (kind: OpeningKind) => string;
  browseLearn: string;
  browseExplore: string;
  browsePractice: string;
  browseProgress: string;
};

const SESSION_UI: Record<Locale, SessionUiCopy> = {
  en: {
    productName: 'Externalize',
    start: 'Start',
    continue: 'Continue',
    resume: 'Resume',
    exit: 'Exit',
    doneForNow: 'Done for now',
    doAnother: 'Do another short round',
    more: 'More',
    moreAria: 'Course, explore, exercises, and progress',
    position: (current, total) => `${current} / ${total}`,
    positionAria: (current, total) => `Step ${current} of ${total} in this round`,
    effort: (steps, minutes) =>
      `${steps} ${steps === 1 ? 'step' : 'steps'} · about ${minutes} min`,
    heading: (kind) => {
      switch (kind) {
        case 'start':
          return 'A short logic session';
        case 'continue':
          return 'Continue your reading';
        case 'quick-review':
          return 'Ready for a quick review';
        case 'lapse-recovery':
          return 'See what stuck';
        case 'resume':
          return 'Resume this round';
        case 'idle':
          return "You're good for now";
      }
    },
    detail: (kind) => {
      switch (kind) {
        case 'start':
          return 'A few small steps. No need to set up a course first.';
        case 'continue':
          return 'Pick up the next useful bit of the argument.';
        case 'quick-review':
          return 'A short check on work that is due.';
        case 'lapse-recovery':
          return 'A brief check on ideas that have gone quiet.';
        case 'resume':
          return 'The same short round, where you left it.';
        case 'idle':
          return 'Nothing useful is due right now.';
      }
    },
    preparationDetail: 'A short preparation round',
    completeHeading: 'Done.',
    completeBody: 'You finished this round.',
    nextReview: (when) => `Next useful review: ${when}.`,
    nextReviewUnknown: 'Another short round is available whenever you want it.',
    idleHeading: "You're good for now",
    idleBody: 'Nothing useful is due right now. Stopping here is the right move.',
    primaryAria: (kind) => {
      switch (kind) {
        case 'resume':
          return 'Resume this round';
        case 'quick-review':
          return 'Start a quick review';
        case 'lapse-recovery':
          return 'See what stuck';
        case 'idle':
          return "You're good for now";
        case 'continue':
          return 'Continue this round';
        default:
          return 'Start a short logic session';
      }
    },
    browseLearn: 'Course',
    browseExplore: 'Explore formulas',
    browsePractice: 'Exercises',
    browseProgress: 'Progress',
  },
  fr: {
    productName: 'Externalize',
    start: 'Commencer',
    continue: 'Poursuivre',
    resume: 'Reprendre',
    exit: 'Quitter',
    doneForNow: 'C’est tout pour maintenant',
    doAnother: 'Enchaîner une courte séance',
    more: 'Autres outils',
    moreAria: 'Cours, exploration, exercices et parcours',
    position: (current, total) => `${current} / ${total}`,
    positionAria: (current, total) => `Étape ${current} sur ${total} de cette séance`,
    effort: (steps, minutes) =>
      `${steps} ${steps === 1 ? 'étape' : 'étapes'} · environ ${minutes} min`,
    heading: (kind) => {
      switch (kind) {
        case 'start':
          return 'Une courte séance de logique';
        case 'continue':
          return 'Poursuivre';
        case 'quick-review':
          return 'Une révision brève';
        case 'lapse-recovery':
          return 'Revoir ce qui tient encore';
        case 'resume':
          return 'Reprendre cette séance';
        case 'idle':
          return 'Rien de pressé pour l’instant';
      }
    },
    detail: (kind) => {
      switch (kind) {
        case 'start':
          return 'Quelques petites étapes. Pas besoin de régler un cours d’abord.';
        case 'continue':
          return 'Reprendre le prochain fragment utile du raisonnement.';
        case 'quick-review':
          return 'Une petite révision sur ce qui est dû.';
        case 'lapse-recovery':
          return 'Un contrôle bref sur des idées devenues lointaines.';
        case 'resume':
          return 'La même courte séance, là où vous l’aviez laissée.';
        case 'idle':
          return 'Rien d’utile n’est dû pour le moment.';
      }
    },
    preparationDetail: 'Une courte préparation',
    completeHeading: 'C’est fini.',
    completeBody: 'Cette séance est achevée.',
    nextReview: (when) => `Prochaine révision utile : ${when}.`,
    nextReviewUnknown: 'Une autre séance courte reste possible, sans obligation.',
    idleHeading: 'Rien de pressé pour l’instant',
    idleBody: 'Rien d’utile n’est dû. S’arrêter ici est tout à fait légitime.',
    primaryAria: (kind) => {
      switch (kind) {
        case 'resume':
          return 'Reprendre cette séance';
        case 'quick-review':
          return 'Commencer une révision brève';
        case 'lapse-recovery':
          return 'Revoir ce qui tient encore';
        case 'idle':
          return 'Rien de pressé pour l’instant';
        case 'continue':
          return 'Poursuivre cette séance';
        default:
          return 'Commencer une courte séance de logique';
      }
    },
    browseLearn: 'Cours',
    browseExplore: 'Explorer les formules',
    browsePractice: 'Exercices',
    browseProgress: 'Parcours',
  },
};

export function sessionUi(locale: Locale): SessionUiCopy {
  return SESSION_UI[locale];
}
