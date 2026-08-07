import { evaluate, parse, collectAtoms, generateTruthTable } from '../../engine';
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

export function usesWatchGrid(formula: string): boolean {
  return usesLiveTruthRow(formula) && formulaAtoms(formula).length === 2;
}

function assignmentsMatch(a: Assignment, b: Assignment, atoms: string[]): boolean {
  return atoms.every((atom) => (a[atom] ?? false) === (b[atom] ?? false));
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

export function renderWatchGrid(
  locale: Locale,
  formula: string,
  activeAssignment: Assignment,
): string {
  const learn = learnUi(locale);
  const atoms = formulaAtoms(formula);
  if (atoms.length !== 2) {
    return renderLiveTruthRow(locale, formula, activeAssignment);
  }
  const [rowAtom, colAtom] = atoms;
  const rowValues = [true, false];
  const colValues = [true, false];
  const cells = rowValues
    .map((rowVal) => {
      const rowCells = colValues
        .map((colVal) => {
          const assignment: Assignment = { [rowAtom]: rowVal, [colAtom]: colVal };
          const active = assignmentsMatch(assignment, activeAssignment, atoms);
          const result = evaluateFormula(formula, assignment);
          return `
            <div class="watch-grid-cell ${active ? 'active' : ''}"${active ? ' aria-current="true"' : ''}>
              <span class="watch-grid-value">${formatTruthValue(locale, result)}</span>
            </div>
          `;
        })
        .join('');
      return `<div class="watch-grid-row">${rowCells}</div>`;
    })
    .join('');

  return `
    <div class="watch-grid-wrap">
      <div class="watch-grid" role="grid" aria-label="${learn.watchGridAria(formula)}">
        <div class="watch-grid-corner"></div>
        <div class="watch-grid-col-labels">
          <span class="watch-grid-col-label">${colAtom}</span>
          <span class="watch-grid-col-label">${formatTruthValue(locale, true)}</span>
          <span class="watch-grid-col-label">${formatTruthValue(locale, false)}</span>
        </div>
        <div class="watch-grid-body">
          <div class="watch-grid-row-labels">
            <span class="watch-grid-row-label">${rowAtom}</span>
            <span class="watch-grid-row-label">${formatTruthValue(locale, true)}</span>
            <span class="watch-grid-row-label">${formatTruthValue(locale, false)}</span>
          </div>
          <div class="watch-grid-cells">${cells}</div>
        </div>
      </div>
    </div>
  `;
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

export function renderCompleteTruthTable(locale: Locale, formula: string): string {
  const table = generateTruthTable(parse(formula), formulaAtoms(formula));
  const learn = learnUi(locale);
  const atoms = table.atoms;
  const body = table.rows.map((row) => {
    const atomCells = atoms.map((atom) => `<td>${formatTruthValue(locale, row.assignment[atom] ?? false)}</td>`).join('');
    return `<tr class="truth-table-row">${atomCells}<td class="result-cell">${formatTruthValue(locale, row.result)}</td></tr>`;
  }).join('');
  const headerCells = atoms.map((atom) => `<th scope="col">${atom}</th>`).join('');
  return `<div class="truth-table-wrap truth-table-static"><table class="truth-table" aria-label="${learn.truthTableAria(formula)}"><thead><tr>${headerCells}<th scope="col">${formula}</th></tr></thead><tbody>${body}</tbody></table></div>`;
}

export function renderTautologyChoice(locale: Locale, submitted: boolean | null, answered: boolean): string {
  const copy = ui(locale);
  if (answered && submitted !== null) {
    return `<p class="tautology-answer" role="status">${submitted ? copy.tautologyYes : copy.tautologyNo}</p>`;
  }
  return `<div class="tautology-choice"><div class="tautology-segments" role="group" aria-label="${copy.tautologyChoiceAria}"><button type="button" class="tautology-segment" data-action="submit-tautology-answer" data-value="true">${copy.tautologyYes}</button><button type="button" class="tautology-segment" data-action="submit-tautology-answer" data-value="false">${copy.tautologyNo}</button></div></div>`;
}

