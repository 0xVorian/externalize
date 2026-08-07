import { describe, expect, it } from 'vitest';
import { EXERCISE_DEFINITIONS } from './exercises';
import { renderApp } from './render';
import { createState, checkTranslation, tryAgainTranslation } from './state';
import { getTranslationExerciseConfig } from './translation';
import { usesLiveTruthRow } from './truth-table-render';

const PRACTICE_FLAT_BINARIES = ['P ∧ Q', 'P ∨ Q', 'P → Q', 'P ↔ Q'] as const;

describe('practice presentation routing', () => {
  it.each([...PRACTICE_FLAT_BINARIES, '¬P'] as const)(
    'usesLiveTruthRow returns true for flat binary %s',
    (formula) => {
      expect(usesLiveTruthRow(formula)).toBe(true);
    },
  );

  it.each(PRACTICE_FLAT_BINARIES)(
    'renderApp uses live truth table for evaluate exercise with formula %s',
    (formula) => {
      const exercise = EXERCISE_DEFINITIONS.find(
        (candidate) => candidate.type === 'evaluate-formula' && candidate.formula === formula,
      );
      expect(exercise).toBeDefined();

      const html = renderApp(createState('en', exercise!), 0, true);

      expect(html).toContain('truth-table-wrap');
      expect(html).toContain('atom-panel');
      expect(html).not.toContain('class="tree-panel"');
    },
  );

  it('renderApp uses tree panel for nested evaluate formulas', () => {
    const nested = EXERCISE_DEFINITIONS.filter(
      (candidate) =>
        candidate.type === 'evaluate-formula' && candidate.formula && !usesLiveTruthRow(candidate.formula),
    );

    for (const exercise of nested) {
      const html = renderApp(createState('en', exercise), 0, true);
      expect(html, exercise.id).toContain('class="tree-panel"');
      expect(html, exercise.id).not.toContain('truth-table-wrap');
    }
  });

  it('provides translation configs for translate-002 through translate-006', () => {
    for (const id of ['translate-002', 'translate-003', 'translate-004', 'translate-005', 'translate-006']) {
      expect(getTranslationExerciseConfig(id)?.expected.formula).toBeTruthy();
    }
  });

  it('shows try again after incorrect translation check', () => {
    const exercise = EXERCISE_DEFINITIONS.find((candidate) => candidate.id === 'translate-004')!;
    let state = createState('en', exercise);
    state = {
      ...state,
      builder: {
        ...state.builder,
        formula: { kind: 'imp', left: { kind: 'atom', name: 'Q' }, right: { kind: 'atom', name: 'P' } },
      },
    };
    state = checkTranslation(state);
    expect(state.feedback?.tag).toBe('reversed-conditional');
    expect(renderApp(state, 0, true)).toContain('data-action="try-again"');
    state = tryAgainTranslation(state);
    expect(state.phase).toBe('ready');
    expect(state.feedback).toBeNull();
  });
});
