import { describe, expect, it } from 'vitest';
import { exerciseLabel } from './exercise-label';

describe('exerciseLabel', () => {
  it('uses concise authored labels instead of dumping task instructions into Progress', () => {
    expect(exerciseLabel('en', 'translate-001')).toBe('Prose to formula — Rain → cancellation');
    expect(exerciseLabel('fr', 'translate-001')).toBe('Énoncé → formule — Pluie → annulation');
    expect(exerciseLabel('en', 'nd-001')).toBe('Proof steps — Derive Q');
    expect(exerciseLabel('en', 'translate-001')).not.toMatch(/palette|Build the/i);
    expect(exerciseLabel('en', 'nd-001')).not.toMatch(/Complete the proof/i);
  });

  it('keeps compact formula labels for formula-bearing exercises', () => {
    expect(exerciseLabel('en', 'eval-001')).toBe('Evaluating formulas — P ∧ Q');
  });
});
