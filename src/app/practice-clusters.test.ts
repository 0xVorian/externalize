import { describe, expect, it } from 'vitest';
import { EXERCISE_DEFINITIONS } from './exercises';
import { ALL_LEARN_LESSONS, LEVEL_0_PRACTICE_UNLOCK_ORDER, LEVEL_2_PRACTICE_UNLOCK_ORDER } from './lessons';
import { flattenUnit1Clusters, UNIT_1_PRACTICE_CLUSTERS } from './practice-clusters';

describe('practice clusters', () => {
  it('covers every Unit 1 exercise exactly once', () => {
    const clustered = new Set(flattenUnit1Clusters());
    const unit1FromDefs = EXERCISE_DEFINITIONS.map((e) => e.id).filter(
      (id) =>
        !LEVEL_0_PRACTICE_UNLOCK_ORDER.includes(id as never) &&
        !LEVEL_2_PRACTICE_UNLOCK_ORDER.includes(id as never),
    );
    expect(clustered.size).toBe(unit1FromDefs.length);
    for (const id of unit1FromDefs) {
      expect(clustered.has(id)).toBe(true);
    }
  });

  it('defines non-empty clusters', () => {
    for (const key of Object.keys(UNIT_1_PRACTICE_CLUSTERS)) {
      expect(UNIT_1_PRACTICE_CLUSTERS[key as keyof typeof UNIT_1_PRACTICE_CLUSTERS].length).toBeGreaterThan(0);
    }
  });
});

describe('content inventory', () => {
  it('matches documented scale', () => {
    const practiceTotal =
      LEVEL_0_PRACTICE_UNLOCK_ORDER.length +
      flattenUnit1Clusters().length +
      LEVEL_2_PRACTICE_UNLOCK_ORDER.length;
    expect(ALL_LEARN_LESSONS.length).toBeGreaterThanOrEqual(20);
    expect(EXERCISE_DEFINITIONS.length).toBeGreaterThanOrEqual(58);
    expect(practiceTotal).toBe(EXERCISE_DEFINITIONS.length);
  });
});
