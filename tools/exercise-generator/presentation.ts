/** Keep in sync with `LIVE_TRUTH_ROW_FORMULAS` in src/app/truth-table-render.ts */
const LIVE_TRUTH_ROW_FORMULAS = new Set(['P ∧ Q', '¬P', 'P ∨ Q', 'P → Q', 'P ↔ Q']);

export function usesLiveTruthRow(formula: string): boolean {
  return LIVE_TRUTH_ROW_FORMULAS.has(formula);
}

export function presentationForExercise(
  exercise: Pick<GeneratedExerciseLike, 'id' | 'type' | 'formula'>,
): string {
  if (exercise.type === 'identify-main-connective') return 'tree-scope';
  if (exercise.type === 'fill-truth-table-cell') return 'truth-table-partial';
  return usesLiveTruthRow(exercise.formula) ? 'truth-table-live' : 'tree-eval';
}

type GeneratedExerciseLike = {
  id: string;
  type: 'identify-main-connective' | 'evaluate-formula' | 'fill-truth-table-cell';
  formula: string;
};
