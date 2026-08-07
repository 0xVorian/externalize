import { describe, expect, it } from 'vitest';
import { evaluateFormula, renderWatchGrid, usesWatchGrid } from './truth-table-render';

describe('renderWatchGrid', () => {
  it('renders a 2×2 grid with P on rows and Q on columns', () => {
    const html = renderWatchGrid('en', 'P ∧ Q', { P: true, Q: true });
    expect(html).toContain('watch-grid');
    expect(html).toContain('watch-grid-cell active');
    expect(html).toContain('watch-grid-row-label">P</span>');
    expect(html).toContain('watch-grid-col-label">Q</span>');
  });

  it('highlights the cell matching the active assignment', () => {
    const active = renderWatchGrid('en', 'P ∨ Q', { P: false, Q: true });
    expect(active.match(/watch-grid-cell active/g)?.length).toBe(1);
    expect(renderWatchGrid('en', 'P ∨ Q', { P: true, Q: false })).toContain('aria-current="true"');
  });

  it('computes results via the engine for each cell', () => {
    expect(evaluateFormula('P ∧ Q', { P: true, Q: false })).toBe(false);
    expect(renderWatchGrid('en', 'P ∧ Q', { P: true, Q: false })).toContain('watch-grid-cell active');
  });

  it('uses locale truth labels in grid cells', () => {
    expect(renderWatchGrid('en', 'P ∧ Q', { P: true, Q: true })).toContain('>T<');
    expect(renderWatchGrid('fr', 'P ∧ Q', { P: true, Q: true })).toContain('>V<');
  });
});

describe('usesWatchGrid', () => {
  it('is true for binary flat formulas', () => {
    expect(usesWatchGrid('P ∧ Q')).toBe(true);
    expect(usesWatchGrid('P ∨ Q')).toBe(true);
    expect(usesWatchGrid('P → Q')).toBe(true);
    expect(usesWatchGrid('P ↔ Q')).toBe(true);
  });

  it('is false for single-atom and nested formulas', () => {
    expect(usesWatchGrid('¬P')).toBe(false);
    expect(usesWatchGrid('(P → Q) ↔ ¬R')).toBe(false);
  });
});
