import { describe, expect, it } from 'vitest';
import { getLessonCopy, learnUi } from '../i18n';
import { getExerciseDefinition } from './exercises';
import { createExploreState } from './explore-state';
import { renderExploreView } from './explore-render';
import { getLessonDefinition } from './lessons';
import {
  checkGuidedSelection,
  createLessonState,
  selectGuidedValue,
} from './lesson-state';
import { renderLessonView } from './lesson-render';
import { renderApp } from './render';
import { createState } from './state';

const defaultLearnProgress = {
  practiceUnlocked: false,
  level0Complete: false,
  level1Complete: false,
  learnPathComplete: false,
  learnProgress: {
    unit: 0 as const,
    lessonPosition: 5,
    lessonTotal: 5,
    completedInUnit: 4,
  },
};

function renderGuided(locale: 'en' | 'fr' = 'en') {
  const state = createLessonState(locale, getLessonDefinition('level0-05-guided')!);
  return { state, html: renderLessonView(state, defaultLearnProgress) };
}

describe('single-target guided evaluation', () => {
  it('does not render the whole-assignment control block while one atom is active', () => {
    const { html } = renderGuided();
    expect(html).not.toContain('atom-panel');
    expect(html).not.toContain('Truth assignment');
    expect(html).not.toContain('data-action="set-atom-value"');
    expect(html).toContain('data-testid="guided-response-workspace"');
  });

  it('shows exactly one blank target for the active atom', () => {
    const { html } = renderGuided();
    expect(html.match(/data-testid="guided-target-cell"/g)).toHaveLength(1);
    expect(html).toContain('truth-table-drop-slot empty');
    expect(html).toContain('Set P to true.');
    expect(html.match(/Set P to true\./g)).toHaveLength(1);
    expect(html).toContain('unknown-cell');
    expect(html).toMatch(/data-testid="truth-result-cell"><span[^>]*>—<\/span>/);
  });

  it('uses ordinary True / False and Vrai / Faux as answer choices', () => {
    const en = renderGuided('en').html;
    const fr = renderGuided('fr').html;
    expect(en).toContain('>True</button>');
    expect(en).toContain('>False</button>');
    expect(fr).toContain('>Vrai</button>');
    expect(fr).toContain('>Faux</button>');
    expect(en).not.toMatch(/data-action="select-guided-value"[^>]*>\s*T\s*<\/button>/);
    expect(fr).not.toMatch(/data-action="select-guided-value"[^>]*>\s*V\s*<\/button>/);
    expect(learnUi('en').check).toBe('Check');
    expect(learnUi('fr').check).toBe('Vérifier');
  });

  it('fills the target with formal notation on a provisional selection', () => {
    const initial = createLessonState('en', getLessonDefinition('level0-05-guided')!);
    const selected = selectGuidedValue(initial, true);
    const html = renderLessonView(selected, defaultLearnProgress);
    expect(html).toContain('truth-table-drop-slot filled');
    expect(html).toMatch(/guided-target-cell[\s\S]*?>T<\/span>/);
    expect(html).toContain('cell-segment true selected');
    expect(html).toMatch(/data-testid="truth-result-cell"><span[^>]*>—<\/span>/);
    expect(selected.assignment.P).toBeUndefined();
    expect(selected.complete).toBe(false);
    expect(selected.guidedStep).toBe(0);
    expect(html).not.toContain('feedback-correct');
    expect(html).not.toContain('feedback-wrong');
  });

  it('does not reveal a determined P ∧ Q result from a provisional P = F', () => {
    const initial = createLessonState('en', getLessonDefinition('level0-05-guided')!);
    const selected = selectGuidedValue(initial, false);
    const html = renderLessonView(selected, defaultLearnProgress);
    expect(html).toMatch(/guided-target-cell[\s\S]*?>F<\/span>/);
    expect(html).toMatch(/data-testid="truth-result-cell"><span[^>]*>—<\/span>/);
    expect(html).not.toContain('feedback-correct');
    expect(html).not.toContain('feedback-wrong');
  });

  it('does not advance or show correctness until Check', () => {
    const initial = createLessonState('en', getLessonDefinition('level0-05-guided')!);
    const selected = selectGuidedValue(initial, true);
    expect(selected.assignment).toEqual(initial.assignment);
    expect(selected.complete).toBe(false);
    expect(selected.guidedCheckFailed).toBe(false);
    expect(checkGuidedSelection(initial)).toBe(initial);

    const checked = checkGuidedSelection(selected);
    expect(checked.assignment.P).toBe(true);
    expect(checked.guidedStep).toBe(1);
    expect(checked.complete).toBe(false);
    expect(checked.guidedSelection).toBeNull();
  });

  it('keeps a wrong check repairable in place', () => {
    const initial = createLessonState('en', getLessonDefinition('level0-05-guided')!);
    const wrong = checkGuidedSelection(selectGuidedValue(initial, false));
    expect(wrong.complete).toBe(false);
    expect(wrong.guidedStep).toBe(0);
    expect(wrong.assignment.P).toBeUndefined();
    expect(wrong.guidedCheckFailed).toBe(true);
    expect(wrong.guidedSelection).toBe(false);

    const wrongHtml = renderLessonView(wrong, defaultLearnProgress);
    expect(wrongHtml).toContain('feedback-wrong');
    expect(wrongHtml).toContain(learnUi('en').guidedValueWrong('P'));
    expect(wrongHtml).toContain('data-testid="guided-response-workspace"');
    expect(wrongHtml).toContain('data-action="check-guided-value"');
    expect(wrongHtml).toMatch(/guided-target-cell[\s\S]*?>F<\/span>/);
    expect(wrongHtml).toMatch(/data-testid="truth-result-cell"><span[^>]*>—<\/span>/);

    const repaired = checkGuidedSelection(selectGuidedValue(wrong, true));
    expect(repaired.guidedCheckFailed).toBe(false);
    expect(repaired.assignment.P).toBe(true);
    expect(repaired.guidedStep).toBe(1);
  });

  it('shows Continue only after the guided assignment is complete', () => {
    let state = createLessonState('en', getLessonDefinition('level0-05-guided')!);
    state = checkGuidedSelection(selectGuidedValue(state, true));
    state = checkGuidedSelection(selectGuidedValue(state, false));
    expect(state.complete).toBe(true);
    const html = renderLessonView(state, defaultLearnProgress);
    expect(html).not.toContain('data-testid="guided-response-workspace"');
    expect(html).not.toContain('data-testid="guided-target-cell"');
    expect(html).toContain('feedback-correct');
    expect(html).toMatch(/data-testid="truth-result-cell">F<\/td>/);
    expect(html).toContain('data-action="lesson-next"');
    const done = getLessonCopy('en', 'level0-05-guided').guidedSteps?.find((step) => step.kind === 'done');
    expect(html).toContain(done?.text ?? 'missing done copy');
  });

  it('keeps unknown atoms distinct from false and hides undetermined results', () => {
    const initial = createLessonState('en', getLessonDefinition('level0-05-guided')!);
    expect(initial.assignment).toEqual({});
    expect(initial.assignment.P).toBeUndefined();
    expect(initial.assignment.Q).toBeUndefined();

    const html = renderLessonView(initial, defaultLearnProgress);
    expect(html).toContain('unknown-cell');
    expect(html).not.toMatch(/<td>F<\/td>/);
    expect(html).toMatch(/data-testid="truth-result-cell"><span[^>]*>—<\/span>/);

    const afterP = checkGuidedSelection(selectGuidedValue(initial, true));
    expect(afterP.assignment).toEqual({ P: true });
    expect(afterP.assignment.Q).toBeUndefined();
    const afterPHtml = renderLessonView(afterP, defaultLearnProgress);
    expect(afterPHtml).toContain('Now set Q to false.');
    expect(afterPHtml).toContain('>T</td>');
    expect(afterPHtml).toContain('data-testid="guided-target-cell"');
    expect(afterPHtml).toMatch(/data-testid="truth-result-cell"><span[^>]*>—<\/span>/);
  });

  it('does not show a definite ¬P result while P is unset', () => {
    const state = createLessonState('en', getLessonDefinition('level1-03-neg-guided')!);
    const html = renderLessonView(state, defaultLearnProgress);
    expect(html).toContain('Choose P so that ¬P is false.');
    expect(html).toContain('truth-table-drop-slot empty');
    expect(html).not.toMatch(/<td>T<\/td>/);
    expect(html).not.toMatch(/<td>F<\/td>/);
    expect(html).toMatch(/data-testid="truth-result-cell"><span[^>]*>—<\/span>/);
  });

  it('keeps ¬P undetermined while a provisional selection is pending Check', () => {
    const state = createLessonState('en', getLessonDefinition('level1-03-neg-guided')!);

    const selectedFalse = selectGuidedValue(state, false);
    const falseHtml = renderLessonView(selectedFalse, defaultLearnProgress);
    expect(falseHtml).toMatch(/guided-target-cell[\s\S]*?>F<\/span>/);
    expect(falseHtml).toMatch(/data-testid="truth-result-cell"><span[^>]*>—<\/span>/);
    expect(falseHtml).not.toContain('feedback-correct');
    expect(falseHtml).not.toContain('feedback-wrong');
    expect(selectedFalse.complete).toBe(false);
    expect(selectedFalse.guidedCheckFailed).toBe(false);

    const selectedTrue = selectGuidedValue(state, true);
    const trueHtml = renderLessonView(selectedTrue, defaultLearnProgress);
    expect(trueHtml).toMatch(/guided-target-cell[\s\S]*?>T<\/span>/);
    expect(trueHtml).toMatch(/data-testid="truth-result-cell"><span[^>]*>—<\/span>/);
    expect(trueHtml).not.toContain('feedback-correct');
    expect(trueHtml).not.toContain('feedback-wrong');
  });

  it('reveals the derived ¬P result only after a successful final Check', () => {
    const initial = createLessonState('en', getLessonDefinition('level1-03-neg-guided')!);
    const wrong = checkGuidedSelection(selectGuidedValue(initial, false));
    expect(wrong.guidedCheckFailed).toBe(true);
    const wrongHtml = renderLessonView(wrong, defaultLearnProgress);
    expect(wrongHtml).toContain('feedback-wrong');
    expect(wrongHtml).toContain('data-testid="guided-response-workspace"');
    expect(wrongHtml).toMatch(/guided-target-cell[\s\S]*?>F<\/span>/);
    expect(wrongHtml).toMatch(/data-testid="truth-result-cell"><span[^>]*>—<\/span>/);

    const repaired = checkGuidedSelection(selectGuidedValue(wrong, true));
    expect(repaired.complete).toBe(true);
    expect(repaired.assignment).toEqual({ P: true });
    const doneHtml = renderLessonView(repaired, defaultLearnProgress);
    expect(doneHtml).toContain('feedback-correct');
    expect(doneHtml).not.toContain('data-testid="guided-response-workspace"');
    expect(doneHtml).toMatch(/data-testid="truth-result-cell">F<\/td>/);
  });
});

