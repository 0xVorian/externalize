import { describe, expect, it } from 'vitest';
import { getExerciseCopy, getLessonCopy, learnUi, onboardingUi, progressUi, sessionUi, ui, visibilityUi } from './index';

describe('learner-facing copy quality', () => {
  it('does not teach obsolete assignment toggles in the introductory truth-assignment lesson', () => {
    const en = getLessonCopy('en', 'level0-02-truth').card?.body.join(' ') ?? '';
    const fr = getLessonCopy('fr', 'level0-02-truth').card?.body.join(' ') ?? '';
    expect(en).not.toMatch(/tap T or F next to each letter/i);
    expect(fr).not.toMatch(/toucher V ou F à côté de chaque variable/i);
    expect(en).toMatch(/give you an assignment/i);
    expect(fr).toMatch(/donner une interprétation/i);
  });

  it('does not duplicate truth-value control labels inside truth-table prompts', () => {
    expect(getExerciseCopy('en', 'tt-001').prompt).not.toMatch(/T or F|True or False/i);
    expect(getExerciseCopy('fr', 'tt-001').prompt).not.toMatch(/V ou F|Vrai ou Faux/i);
  });

  it('introduces the current choose-then-check graded interaction in onboarding', () => {
    const en = onboardingUi('en').screens[1]!;
    const fr = onboardingUi('fr').screens[1]!;
    expect(`${en.title} ${en.body}`).toMatch(/Choose, then check.*correctness is revealed only after/i);
    expect(`${fr.title} ${fr.body}`).toMatch(/Choisissez, puis vérifiez.*correction n.apparaît qu’après/i);
  });

  it('keeps language-switch accessibility copy in the active interface language', () => {
    expect(ui('en').languageGroupAria).toBe('Language');
    expect(ui('en').switchTo('fr')).toBe('Switch to French');
    expect(ui('fr').languageGroupAria).toBe('Langue');
    expect(ui('fr').switchTo('en')).toBe('Passer en anglais');
  });

  it('uses route-neutral, natural session-opening copy', () => {
    const en = sessionUi('en');
    const fr = sessionUi('fr');
    expect(en.heading('continue')).not.toMatch(/reading/i);
    expect(en.detail('continue')).not.toMatch(/argument/i);
    expect(fr.detail('start')).not.toMatch(/régler un cours/i);
    expect(fr.detail('quick-review')).not.toMatch(/ce qui est dû/i);
    expect(fr.detail('idle')).not.toMatch(/est dû/i);
  });

  it('keeps Progress copy conservative and free of implementation jargon', () => {
    const en = visibilityUi('en');
    const fr = visibilityUi('fr');
    expect(en.sessionProgressAria(2, 5)).not.toMatch(/finalized/i);
    expect(en.youCanNowHeading).toMatch(/consistent/i);
    expect(fr.youCanNowHeading).not.toMatch(/vous savez/i);
    expect(fr.sessionProgressAria(2, 5)).not.toMatch(/finalis/i);
    expect(progressUi('fr').strugglesHeading).toBe('À consolider');
    expect(progressUi('fr').exerciseLocked).toBe('verrouillé');
  });

  it('describes prerequisites and Explore without gamified or grading language', () => {
    const en = learnUi('en');
    const fr = learnUi('fr');
    expect(en.practiceLocked).not.toMatch(/unlock/i);
    expect(en.level0Complete).not.toMatch(/unlock/i);
    expect(en.explorePrompt).not.toMatch(/graded/i);
    expect(fr.explorePrompt).not.toMatch(/notés/i);
    expect(progressUi('en').exercisesStatus(2, 4)).toContain('available');
    expect(progressUi('fr').exercisesStatus(2, 4)).toContain('disponible');
    expect(visibilityUi('en').momentExerciseUnlocked('eval-001')).not.toMatch(/unlocked/i);
    expect(visibilityUi('fr').upNextEmpty).not.toMatch(/s’ouvriront/i);
  });

  it('lets visible truth tables carry their own assignment context', () => {
    for (const locale of ['en', 'fr'] as const) {
      for (const id of ['tt-001', 'tt-002', 'tt-003', 'tt-004', 'tt-005', 'tt-006']) {
        const prompt = getExerciseCopy(locale, id).prompt;
        expect(prompt.length, `${locale}/${id}`).toBeLessThan(40);
        expect(prompt, `${locale}/${id}`).not.toMatch(/\b(?:P|Q|R)\b|true|false|vrai|faux/i);
      }
    }
  });

  it('separates long source setups from the question itself', () => {
    for (const locale of ['en', 'fr'] as const) {
      for (const id of ['lat-predict-descartes', 'lat-transfer-kind']) {
        const copy = getExerciseCopy(locale, id);
        expect(copy.context?.length, `${locale}/${id}`).toBeGreaterThan(0);
        expect(copy.prompt.length, `${locale}/${id}`).toBeLessThan(100);
      }
    }
  });

  it('keeps formal source-route explanations precise without awkward instance jargon', () => {
    const enExistential = getExerciseCopy('en', 'lat-check-existential');
    const frFormalize = getExerciseCopy('fr', 'lat-formalize-readings');
    const frTautology = getExerciseCopy('fr', 'val-004');
    expect(`${enExistential.choiceWrong} ${enExistential.feedback?.correct}`).not.toMatch(/reports an instance|asserts a witness/i);
    expect(frFormalize.choiceWrong).not.toMatch(/use de l’implication/i);
    expect(frTautology.cellWrong).not.toMatch(/sort jamais faux/i);
  });

});
