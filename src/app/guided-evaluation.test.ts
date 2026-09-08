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
    expect(html).toContain('Choose the value for P.');
    expect(html.match(/Choose the value for P\./g)).toHaveLength(1);
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
    expect(selected.assignment.P).toBe(false);
    expect(selected.complete).toBe(false);
    expect(selected.guidedStep).toBe(0);
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
    expect(wrong.assignment.P).toBe(false);
    expect(wrong.guidedCheckFailed).toBe(true);
    expect(wrong.guidedSelection).toBe(false);

    const wrongHtml = renderLessonView(wrong, defaultLearnProgress);
    expect(wrongHtml).toContain('feedback-wrong');
    expect(wrongHtml).toContain(learnUi('en').guidedValueWrong('P'));
    expect(wrongHtml).toContain('data-testid="guided-response-workspace"');
    expect(wrongHtml).toContain('data-action="check-guided-value"');

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
    expect(html).toContain('data-action="lesson-next"');
    const done = getLessonCopy('en', 'level0-05-guided').guidedSteps?.find((step) => step.kind === 'done');
    expect(html).toContain(done?.text ?? 'missing done copy');
  });
});

describe('full-assignment contexts stay on the assignment panel', () => {
  it('keeps Explore on the multi-atom assignment controls', () => {
    const html = renderExploreView(createExploreState('en'), true);
    expect(html).toContain('atom-panel');
    expect(html).toContain('data-action="set-explore-atom"');
    expect(html).not.toContain('data-testid="guided-response-workspace"');
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
