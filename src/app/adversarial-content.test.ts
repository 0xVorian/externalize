import { describe, expect, it } from 'vitest';
import { EXERCISE_DEFINITIONS } from './exercises';
import { evaluateWithNodes, parse } from '../../engine';
import { getExerciseCopy } from '../i18n/messages';

describe('adversarial content checks', () => {
  it('evaluation assessment prompts do not state the root truth value', () => {
    for (const locale of ['en', 'fr'] as const) {
      for (const exercise of EXERCISE_DEFINITIONS.filter((e) => e.type === 'evaluate-formula')) {
        const copy = getExerciseCopy(locale, exercise.id);
        const prompt = copy.assessmentPrompt ?? copy.prompt;
        if (!exercise.initialAssignment) continue;
        const { root } = evaluateWithNodes(parse(exercise.formula!), exercise.initialAssignment);
        const rootLabel = root ? (locale === 'fr' ? 'V' : 'T') : locale === 'fr' ? 'F' : 'F';
        const opposite = root ? locale === 'fr' ? 'F' : 'F' : locale === 'fr' ? 'V' : 'T';
        expect(prompt.toLowerCase()).not.toContain(`is ${rootLabel.toLowerCase()}`);
        expect(prompt).not.toMatch(new RegExp(`\\b${rootLabel}\\b.*whole formula`, 'i'));
        expect(prompt).not.toContain(`whole formula is ${rootLabel}`);
        expect(prompt).not.toContain(`formule entière est ${rootLabel}`);
        void opposite;
      }
    }
  });
});
