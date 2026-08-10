export const EVALUATION_SCAFFOLD_LEVELS: Record<string, string[][]> = {
  'eval-007': [[], ['root.R']],
  'eval-008': [[], ['root.O']],
  'eval-020': [[], ['root.O']],
};

export function scaffoldNodeIdsForLevel(exerciseId: string, level: number): string[] {
  const levels = EVALUATION_SCAFFOLD_LEVELS[exerciseId];
  if (!levels || levels.length === 0) {
    return [];
  }
  const clamped = Math.min(Math.max(level, 0), levels.length - 1);
  return levels[clamped] ?? [];
}

export function maxScaffoldLevel(exerciseId: string): number {
  const levels = EVALUATION_SCAFFOLD_LEVELS[exerciseId];
  return levels ? levels.length - 1 : 0;
}

export function hasEvaluationScaffold(exerciseId: string): boolean {
  return exerciseId in EVALUATION_SCAFFOLD_LEVELS;
}
