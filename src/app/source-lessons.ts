import type { LessonDefinition } from './lessons';

export const SOURCE_LESSONS: LessonDefinition[] = [
  { id: 'lat-conditional-bridge', type: 'card', unit: 0 },
  { id: 'lat-empty-no-counterexample', type: 'card', unit: 0 },
  { id: 'lat-name-vacuity', type: 'card', unit: 0 },
  { id: 'lat-quantifier-universal', type: 'card', unit: 0 },
  { id: 'lat-existential-meaning', type: 'card', unit: 0 },
  { id: 'lat-name-existential', type: 'card', unit: 0 },
  { id: 'lat-quantifier-existential', type: 'card', unit: 0 },
  { id: 'lat-existential-conjunction', type: 'card', unit: 0 },
  { id: 'lat-ii-26-context', type: 'card', unit: 0 },
  { id: 'lat-ii-26-return', type: 'card', unit: 0 },
];

const SOURCE_LESSON_BY_ID = new Map(SOURCE_LESSONS.map((lesson) => [lesson.id, lesson]));

export function getSourceLesson(id: string): LessonDefinition | undefined {
  return SOURCE_LESSON_BY_ID.get(id);
}

export function isSourceLessonId(id: string): boolean {
  return SOURCE_LESSON_BY_ID.has(id);
}
