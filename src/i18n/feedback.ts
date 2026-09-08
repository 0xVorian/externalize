import type { EvaluationFeedbackResult } from '../../engine';
import type { Locale } from './locale';
import {
  formatTruthValue,
  getFeedbackTemplates as baseGetFeedbackTemplates,
  ui as baseUi,
} from './messages';

const TRANSLATION_SUCCESS: Record<Locale, Record<string, string>> = {
  en: {
    'translate-001':
      'Correct — P → Q keeps rain as the antecedent and cancellation as the consequent.',
    'translate-002':
      'Correct — ¬ has scope over the whole conjunction, giving ¬(P ∧ Q).',
    'translate-003':
      'Correct — the conditional P → Q is one conjunct, joined with R by the outer ∧.',
    'translate-004':
      'Correct — P → Q keeps the alarm sounding as the antecedent and smoke as the consequent.',
    'translate-005':
      'Correct — “if and only if” is represented by ↔, so P ↔ Q preserves the sentence structure.',
    'translate-006':
      'Correct — ¬ applies to the whole disjunction, giving ¬(P ∨ Q).',
  },
  fr: {
    'translate-001':
      'Exact — P → Q place la pluie en antécédent et l’annulation du match en conséquent.',
    'translate-002':
      'Exact — ¬ porte sur toute la conjonction, ce qui donne ¬(P ∧ Q).',
    'translate-003':
      'Exact — l’implication P → Q forme un conjoint, relié à R par la conjonction ∧ extérieure.',
    'translate-004':
      'Exact — P → Q place le déclenchement de l’alarme en antécédent et la présence de fumée en conséquent.',
    'translate-005':
      'Exact — « si et seulement si » se note ↔ : P ↔ Q conserve donc la structure de la phrase.',
    'translate-006':
      'Exact — ¬ porte sur toute la disjonction, ce qui donne ¬(P ∨ Q).',
  },
};

const TRANSLATION_REPAIR = {
  en: {
    'wrong-operator':
      'One connective does not match the sentence. Compare each English connective with the symbol doing the same job in your formula.',
    'wrong-atom':
      'One sentence letter refers to the wrong statement. Recheck the P/Q/R key before changing the connective structure.',
  },
  fr: {
    'wrong-operator':
      'Un connecteur ne correspond pas à la phrase. Comparez chaque connecteur logique de l’énoncé au symbole qui joue le même rôle dans votre formule.',
    'wrong-atom':
      'Une variable ne désigne pas la bonne proposition. Revérifiez la correspondance P/Q/R avant de modifier les connecteurs.',
  },
} as const;

export function ui(locale: Locale) {
  const copy = baseUi(locale);
  return {
    ...copy,
    // Answer controls use ordinary words; formal displays continue to use formatTruthValue.
    trueLabel: locale === 'fr' ? 'Vrai' : 'True',
    falseLabel: locale === 'fr' ? 'Faux' : 'False',
    evaluationCorrect:
      locale === 'fr'
        ? 'Exact — les valeurs intermédiaires conduisent bien à ce résultat.'
        : 'Correct — the intermediate truth values lead to this result.',
  };
}

export function getFeedbackTemplates(locale: Locale, exerciseId: string) {
  const templates = baseGetFeedbackTemplates(locale, exerciseId);

  if (exerciseId.startsWith('scope-')) {
    return {
      ...templates,
      correct:
        locale === 'fr'
          ? 'Exact — {label} a la portée la plus large : c’est donc le connecteur principal.'
          : 'Correct — {label} has the widest scope, so it is the main connective.',
    };
  }

  const translationSuccess = TRANSLATION_SUCCESS[locale][exerciseId];
  if (translationSuccess) {
    return {
      ...templates,
      correct: translationSuccess,
      ...TRANSLATION_REPAIR[locale],
    };
  }

  return templates;
}

function childValue(locale: Locale, label: string, value: boolean): string {
  return locale === 'fr'
    ? `${label} vaut ${formatTruthValue(locale, value)}`
    : `${label} is ${formatTruthValue(locale, value)}`;
}

function evaluationReason(locale: Locale, result: EvaluationFeedbackResult): string {
  const parts = result.childParts.map((part) => childValue(locale, part.label, part.value));
  const joined = parts.join(locale === 'fr' ? ' et ' : ' and ');
  const root = formatTruthValue(locale, result.rootValue);

  if (locale === 'fr') {
    switch (result.connectiveKind) {
      case 'and':
        return `${joined}. Une conjonction n’est vraie que si les deux conjoints le sont ; la formule entière vaut donc ${root}.`;
      case 'or':
        return `${joined}. Une disjonction est vraie dès qu’au moins un disjonct est vrai ; la formule entière vaut donc ${root}.`;
      case 'imp':
        return `${joined}. Une implication matérielle n’est fausse que si l’antécédent est vrai et le conséquent faux ; la formule entière vaut donc ${root}.`;
      case 'iff':
        return `${joined}. Une biconditionnelle est vraie lorsque ses deux côtés ont la même valeur ; la formule entière vaut donc ${root}.`;
      case 'not':
        return `${parts[0] ?? ''}. La négation inverse cette valeur ; la formule entière vaut donc ${root}.`;
      case 'pred':
        return `La variable propositionnelle fixe directement la valeur de la formule : ${root}.`;
      default:
        return `${joined}. La formule entière vaut ${root}.`;
    }
  }

  switch (result.connectiveKind) {
    case 'and':
      return `${joined}. A conjunction is true only when both conjuncts are true, so the whole formula is ${root}.`;
    case 'or':
      return `${joined}. A disjunction is true when at least one disjunct is true, so the whole formula is ${root}.`;
    case 'imp':
      return `${joined}. A material conditional is false only when the antecedent is true and the consequent is false, so the whole formula is ${root}.`;
    case 'iff':
      return `${joined}. A biconditional is true when both sides have the same truth value, so the whole formula is ${root}.`;
    case 'not':
      return `${parts[0] ?? ''}. Negation flips that value, so the whole formula is ${root}.`;
    case 'pred':
      return `The sentence letter directly fixes the formula’s truth value: ${root}.`;
    default:
      return `${joined}. The whole formula is ${root}.`;
  }
}

export function formatEvaluationFeedback(
  locale: Locale,
  result: EvaluationFeedbackResult,
): string {
  const reason = evaluationReason(locale, result);
  if (!result.correct) {
    return reason;
  }
  return locale === 'fr' ? `Exact — ${reason}` : `Correct — ${reason}`;
}
