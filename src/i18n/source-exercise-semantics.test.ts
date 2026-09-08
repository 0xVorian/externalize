import { describe, expect, it } from 'vitest';
import { getExerciseDefinition } from '../app/exercises';
import { SOURCE_EXERCISES } from './source';

describe('Sobel source exercise semantics', () => {
  it('keeps the empty-club prediction choices neutral until feedback', () => {
    const en = SOURCE_EXERCISES.en['lat-predict-empty-club'];
    const fr = SOURCE_EXERCISES.fr['lat-predict-empty-club'];

    expect(en.choices).toEqual({
      'still-true': 'Yes — it is still true.',
      'needs-instance': 'No — there must be at least one member.',
    });
    expect(fr.choices).toEqual({
      'still-true': 'Oui — elle reste vraie.',
      'needs-instance': 'Non — il faut au moins un membre.',
    });

    const visibleChoices = [
      ...Object.values(en.choices ?? {}),
      ...Object.values(fr.choices ?? {}),
    ].join(' ');
    expect(visibleChoices).not.toMatch(/failed to sign|contradict|counterexample|manqué de signer|contredit|contre-exemple/i);

    expect(`${en.choiceWrong} ${en.feedback?.correct}`).toMatch(/counterexample|failed to sign/i);
    expect(`${fr.choiceWrong} ${fr.feedback?.correct}`).toMatch(/contre-exemple|manqué de signer/i);
  });

  it('makes the conditional evidence check a determinate true-or-false application', () => {
    const definition = getExerciseDefinition('lat-retrieve-conditional');
    expect(definition?.formula).toBe('F(a) → G(a)');
    expect(definition?.correctChoiceId).toBe('holds');

    const en = SOURCE_EXERCISES.en['lat-retrieve-conditional'];
    expect(en.prompt).toBe('Is F(a) → G(a) true or false?');
    expect(en.context?.join(' ')).toMatch(/not a club member.*did not sign the club register/i);
    expect(en.context?.join(' ')).toMatch(/G\(x\).*signed the club register/i);
    expect(en.choices).toEqual({ holds: 'True', fails: 'False' });
    expect(`${en.choiceWrong} ${en.feedback?.correct}`).toMatch(/false only when the if-clause is true and the then-clause is false/i);

    const fr = SOURCE_EXERCISES.fr['lat-retrieve-conditional'];
    expect(fr.prompt).toBe('F(a) → G(a) est-elle vraie ou fausse ?');
    expect(fr.context?.join(' ')).toMatch(/n’est pas membre du club.*n’a pas signé le registre du club/i);
    expect(fr.context?.join(' ')).toMatch(/G\(x\).*a signé le registre du club/i);
    expect(fr.choices).toEqual({ holds: 'Vraie', fails: 'Fausse' });
    expect(`${fr.choiceWrong} ${fr.feedback?.correct}`).toMatch(/fausse seulement lorsque.*« si ».*vrai.*« alors ».*faux/i);
  });
});
