export type LessonType = 'card' | 'watch' | 'guided';

export type LessonDefinition = {
  id: string;
  type: LessonType;
  /** Formula for watch/guided lessons */
  formula?: string;
  /** Unit index: 0 = introductory syntax, 1 = connectives, 2 = nested formulas */
  unit: 0 | 1 | 2;
};

export const LEVEL_0_LESSONS: LessonDefinition[] = [
  { id: 'level0-01-letters', type: 'card', unit: 0 },
  { id: 'level0-02-truth', type: 'card', unit: 0 },
  { id: 'level0-03-and', type: 'card', unit: 0 },
  { id: 'level0-04-watch', type: 'watch', formula: 'P ∧ Q', unit: 0 },
  { id: 'level0-05-guided', type: 'guided', formula: 'P ∧ Q', unit: 0 },
];

export const LEVEL_1_LESSONS: LessonDefinition[] = [
  { id: 'level1-01-neg', type: 'card', unit: 1 },
  { id: 'level1-02-neg-watch', type: 'watch', formula: '¬P', unit: 1 },
  { id: 'level1-03-neg-guided', type: 'guided', formula: '¬P', unit: 1 },
  { id: 'level1-04-or', type: 'card', unit: 1 },
  { id: 'level1-05-or-watch', type: 'watch', formula: 'P ∨ Q', unit: 1 },
  { id: 'level1-06-or-guided', type: 'guided', formula: 'P ∨ Q', unit: 1 },
  { id: 'level1-07-imp', type: 'card', unit: 1 },
  { id: 'level1-08-imp-watch', type: 'watch', formula: 'P → Q', unit: 1 },
  { id: 'level1-09-imp-guided', type: 'guided', formula: 'P → Q', unit: 1 },
  { id: 'level1-10-iff', type: 'card', unit: 1 },
  { id: 'level1-11-iff-watch', type: 'watch', formula: 'P ↔ Q', unit: 1 },
  { id: 'level1-12-iff-guided', type: 'guided', formula: 'P ↔ Q', unit: 1 },
];

export const LEVEL_2_LESSONS: LessonDefinition[] = [
  { id: 'level2-01-nesting', type: 'card', unit: 2 },
  { id: 'level2-02-double-neg', type: 'card', unit: 2 },
  { id: 'level2-03-double-neg-watch', type: 'watch', formula: '¬¬P', unit: 2 },
  { id: 'level2-04-double-neg-guided', type: 'guided', formula: '¬¬P', unit: 2 },
  { id: 'level2-05-precedence', type: 'card', unit: 2 },
  { id: 'level2-06-demorgan', type: 'card', unit: 2 },
  { id: 'level2-07-demorgan-watch', type: 'watch', formula: '¬(P ∧ Q)', unit: 2 },
  { id: 'level2-08-demorgan-guided', type: 'guided', formula: '¬(P ∨ Q)', unit: 2 },
];

/** Full learn path: Unit 0, then Unit 1 (gated on level0Complete), then Unit 2 (gated on level1Complete). */
export const ALL_LEARN_LESSONS: LessonDefinition[] = [
  ...LEVEL_0_LESSONS,
  ...LEVEL_1_LESSONS,
  ...LEVEL_2_LESSONS,
];

/** Unit 0 practice — unlocks after level0Complete. */
export const LEVEL_0_PRACTICE_UNLOCK_ORDER = ['eval-001', 'scope-012'] as const;

/** Unit 1 practice — unlocks after all 12 Level 1 lessons. */
export const LEVEL_1_PRACTICE_UNLOCK_ORDER = [
  'eval-010', 'eval-003', 'eval-004', 'eval-005', 'tt-001', 'tt-002', 'tt-003',
  'scope-003', 'scope-009', 'scope-004', 'scope-007', 'eval-002', 'eval-006',
  'tt-004', 'tt-005', 'eval-007', 'eval-008', 'eval-009', 'scope-001', 'scope-005',
  'scope-006', 'scope-008', 'scope-010', 'scope-011', 'scope-002', 'translate-001',
] as const;

export const PRACTICE_UNLOCK_ORDER = [
  ...LEVEL_0_PRACTICE_UNLOCK_ORDER,
  ...LEVEL_1_PRACTICE_UNLOCK_ORDER,
] as const;

export type PracticeTier = 'unit0' | 'unit1';

export function practiceTier(exerciseId: string): PracticeTier {
  return (LEVEL_0_PRACTICE_UNLOCK_ORDER as readonly string[]).includes(exerciseId)
    ? 'unit0'
    : 'unit1';
}

const LESSON_BY_ID = new Map(ALL_LEARN_LESSONS.map((lesson) => [lesson.id, lesson]));

export function getLessonDefinition(id: string): LessonDefinition | undefined {
  return LESSON_BY_ID.get(id);
}

export function lessonsForUnit(unit: 0 | 1 | 2): LessonDefinition[] {
  if (unit === 0) return LEVEL_0_LESSONS;
  if (unit === 1) return LEVEL_1_LESSONS;
  return LEVEL_2_LESSONS;
}

export function lessonUnit(lessonId: string): 0 | 1 | 2 {
  return getLessonDefinition(lessonId)?.unit ?? 0;
}

export function isLevel0Complete(completed: string[]): boolean {
  return LEVEL_0_LESSONS.every((lesson) => completed.includes(lesson.id));
}

export function isLevel1Complete(completed: string[]): boolean {
  return LEVEL_1_LESSONS.every((lesson) => completed.includes(lesson.id));
}

export function isLevel2Complete(completed: string[]): boolean {
  return LEVEL_2_LESSONS.every((lesson) => completed.includes(lesson.id));
}

export function isLearnPathComplete(completed: string[]): boolean {
  return ALL_LEARN_LESSONS.every((lesson) => completed.includes(lesson.id));
}

export function nextLessonId(currentId: string): string | null {
  const index = ALL_LEARN_LESSONS.findIndex((lesson) => lesson.id === currentId);
  if (index < 0 || index >= ALL_LEARN_LESSONS.length - 1) return null;
  return ALL_LEARN_LESSONS[index + 1].id;
}

export function firstIncompleteLesson(completed: string[]): LessonDefinition {
  for (const lesson of LEVEL_0_LESSONS) {
    if (!completed.includes(lesson.id)) return lesson;
  }
  if (isLevel0Complete(completed)) {
    for (const lesson of LEVEL_1_LESSONS) {
      if (!completed.includes(lesson.id)) return lesson;
    }
  }
  if (isLevel1Complete(completed)) {
    for (const lesson of LEVEL_2_LESSONS) {
      if (!completed.includes(lesson.id)) return lesson;
    }
  }
  return ALL_LEARN_LESSONS[ALL_LEARN_LESSONS.length - 1];
}

export function firstIncompleteLessonInUnit(unit: 0 | 1 | 2, completed: string[]): LessonDefinition {
  const unitLessons = lessonsForUnit(unit);
  for (const lesson of unitLessons) {
    if (!completed.includes(lesson.id)) return lesson;
  }
  return unitLessons[0];
}
