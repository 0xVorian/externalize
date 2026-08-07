import type { ProofFillConfig } from '../../../engine';

export const ND_001: ProofFillConfig = {
  hiddenLineIndex: 2,
  lines: [
    { formula: 'P → Q', justification: 'premise' },
    { formula: 'P', justification: 'premise' },
    { hidden: true },
  ],
  expected: { rule: 'mp', cites: [1, 2], formula: 'Q' },
  allowedRules: ['mp'],
};

const BY_ID: Record<string, ProofFillConfig> = {
  'nd-001': ND_001,
};

export function getProofExerciseConfig(id: string): ProofFillConfig | undefined {
  return BY_ID[id];
}
