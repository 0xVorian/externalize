import { describe, expect, it } from 'vitest';
import { createLessonState } from './lesson-state';
import { renderLessonView } from './lesson-render';
import { getLessonDefinition, LEVEL_0_LESSONS } from './lessons';
import { progressUi } from '../i18n';

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

  it('announces a unit-complete card live only on first presentation', () => {
    const state = createLessonState('en', getLessonDefinition('level0-02-truth')!);
    const notice = 'Introductory unit complete. Exercises are unlocked.';
    const liveHtml = renderLessonView(state, {
      ...defaultLearnProgress,
      unitCompleteNotice: notice,
      unitCompleteNoticeLive: true,
    });
    const liveTag = liveHtml.match(/<section class="unit-complete-card"[^>]*>/)?.[0];
    expect(liveTag).toContain('role="status"');
    expect(liveTag).toContain('aria-live="polite"');
    expect(liveHtml).toContain(notice);

    const laterHtml = renderLessonView(state, {
      ...defaultLearnProgress,
      unitCompleteNotice: notice,
      unitCompleteNoticeLive: false,
    });
    const laterTag = laterHtml.match(/<section class="unit-complete-card"[^>]*>/)?.[0];
    expect(laterTag).toContain('aria-live="off"');
    expect(laterTag).not.toContain('role="status"');
    expect(laterHtml).toContain(notice);
  });

  it('shows all three Course units for a new learner, with later units locked', () => {
    const state = createLessonState('en', getLessonDefinition('level0-01-letters')!);
    const html = renderLessonView(state, defaultLearnProgress);
    expect(html).toContain('data-testid="unit-picker"');
    expect(html).toContain('data-testid="unit-picker-0"');
    expect(html).toContain('data-testid="unit-picker-1"');
    expect(html).toContain('data-testid="unit-picker-2"');
    expect(html).toMatch(/data-unit="1"[^>]*data-status="locked"/);
    expect(html).toMatch(/data-testid="unit-picker-1"[^>]* disabled/);
    expect(html).toMatch(/data-unit="2"[^>]*data-status="locked"/);
    expect(html).toMatch(/data-testid="unit-picker-2"[^>]* disabled/);
    expect(html).toContain(progressUi('en').waitingOn(0));
    expect(html).toContain(progressUi('en').waitingOn(1));
    expect(html).not.toMatch(
      /data-testid="unit-picker-0"[^>]*disabled/,
    );
  });

  it('uses independent French waiting-on wording on locked Course units', () => {
    const state = createLessonState('fr', getLessonDefinition('level0-01-letters')!);
    const html = renderLessonView(state, defaultLearnProgress);
    expect(html).toContain(progressUi('fr').waitingOn(0));
    expect(html).toContain('0 leçons sur 15');
    expect(html).not.toContain(progressUi('en').waitingOn(0));
  });

  it('lets a finished Unit 0 stay selectable while Unit 2 remains locked', () => {
    const state = createLessonState('en', getLessonDefinition('level1-01-neg')!);
    const html = renderLessonView(state, {
      ...defaultLearnProgress,
      level0Complete: true,
      lessonsCompleted: LEVEL_0_LESSONS.map((lesson) => lesson.id),
      learnProgress: {
        unit: 1,
        lessonPosition: 1,
        lessonTotal: 15,
        completedInUnit: 0,
      },
    });
    expect(html).not.toMatch(
      /data-testid="unit-picker-0"[^>]*disabled/,
    );
    expect(html).not.toMatch(
      /data-testid="unit-picker-1"[^>]*disabled/,
    );
    expect(html).toMatch(/data-unit="2"[^>]*data-status="locked"/);
    expect(html).toMatch(/data-testid="unit-picker-2"[^>]* disabled/);
    expect(html).toContain(progressUi('en').waitingOn(1));
  });
});
