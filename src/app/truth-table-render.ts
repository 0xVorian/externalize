import { evaluate, parse, collectAtoms } from '../../engine';
import type { Assignment, PartialTruthTable } from '../../engine';
import { learnUi, ui, formatTruthValue, type Locale } from '../i18n';

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
        <tr class="truth-table-row ${row.active ? 'active' : ''}">
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

function renderBlankResultCell(
  locale: Locale,
  rowIndex: number,
  submitted: boolean | null,
  answered: boolean,
): string {
  const copy = ui(locale);
  if (answered && submitted !== null) {
    return `<td class="result-cell">${formatTruthValue(locale, submitted)}</td>`;
  }
  return `<td class="result-cell blank-cell"><div class="cell-segments" role="group" aria-label="${copy.cellFillAria(rowIndex + 1)}"><button type="button" class="cell-segment true" data-action="submit-cell-value" data-value="true">${copy.trueLabel}</button><button type="button" class="cell-segment false" data-action="submit-cell-value" data-value="false">${copy.falseLabel}</button></div></td>`;
}

export function renderPartialTruthTable(
  locale: Locale,
  formula: string,
  table: PartialTruthTable,
  options: { hiddenRowIndex: number; submitted: boolean | null; answered: boolean },
): string {
  const learn = learnUi(locale);
  const body = table.rows
    .map((row, index) => {
      const atomCells = table.atoms
        .map((atom) => `<td>${formatTruthValue(locale, row.assignment[atom] ?? false)}</td>`)
        .join('');
      const resultCell =
        index === options.hiddenRowIndex
          ? renderBlankResultCell(locale, index, options.submitted, options.answered)
          : `<td class="result-cell">${formatTruthValue(locale, row.result ?? false)}</td>`;
      return `<tr class="truth-table-row ${index === options.hiddenRowIndex ? 'active' : ''}">${atomCells}${resultCell}</tr>`;
    })
    .join('');
  const headerCells = table.atoms.map((atom) => `<th scope="col">${atom}</th>`).join('');
  return `<div class="truth-table-wrap"><table class="truth-table" aria-label="${learn.truthTableAria(formula)}"><thead><tr>${headerCells}<th scope="col">${formula}</th></tr></thead><tbody>${body}</tbody></table></div>`;
}
