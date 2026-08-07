import type { Formula, TreeNode } from '../ast/types';
import { connectiveLabel } from './display';

let nextId = 0;

function createId(): string {
  nextId += 1;
  return `node-${nextId}`;
}

export function resetTreeIds(): void {
  nextId = 0;
}

export function toVerticalTree(formula: Formula): TreeNode {
  resetTreeIds();
  return buildTree(formula);
}

function buildTree(formula: Formula): TreeNode {
  switch (formula.kind) {
    case 'atom':
      return {
        id: createId(),
        kind: 'atom',
        label: formula.name,
        children: [],
      };
    case 'not':
      return {
        id: createId(),
        kind: 'not',
        label: connectiveLabel('not'),
        children: [buildTree(formula.operand)],
      };
    case 'and':
    case 'or':
    case 'imp':
    case 'iff':
      return {
        id: createId(),
        kind: formula.kind,
        label: connectiveLabel(formula.kind),
        children: [buildTree(formula.left), buildTree(formula.right)],
      };
  }
}

export function annotateTreeValues(tree: TreeNode, values: Map<string, boolean>): TreeNode {
  return {
    ...tree,
    value: values.get(tree.id),
    children: tree.children.map((child) => annotateTreeValues(child, values)),
  };
}
