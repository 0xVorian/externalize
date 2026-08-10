import { describe, expect, it } from 'vitest';
import { LEVEL_0_LESSONS, LEVEL_1_LESSONS, LEVEL_2_LESSONS, ALL_LEARN_LESSONS } from '../app/lessons';
import { getLessonCopy, learnUi, getReference } from './lessons';

const WATCH_STEP_COUNTS: Record<string, number> = {
  'level0-04-watch': 4,
  'level1-02-neg-watch': 2,
  'level1-05-or-watch': 4,
  'level1-08-imp-watch': 4,
  'level1-11-iff-watch': 4,
  'level2-03-double-neg-watch': 2,
  'level2-07-demorgan-watch': 4,
};

describe('lesson i18n', () => {
  for (const locale of ['en', 'fr'] as const) {
    it(`provides learn UI for ${locale}`, () => {
      const ui = learnUi(locale);
      expect(ui.learn).toBeTruthy();
      expect(ui.level0Title).toBeTruthy();
      expect(ui.level1Title).toBeTruthy();
      expect(ui.level2Title).toBeTruthy();
      expect(ui.level1Complete).toBeTruthy();
      expect(ui.level2Complete).toBeTruthy();
      expect(ui.unitPickerLabel).toBeTruthy();
      expect(ui.continueUnit1).toBeTruthy();
      expect(ui.continueUnit2).toBeTruthy();
    });

    it(`provides all level 0 lessons in ${locale}`, () => {
      for (const lesson of LEVEL_0_LESSONS) {
        const copy = getLessonCopy(locale, lesson.id);
        expect(copy.title.length).toBeGreaterThan(0);
        if (lesson.type === 'watch') {
          expect(copy.watchSteps?.length).toBe(WATCH_STEP_COUNTS[lesson.id]);
        }
        if (lesson.type === 'guided') {
          expect(copy.guidedSteps?.length).toBe(3);
          for (const step of copy.guidedSteps ?? []) {
            if (step.kind === 'hint') {
              expect(step.atom).toBeTruthy();
            }
          }
        }
      }
    });

    it(`provides all level 1 lessons in ${locale}`, () => {
      for (const lesson of LEVEL_1_LESSONS) {
        const copy = getLessonCopy(locale, lesson.id);
        expect(copy.title.length).toBeGreaterThan(0);
        if (lesson.type === 'card') {
          expect(copy.card?.body.length).toBeGreaterThan(0);
        }
        if (lesson.type === 'watch') {
          expect(copy.watchSteps?.length).toBe(WATCH_STEP_COUNTS[lesson.id]);
        }
        if (lesson.type === 'guided') {
          expect(copy.guidedSteps?.some((step) => step.kind === 'done')).toBe(true);
          for (const step of copy.guidedSteps ?? []) {
            if (step.kind === 'hint') {
              expect(step.atom).toBeTruthy();
            }
          }
        }
      }
    });

    it(`provides all level 2 lessons in ${locale}`, () => {
      for (const lesson of LEVEL_2_LESSONS) {
        const copy = getLessonCopy(locale, lesson.id);
        expect(copy.title.length).toBeGreaterThan(0);
        if (lesson.type === 'card') {
          expect(copy.card?.body.length).toBeGreaterThan(0);
        }
        if (lesson.type === 'watch') {
          expect(copy.watchSteps?.length).toBe(WATCH_STEP_COUNTS[lesson.id]);
        }
        if (lesson.type === 'guided') {
          expect(copy.guidedSteps?.some((step) => step.kind === 'done')).toBe(true);
          for (const step of copy.guidedSteps ?? []) {
            if (step.kind === 'hint') {
              expect(step.atom).toBeTruthy();
            }
          }
        }
      }
    });

    it(`provides operator reference in ${locale}`, () => {
      expect(getReference(locale).length).toBeGreaterThanOrEqual(5);
    });
  }

  it('does not use ⊃ as a sentence-letter gloss in lesson 0.1', () => {
    for (const locale of ['en', 'fr'] as const) {
      const example = getLessonCopy(locale, 'level0-01-letters').card?.example ?? '';
      expect(example).not.toContain('⊃');
    }
  });

  it('covers every learn-path lesson in both locales', () => {
    for (const lesson of ALL_LEARN_LESSONS) {
      expect(() => getLessonCopy('en', lesson.id)).not.toThrow();
      expect(() => getLessonCopy('fr', lesson.id)).not.toThrow();
    }
  });
});
