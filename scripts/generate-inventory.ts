#!/usr/bin/env tsx
import { EXERCISE_DEFINITIONS } from '../src/app/exercises';
import {
  ALL_LEARN_LESSONS,
  LEVEL_0_PRACTICE_UNLOCK_ORDER,
  LEVEL_2_PRACTICE_UNLOCK_ORDER,
} from '../src/app/lessons';
import { flattenUnit1Clusters } from '../src/app/practice-clusters';

const unit1 = flattenUnit1Clusters();
const total =
  LEVEL_0_PRACTICE_UNLOCK_ORDER.length + unit1.length + LEVEL_2_PRACTICE_UNLOCK_ORDER.length;

const lines = [
  '# Generated inventory',
  '',
  `Generated: ${new Date().toISOString().slice(0, 10)}`,
  '',
  `- Lessons: ${ALL_LEARN_LESSONS.length}`,
  `- Exercises: ${EXERCISE_DEFINITIONS.length}`,
  `- Practice chain: ${total} (${LEVEL_0_PRACTICE_UNLOCK_ORDER.length} Unit 0 + ${unit1.length} Unit 1 + ${LEVEL_2_PRACTICE_UNLOCK_ORDER.length} Unit 2)`,
  '',
  '## Unit 0 practice',
  ...LEVEL_0_PRACTICE_UNLOCK_ORDER.map((id) => `- ${id}`),
  '',
  '## Unit 1 practice (clustered)',
  ...unit1.map((id) => `- ${id}`),
  '',
  '## Unit 2 practice',
  ...LEVEL_2_PRACTICE_UNLOCK_ORDER.map((id) => `- ${id}`),
  '',
];

process.stdout.write(lines.join('\n'));
