import { describe, expect, it } from 'vitest';
import { learnUi } from './lessons';
import { sessionUi } from './session';
import { SOURCE_LESSONS, SOURCE_EXERCISES } from './source';

const JARGON = /∀|∃|vacuous|vacuité|quantifier|quantificateur|predicate|prédicati|implication|→|existential/i;

describe('session UI copy', () => {
  it('authors EN and FR independently without planner leakage', () => {
    const en = sessionUi('en');
    const fr = sessionUi('fr');
    expect(en.heading('start')).toBe('A short logic session');
    expect(fr.heading('start')).toBe('Une courte séance de logique');
    expect(en.heading('start')).not.toBe(fr.heading('start'));
    expect(en.doneForNow).toBe('Done for now');
    expect(fr.doneForNow).toContain('maintenant');
    const blob = JSON.stringify({ en, fr });
    expect(blob).not.toMatch(/missing prerequisite/i);
    expect(blob).not.toMatch(/prérequis manquant/i);
    expect(blob).not.toMatch(/unsupported bridge/i);
    expect(blob).not.toMatch(/pont court/i);
    expect(blob.toLowerCase()).not.toContain('planner');
  });

  it('keeps planner diagnostics out of learn UI copy', () => {
    const blob = JSON.stringify({ en: learnUi('en'), fr: learnUi('fr') });
    expect(blob).not.toMatch(/missing prerequisite/i);
    expect(blob).not.toMatch(/prérequis manquant/i);
    expect(blob).not.toMatch(/unsupported bridge/i);
    expect(blob).not.toMatch(/pont court/i);
    expect(blob).not.toMatch(/avant de poursuivre/i);
    expect(blob.toLowerCase()).not.toContain('planner');
  });
});

describe('Sobel meaning before terminology', () => {
  it('establishes the empty-class case without quantifier jargon', () => {
    for (const locale of ['en', 'fr'] as const) {
      const lesson = SOURCE_LESSONS[locale]['lat-conditional-bridge'];
      const visible = [lesson.title, lesson.subtitle, ...(lesson.card?.body ?? []), lesson.card?.example]
        .join(' ');
      expect(visible).not.toMatch(JARGON);
      const exercise = SOURCE_EXERCISES[locale]['lat-retrieve-conditional'];
      const exerciseVisible = [
        exercise.prompt,
        ...Object.values(exercise.choices ?? {}),
      ].join(' ');
      expect(exerciseVisible).not.toMatch(/∀|∃|vacuous|vacuité/i);
    }
    expect(SOURCE_LESSONS.en['lat-conditional-bridge'].card?.body[0]).not.toBe(
      SOURCE_LESSONS.fr['lat-conditional-bridge'].card?.body[0],
    );
  });

  it('names vacuity and ∀ only after the empty-class case', () => {
    const en = SOURCE_LESSONS.en['lat-quantifier-universal'].card!.body.join(' ');
    const fr = SOURCE_LESSONS.fr['lat-quantifier-universal'].card!.body.join(' ');
    expect(en).toMatch(/vacuity/i);
    expect(en).toContain('∀');
    expect(fr).toMatch(/cas de vérité par vacuité/);
    expect(fr).toContain('∀');
  });

  it('introduces ∃ after existential meaning and keeps commitment on the quantifier', () => {
    const en = SOURCE_LESSONS.en['lat-quantifier-existential'].card!.body.join(' ');
    const fr = SOURCE_LESSONS.fr['lat-quantifier-existential'].card!.body.join(' ');
    expect(en).toContain('∃');
    expect(en).toMatch(/existential commitment comes from that quantifier/i);
    expect(fr).toContain('∃');
    expect(fr).toMatch(/engagement existentiel vient de ce quantificateur/i);
  });

  it('returns to Descartes after the logical distinction', () => {
    const en = SOURCE_LESSONS.en['lat-ii-26-context'].card!.body.join(' ');
    expect(en).toMatch(/Descartes/i);
    expect(en).toMatch(/2\.6/);
  });
});
