import { describe, expect, it } from 'vitest';
import { getExerciseDefinition } from './exercises';
import {
  cellSubmissionCorrect,
  checkEvaluation,
  createState,
  selectEvaluationPrediction,
  submitCellValue,
} from './state';

describe('fill-truth-table-cell validation', () => {
  it('masks one row', () => {
    const state = createState('en', getExerciseDefinition('tt-001')!);
    expect(state.partialTable?.rows[2]?.result).toBeNull();
  });

  it('records a provisional choice without grading it', () => {
    const initial = createState('en', getExerciseDefinition('tt-002')!);
    const selected = selectEvaluationPrediction(initial, false);
    expect(selected.submittedCell).toBe(false);
    expect(selected.phase).toBe('ready');
    expect(selected.attempt.checkedAnswers).toBe(0);
    expect(cellSubmissionCorrect(selected)).toBeNull();
  });

  it('grades the provisional choice only when Check is invoked', () => {
    const initial = createState('en', getExerciseDefinition('tt-002')!);
    const selected = selectEvaluationPrediction(initial, false);
    const checked = checkEvaluation(selected);
    expect(checked.phase).toBe('answered');
    expect(checked.attempt.checkedAnswers).toBe(1);
    expect(cellSubmissionCorrect(checked)).toBe(true);
  });

  it('does nothing when Check is invoked before a choice exists', () => {
    const initial = createState('en', getExerciseDefinition('tt-002')!);
    expect(checkEvaluation(initial)).toBe(initial);
  });

  it('validates incorrect checked choices', () => {
    const initial = createState('en', getExerciseDefinition('tt-003')!);
    const checked = checkEvaluation(selectEvaluationPrediction(initial, true));
    expect(cellSubmissionCorrect(checked)).toBe(false);
  });

  it('keeps direct submission validation for existing callers', () => {
    expect(
      cellSubmissionCorrect(
        submitCellValue(createState('en', getExerciseDefinition('tt-004')!), false),
      ),
    ).toBe(true);
  });
});
