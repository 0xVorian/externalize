import { describe, expect, it } from 'vitest';
import { LEVEL_0_LESSONS, LEVEL_0_PRACTICE_UNLOCK_ORDER } from './lessons';
import { requiredLessonsForExercise } from './prerequisites';

describe('Level 0 practice progression', () => {
  it('requires only material taught in Unit 0 before each graded exercise', () => {
    const level0LessonIds = new Set(LEVEL_0_LESSONS.map((lesson) => lesson.id));

    for (const exerciseId of LEVEL_0_PRACTICE_UNLOCK_ORDER) {
      const required = requiredLessonsForExercise(exerciseId);
      expect(required.length).toBeGreaterThan(0);
      for (const lessonId of required) {
        expect(
          level0LessonIds.has(lessonId),
          `${exerciseId} requires ${lessonId}, which is not taught in Unit 0`,
        ).toBe(true);
      }
    }
  });

  it('does not require nested main-connective scope work in Unit 0', () => {
    expect(LEVEL_0_PRACTICE_UNLOCK_ORDER).not.toContain('scope-012');
  });
});
