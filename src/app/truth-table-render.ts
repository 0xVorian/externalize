import { evaluate, parse, collectAtoms } from '../../engine';
import type { Assignment } from '../../engine';
import { learnUi, formatTruthValue, type Locale } from '../i18n';

/** Flat formulas that use a live single-row truth table in lessons and practice. */
const LIVE_TRUTH_ROW_FORMULAS = new Set(['P ∧ Q', '¬P', 'P ∨ Q', 'P → Q', 'P ↔ Q']);

export function formulaAtoms(formula: string): string[] {
  return [...collectAtoms(parse(formula))].sort();
}

export function evaluateFormula(formula: string, assignment: Assignment): boolean {
  return evaluate(parse(formula), assignment);
}

export type TruthTableRow = {
  assignment: Assignment;
  active: boolean;
  srLabel?: string;
};

export function usesLiveTruthRow(formula: string): boolean {
  return LIVE_TRUTH_ROW_FORMULAS.has(formula);
}

export function renderTruthTable(
  locale: Locale,
  formula: string,
  rows: TruthTableRow[],
): string {
  const learn = learnUi(locale);
  const atoms = formulaAtoms(formula);
  const body = rows
    .map((row) => {
      const result = evaluateFormula(formula, row.assignment);
      const atomCells = atoms
        .map((atom) => `<td>${formatTruthValue(locale, row.assignment[atom] ?? false)}</td>`)
        .join('');
      return `
        <tr class="truth-table-row ${row.active ? 'active' : ''}"${row.active ? ' aria-current="step"' : ''}>
          ${row.srLabel ? `<th scope="row" class="sr-only">${row.srLabel}</th>` : ''}
          ${atomCells}
          <td class="result-cell">${formatTruthValue(locale, result)}</td>
        </tr>
      `;
    })
    .join('');

  const headerCells = atoms.map((atom) => `<th scope="col">${atom}</th>`).join('');

  return `
    <div class="truth-table-wrap">
      <table class="truth-table" aria-label="${learn.truthTableAria(formula)}">
        <thead>
          <tr>
            ${headerCells}
            <th scope="col">${formula}</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `;
}

export function renderLiveTruthRow(
  locale: Locale,
  formula: string,
  assignment: Record<string, boolean>,
): string {
  const atoms = formulaAtoms(formula);
  const row: Assignment = {};
  for (const atom of atoms) {
    row[atom] = assignment[atom] ?? false;
  }
  return renderTruthTable(locale, formula, [{ assignment: row, active: true }]);
}
