import type { Formula, Term, TreeNode } from '../ast/types';
import { connectiveLabel } from './display';

export function toVerticalTree(formula: Formula): TreeNode { return buildTree(formula, 'root'); }

function formatTermLabel(term: Term): string { return term.name; }

function buildTree(formula: Formula, path: string): TreeNode {
  switch (formula.kind) {
    case 'pred':
      if (formula.args.length === 0) return { id: path, kind: 'pred', label: formula.name, children: [] };
      return { id: path, kind: 'pred', label: formula.name, children: formula.args.map((arg, index) => ({ id: `${path}.A${index}`, kind: 'pred', label: formatTermLabel(arg), children: [] })) };
    case 'not': return { id: path, kind: 'not', label: connectiveLabel('not'), children: [buildTree(formula.operand, `${path}.O`)] };
    case 'forall': return { id: path, kind: 'forall', label: `${connectiveLabel('forall')}${formula.var}`, children: [buildTree(formula.body, `${path}.B`)] };
    case 'exists': return { id: path, kind: 'exists', label: `${connectiveLabel('exists')}${formula.var}`, children: [buildTree(formula.body, `${path}.B`)] };
    case 'and': case 'or': case 'imp': case 'iff':
      return { id: path, kind: formula.kind, label: connectiveLabel(formula.kind), children: [buildTree(formula.left, `${path}.L`), buildTree(formula.right, `${path}.R`)] };
  }
}

export function findNodeById(tree: TreeNode, id: string): TreeNode | undefined {
  if (tree.id === id) return tree;
  for (const child of tree.children) { const found = findNodeById(child, id); if (found) return found; }
  return undefined;
}

export function annotateTreeValues(tree: TreeNode, values: Map<string, boolean>): TreeNode {
  return { ...tree, value: values.get(tree.id), children: tree.children.map((child) => annotateTreeValues(child, values)) };
}

export function resetTreeIds(): void {}
