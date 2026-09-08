#!/usr/bin/env tsx
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { EXERCISE_DEFINITIONS } from '../src/app/exercises';
import {
  ALL_LEARN_LESSONS,
  LEVEL_0_PRACTICE_UNLOCK_ORDER,
  LEVEL_2_PRACTICE_UNLOCK_ORDER,
} from '../src/app/lessons';
import { flattenUnit1Clusters } from '../src/app/practice-clusters';

const OUTPUT_PATH = resolve('docs/generated-inventory.md');

function renderInventory(): string {
  const unit1 = flattenUnit1Clusters();
  const total =
    LEVEL_0_PRACTICE_UNLOCK_ORDER.length + unit1.length + LEVEL_2_PRACTICE_UNLOCK_ORDER.length;

  const lines = [
    '# Generated inventory',
    '',
    '> Generated from current source. Do not hand-edit; run `npm run inventory:update`.',
    '',
    `- Foundations lessons: ${ALL_LEARN_LESSONS.length}`,
    `- Exercise definitions: ${EXERCISE_DEFINITIONS.length}`,
    `- Foundations Practice chain: ${total} (${LEVEL_0_PRACTICE_UNLOCK_ORDER.length} Unit 0 + ${unit1.length} Unit 1 + ${LEVEL_2_PRACTICE_UNLOCK_ORDER.length} Unit 2)`,
    '',
    '## Unit 0 Practice',
    ...LEVEL_0_PRACTICE_UNLOCK_ORDER.map((id) => `- ${id}`),
    '',
    '## Unit 1 Practice (clustered)',
    ...unit1.map((id) => `- ${id}`),
    '',
    '## Unit 2 Practice',
    ...LEVEL_2_PRACTICE_UNLOCK_ORDER.map((id) => `- ${id}`),
  ];

  return `${lines.join('\n')}\n`;
}

const expected = renderInventory();
const args = new Set(process.argv.slice(2));

if (args.has('--write')) {
  writeFileSync(OUTPUT_PATH, expected);
  process.stdout.write(`Updated ${OUTPUT_PATH}\n`);
  process.exit(0);
}

if (args.has('--check')) {
  let actual = '';
  try {
    actual = readFileSync(OUTPUT_PATH, 'utf8');
  } catch {
    process.stderr.write(`Missing ${OUTPUT_PATH}; run npm run inventory:update.\n`);
    process.exit(1);
  }
  if (actual !== expected) {
    process.stderr.write(`Inventory drift detected in ${OUTPUT_PATH}; run npm run inventory:update.\n`);
    process.exit(1);
  }
  process.stdout.write('Inventory is current.\n');
  process.exit(0);
}

process.stdout.write(expected);
