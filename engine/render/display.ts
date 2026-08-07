import type { ConnectiveKind, Formula } from '../ast/types';

const SYMBOLS: Record<ConnectiveKind, string> = {
  not: '¬',
  and: '∧',
  or: '∨',
  imp: '→',
  iff: '↔',
};

function isBinary(kind: Formula['kind']): kind is Exclude<ConnectiveKind, 'not'> {
  return kind === 'and' || kind === 'or' || kind === 'imp' || kind === 'iff';
}

function needsParens(parent: ConnectiveKind | 'atom', child: Formula, side: 'left' | 'right'): boolean {
  if (child.kind === 'atom' || child.kind === 'not') {
    return false;
  }

  if (parent === 'atom' || parent === 'not') {
    return false;
  }

  if (parent === child.kind && side === 'left') {
    return false;
  }

  return true;
}

function formatWithContext(formula: Formula, parent: ConnectiveKind | 'atom', side: 'left' | 'right'): string {
  const text = format(formula);
  return needsParens(parent, formula, side) ? `(${text})` : text;
}

export function format(formula: Formula): string {
  switch (formula.kind) {
    case 'atom':
      return formula.name;
    case 'not':
      return `${SYMBOLS.not}${formatWithContext(formula.operand, 'not', 'left')}`;
    case 'and':
      return `${formatWithContext(formula.left, 'and', 'left')} ${SYMBOLS.and} ${formatWithContext(formula.right, 'and', 'right')}`;
    case 'or':
      return `${formatWithContext(formula.left, 'or', 'left')} ${SYMBOLS.or} ${formatWithContext(formula.right, 'or', 'right')}`;
    case 'imp':
      return `${formatWithContext(formula.left, 'imp', 'left')} ${SYMBOLS.imp} ${formatWithContext(formula.right, 'imp', 'right')}`;
    case 'iff':
      return `${formatWithContext(formula.left, 'iff', 'left')} ${SYMBOLS.iff} ${formatWithContext(formula.right, 'iff', 'right')}`;
  }
}

export function connectiveLabel(kind: ConnectiveKind): string {
  return SYMBOLS[kind];
}

export function isBinaryConnective(kind: Formula['kind']): boolean {
  return isBinary(kind);
}
