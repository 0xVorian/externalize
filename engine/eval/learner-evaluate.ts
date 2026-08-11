import type { Assignment, Formula, TreeNode } from '../ast/types';
import { connectiveLabel } from '../render/display';
import type { EvaluationResult } from './evaluate';
import { evaluateWithNodes } from './evaluate';

function combine(kind: 'and' | 'or' | 'imp' | 'iff', left: boolean, right: boolean): boolean {
  switch (kind) {
    case 'and': return left && right;
    case 'or': return left || right;
    case 'imp': return !left || right;
    case 'iff': return left === right;
  }
}

function buildLearnerAwareTree(
  formula: Formula,
  assignment: Assignment,
  path: string,
  values: Map<string, boolean>,
  learnerValues: Record<string, boolean>,
  scaffoldIds: Set<string>,
): TreeNode {
  switch (formula.kind) {
    case 'pred': {
      if (formula.args.length !== 0) {
        throw new Error(`Cannot evaluate predicate '${formula.name}' with arguments in propositional mode`);
      }
      const value = assignment[formula.name];
      if (value === undefined) {
        throw new Error(`Missing assignment for atom '${formula.name}'`);
      }
      values.set(path, value);
      return { id: path, kind: 'pred', label: formula.name, value, children: [] };
    }
    case 'forall':
    case 'exists':
      throw new Error('Cannot evaluate quantified formula in propositional mode');
    case 'not': {
      const child = buildLearnerAwareTree(
        formula.operand,
        assignment,
        `${path}.O`,
        values,
        learnerValues,
        scaffoldIds,
      );
      let value: boolean | undefined;
      if (scaffoldIds.has(path)) {
        value = learnerValues[path];
      } else if (child.value !== undefined) {
        value = !child.value;
      }
      if (value !== undefined) {
        values.set(path, value);
      }
      return { id: path, kind: 'not', label: connectiveLabel('not'), value, children: [child] };
    }
    case 'and':
    case 'or':
    case 'imp':
    case 'iff': {
      const left = buildLearnerAwareTree(
        formula.left,
        assignment,
        `${path}.L`,
        values,
        learnerValues,
        scaffoldIds,
      );
      const right = buildLearnerAwareTree(
        formula.right,
        assignment,
        `${path}.R`,
        values,
        learnerValues,
        scaffoldIds,
      );
      let value: boolean | undefined;
      if (scaffoldIds.has(path)) {
        value = learnerValues[path];
      } else if (left.value !== undefined && right.value !== undefined) {
        value = combine(formula.kind, left.value, right.value);
      }
      if (value !== undefined) {
        values.set(path, value);
      }
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

export function evaluateWithLearnerOverlay(
  formula: Formula,
  assignment: Assignment,
  learnerValues: Record<string, boolean>,
  scaffoldNodeIds: string[],
): EvaluationResult {
  const values = new Map<string, boolean>();
  const scaffoldIds = new Set(scaffoldNodeIds);
  const tree = buildLearnerAwareTree(formula, assignment, 'root', values, learnerValues, scaffoldIds);
  const root = values.get('root');
  return { root: root ?? false, values, tree };
}

export function expectedNodeValue(
  formula: Formula,
  assignment: Assignment,
  nodeId: string,
): boolean {
  const { values } = evaluateWithNodes(formula, assignment);
  const expected = values.get(nodeId);
  if (expected === undefined) {
    throw new Error(`No expected value for node ${nodeId}`);
  }
  return expected;
}
