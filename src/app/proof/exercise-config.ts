import type { ProofFillConfig } from '../../../engine';
export const ND_001: ProofFillConfig = { hiddenLineIndex: 2, lines: [{ formula: 'P → Q', justification: 'premise' }, { formula: 'P', justification: 'premise' }, { hidden: true }], expected: { rule: 'mp', cites: [1, 2], formula: 'Q' }, allowedRules: ['mp'] };
export const ND_002: ProofFillConfig = { hiddenLineIndex: 1, lines: [{ formula: 'P ∧ Q', justification: 'premise' }, { hidden: true }], expected: { rule: 'and-elim', cites: [1], formula: 'P' }, allowedRules: ['and-elim'] };
const BY_ID: Record<string, ProofFillConfig> = { 'nd-001': ND_001, 'nd-002': ND_002 };
export function getProofExerciseConfig(id: string): ProofFillConfig | undefined { return BY_ID[id]; }
