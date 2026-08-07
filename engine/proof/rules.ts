import type { Formula } from '../ast/types';
import { equivalent } from '../equiv/equivalent';
import type { RuleId } from './types';

export type InferenceRule = { id: RuleId; arity: number };

export const INFERENCE_RULES: Record<RuleId, InferenceRule> = {
  mp: { id: 'mp', arity: 2 },
  'and-elim': { id: 'and-elim', arity: 1 },
};

export function applyModusPonens(a: Formula, b: Formula): Formula | null {
  if (a.kind === 'imp' && equivalent(a.left, b)) return a.right;
  if (b.kind === 'imp' && equivalent(b.left, a)) return b.right;
  return null;
}

export function applyAndElimLeft(a: Formula): Formula | null {
  return a.kind === 'and' ? a.left : null;
}

export function applyRule(rule: RuleId, fs: Formula[]): Formula | null {
  if (rule === 'mp' && fs.length === 2) return applyModusPonens(fs[0], fs[1]);
  if (rule === 'and-elim' && fs.length === 1) return applyAndElimLeft(fs[0]);
  return null;
}
