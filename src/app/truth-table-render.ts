import { evaluate, parse, collectAtoms, generateTruthTable } from '../../engine';
import type { Assignment, PartialTruthTable } from '../../engine';
import { learnUi, ui, formatTruthValue, type Locale } from '../i18n';
import {
  determinedFormulaValue,
  isAtomAssigned,
  type PartialAssignment,
} from './partial-assignment';

/** Flat formulas that use a live single-row truth table in lessons and practice. */
const LIVE_TRUTH_ROW_FORMULAS = new Set(['P ∧ Q', '¬P', 'P ∨ Q', 'P → Q', 'P ↔ Q']);

export function formulaAtoms(formula: string): string[] {
  return [...collectAtoms(parse(formula))].sort();
}

export function evaluateFormula(formula: string, assignment: Assignment): boolean {
  return evaluate(parse(formula), assignment);
}

export type TruthTableRow = {
  assignment: PartialAssignment;
  active: boolean;
  srLabel?: string;
  targetAtom?: string;
  targetValue?: boolean | null;
};

export type LiveTruthRowOptions = {
  hideResult?: boolean;
  targetAtom?: string;
  targetValue?: boolean | null;
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

/**
 * Committed values only. A provisional target fill is display-only and must
 * not determine the result before Check.
 */
function committedRowAssignment(row: TruthTableRow, atoms: string[]): PartialAssignment {
  const assignment: PartialAssignment = {};
  for (const atom of atoms) {
    if (atom === row.targetAtom) {
      continue;
    }
    if (isAtomAssigned(row.assignment, atom)) {
      assignment[atom] = row.assignment[atom];
    }
  }
  return assignment;
}

function renderUnknownCell(label: string, text: string): string {
  return `<td class="unknown-cell"><span aria-label="${label}">${text}</span></td>`;
}

function renderTruthValueSlot(
  locale: Locale,
  value: boolean | null,
  ariaLabel: string,
): string {
  const filled = value !== null;
  const text = filled ? formatTruthValue(locale, value) : '&nbsp;';
  return `<span class="truth-table-drop-slot ${filled ? 'filled' : 'empty'}" aria-label="${ariaLabel}">${text}</span>`;
}

export function renderTruthTable(
  locale: Locale,
  formula: string,
  rows: TruthTableRow[],
  options: { hideResult?: boolean } = {},
): string {
  const learn = learnUi(locale);
  const atoms = formulaAtoms(formula);
  const body = rows
    .map((row) => {
      const displayAssignment = committedRowAssignment(row, atoms);
      const determined = options.hideResult
        ? null
        : determinedFormulaValue(formula, displayAssignment);
      const atomCells = atoms
        .map((atom) => {
          if (atom === row.targetAtom) {
            const filled = row.targetValue === true || row.targetValue === false;
            const aria = filled
              ? `${learn.guidedTargetAria(atom, true)}: ${formatTruthValue(locale, row.targetValue!)}`
              : learn.guidedTargetAria(atom, false);
            return `<td class="blank-cell guided-target-cell" data-testid="guided-target-cell">${renderTruthValueSlot(locale, filled ? row.targetValue! : null, aria)}</td>`;
          }
          if (!isAtomAssigned(row.assignment, atom)) {
            return renderUnknownCell(
              learn.unassignedAtomAria(atom),
              formatTruthValue(locale, undefined),
            );
          }
          return `<td>${formatTruthValue(locale, row.assignment[atom])}</td>`;
        })
        .join('');
      const resultCell = options.hideResult
        ? '<td class="result-cell">—</td>'
        : determined === null
          ? `<td class="result-cell" data-testid="truth-result-cell"><span aria-label="${learn.undeterminedResultAria}">${formatTruthValue(locale, undefined)}</span></td>`
          : `<td class="result-cell" data-testid="truth-result-cell">${formatTruthValue(locale, determined)}</td>`;
      return `
        <tr class="truth-table-row ${row.active ? 'active' : ''}"${row.active ? ' aria-current="step"' : ''}>
          ${row.srLabel ? `<th scope="row" class="sr-only">${row.srLabel}</th>` : ''}
          ${atomCells}
          ${resultCell}
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
  assignment: PartialAssignment,
  options: LiveTruthRowOptions = {},
): string {
  const row: PartialAssignment = {};
  for (const atom of formulaAtoms(formula)) {
    if (isAtomAssigned(assignment, atom)) {
      row[atom] = assignment[atom];
    }
  }
  return renderTruthTable(
    locale,
    formula,
    [
      {
        assignment: row,
        active: true,
        targetAtom: options.targetAtom,
        targetValue: options.targetValue,
      },
    ],
    { hideResult: options.hideResult },
  );
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
  const rows = rowValues
    .map((rowVal) => {
      const cells = colValues
        .map((colVal) => {
          const assignment: Assignment = { [rowAtom]: rowVal, [colAtom]: colVal };
          const active = assignmentsMatch(assignment, activeAssignment, atoms);
          const result = evaluateFormula(formula, assignment);
          return `
            <td class="watch-grid-cell ${active ? 'active' : ''}"${active ? ' aria-current="true"' : ''}>
              <span class="watch-grid-value">${formatTruthValue(locale, result)}</span>
            </td>
          `;
        })
        .join('');
      return `
        <tr class="watch-grid-row">
          <th scope="row" class="watch-grid-row-label">${rowAtom} = ${formatTruthValue(locale, rowVal)}</th>
          ${cells}
        </tr>
      `;
    })
    .join('');

  return `
    <div class="watch-grid-wrap">
      <table class="watch-grid" aria-label="${learn.watchGridAria(formula)}">
        <thead>
          <tr>
            <th class="watch-grid-corner" scope="col">${rowAtom} ↓ / ${colAtom} →</th>
            ${colValues.map((value) => `<th scope="col" class="watch-grid-col-label">${colAtom} = ${formatTruthValue(locale, value)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderBlankResultCell(
  locale: Locale,
  rowIndex: number,
  submitted: boolean | null,
): string {
  const copy = ui(locale);
  const value = submitted === null ? '&nbsp;' : formatTruthValue(locale, submitted);
  const stateClass = submitted === null ? 'empty' : 'filled';
  return `<td class="result-cell blank-cell"><span class="truth-table-drop-slot ${stateClass}" aria-label="${copy.cellFillAria(rowIndex + 1)}">${value}</span></td>`;
}

function renderTruthTableAnswerTray(
  locale: Locale,
  rowIndex: number,
  submitted: boolean | null,
  answered: boolean,
): string {
  if (answered) {
    return '';
  }
  const copy = ui(locale);
  return `<section class="truth-table-response-workspace"><div class="truth-table-answer-tray" role="group" aria-label="${copy.cellFillAria(rowIndex + 1)}"><button type="button" class="cell-segment true${submitted === true ? ' selected' : ''}" data-action="select-evaluation-prediction" data-value="true" aria-pressed="${submitted === true}">${copy.trueLabel}</button><button type="button" class="cell-segment false${submitted === false ? ' selected' : ''}" data-action="select-evaluation-prediction" data-value="false" aria-pressed="${submitted === false}">${copy.falseLabel}</button></div><button type="button" class="primary truth-table-check" data-action="check-evaluation"${submitted === null ? ' disabled' : ''}>${copy.checkAnswer}</button></section>`;
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
          ? renderBlankResultCell(locale, index, options.submitted)
          : `<td class="result-cell">${formatTruthValue(locale, row.result ?? false)}</td>`;
      return `<tr class="truth-table-row ${index === options.hiddenRowIndex ? 'active' : ''}">${atomCells}${resultCell}</tr>`;
    })
    .join('');
  const headerCells = table.atoms.map((atom) => `<th scope="col">${atom}</th>`).join('');
  return `<div class="truth-table-wrap"><table class="truth-table" aria-label="${learn.truthTableAria(formula)}"><thead><tr>${headerCells}<th scope="col">${formula}</th></tr></thead><tbody>${body}</tbody></table></div>${renderTruthTableAnswerTray(locale, options.hiddenRowIndex, options.submitted, options.answered)}`;
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
