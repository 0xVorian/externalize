import { describe, expect, it } from 'vitest';
import {
  buildEvaluationFeedback,
  checkMainConnectiveSelection,
  evaluateWithNodes,
  parse,
  toVerticalTree,
} from '../../engine';
import { EXERCISE_DEFINITIONS, type ExerciseDefinition } from '../app/exercises';
import {
  formatEvaluationFeedback,
  getCellFeedback,
  getCounterFeedback,
  getExerciseCopy,
  getFeedbackTemplates,
  getTautologyFeedback,
} from './index';
import type { Locale } from './locale';

function successFeedback(locale: Locale, exercise: ExerciseDefinition): string {
  switch (exercise.type) {
    case 'identify-main-connective': {
      const formula = parse(exercise.formula!);
      const tree = toVerticalTree(formula);
      return checkMainConnectiveSelection(
        formula,
        tree,
        tree.id,
        getFeedbackTemplates(locale, exercise.id),
      ).message;
    }
    case 'evaluate-formula': {
      if (!exercise.initialAssignment) {
        throw new Error(`Expected a reference assignment for ${exercise.id}`);
      }
      const tree = evaluateWithNodes(parse(exercise.formula!), exercise.initialAssignment).tree;
      if (tree.value === undefined) {
        throw new Error(`Expected a root truth value for ${exercise.id}`);
      }
      return formatEvaluationFeedback(
        locale,
        buildEvaluationFeedback(tree, tree.value),
      );
    }
    case 'fill-truth-table-cell':
      return getCellFeedback(locale, exercise.id, true);
    case 'find-counterexample':
      return getCounterFeedback(locale, exercise.id, true);
    case 'classify-tautology':
      return getTautologyFeedback(locale, exercise.id, true);
    case 'classify-choice':
      return getExerciseCopy(locale, exercise.id).feedback?.correct ?? '';
    case 'translate-en-to-formula':
    case 'proof-fill-step':
      return getFeedbackTemplates(locale, exercise.id).correct ?? '';
  }
}

describe('reason-bearing learner feedback', () => {
  it('explains a correct evaluation instead of confirming the learner prediction', () => {
    const tree = evaluateWithNodes(parse('P ∧ Q'), { P: true, Q: false }).tree;
    const result = buildEvaluationFeedback(tree, false);

    const en = formatEvaluationFeedback('en', result);
    expect(en).toMatch(/^Correct —/);
    expect(en).toMatch(/P is T/);
    expect(en).toMatch(/Q is F/);
    expect(en).toMatch(/conjunction is true only when both conjuncts are true/i);
    expect(en).toMatch(/whole formula is F/);
    expect(en).not.toMatch(/you predicted|your prediction/i);

    const fr = formatEvaluationFeedback('fr', result);
    expect(fr).toMatch(/^Exact —/);
    expect(fr).toMatch(/P vaut V/);
    expect(fr).toMatch(/Q vaut F/);
    expect(fr).toMatch(/conjonction n’est vraie que si les deux conjoints/i);
    expect(fr).toMatch(/formule entière vaut donc F/);
    expect(fr).not.toMatch(/valeur prédite|votre prédiction/i);
  });

  it('explains why a correct scope selection is the main connective', () => {
    const formula = parse('(P → Q) ∧ R');
    const tree = toVerticalTree(formula);

    const en = checkMainConnectiveSelection(
      formula,
      tree,
      tree.id,
      getFeedbackTemplates('en', 'scope-001'),
    );
    expect(en.message).toBe('Correct — ∧ has the widest scope, so it is the main connective.');

    const fr = checkMainConnectiveSelection(
      formula,
      tree,
      tree.id,
      getFeedbackTemplates('fr', 'scope-001'),
    );
    expect(fr.message).toBe('Exact — ∧ a la portée la plus large : c’est donc le connecteur principal.');
  });

  it('gives every translation exercise an authored reason on success', () => {
    const translationIds = EXERCISE_DEFINITIONS
      .filter((exercise) => exercise.type === 'translate-en-to-formula')
      .map((exercise) => exercise.id);

    expect(translationIds).toHaveLength(6);
    for (const locale of ['en', 'fr'] as const) {
      for (const id of translationIds) {
        const message = getFeedbackTemplates(locale, id).correct ?? '';
        expect(message, `${locale}/${id}`).not.toMatch(/^(Correct|Exact)\.$/);
        expect(message.length, `${locale}/${id}`).toBeGreaterThan(35);
      }
    }
  });

  it('keeps repair feedback actionable for generic translation mistakes', () => {
    const en = getFeedbackTemplates('en', 'translate-001');
    expect(en['wrong-operator']).toMatch(/compare each English connective/i);
    expect(en['wrong-atom']).toMatch(/recheck the P\/Q\/R key/i);

    const fr = getFeedbackTemplates('fr', 'translate-001');
    expect(fr['wrong-operator']).toMatch(/Comparez chaque liaison logique/i);
    expect(fr['wrong-atom']).toMatch(/Revérifiez la correspondance P\/Q\/R/i);
  });

  it('does not let any current graded exercise fall back to bare success confirmation', () => {
    for (const locale of ['en', 'fr'] as const) {
      for (const exercise of EXERCISE_DEFINITIONS) {
        const message = successFeedback(locale, exercise);
        expect(message, `${locale}/${exercise.id}`).not.toBe('');
        expect(message, `${locale}/${exercise.id}`).not.toMatch(/^(Correct|Exact)\.$/);
        expect(message, `${locale}/${exercise.id}`).not.toMatch(
          /root has the truth value you predicted|racine a bien la valeur prédite/i,
        );
      }
    }
  });
});
