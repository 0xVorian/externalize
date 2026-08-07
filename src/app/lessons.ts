export type LessonType = 'card' | 'watch' | 'guided';

export type LessonDefinition = {
  id: string;
  type: LessonType;
  /** Formula for watch/guided lessons */
  formula?: string;
};

export const LEVEL_0_LESSONS: LessonDefinition[] = [
  { id: 'level0-01-letters', type: 'card' },
  { id: 'level0-02-truth', type: 'card' },
  { id: 'level0-03-and', type: 'card' },
  { id: 'level0-04-watch', type: 'watch', formula: 'P ∧ Q' },
  { id: 'level0-05-guided', type: 'guided', formula: 'P ∧ Q' },
];

export const PRACTICE_UNLOCK_ORDER = [
  'eval-001',
  'eval-002',
  'scope-003',
  'scope-001',
  'scope-002',
] as const;

export function getLessonDefinition(id: string): LessonDefinition | undefined {
  return LEVEL_0_LESSONS.find((lesson) => lesson.id === id);
}

export function nextLessonId(currentId: string): string | null {
  const index = LEVEL_0_LESSONS.findIndex((lesson) => lesson.id === currentId);
  if (index < 0 || index >= LEVEL_0_LESSONS.length - 1) {
    return null;
  }
  return LEVEL_0_LESSONS[index + 1].id;
}

export function firstIncompleteLesson(completed: string[]): LessonDefinition {
  for (const lesson of LEVEL_0_LESSONS) {
    if (!completed.includes(lesson.id)) {
      return lesson;
    }
  }
  return LEVEL_0_LESSONS[LEVEL_0_LESSONS.length - 1];
}
