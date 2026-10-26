import { describe, expect, it } from 'vitest';
import { accountUi } from './account';

describe('account copy', () => {
  it('authors the same keys independently in EN and FR', () => {
    const en = accountUi('en');
    const fr = accountUi('fr');
    expect(Object.keys(en).sort()).toEqual(Object.keys(fr).sort());
    for (const key of Object.keys(en) as Array<keyof typeof en>) {
      expect(en[key].length, `en.${key}`).toBeGreaterThan(0);
      expect(fr[key].length, `fr.${key}`).toBeGreaterThan(0);
    }
    expect(en.passkeyCreate).not.toBe(fr.passkeyCreate);
    expect(en.passkeyHint).not.toMatch(/streak|don't lose|XP/i);
    expect(fr.passkeyHint).not.toMatch(/série|ne perdez pas|XP/i);
  });
});
