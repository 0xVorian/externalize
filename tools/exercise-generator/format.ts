import type { GenerateResult } from './types';

function formatAssignment(assignment: Record<string, boolean>): string {
  const entries = Object.entries(assignment)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([atom, value]) => `${atom}: ${value}`);
  return `{ ${entries.join(', ')} }`;
}

export function formatExerciseDefinition(exercise: GenerateResult['exercises'][number]): string {
  const parts = [`id: '${exercise.id}'`, `type: '${exercise.type}'`, `formula: '${exercise.formula}'`];
  if (exercise.initialAssignment) {
    parts.push(`initialAssignment: ${formatAssignment(exercise.initialAssignment)}`);
  }
  if (exercise.hiddenRowIndex !== undefined) {
    parts.push(`hiddenRowIndex: ${exercise.hiddenRowIndex}`);
  }
  return `  { ${parts.join(', ')} },`;
}

export function formatTypeScript(result: GenerateResult): string {
  const lines = [
    '// Paste into EXERCISE_DEFINITIONS in src/app/exercises.ts — review before committing.',
    '// Also add i18n copy, presentation entries, and unlock order as needed.',
    '',
    ...result.exercises.map(formatExerciseDefinition),
    '',
    '// Suggested PRESENTATION entries (src/app/presentation.test.ts):',
    ...Object.entries(result.presentation).map(
      ([id, presentation]) => `// '${id}': '${presentation}',`,
    ),
  ];

  if (result.warnings.length > 0) {
    lines.push('', '// Warnings:', ...result.warnings.map((warning) => `// - ${warning}`));
  }

  return lines.join('\n');
}

export function formatJson(result: GenerateResult): string {
  return `${JSON.stringify(result.exercises, null, 2)}\n`;
}

export function formatUnlockOrderHint(ids: string[]): string {
  return [
    '// Suggested PRACTICE_UNLOCK_ORDER append (src/app/lessons.ts) — reorder for pedagogy:',
    ...ids.map((id) => `// '${id}',`),
  ].join('\n');
}
