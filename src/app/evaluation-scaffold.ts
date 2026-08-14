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

export function currentScaffoldLevel(level: number | undefined): number {
  return level ?? 0;
}

export function nextScaffoldLevel(
  exerciseId: string,
  current: number | undefined,
): number | null {
  if (!hasEvaluationScaffold(exerciseId)) {
    return null;
  }
  const from = currentScaffoldLevel(current);
  const max = maxScaffoldLevel(exerciseId);
  if (from >= max) {
    return null;
  }
  return from + 1;
}

export function scaffoldHidesMoreIntermediates(
  exerciseId: string,
  from: number,
  to: number,
): boolean {
  if (to <= from || !hasEvaluationScaffold(exerciseId)) {
    return false;
  }
  return nextScaffoldLevel(exerciseId, from) === to;
}

export { maxScaffoldLevel as scaffoldMaxLevel };
