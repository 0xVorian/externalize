#!/usr/bin/env node
import { EXERCISE_DEFINITIONS } from '../../src/app/exercises';
import { diffAgainstExisting, generateExercises, loadExerciseTemplates } from './generate';
import { formatJson, formatTypeScript, formatUnlockOrderHint } from './format';
import type { ExercisePattern } from './types';

function usage(): string {
  return `Usage: npm run generate:exercises -- [options]

Options:
  --json              Output JSON array instead of TypeScript snippets
  --both              Output TypeScript then JSON
  --pattern=<name>    scope | eval | fill-truth-table (repeatable; default: all)
  --start-scope=N     First scope-NNN index when IDs are auto-assigned (default: 1)
  --start-eval=N      First eval-NNN index (default: 1)
  --start-tt=N        First tt-NNN index (default: 1)
  --templates=PATH    Template JSON path (default: content/exercise-templates.json)
  --diff              Compare generated output to src/app/exercises.ts (same patterns only)
  --unlock-hint       Append suggested PRACTICE_UNLOCK_ORDER lines after TS output

Examples:
  npm run generate:exercises
  npm run generate:exercises -- --pattern=scope --start-scope=13
  npm run generate:exercises -- --json --pattern=eval
  npm run generate:exercises -- --diff
`;
}

function parsePatterns(args: string[]): ExercisePattern[] | undefined {
  const patterns = args
    .filter((arg) => arg.startsWith('--pattern='))
    .map((arg) => arg.slice('--pattern='.length) as ExercisePattern);

  if (patterns.length === 0) return undefined;

  const allowed: ExercisePattern[] = ['scope', 'eval', 'fill-truth-table'];
  for (const pattern of patterns) {
    if (!allowed.includes(pattern)) {
      throw new Error(`Unknown pattern "${pattern}". Expected: ${allowed.join(', ')}`);
    }
  }
  return patterns;
}

function parseStart(args: string[], flag: string): number | undefined {
  const match = args.find((arg) => arg.startsWith(`${flag}=`));
  if (!match) return undefined;
  const value = Number(match.slice(flag.length + 1));
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${flag} must be a positive integer`);
  }
  return value;
}

function main(): void {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(usage());
    return;
  }

  const templatesPath = args.find((arg: string) => arg.startsWith('--templates='))?.slice('--templates='.length);
  const patterns = parsePatterns(args);
  const templates = loadExerciseTemplates(templatesPath);
  const result = generateExercises(templates, {
    patterns,
    startIds: {
      scope: parseStart(args, '--start-scope'),
      eval: parseStart(args, '--start-eval'),
      tt: parseStart(args, '--start-tt'),
    },
  });

  if (args.includes('--diff')) {
    const existing = EXERCISE_DEFINITIONS.filter((exercise) =>
      patterns
        ? (patterns.includes('scope') && exercise.type === 'identify-main-connective') ||
          (patterns.includes('eval') && exercise.type === 'evaluate-formula') ||
          (patterns.includes('fill-truth-table') && exercise.type === 'fill-truth-table-cell')
        : exercise.type !== 'translate-en-to-formula',
    );
    const { onlyInTemplates, onlyInApp } = diffAgainstExisting(result.exercises, existing);
    console.log('// Template diff vs src/app/exercises.ts');
    console.log(`// Only in templates (${onlyInTemplates.length}):`);
    for (const exercise of onlyInTemplates) {
      console.log(`//   ${exercise.id}  ${exercise.formula}`);
    }
    console.log(`// Only in app (${onlyInApp.length}):`);
    for (const exercise of onlyInApp) {
      console.log(`//   ${exercise.id}  ${exercise.formula}`);
    }
    if (onlyInTemplates.length === 0 && onlyInApp.length === 0) {
      console.log('// In sync for selected patterns.');
    }
    return;
  }

  const outputJson = args.includes('--json');
  const outputBoth = args.includes('--both');

  if (outputBoth) {
    console.log(formatTypeScript(result));
    console.log('\n--- JSON ---\n');
    console.log(formatJson(result));
  } else if (outputJson) {
    console.log(formatJson(result));
  } else {
    console.log(formatTypeScript(result));
    if (args.includes('--unlock-hint')) {
      console.log('\n' + formatUnlockOrderHint(result.exercises.map((exercise) => exercise.id)));
    }
  }
}

main();
