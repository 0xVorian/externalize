import { getExerciseDefinition } from './exercises';
import { getLessonDefinition } from './lessons';
import type { SessionStep, SessionStepSource } from './session-types';
import type { ProgressStore } from './storage';
import { watchCaseCount } from '../i18n';

export { watchCaseCount };

const watchCaseCountOverrides = new Map<string, number>();

/** Test-only: pretend a watch lesson has more cases than the authored catalog. */
export function setWatchCaseCountOverrideForTests(lessonId: string, count?: number): void {
  if (count === undefined) {
    watchCaseCountOverrides.delete(lessonId);
  } else {
    watchCaseCountOverrides.set(lessonId, count);
  }
}

function resolvedWatchCaseCount(itemId: string): number {
  return watchCaseCountOverrides.get(itemId) ?? watchCaseCount(itemId);
}

export function isTeachingItem(itemId: string): boolean {
  const lesson = getLessonDefinition(itemId);
  return lesson?.type === 'card' || lesson?.type === 'watch';
}

export function isPracticeItem(itemId: string): boolean {
  if (getExerciseDefinition(itemId)) {
    return true;
  }
  return getLessonDefinition(itemId)?.type === 'guided';
}

export function isLastWatchUnit(itemId: string, unitIndex: number | undefined): boolean {
  if (unitIndex === undefined) {
    return true;
  }
  const count = resolvedWatchCaseCount(itemId);
  return count <= 0 || unitIndex >= count - 1;
}

export function unitsForItem(itemId: string, fromIndex = 0): SessionStep[] {
  const lesson = getLessonDefinition(itemId);
  const source: SessionStepSource = getExerciseDefinition(itemId) ? 'practice' : 'route';
  if (lesson?.type === 'watch') {
    const count = resolvedWatchCaseCount(itemId);
    const start = Math.max(0, Math.min(fromIndex, count));
    const steps: SessionStep[] = [];
    for (let index = start; index < count; index += 1) {
      steps.push({
        id: `${itemId}#${index}`,
        source,
        itemId,
        unitIndex: index,
      });
    }
    return steps;
  }
  return [{ id: itemId, source, itemId }];
}

export function expandItemsToUnits(itemIds: string[], store?: ProgressStore): SessionStep[] {
  const steps: SessionStep[] = [];
  for (const itemId of itemIds) {
    const lesson = getLessonDefinition(itemId);
    const fromIndex =
      lesson?.type === 'watch' &&
      store &&
      store.resume.lessonId === itemId &&
      !store.lessonsCompleted.includes(itemId) &&
      typeof store.resume.watchStep === 'number'
        ? store.resume.watchStep
        : 0;
    steps.push(...unitsForItem(itemId, fromIndex));
  }
  return steps;
}
