import type { Assignment, Formula } from '../ast/types';
import { connectiveLabel } from '../render/display';
import type { TreeNode } from '../ast/types';

export type EvaluationResult = {
  root: boolean;
  values: Map<string, boolean>;
  tree: TreeNode;
};

export function evaluate(formula: Formula, assignment: Assignment): boolean {
  switch (formula.kind) {
    case 'atom': {
      const value = assignment[formula.name];
      if (value === undefined) {
        throw new Error(`Missing assignment for atom '${formula.name}'`);
      }
      return value;
    }
    case 'not':
      return !evaluate(formula.operand, assignment);
    case 'and':
      return evaluate(formula.left, assignment) && evaluate(formula.right, assignment);
    case 'or':
      return evaluate(formula.left, assignment) || evaluate(formula.right, assignment);
    case 'imp':
      return !evaluate(formula.left, assignment) || evaluate(formula.right, assignment);
    case 'iff':
      return evaluate(formula.left, assignment) === evaluate(formula.right, assignment);
  }
}

export function evaluateWithNodes(formula: Formula, assignment: Assignment): EvaluationResult {
  const values = new Map<string, boolean>();
  const tree = buildEvaluatedTree(formula, assignment, 'root', values);
  const root = values.get('root');
  if (root === undefined) {
    throw new Error('Evaluation did not produce a root value');
  }
  return { root, values, tree };
}

function buildEvaluatedTree(
  formula: Formula,
  assignment: Assignment,
  path: string,
  values: Map<string, boolean>,
): TreeNode {
  switch (formula.kind) {
    case 'atom': {
      const value = assignment[formula.name];
      if (value === undefined) {
        throw new Error(`Missing assignment for atom '${formula.name}'`);
      }
      values.set(path, value);
      return {
        id: path,
        kind: 'atom',
        label: formula.name,
        value,
        children: [],
      };
    }
    case 'not': {
      const child = buildEvaluatedTree(formula.operand, assignment, `${path}.O`, values);
      const value = !child.value!;
      values.set(path, value);
      return {
        id: path,
        kind: 'not',
        label: connectiveLabel('not'),
        value,
        children: [child],
      };
    }
    case 'and':
    case 'or':
    case 'imp':
    case 'iff': {
      const left = buildEvaluatedTree(formula.left, assignment, `${path}.L`, values);
      const right = buildEvaluatedTree(formula.right, assignment, `${path}.R`, values);
      const value = combine(formula.kind, left.value!, right.value!);
      values.set(path, value);
      return {
        id: path,
        kind: formula.kind,
        label: connectiveLabel(formula.kind),
        value,
        children: [left, right],
      };
    }
  }
}

function combine(kind: 'and' | 'or' | 'imp' | 'iff', left: boolean, right: boolean): boolean {
  switch (kind) {
    case 'and':
      return left && right;
    case 'or':
      return left || right;
    case 'imp':
      return !left || right;
    case 'iff':
      return left === right;
  }
}

export function allAssignments(atoms: string[]): Assignment[] {
  const count = 1 << atoms.length;
  const result: Assignment[] = [];

  for (let mask = 0; mask < count; mask += 1) {
    const assignment: Assignment = {};
    atoms.forEach((atom, index) => {
      assignment[atom] = Boolean((mask >> (atoms.length - 1 - index)) & 1);
    });
    result.push(assignment);
  }

  return result;
}
