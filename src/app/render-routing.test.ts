import { describe, expect, it } from 'vitest';
import { EXERCISE_DEFINITIONS } from './exercises';
import { renderApp, type PracticeViewContext } from './render';
import { createState, checkTranslation } from './state';
import { getTranslationExerciseConfig } from './translation';
import { usesLiveTruthRow } from './truth-table-render';

const PRACTICE_FLAT_BINARIES = ['P ∧ Q', 'P ∨ Q', 'P → Q', 'P ↔ Q'] as const;

describe('practice presentation routing', () => {
  it.each([...PRACTICE_FLAT_BINARIES, '¬P'] as const)(
    'usesLiveTruthRow returns true for flat binary %s',
    (formula) => {
      expect(usesLiveTruthRow(formula)).toBe(true);
    },
  );

  it.each(PRACTICE_FLAT_BINARIES)(
    'renderApp uses live truth table for evaluate exercise with formula %s',
    (formula) => {
      const exercise = EXERCISE_DEFINITIONS.find(
        (candidate) => candidate.type === 'evaluate-formula' && candidate.formula === formula,
      );
      expect(exercise).toBeDefined();

      const html = renderApp(createState('en', exercise!), 0, true);

      expect(html).toContain('truth-table-wrap');
      expect(html).toContain('atom-panel');
      expect(html).not.toContain('class="tree-panel"');
    },
  );

  it('renderApp uses tree panel for nested evaluate formulas', () => {
    const nested = EXERCISE_DEFINITIONS.filter(
      (candidate) =>
        candidate.type === 'evaluate-formula' && candidate.formula && !usesLiveTruthRow(candidate.formula),
    );

    for (const exercise of nested) {
      const html = renderApp(createState('en', exercise), 0, true);
      expect(html, exercise.id).toContain('class="tree-panel"');
      expect(html, exercise.id).not.toContain('truth-table-wrap');
    }
  });

  it('provides translation configs for translate-002 through translate-006', () => {
    for (const id of ['translate-002', 'translate-003', 'translate-004', 'translate-005', 'translate-006']) {
      expect(getTranslationExerciseConfig(id)?.expected.formula).toBeTruthy();
    }
  });

  it('keeps incorrect translation feedback visible for in-place repair', () => {
    const exercise = EXERCISE_DEFINITIONS.find((candidate) => candidate.id === 'translate-004')!;
    let state = createState('en', exercise);
    state = {
      ...state,
      builder: {
        ...state.builder,
        formula: { kind: 'imp', left: { kind: 'pred', name: 'Q', args: [] }, right: { kind: 'pred', name: 'P', args: [] } },
      },
    };
    state = checkTranslation(state);
    expect(state.feedback?.tag).toBe('reversed-conditional');
    expect(state.phase).toBe('answered');
    const html = renderApp(state, 0, true);
    expect(html).not.toContain('data-action="try-again"');
    expect(html).toContain('data-action="check-translation"');
    expect(html).toContain('feedback-wrong');
  });

  it('renders French-authored atom glosses in translation practice', () => {
    const exercise = EXERCISE_DEFINITIONS.find((candidate) => candidate.id === 'translate-003')!;
    const html = renderApp(createState('fr', exercise), 0, true);
    expect(html).toContain('Il pleut.');
    expect(html).toContain('Le terrain est fermé.');
    expect(html).not.toContain('It rains.');
  });

  it('announces practice capability name and state once without a duplicate sr-only line', () => {
    const exercise = EXERCISE_DEFINITIONS.find((candidate) => candidate.id === 'eval-001')!;
    const context: PracticeViewContext = {
      capabilityState: 'ready',
      sessionCompleted: 0,
      sessionTarget: 5,
      sessionComplete: false,
    };
    const html = renderApp(createState('en', exercise), 0, true, context);
    expect(html).toContain('class="exercise-family">Evaluating formulas');
    expect(html).toContain('data-testid="capability-state">Ready');
    expect(html).not.toMatch(/class="sr-only"[^>]*>Evaluating formulas: Ready/);
    expect(html).toContain('data-testid="practice-session"');
  });

  it('renders a unit-complete notice in Practice when one is provided', () => {
    const exercise = EXERCISE_DEFINITIONS.find((candidate) => candidate.id === 'eval-001')!;
    const html = renderApp(createState('en', exercise), 0, true, {
      capabilityState: 'ready',
      sessionCompleted: 0,
      sessionTarget: 5,
      sessionComplete: false,
      unitCompleteNotice: 'Unit 2 complete. Nested structure is in place.',
    });
    expect(html).toContain('data-testid="unit-complete"');
    expect(html).toContain('Unit 2 complete. Nested structure is in place.');
  });

  it('announces a unit-complete card live only on first presentation', () => {
    const exercise = EXERCISE_DEFINITIONS.find((candidate) => candidate.id === 'eval-001')!;
    const notice = 'Unit 2 complete. Nested structure is in place.';
    const base = {
      capabilityState: 'ready' as const,
      sessionCompleted: 0,
      sessionTarget: 5,
      sessionComplete: false,
      unitCompleteNotice: notice,
    };
    const liveHtml = renderApp(createState('en', exercise), 0, true, {
      ...base,
      unitCompleteNoticeLive: true,
    });
    const liveTag = liveHtml.match(/<section class="unit-complete-card"[^>]*>/)?.[0];
    expect(liveTag).toContain('role="status"');
    expect(liveTag).toContain('aria-live="polite"');

    const laterHtml = renderApp(createState('en', exercise), 0, true, {
      ...base,
      unitCompleteNoticeLive: false,
    });
    const laterTag = laterHtml.match(/<section class="unit-complete-card"[^>]*>/)?.[0];
    expect(laterTag).toContain('aria-live="off"');
    expect(laterTag).not.toContain('role="status"');
    expect(laterHtml).toContain(notice);
  });

  it('announces a progress moment live only on first presentation', () => {
    const exercise = EXERCISE_DEFINITIONS.find((candidate) => candidate.id === 'eval-001')!;
    const base: PracticeViewContext = {
      capabilityState: 'reliable',
      sessionCompleted: 1,
      sessionTarget: 5,
      sessionComplete: false,
      progressMoment: {
        kind: 'capability-reliable',
        skillId: 'practice:evaluate-formula',
      },
    };
    const liveHtml = renderApp(createState('en', exercise), 0, true, {
      ...base,
      progressMomentLive: true,
    });
    const liveTag = liveHtml.match(/<aside class="progress-moment"[^>]*>/)?.[0];
    expect(liveTag).toContain('role="status"');
    expect(liveTag).toContain('aria-live="polite"');

    const laterHtml = renderApp(createState('en', exercise), 0, true, {
      ...base,
      progressMomentLive: false,
    });
    const laterTag = laterHtml.match(/<aside class="progress-moment"[^>]*>/)?.[0];
    expect(laterTag).toContain('role="status"');
    expect(laterTag).toContain('aria-live="off"');
    expect(laterTag).not.toContain('aria-live="polite"');
  });

  it('announces a session-complete card live only on first presentation', () => {
    const exercise = EXERCISE_DEFINITIONS.find((candidate) => candidate.id === 'eval-001')!;
    const base: PracticeViewContext = {
      capabilityState: 'developing',
      sessionCompleted: 5,
      sessionTarget: 5,
      sessionComplete: true,
    };
    const liveHtml = renderApp(createState('en', exercise), 0, true, {
      ...base,
      sessionCompleteLive: true,
    });
    const liveTag = liveHtml.match(/<section class="session-complete-card"[^>]*>/)?.[0];
    expect(liveTag).toContain('role="status"');
    expect(liveTag).toContain('aria-live="polite"');
    expect(liveHtml).toContain('data-testid="session-complete"');

    const laterHtml = renderApp(createState('en', exercise), 0, true, {
      ...base,
      sessionCompleteLive: false,
    });
    const laterTag = laterHtml.match(/<section class="session-complete-card"[^>]*>/)?.[0];
    expect(laterTag).toContain('aria-live="off"');
    expect(laterTag).not.toContain('role="status"');
    expect(laterHtml).toContain('data-testid="session-complete"');

    const freshSessionHtml = renderApp(createState('en', exercise), 0, true, {
      capabilityState: 'developing',
      sessionCompleted: 0,
      sessionTarget: 5,
      sessionComplete: false,
      sessionCompleteLive: false,
    });
    expect(freshSessionHtml).not.toContain('data-testid="session-complete"');

    const laterSessionHtml = renderApp(createState('en', exercise), 0, true, {
      ...base,
      sessionCompleteLive: true,
    });
    const laterSessionTag = laterSessionHtml.match(
      /<section class="session-complete-card"[^>]*>/,
    )?.[0];
    expect(laterSessionTag).toContain('role="status"');
    expect(laterSessionTag).toContain('aria-live="polite"');
  });
});
