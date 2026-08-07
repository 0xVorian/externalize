import type { Formula } from '../ast/types';

export type RuleId = 'mp';

export type ProofLineSpec = {
  formula?: string;
  justification?: 'premise' | RuleId;
  cites?: number[];
  hidden?: boolean;
  subproofLevel?: number;
};

export type ProofLine = {
  lineNumber: number;
  formula: Formula | null;
  justification: 'premise' | RuleId | null;
  cites: number[];
  subproofLevel: number;
  hidden: boolean;
};

export type ProofFillConfig = {
  hiddenLineIndex: number;
  lines: ProofLineSpec[];
  expected: { rule: RuleId; cites: number[]; formula: string };
  allowedRules: RuleId[];
};
