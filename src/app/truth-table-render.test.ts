import { describe, expect, it } from 'vitest';
import {
  evaluateFormula,
  formulaAtoms,
  renderLiveTruthRow,
  renderTruthTable,
  renderWatchGrid,
  usesLiveTruthRow,
  usesWatchGrid,
} from './truth-table-render';

const FLAT_BINARIES = ['P ∧ Q', '¬P', 'P ∨ Q', 'P → Q', 'P ↔ Q'] as const;

describe('truth-table-render', () => {
  describe('usesLiveTruthRow', () => {
    it.each(FLAT_BINARIES)('returns true for flat formula %s', (formula) => {
      expect(usesLiveTruthRow(formula)).toBe(true);
    });

    it('returns false for nested formulas', () => {
      expect(usesLiveTruthRow('(P → Q) ↔ ¬R')).toBe(false);
    });
  });

  describe('usesWatchGrid', () => {
    it('is true for binary flat formulas', () => {
      expect(usesWatchGrid('P ∧ Q')).toBe(true);
      expect(usesWatchGrid('P ∨ Q')).toBe(true);
    });

    it('is false for single-atom and nested formulas', () => {
      expect(usesWatchGrid('¬P')).toBe(false);
      expect(usesWatchGrid('(P → Q) ↔ ¬R')).toBe(false);
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
    });
  });

  describe('renderLiveTruthRow', () => {
    it('renders a single active row for P ∧ Q', () => {
      const html = renderLiveTruthRow('en', 'P ∧ Q', { P: true, Q: false });
      expect(html).toContain('truth-table-row active');
    });
  });

  describe('renderTruthTable', () => {
    it('renders multiple rows for watch lessons', () => {
      const html = renderTruthTable('en', 'P ∧ Q', [
        { assignment: { P: true, Q: true }, active: true },
        { assignment: { P: true, Q: false }, active: false },
      ]);
      expect(html).toContain('truth-table-wrap');
    });
  });

  describe('renderWatchGrid', () => {
    it('renders a 2×2 grid with P on rows and Q on columns', () => {
      const html = renderWatchGrid('en', 'P ∧ Q', { P: true, Q: true });
      expect(html).toContain('watch-grid');
      expect(html).toContain('watch-grid-cell active');
      expect(html).toContain('watch-grid-row-label">P = T</th>');
      expect(html).toContain('watch-grid-col-label">Q = T</th>');
    });

    it('highlights the cell matching the active assignment', () => {
      const active = renderWatchGrid('en', 'P ∨ Q', { P: false, Q: true });
      expect(active.match(/watch-grid-cell active/g)?.length).toBe(1);
      expect(renderWatchGrid('en', 'P ∨ Q', { P: true, Q: false })).toContain('aria-current="true"');
    });

    it('uses locale truth labels in grid cells', () => {
      expect(renderWatchGrid('en', 'P ∧ Q', { P: true, Q: true })).toContain('>T<');
      expect(renderWatchGrid('fr', 'P ∧ Q', { P: true, Q: true })).toContain('>V<');
    });
  });
});
