import type { ConnectiveKind, Formula, Term } from '../ast/types';

const SYMBOLS: Record<ConnectiveKind, string> = {
  not: '¬', and: '∧', or: '∨', imp: '→', iff: '↔', forall: '∀', exists: '∃',
};

function isBinary(kind: Formula['kind']): kind is Exclude<ConnectiveKind, 'not' | 'forall' | 'exists'> {
  return kind === 'and' || kind === 'or' || kind === 'imp' || kind === 'iff';
}

function formatTerm(term: Term): string { return term.name; }

function formatPred(formula: Extract<Formula, { kind: 'pred' }>): string {
  if (formula.args.length === 0) return formula.name;
  return `${formula.name}(${formula.args.map(formatTerm).join(', ')})`;
}

function needsParens(parent: ConnectiveKind | 'pred', child: Formula, side: 'left' | 'right'): boolean {
  if (child.kind === 'pred' || child.kind === 'not') return false;
  if (child.kind === 'forall' || child.kind === 'exists') return parent === 'not';
  if (parent === 'pred' || parent === 'not') return false;
  if (parent === child.kind && side === 'left') return false;
  return true;
}

function formatWithContext(formula: Formula, parent: ConnectiveKind | 'pred', side: 'left' | 'right'): string {
  const text = format(formula);
  return needsParens(parent, formula, side) ? `(${text})` : text;
}

export function format(formula: Formula): string {
  switch (formula.kind) {
    case 'pred': return formatPred(formula);
    case 'not': return `${SYMBOLS.not}${formatWithContext(formula.operand, 'not', 'left')}`;
    case 'and': return `${formatWithContext(formula.left, 'and', 'left')} ${SYMBOLS.and} ${formatWithContext(formula.right, 'and', 'right')}`;
    case 'or': return `${formatWithContext(formula.left, 'or', 'left')} ${SYMBOLS.or} ${formatWithContext(formula.right, 'or', 'right')}`;
    case 'imp': return `${formatWithContext(formula.left, 'imp', 'left')} ${SYMBOLS.imp} ${formatWithContext(formula.right, 'imp', 'right')}`;
    case 'iff': return `${formatWithContext(formula.left, 'iff', 'left')} ${SYMBOLS.iff} ${formatWithContext(formula.right, 'iff', 'right')}`;
    case 'forall': return `${SYMBOLS.forall}${formula.var} ${formatWithContext(formula.body, 'forall', 'left')}`;
    case 'exists': return `${SYMBOLS.exists}${formula.var} ${formatWithContext(formula.body, 'exists', 'left')}`;
  }
}

export function connectiveLabel(kind: ConnectiveKind): string { return SYMBOLS[kind]; }
export function isBinaryConnective(kind: Formula['kind']): boolean { return isBinary(kind); }
