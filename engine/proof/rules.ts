import type { Formula } from '../ast/types';
import { equivalent } from '../equiv/equivalent';
import type { RuleId } from './types';

export type InferenceRule = { id: RuleId; arity: number };

export const INFERENCE_RULES: Record<RuleId, InferenceRule> = {
  mp: { id: 'mp', arity: 2 },
};

export function applyModusPonens(a: Formula, b: Formula): Formula | null {
  if (a.kind === 'imp' && equivalent(a.left, b)) return a.right;
  if (b.kind === 'imp' && equivalent(b.left, a)) return b.right;
  return null;
}

export function applyRule(rule: RuleId, fs: Formula[]): Formula | null {
  return rule === 'mp' && fs.length === 2 ? applyModusPonens(fs[0], fs[1]) : null;
}
