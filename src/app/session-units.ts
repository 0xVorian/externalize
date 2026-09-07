import { getExerciseDefinition } from './exercises';
import { getLessonDefinition } from './lessons';
import type { SessionStep, SessionStepSource } from './session-types';
import type { ProgressStore } from './storage';
import { watchCaseCount } from '../i18n';

export { watchCaseCount };

export function isLastWatchUnit(itemId: string, unitIndex: number | undefined): boolean {
  if (unitIndex === undefined) {
    return true;
  }
  const count = watchCaseCount(itemId);
  return count <= 0 || unitIndex >= count - 1;
}

export function unitsForItem(itemId: string, fromIndex = 0): SessionStep[] {
  const lesson = getLessonDefinition(itemId);
  const source: SessionStepSource = getExerciseDefinition(itemId) ? 'practice' : 'route';
  if (lesson?.type === 'watch') {
    const count = watchCaseCount(itemId);
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
