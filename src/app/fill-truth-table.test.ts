import { describe, expect, it } from 'vitest';
import { getExerciseDefinition } from './exercises';
import { createState, submitCellValue, cellSubmissionCorrect } from './state';

describe('fill-truth-table-cell validation', () => {
  it('masks one row', () => {
    const state = createState('en', getExerciseDefinition('tt-001')!);
    expect(state.partialTable?.rows[2]?.result).toBeNull();
  });
  it('validates correct submission', () => {
    expect(cellSubmissionCorrect(submitCellValue(createState('en', getExerciseDefinition('tt-002')!), false))).toBe(true);
  });
  it('validates incorrect submission', () => {
    expect(cellSubmissionCorrect(submitCellValue(createState('en', getExerciseDefinition('tt-003')!), true))).toBe(false);
  });
  it('validates three-atom table', () => {
    expect(cellSubmissionCorrect(submitCellValue(createState('en', getExerciseDefinition('tt-004')!), false))).toBe(true);
  });
});
