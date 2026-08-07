import { describe, expect, it } from 'vitest';
import { LEVEL_0_LESSONS } from '../app/lessons';
import { getLessonCopy, learnUi, getReference } from './lessons';

describe('lesson i18n', () => {
  for (const locale of ['en', 'fr'] as const) {
    it(`provides learn UI for ${locale}`, () => {
      expect(learnUi(locale).learn).toBeTruthy();
      expect(learnUi(locale).level0Title).toBeTruthy();
    });

    it(`provides all level 0 lessons in ${locale}`, () => {
      for (const lesson of LEVEL_0_LESSONS) {
        const copy = getLessonCopy(locale, lesson.id);
        expect(copy.title.length).toBeGreaterThan(0);
        if (lesson.type === 'watch') {
          expect(copy.watchSteps?.length).toBe(4);
        }
        if (lesson.type === 'guided') {
          expect(copy.guidedSteps?.length).toBe(3);
        }
      }
    });

    it(`provides operator reference in ${locale}`, () => {
      expect(getReference(locale).length).toBeGreaterThanOrEqual(5);
    });
  }
});
