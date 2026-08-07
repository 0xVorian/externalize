import type { Formula } from '../ast/types';
import { collectAtoms } from '../ast/types';
import { evaluate, allAssignments } from '../eval/evaluate';

export type EquivalenceOptions = {
  allowCommutativeAnd?: boolean;
  allowCommutativeOr?: boolean;
  allowSemantic?: boolean;
};

function normalize(formula: Formula, options: EquivalenceOptions): Formula {
  switch (formula.kind) {
    case 'atom':
      return formula;
    case 'not':
      return { kind: 'not', operand: normalize(formula.operand, options) };
    case 'and':
    case 'or': {
      const left = normalize(formula.left, options);
      const right = normalize(formula.right, options);
      const commutative = formula.kind === 'and' ? options.allowCommutativeAnd : options.allowCommutativeOr;
      if (commutative) {
        return sortPair(formula.kind, left, right, options);
      }
      return { kind: formula.kind, left, right };
    }
    case 'imp':
      return {
        kind: 'imp',
        left: normalize(formula.left, options),
        right: normalize(formula.right, options),
      };
    case 'iff':
      return {
        kind: 'iff',
        left: normalize(formula.left, options),
        right: normalize(formula.right, options),
      };
  }
}

function sortPair(
  kind: 'and' | 'or',
  left: Formula,
  right: Formula,
  options: EquivalenceOptions,
): Formula {
  const leftKey = canonicalKey(left, options);
  const rightKey = canonicalKey(right, options);
  if (leftKey <= rightKey) {
    return { kind, left, right };
  }
  return { kind, left: right, right: left };
}

function canonicalKey(formula: Formula, options: EquivalenceOptions): string {
  return JSON.stringify(normalize(formula, options));
}

function structurallyEqual(a: Formula, b: Formula, options: EquivalenceOptions): boolean {
  return canonicalKey(a, options) === canonicalKey(b, options);
}

export function equivalent(a: Formula, b: Formula, options: EquivalenceOptions = {}): boolean {
  if (structurallyEqual(a, b, options)) {
    return true;
  }

  if (options.allowSemantic) {
    const atoms = [...collectAtoms(a), ...collectAtoms(b)];
    const unique = [...new Set(atoms)].sort();
    return allAssignments(unique).every(
      (assignment) => evaluate(a, assignment) === evaluate(b, assignment),
    );
  }

  return false;
}

export function distinct(a: Formula, b: Formula, options?: EquivalenceOptions): boolean {
  return !equivalent(a, b, options);
}

export function semanticallyEquivalent(a: Formula, b: Formula): boolean {
  return equivalent(a, b, { allowSemantic: true });
}
