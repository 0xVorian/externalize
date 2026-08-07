import type { Formula, TreeNode } from '../ast/types';
import { findNodeById } from '../render/tree';
import { connectiveLabel } from '../render/display';

export type ScopeFeedbackTag =
  | 'correct'
  | 'wrong-main-connective'
  | 'selected-subconnective'
  | 'selected-atom'
  | 'selected-operand-not-connective';

export type FeedbackTemplate = Partial<Record<ScopeFeedbackTag, string>>;

export type FeedbackResult = {
  correct: boolean;
  tag: ScopeFeedbackTag;
  message: string;
};

const DEFAULT_TEMPLATES: Record<ScopeFeedbackTag, string> = {
  correct: 'Correct.',
  'wrong-main-connective':
    'That is not the main connective of the whole formula. The main connective has the widest scope.',
  'selected-subconnective':
    '{label} is the main connective of a subformula, but not of the whole formula.',
  'selected-atom': '{label} is a sentence letter, not a connective.',
  'selected-operand-not-connective': 'That node is not a connective.',
};

export function resolveFeedback(
  tag: ScopeFeedbackTag,
  templates: FeedbackTemplate = {},
  vars: Record<string, string> = {},
): string {
  const template = templates[tag] ?? DEFAULT_TEMPLATES[tag];
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`);
}

export function checkMainConnectiveSelection(
  formula: Formula,
  tree: TreeNode,
  selectedNodeId: string,
  templates: FeedbackTemplate = {},
): FeedbackResult {
  const selected = findNodeById(tree, selectedNodeId);
  if (!selected) {
    return {
      correct: false,
      tag: 'selected-operand-not-connective',
      message: resolveFeedback('selected-operand-not-connective', templates),
    };
  }

  const expectedKind = formula.kind;
  if (selected.id === tree.id && selected.kind === expectedKind) {
    return {
      correct: true,
      tag: 'correct',
      message: resolveFeedback('correct', templates),
    };
  }

  if (selected.kind === 'atom') {
    return {
      correct: false,
      tag: 'selected-atom',
      message: resolveFeedback('selected-atom', templates, { label: selected.label }),
    };
  }

  if (selected.id !== tree.id) {
    const label =
      selected.kind === 'not' ? '¬' : connectiveLabel(selected.kind);
    return {
      correct: false,
      tag: 'selected-subconnective',
      message: resolveFeedback('selected-subconnective', templates, { label }),
    };
  }

  return {
    correct: false,
    tag: 'wrong-main-connective',
    message: resolveFeedback('wrong-main-connective', templates),
  };
}

export function expectedMainConnectiveNodeId(): string {
  return 'root';
}
