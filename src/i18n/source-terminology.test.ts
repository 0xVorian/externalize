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
    expect(fr.detail('start')).toContain('étapes courtes');
    expect(fr.detail('quick-review')).toContain('courte révision');
    expect(en.heading('start')).not.toBe(fr.heading('start'));
    expect(en.doneForNow).toBe('Done for now');
    expect(fr.doneForNow).toContain('maintenant');
    const blob = JSON.stringify({ en, fr });
    expect(blob).not.toMatch(/missing prerequisite/i);
    expect(blob).not.toMatch(/prérequis manquant/i);
    expect(blob).not.toMatch(/unsupported bridge/i);
    expect(blob).not.toMatch(/pont court/i);
    expect(blob.toLowerCase()).not.toContain('planner');
    expect(blob).not.toMatch(/séance bornée|étapes bornées|récupération courte|assertion couvrante/i);
    expect(blob).not.toMatch(/bounded round|retrieval round/i);
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
  const firstVisible = (locale: 'en' | 'fr', id: string) => {
    const lesson = SOURCE_LESSONS[locale][id];
    return [lesson.title, lesson.subtitle, ...(lesson.card?.body ?? []), lesson.card?.example]
      .join(' ');
  };

  it('establishes the empty-class case without quantifier jargon', () => {
    for (const locale of ['en', 'fr'] as const) {
      const visible = firstVisible(locale, 'lat-conditional-bridge');
      expect(visible).not.toMatch(JARGON);
      expect(visible).not.toMatch(/counterexample|contre-exemple|vacuity|vacuité/i);
      expect(visible).not.toMatch(/nobody failed|personne n’a manqué|can still hold|peut encore valoir/i);
      const exercise = SOURCE_EXERCISES[locale]['lat-predict-empty-club'];
      const exerciseVisible = [
        exercise.prompt,
        ...Object.values(exercise.choices ?? {}),
      ].join(' ');
      expect(exerciseVisible).not.toMatch(/∀|∃|vacuous|vacuité|→/i);
    }
    expect(SOURCE_LESSONS.en['lat-conditional-bridge'].card?.body[0]).not.toBe(
      SOURCE_LESSONS.fr['lat-conditional-bridge'].card?.body[0],
    );
  });

  it('keeps the empty-club setup free of the later explanation', () => {
    const en = firstVisible('en', 'lat-conditional-bridge');
    const fr = firstVisible('fr', 'lat-conditional-bridge');
    expect(en).not.toMatch(/no counterexample|nothing stands against|true because/i);
    expect(fr).not.toMatch(/aucun contre-exemple|rien .* ne s’oppose|vraie faute/i);
  });

  it('explains the missing counterexample before naming vacuity', () => {
    for (const locale of ['en', 'fr'] as const) {
      const visible = firstVisible(locale, 'lat-empty-no-counterexample');
      expect(visible).not.toMatch(JARGON);
      expect(visible.toLowerCase()).toMatch(/counterexample|contre-exemple/);
    }
    const vacuity = firstVisible('en', 'lat-name-vacuity');
    expect(vacuity).toMatch(/vacuity/i);
    expect(vacuity).not.toContain('∀');
    expect(firstVisible('fr', 'lat-name-vacuity')).toMatch(/cas de vérité par vacuité/);
    expect(firstVisible('fr', 'lat-name-vacuity')).not.toContain('∀');
  });

  it('introduces ordinary if–then before the arrow, and the arrow before ∀', () => {
    const meaningEn = firstVisible('en', 'lat-conditional-meaning');
    const meaningFr = firstVisible('fr', 'lat-conditional-meaning');
    expect(meaningEn).toMatch(/if someone is a member, then that person signed the register/i);
    expect(meaningEn).not.toMatch(/∀|∃|→|material conditional/i);
    expect(meaningFr).toMatch(/si quelqu’un est membre, alors cette personne a signé le registre/i);
    expect(meaningFr).not.toMatch(/∀|∃|→|implication matérielle/i);

    const notationEn = firstVisible('en', 'lat-conditional-notation');
    const notationFr = firstVisible('fr', 'lat-conditional-notation');
    expect(notationEn).toContain('→');
    expect(notationEn).toMatch(/F\(x\) → G\(x\)/);
    expect(notationEn).not.toContain('∀');
    expect(notationEn).not.toMatch(/material conditional/i);
    expect(notationFr).toContain('→');
    expect(notationFr).toMatch(/F\(x\) → G\(x\)/);
    expect(notationFr).not.toContain('∀');
    expect(notationFr).not.toMatch(/implication matérielle/i);

    const universalMeaning = firstVisible('en', 'lat-universal-meaning');
    expect(universalMeaning).not.toContain('∀');
    expect(universalMeaning).toMatch(/for each object/i);

    const forallEn = firstVisible('en', 'lat-quantifier-universal');
    expect(forallEn).toContain('∀x (F(x) → G(x))');
    expect(forallEn).toMatch(/universal quantifier/i);
  });

  it('introduces ∀ only after vacuity has been named', () => {
    const en = firstVisible('en', 'lat-quantifier-universal');
    const fr = firstVisible('fr', 'lat-quantifier-universal');
    expect(en).toContain('∀');
    expect(en).toMatch(/universal quantifier/i);
    expect(fr).toContain('∀');
    expect(fr).toMatch(/quantificateur universel/);
  });

  it('establishes existential meaning before ∃ or the academic name', () => {
    const meaningEn = firstVisible('en', 'lat-existential-meaning');
    const meaningFr = firstVisible('fr', 'lat-existential-meaning');
    expect(meaningEn).not.toMatch(/∀|∃|quantifier|existential/i);
    expect(meaningFr).not.toMatch(/∀|∃|quantificateur|existentiel/i);
    expect(meaningEn).toMatch(/at least one member signed the register/i);
    expect(meaningFr).toMatch(/au moins un membre a signé le registre/i);
    expect(meaningFr).not.toMatch(/Quelque membre a signé/);

    const nameEn = firstVisible('en', 'lat-name-existential');
    const nameFr = firstVisible('fr', 'lat-name-existential');
    expect(nameEn).toMatch(/existential claim/i);
    expect(nameEn).not.toContain('∃');
    expect(nameFr).toMatch(/assertion existentielle/i);
    expect(nameFr).not.toContain('∃');
  });

  it('introduces ∃ after existential meaning, without witness or commitment jargon', () => {
    const en = firstVisible('en', 'lat-quantifier-existential');
    const fr = firstVisible('fr', 'lat-quantifier-existential');
    expect(en).toContain('∃');
    expect(en).toMatch(/existential quantifier/i);
    expect(en).toMatch(/at least one F/i);
    expect(en).not.toMatch(/witness|existential commitment|F\(x\) ∧ G\(x\)/i);
    expect(fr).toContain('∃');
    expect(fr).toMatch(/quantificateur existentiel/);
    expect(fr).not.toMatch(/témoin|engagement existentiel|F\(x\) ∧ G\(x\)/i);
  });

  it('teaches same-witness conjunction only after ∃', () => {
    const en = firstVisible('en', 'lat-existential-conjunction');
    const fr = firstVisible('fr', 'lat-existential-conjunction');
    expect(en).toMatch(/F\(x\) ∧ G\(x\)/);
    expect(en).toMatch(/same witness/i);
    expect(en).toMatch(/existential commitment is in ∃/i);
    expect(fr).toMatch(/F\(x\) ∧ G\(x\)/);
    expect(fr).toMatch(/même témoin/);
    expect(fr).toMatch(/engagement existentiel vient de ∃/i);
  });

  it('returns to Descartes after the logical distinction', () => {
    const en = SOURCE_LESSONS.en['lat-ii-26-context'].card!.body.join(' ');
    expect(en).toMatch(/Descartes/i);
    expect(en).toMatch(/2\.6/);
  });
});
