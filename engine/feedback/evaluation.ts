import type { TreeNode } from '../ast/types';

export type EvaluationFeedbackResult = {
  correct: boolean;
  tag: 'correct' | 'incorrect-evaluation';
  rootLabel: string;
  rootValue: boolean;
  childParts: Array<{ label: string; value: boolean }>;
  connectiveKind: TreeNode['kind'];
};

function childParts(node: TreeNode): Array<{ label: string; value: boolean }> {
  return node.children
    .filter((child) => child.value !== undefined)
    .map((child) => ({ label: child.label, value: child.value! }));
}

export function buildEvaluationFeedback(
  tree: TreeNode,
  prediction: boolean,
): EvaluationFeedbackResult {
  const rootValue = tree.value;
  if (rootValue === undefined) {
    throw new Error('Evaluation tree root has no value');
  }
  const correct = prediction === rootValue;
  return {
    correct,
    tag: correct ? 'correct' : 'incorrect-evaluation',
    rootLabel: tree.label,
    rootValue,
    childParts: childParts(tree),
    connectiveKind: tree.kind,
  };
}
