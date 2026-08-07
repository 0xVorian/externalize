import { describe, expect, it } from 'vitest';
import {
  evaluateFormula,
  formulaAtoms,
  renderLiveTruthRow,
  renderTruthTable,
  usesLiveTruthRow,
} from './truth-table-render';

const FLAT_BINARIES = ['P ∧ Q', '¬P', 'P ∨ Q', 'P → Q', 'P ↔ Q'] as const;

function normalizeHtml(html: string): string {
  return html.replace(/\s+/g, ' ').trim();
}

describe('truth-table-render', () => {
  describe('usesLiveTruthRow', () => {
    it.each(FLAT_BINARIES)('returns true for flat formula %s', (formula) => {
      expect(usesLiveTruthRow(formula)).toBe(true);
    });

    it('returns false for nested or compound formulas', () => {
      expect(usesLiveTruthRow('(P → Q) ↔ ¬R')).toBe(false);
      expect(usesLiveTruthRow('¬(P ∧ Q)')).toBe(false);
      expect(usesLiveTruthRow('P ∧ (Q ∨ R)')).toBe(false);
    });
  });

  describe('formulaAtoms', () => {
    it('collects a single atom for ¬P', () => {
      expect(formulaAtoms('¬P')).toEqual(['P']);
    });
  });

  describe('evaluateFormula', () => {
    it('evaluates ¬P from assignment', () => {
      expect(evaluateFormula('¬P', { P: true })).toBe(false);
      expect(evaluateFormula('¬P', { P: false })).toBe(true);
    });
  });

  describe('renderLiveTruthRow', () => {
    it('renders a single active row for P ∧ Q', () => {
      const html = renderLiveTruthRow('en', 'P ∧ Q', { P: true, Q: false });

      expect(html).toContain('truth-table-wrap');
      expect(html).toContain('truth-table-row active');
      expect(html).toContain('<th scope="col">P</th>');
      expect(html).toContain('<th scope="col">Q</th>');
      expect(html).toContain('<td class="result-cell">F</td>');
    });

    it('renders one atom column for ¬P', () => {
      const html = renderLiveTruthRow('en', '¬P', { P: true });

      expect(html).toContain('<th scope="col">P</th>');
      expect(html).not.toContain('<th scope="col">Q</th>');
      expect(html).toContain('<td class="result-cell">F</td>');
    });

    it('uses locale truth labels in French', () => {
      const html = renderLiveTruthRow('fr', '¬P', { P: false });

      expect(html).toContain('<td class="result-cell">V</td>');
      expect(html).toContain('Table de vérité de ¬P');
    });

    it('matches snapshot for ¬P live row', () => {
      expect(normalizeHtml(renderLiveTruthRow('en', '¬P', { P: true }))).toMatchInlineSnapshot(
        `"<div class=\"truth-table-wrap\"> <table class=\"truth-table\" aria-label=\"Truth table for ¬P\"> <thead> <tr> <th scope=\"col\">P</th> <th scope=\"col\">¬P</th> </tr> </thead> <tbody> <tr class=\"truth-table-row active\"> <td>T</td> <td class=\"result-cell\">F</td> </tr> </tbody> </table> </div>"`,
      );
    });
  });

  describe('renderTruthTable', () => {
    it('renders multiple rows with exactly one active', () => {
      const html = renderTruthTable('en', 'P ∧ Q', [
        { assignment: { P: false, Q: false }, active: false, srLabel: 'Case 1 of 4' },
        { assignment: { P: false, Q: true }, active: true, srLabel: 'Case 2 of 4' },
        { assignment: { P: true, Q: false }, active: false },
        { assignment: { P: true, Q: true }, active: false },
      ]);

      expect(html.match(/class="truth-table-row/g)?.length).toBe(4);
      expect(html.match(/truth-table-row active/g)?.length).toBe(1);
      expect(html).toContain('Case 1 of 4');
    });

    it('evaluates each row for ¬P watch table', () => {
      const html = renderTruthTable('en', '¬P', [
        { assignment: { P: false }, active: true },
        { assignment: { P: true }, active: false },
      ]);

      expect(html).toContain('<td class="result-cell">T</td>');
      expect(html).toContain('<td class="result-cell">F</td>');
    });
  });
});

