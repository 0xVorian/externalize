import { describe, expect, it } from 'vitest';
import { LEVEL_0_LESSONS, LEVEL_2_LESSONS } from './lessons';
import { buildCourseOutline, hereLessonId } from './course-outline';
import { completeLesson, loadProgress } from './storage';

function completeIds(ids: readonly string[]) {
  let store = loadProgress();
  for (const id of ids) {
    store = completeLesson(store, id);
  }
  return store;
}

describe('course outline', () => {
  it('shows all three units for a new learner, with Unit 0 current', () => {
    const outline = buildCourseOutline(loadProgress());
    expect(outline.map((unit) => unit.unit)).toEqual([0, 1, 2]);
    expect(outline[0]?.status).toBe('current');
    expect(outline[0]?.done).toBe(0);
    expect(outline[0]?.total).toBe(LEVEL_0_LESSONS.length);
    expect(outline[1]?.status).toBe('locked');
    expect(outline[1]?.waitingOnUnit).toBe(0);
    expect(outline[2]?.status).toBe('locked');
    expect(outline[2]?.waitingOnUnit).toBe(1);
    expect(hereLessonId(loadProgress())).toBe('level0-01-letters');
    expect(outline[0]?.concepts[0]?.lessons[0]?.status).toBe('here');
    expect(outline[1]?.concepts[0]?.lessons.every((lesson) => lesson.status === 'locked')).toBe(
      true,
    );
  });

  it('marks completed Unit 0 lessons done and keeps later units visible', () => {
    const store = completeIds(LEVEL_0_LESSONS.map((lesson) => lesson.id));
    const outline = buildCourseOutline(store);
    expect(outline[0]?.status).toBe('done');
    expect(outline[0]?.done).toBe(LEVEL_0_LESSONS.length);
    expect(outline[0]?.concepts.every((group) => group.lessons.every((lesson) => lesson.status === 'done'))).toBe(
      true,
    );
    expect(outline[1]?.status).toBe('current');
    expect(outline[1]?.waitingOnUnit).toBeUndefined();
    expect(hereLessonId(store)).toBe('level1-01-neg');
    expect(outline[1]?.concepts[0]?.lessons[0]?.status).toBe('here');
    expect(outline[2]?.status).toBe('locked');
    expect(outline[2]?.concepts.some((group) => group.lessons.length > 0)).toBe(true);
  });

  it('marks a mid-Unit 1 position as you-are-here and later Unit 1 lessons as upcoming', () => {
    const through = [
      ...LEVEL_0_LESSONS.map((lesson) => lesson.id),
      'level1-01-neg',
      'level1-02-neg-watch',
    ];
    const store = completeIds(through);
    const outline = buildCourseOutline(store);
    expect(outline[1]?.current).toBe(true);
    const unit1Lessons = outline[1]!.concepts.flatMap((group) => group.lessons);
    expect(unit1Lessons.find((lesson) => lesson.id === 'level1-01-neg')?.status).toBe('done');
    expect(unit1Lessons.find((lesson) => lesson.id === 'level1-03-neg-guided')?.status).toBe(
      'here',
    );
    expect(unit1Lessons.find((lesson) => lesson.id === 'level1-07-imp')?.status).toBe('upcoming');
    expect(outline[2]?.status).toBe('locked');
    expect(outline[2]?.total).toBe(LEVEL_2_LESSONS.length);
  });
});
