import type { Assignment, Formula } from '../ast/types';
import { toVerticalTree } from '../render/tree';
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
  const tree = toVerticalTree(formula);
  const values = new Map<string, boolean>();

  const visit = (node: TreeNode, subformula: Formula): boolean => {
    let value: boolean;

    switch (subformula.kind) {
      case 'atom': {
        const assigned = assignment[subformula.name];
        if (assigned === undefined) {
          throw new Error(`Missing assignment for atom '${subformula.name}'`);
        }
        value = assigned;
        break;
      }
      case 'not':
        value = !visit(node.children[0], subformula.operand);
        break;
      case 'and':
      case 'or':
      case 'imp':
      case 'iff':
        value = combine(
          subformula.kind,
          visit(node.children[0], subformula.left),
          visit(node.children[1], subformula.right),
        );
        break;
    }

    values.set(node.id, value);
    return value;
  };

  const root = visit(tree, formula);

  const attachValues = (node: TreeNode): TreeNode => ({
    ...node,
    value: values.get(node.id),
    children: node.children.map(attachValues),
  });

  return {
    root,
    values,
    tree: attachValues(tree),
  };
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
