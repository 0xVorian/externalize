import { describe, expect, it } from 'vitest';
import { EXERCISE_DEFINITIONS } from '../../src/app/exercises';
import { diffAgainstExisting, generateExercises, loadExerciseTemplates } from './generate';
import { formatJson, formatTypeScript } from './format';
import { presentationForExercise } from './presentation';

describe('exercise template generator', () => {
  it('loads the default template bank', () => {
    const templates = loadExerciseTemplates();
    expect(templates.scope).toHaveLength(12);
    expect(templates.eval).toHaveLength(10);
    expect(templates.fillTruthTable).toHaveLength(5);
  });

  it('generates definitions matching the current scope/eval/tt bank', () => {
    const result = generateExercises(loadExerciseTemplates());
    const generated = result.exercises;
    const existing = EXERCISE_DEFINITIONS.filter(
      (exercise) =>
        exercise.type === 'identify-main-connective' ||
        exercise.type === 'evaluate-formula' ||
        exercise.type === 'fill-truth-table-cell',
    );

    expect(generated).toHaveLength(existing.length);
    expect(diffAgainstExisting(generated, existing).onlyInTemplates).toHaveLength(0);
    expect(diffAgainstExisting(generated, existing).onlyInApp).toHaveLength(0);
  });

  it('assigns presentation routes consistent with the app', () => {
    const result = generateExercises(loadExerciseTemplates());
    expect(result.presentation['scope-001']).toBe('tree-scope');
    expect(result.presentation['eval-001']).toBe('truth-table-live');
    expect(result.presentation['eval-002']).toBe('tree-eval');
    expect(result.presentation['tt-001']).toBe('truth-table-partial');
    expect(presentationForExercise({ id: 'eval-010', type: 'evaluate-formula', formula: '¬P' })).toBe(
      'truth-table-live',
    );
  });

  it('formats reviewable TypeScript snippets', () => {
    const result = generateExercises(loadExerciseTemplates(), { patterns: ['scope'], startIds: { scope: 13 } });
    const snippet = formatTypeScript(result);
    expect(snippet).toContain("id: 'scope-013'");
    expect(snippet).toContain('Paste into EXERCISE_DEFINITIONS');
    expect(snippet).toContain("'scope-013': 'tree-scope'");
  });

  it('formats JSON for tooling', () => {
    const result = generateExercises(loadExerciseTemplates(), { patterns: ['eval'], startIds: { eval: 11 } });
    const json = JSON.parse(formatJson(result)) as unknown[];
    expect(json).toHaveLength(10);
    expect(json[9]).toMatchObject({ id: 'eval-020', type: 'evaluate-formula' });
  });

  it('rejects invalid formulas and out-of-range hidden rows', () => {
    expect(() =>
      generateExercises({
        scope: [{ formula: 'P @ Q' }],
        eval: [],
        fillTruthTable: [],
      }),
    ).toThrow(/invalid formula/i);

    expect(() =>
      generateExercises({
        scope: [],
        eval: [],
        fillTruthTable: [{ formula: 'P ∧ Q', hiddenRowIndex: 99 }],
      }),
    ).toThrow(/hiddenRowIndex/i);
  });
});
