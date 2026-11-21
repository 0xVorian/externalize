import { describe, expect, it } from 'vitest';
import { getExerciseCopy } from '../i18n';
import { getExerciseDefinition } from './exercises';
import { renderClassifyChoiceActions, renderClassifyChoiceBody } from './classify-choice-render';
import { LOGIC_AND_THEISM_READING_ROUTE_ID } from './routes';
import { renderSourceLearnView } from './source-learn-render';
import {
  checkClassification,
  createState,
  practiceDraftSnapshot,
  selectClassificationChoice,
  tryAgainPractice,
  type AppState,
} from './state';

function retrieve(locale: 'en' | 'fr' = 'fr'): AppState {
  return createState(locale, getExerciseDefinition('lat-retrieve-conditional')!);
}

function renderSession(state: AppState, current = 1, total = 4): string {
  return renderSourceLearnView({
    locale: state.locale,
    practiceUnlocked: true,
    activeRouteId: LOGIC_AND_THEISM_READING_ROUTE_ID,
    depth: 'reading',
    plan: [],
    itemIndex: current,
    itemTotal: total,
    isTerminal: false,
    routeComplete: false,
    practiceState: state,
    session: { current, total },
  });
}

describe('classify-choice in-place repair', () => {
  it('keeps Vraie/Fausse enabled after a wrong Check and still shows the miss', () => {
    let state = selectClassificationChoice(retrieve(), 'fails');
    state = checkClassification(state);
    expect(state.feedback?.correct).toBe(false);
    expect(state.selectedChoiceId).toBe('fails');

    const html = renderSession(state);
    expect(html).toContain('data-testid="session-position"');
    expect(html).toContain('1 / 4');
    expect(html).toContain('feedback-wrong');
    expect(html).toContain(
      getExerciseCopy('fr', 'lat-retrieve-conditional').choiceWrong,
    );
    expect(html).toContain('class="choice-option selected"');
    expect(html).toContain('data-choice-id="fails"');
    expect(html).not.toMatch(/data-choice-id="holds"[^>]*disabled/);
    expect(html).not.toMatch(/data-choice-id="fails"[^>]*disabled/);
    expect(html).toContain('data-action="check-classification"');
    expect(html).not.toContain('data-action="try-again"');
    expect(html).not.toContain('disabled>');
  });

  it('lets the learner change to the other option without Try again', () => {
    let state = selectClassificationChoice(retrieve(), 'fails');
    state = checkClassification(state);
    state = selectClassificationChoice(state, 'holds');
    expect(state.phase).toBe('ready');
    expect(state.selectedChoiceId).toBe('holds');
    expect(state.feedback).toBeNull();
    expect(state.message).toBeNull();

    const html = renderSession(state);
    expect(html).not.toContain('feedback-wrong');
    expect(html).toContain('class="choice-option selected"');
    expect(html).toContain('data-choice-id="holds"');
    expect(html).toContain('data-action="check-classification"');
    expect(html).not.toContain(' disabled>');
  });

  it('does not paint leftover wrong-answer copy after Try again', () => {
    let state = selectClassificationChoice(retrieve(), 'fails');
    state = checkClassification(state);
    state = tryAgainPractice(state);
    expect(state.phase).toBe('ready');
    expect(state.selectedChoiceId).toBeNull();
    expect(state.feedback).toBeNull();
    expect(state.message).toBeNull();

    const html = renderSession(state);
    expect(html).not.toContain('feedback-wrong');
    expect(html).not.toContain(
      getExerciseCopy('fr', 'lat-retrieve-conditional').choiceWrong,
    );
    expect(html).toContain('data-action="check-classification"');
    expect(html).toContain(' disabled>');
    expect(html).not.toMatch(/data-choice-id="holds"[^>]*disabled/);
    expect(html).not.toMatch(/data-choice-id="fails"[^>]*disabled/);
  });

  it('does not restore spoiler feedback onto a Try again draft', () => {
    let state = selectClassificationChoice(retrieve('en'), 'fails');
    state = checkClassification(state);
    const leftover = {
      ...practiceDraftSnapshot(state),
      phase: 'ready' as const,
      selectedChoiceId: null,
    };
    const restored = createState(
      'en',
      getExerciseDefinition('lat-retrieve-conditional')!,
      leftover,
    );
    expect(restored.phase).toBe('ready');
    expect(restored.selectedChoiceId).toBeNull();
    expect(restored.feedback).toBeNull();
    expect(restored.message).toBeNull();
    expect(renderClassifyChoiceBody(restored)).not.toMatch(/disabled/);
    expect(renderClassifyChoiceActions(restored)).toContain(' disabled>');
  });

  it('disables Check until a choice is selected, including EN True/False', () => {
    const ready = retrieve('en');
    expect(renderClassifyChoiceActions(ready)).toContain(' disabled>');
    const selected = selectClassificationChoice(ready, 'holds');
    expect(renderClassifyChoiceActions(selected)).not.toContain(' disabled>');
    expect(renderClassifyChoiceBody(selected)).toContain('True');
    expect(renderClassifyChoiceBody(selected)).toContain('False');
  });
});
