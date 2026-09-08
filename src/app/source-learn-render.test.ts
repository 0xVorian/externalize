import { describe, expect, it } from 'vitest';
import { createLessonState } from './lesson-state';
import { LOGIC_AND_THEISM_READING_ROUTE_ID } from './routes';
import { renderSourceLearnView } from './source-learn-render';
import { getSourceLesson } from './source-lessons';
import { createState } from './state';
import { getExerciseDefinition } from './exercises';
import { getExerciseCopy } from '../i18n';

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


describe('source exercise copy hierarchy', () => {
  it('renders one concise question instead of repeating it in the shell', () => {
    const exercise = getExerciseDefinition('lat-retrieve-conditional')!;
    const state = createState('en', exercise);
    const prompt = getExerciseCopy('en', exercise.id).prompt;
    const html = renderSourceLearnView({
      locale: 'en',
      practiceUnlocked: true,
      activeRouteId: LOGIC_AND_THEISM_READING_ROUTE_ID,
      depth: 'reading',
      plan: [],
      itemIndex: 2,
      itemTotal: 12,
      isTerminal: false,
      routeComplete: false,
      practiceState: state,
    });

    expect(html).toContain('<h1>Quick check</h1>');
    expect(html.match(new RegExp(`<p class=\"exercise-prompt\">${prompt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</p>`, 'g'))).toHaveLength(1);
    expect(html).toContain('Alex did not sign the club register.');
    expect(html).toContain('G(x): x signed the club register.');
    expect(html).not.toContain(`<p class="queue-meta">${prompt}</p>`);
  });
});
