import { describe, expect, it } from 'vitest';
import { getExerciseDefinition } from './exercises';
import { createState } from './state';
import {
  evaluateFormula,
  formulaAtoms,
  renderLiveTruthRow,
  renderPartialTruthTable,
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

  describe('renderPartialTruthTable', () => {
    const state = createState('en', getExerciseDefinition('tt-001')!);
    const table = state.partialTable!;

    it('starts with a blank target, semantic answer words, and disabled Check', () => {
      const html = renderPartialTruthTable('en', 'P ∧ Q', table, {
        hiddenRowIndex: 2,
        submitted: null,
        answered: false,
      });
      expect(html).toContain('truth-table-drop-slot empty');
      expect(html).toContain('truth-table-answer-tray');
      expect(html).toContain('>True</button>');
      expect(html).toContain('>False</button>');
      expect(html).toContain('data-action="select-evaluation-prediction"');
      expect(html).toMatch(/truth-table-check[^>]*disabled/);
    });

    it('moves a provisional semantic choice into the formal target before checking', () => {
      const html = renderPartialTruthTable('en', 'P ∧ Q', table, {
        hiddenRowIndex: 2,
        submitted: true,
        answered: false,
      });
      expect(html).toContain('truth-table-drop-slot filled');
      expect(html).toContain('>T</span>');
      expect(html).toContain('cell-segment true selected');
      expect(html).toContain('aria-pressed="true"');
      expect(html).toContain('truth-table-answer-tray');
      expect(html).toContain('data-action="check-evaluation"');
      expect(html).not.toMatch(/truth-table-check[^>]*disabled/);
    });

    it('removes the response workspace after the answer has been checked', () => {
      const html = renderPartialTruthTable('en', 'P ∧ Q', table, {
        hiddenRowIndex: 2,
        submitted: true,
        answered: true,
      });
      expect(html).not.toContain('truth-table-answer-tray');
      expect(html).not.toContain('truth-table-check');
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

    it('uses locale truth notation in grid cells', () => {
      expect(renderWatchGrid('en', 'P ∧ Q', { P: true, Q: true })).toContain('>T<');
      expect(renderWatchGrid('fr', 'P ∧ Q', { P: true, Q: true })).toContain('>V<');
    });
  });
});
