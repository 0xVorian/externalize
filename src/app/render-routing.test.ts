import { describe, expect, it } from 'vitest';
import { EXERCISE_DEFINITIONS } from './exercises';
import { renderApp } from './render';
import { createState } from './state';
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
        candidate.type === 'evaluate-formula' && !usesLiveTruthRow(candidate.formula),
    );

    for (const exercise of nested) {
      const html = renderApp(createState('en', exercise), 0, true);
      expect(html, exercise.id).toContain('class="tree-panel"');
      expect(html, exercise.id).not.toContain('truth-table-wrap');
    }
  });
});
