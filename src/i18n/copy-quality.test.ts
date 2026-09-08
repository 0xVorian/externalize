import { describe, expect, it } from 'vitest';
import { getExerciseCopy, getLessonCopy, onboardingUi } from './index';

describe('learner-facing copy quality', () => {
  it('does not teach obsolete assignment toggles in the introductory truth-assignment lesson', () => {
    const en = getLessonCopy('en', 'level0-02-truth').card?.body.join(' ') ?? '';
    const fr = getLessonCopy('fr', 'level0-02-truth').card?.body.join(' ') ?? '';
    expect(en).not.toMatch(/tap T or F next to each letter/i);
    expect(fr).not.toMatch(/toucher V ou F à côté de chaque variable/i);
    expect(en).toMatch(/give you an assignment/i);
    expect(fr).toMatch(/donner une interprétation/i);
  });

  it('uses ordinary truth words for the current truth-table answer controls', () => {
    expect(getExerciseCopy('en', 'tt-001').prompt).toMatch(/Choose True or False/i);
    expect(getExerciseCopy('fr', 'tt-001').prompt).toMatch(/Choisissez Vrai ou Faux/i);
  });

  it('introduces the current choose-then-check graded interaction in onboarding', () => {
    const en = onboardingUi('en').screens[1]!;
    const fr = onboardingUi('fr').screens[1]!;
    expect(`${en.title} ${en.body}`).toMatch(/Choose, then check.*correctness is revealed only after/i);
    expect(`${fr.title} ${fr.body}`).toMatch(/Choisissez, puis vérifiez.*correction n.apparaît qu’après/i);
  });
});
