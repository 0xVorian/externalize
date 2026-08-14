import { describe, expect, it } from 'vitest';
import { createLessonState } from './lesson-state';
import { renderLessonView } from './lesson-render';
import { getLessonDefinition } from './lessons';

const defaultLearnProgress = {
  practiceUnlocked: false,
  level0Complete: false,
  level1Complete: false,
  learnPathComplete: false,
  learnProgress: {
    unit: 0 as const,
    lessonPosition: 1,
    lessonTotal: 5,
    completedInUnit: 0,
  },
};

describe('lesson presentation routing', () => {
  it('renders the configured 2x2 watch grid for level0-04-watch', () => {
    const state = createLessonState(
      'en',
      getLessonDefinition('level0-04-watch')!,
    );
    const html = renderLessonView(state, defaultLearnProgress);
    expect(html).toContain('class="watch-grid"');
    expect(html).not.toContain('class="truth-table"');
  });

  it('renders compact unit and lesson progress', () => {
    const state = createLessonState(
      'en',
      getLessonDefinition('level0-02-truth')!,
    );
    const html = renderLessonView(state, {
      ...defaultLearnProgress,
      learnProgress: {
        unit: 0,
        lessonPosition: 2,
        lessonTotal: 5,
        completedInUnit: 1,
      },
    });
    expect(html).toContain('data-testid="learn-progress"');
    expect(html).toContain('Lesson 2 of 5');
    expect(html).toContain('1 completed');
    expect(html).toContain('role="meter"');
    expect(html).toContain('aria-valuenow="1"');
  });
});
