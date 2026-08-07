import type { Formula, TreeNode } from '../ast/types';
import { connectiveLabel } from './display';

export function toVerticalTree(formula: Formula): TreeNode {
  return buildTree(formula, 'root');
}

function buildTree(formula: Formula, path: string): TreeNode {
  switch (formula.kind) {
    case 'atom':
      return {
        id: path,
        kind: 'atom',
        label: formula.name,
        children: [],
      };
    case 'not':
      return {
        id: path,
        kind: 'not',
        label: connectiveLabel('not'),
        children: [buildTree(formula.operand, `${path}.O`)],
      };
    case 'and':
    case 'or':
    case 'imp':
    case 'iff':
      return {
        id: path,
        kind: formula.kind,
        label: connectiveLabel(formula.kind),
        children: [
          buildTree(formula.left, `${path}.L`),
          buildTree(formula.right, `${path}.R`),
        ],
      };
  }
}

export function findNodeById(tree: TreeNode, id: string): TreeNode | undefined {
  if (tree.id === id) {
    return tree;
  }
  for (const child of tree.children) {
    const found = findNodeById(child, id);
    if (found) {
      return found;
    }
  }
  return undefined;
}

export function annotateTreeValues(tree: TreeNode, values: Map<string, boolean>): TreeNode {
  return {
    ...tree,
    value: values.get(tree.id),
    children: tree.children.map((child) => annotateTreeValues(child, values)),
  };
}

/** @deprecated Use path-based IDs from toVerticalTree; kept for compatibility. */
export function resetTreeIds(): void {
  // No-op: path-based IDs replaced the global counter.
}