describe('full-assignment contexts stay on the assignment panel', () => {
  it('keeps Explore on the multi-atom assignment controls', () => {
    const html = renderExploreView(createExploreState('en'), true);
    expect(html).toContain('atom-panel');
    expect(html).toContain('data-action="set-explore-atom"');
    expect(html).not.toContain('data-testid="guided-response-workspace"');
    expect(html).toContain('>F</td>');
    expect(html).toMatch(/data-testid="truth-result-cell">F<\/td>/);
  });

  it('keeps find-counterexample on editable assignment controls', () => {
    const html = renderApp(createState('en', getExerciseDefinition('counter-001')!), 0, true);
    expect(html).toContain('atom-panel');
    expect(html).toContain('data-action="set-atom-value"');
    expect(html).not.toContain('data-testid="guided-response-workspace"');
    expect(html).not.toContain('data-testid="guided-target-cell"');
  });

  it('keeps given-assignment evaluation on the read-only assignment panel', () => {
    const html = renderApp(createState('en', getExerciseDefinition('eval-001')!), 0, true);
    expect(html).toContain('atom-panel-readonly');
    expect(html).toContain('Truth assignment');
    expect(html).not.toContain('data-testid="guided-response-workspace"');
    expect(html).not.toContain('data-testid="guided-target-cell"');
  });
});
