import { describe, expect, it } from 'vitest';
import { createLessonState } from './lesson-state';
import { LOGIC_AND_THEISM_READING_ROUTE_ID } from './routes';
import { renderSourceLearnView } from './source-learn-render';
import { getSourceLesson } from './source-lessons';

function renderTerminal(options: { isTerminal: boolean; routeComplete: boolean }): string {
  return renderSourceLearnView({
    locale: 'en',
    practiceUnlocked: false,
    activeRouteId: LOGIC_AND_THEISM_READING_ROUTE_ID,
    depth: 'reading',
    plan: [],
    itemIndex: 12,
    itemTotal: 12,
    isTerminal: options.isTerminal,
    routeComplete: options.routeComplete,
    lessonState: createLessonState('en', getSourceLesson('lat-ii-26-return')!),
  });
}

describe('source-learn terminal actions', () => {
  it('shows the completion CTA on the final unread item', () => {
    const html = renderTerminal({ isTerminal: true, routeComplete: false });
    expect(html).toContain('data-testid="source-complete"');
    expect(html).toContain('Done — return to the book');
    expect(html).not.toContain('data-testid="source-route-complete"');
    expect(html).toContain('Return to the passage');
  });

  it('hides the completion CTA after the route is complete', () => {
    const html = renderTerminal({ isTerminal: true, routeComplete: true });
    expect(html).not.toContain('data-testid="source-complete"');
    expect(html).not.toContain('data-action="lesson-next"');
    expect(html).toContain('data-testid="source-route-complete"');
    expect(html).toContain('Return to the passage');
    expect(html).toContain('Continue in Sobel at Chapter II');
  });
});
