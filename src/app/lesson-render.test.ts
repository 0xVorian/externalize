import { describe, expect, it } from 'vitest';
import { createLessonState } from './lesson-state';
import { renderLessonView } from './lesson-render';
import { getLessonDefinition } from './lessons';

describe('lesson presentation routing', () => {
  it('renders the configured 2x2 watch grid for level0-04-watch', () => {
    const state = createLessonState(
      'en',
      getLessonDefinition('level0-04-watch')!,
    );
    const html = renderLessonView(state, {
      practiceUnlocked: false,
      level0Complete: false,
      level1Complete: false,
      learnPathComplete: false,
    });
    expect(html).toContain('class="watch-grid"');
    expect(html).not.toContain('class="truth-table"');
  });
});
