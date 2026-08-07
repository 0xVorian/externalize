import { evaluate, parse } from '../../engine';
import { learnUi, formatTruthValue, type Locale } from '../i18n';

/** Flat two-atom formulas that use a live single-row truth table in practice. */
const LIVE_TRUTH_ROW_FORMULAS = new Set(['P ∧ Q', 'P ∨ Q', 'P → Q', 'P ↔ Q']);

export function conjunctionResult(assignment: { P: boolean; Q: boolean }): boolean {
  return assignment.P && assignment.Q;
}

export type TruthTableRow = {
  assignment: { P: boolean; Q: boolean };
  active: boolean;
  srLabel?: string;
};

export function usesLiveTruthRow(formula: string): boolean {
  return LIVE_TRUTH_ROW_FORMULAS.has(formula);
}

function formulaResult(formula: string, assignment: { P: boolean; Q: boolean }): boolean {
  return evaluate(parse(formula), assignment);
}

export function renderTruthTable(
  locale: Locale,
  formula: string,
  rows: TruthTableRow[],
): string {
  const learn = learnUi(locale);
  const body = rows
    .map((row) => {
      const result = formulaResult(formula, row.assignment);
      return `
        <tr class="truth-table-row ${row.active ? 'active' : ''}">
          ${row.srLabel ? `<th scope="row" class="sr-only">${row.srLabel}</th>` : ''}
          <td>${formatTruthValue(locale, row.assignment.P)}</td>
          <td>${formatTruthValue(locale, row.assignment.Q)}</td>
          <td class="result-cell">${formatTruthValue(locale, result)}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div class="truth-table-wrap">
      <table class="truth-table" aria-label="${learn.truthTableAria(formula)}">
        <thead>
          <tr>
            <th scope="col">P</th>
            <th scope="col">Q</th>
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
  const row = {
    P: assignment.P ?? false,
    Q: assignment.Q ?? false,
  };
  return renderTruthTable(locale, formula, [{ assignment: row, active: true }]);
}
