import { describe, expect, it } from 'vitest';
import { createLessonState } from './lesson-state';
import { LOGIC_AND_THEISM_READING_ROUTE_ID } from './routes';
import { renderRoundComplete } from './session-complete-render';
import { renderSessionChrome, renderSessionFrame, sessionStepLabel } from './session-chrome-render';
import { renderSessionOpening } from './session-opening-render';
import { renderSourceLearnView } from './source-learn-render';
import { renderLanguageToggle, renderModeNav } from './shell-render';
import { getSourceLesson } from './source-lessons';
import type { OpeningOffer } from './session-types';

const startOffer: OpeningOffer = {
  kind: 'start',
  plan: {
    id: 'plan-start-a',
    kind: 'start',
    estimatedMinutes: 3,
    steps: [
      { id: 'level0-01-letters', source: 'route', itemId: 'level0-01-letters' },
      { id: 'level0-02-truth', source: 'route', itemId: 'level0-02-truth' },
      { id: 'level0-03-and', source: 'route', itemId: 'level0-03-and' },
      { id: 'level0-04-watch', source: 'route', itemId: 'level0-04-watch' },
      { id: 'level0-05-guided', source: 'route', itemId: 'level0-05-guided' },
    ],
  },
};

describe('session shell', () => {
  it('shows one primary action and hides product architecture', () => {
    const html = renderSessionOpening({ locale: 'en', offer: startOffer, practiceUnlocked: false });
    expect(html.match(/data-testid="session-primary-action"/g)).toHaveLength(1);
    expect(html).toContain('A short logic session');
    expect(html).toContain('Sentence letters');
    expect(html).toContain('5 steps');
    expect(html).not.toContain('data-testid="route-picker"');
    expect(html).not.toContain('depth-toggle');
    expect(html).not.toContain('planner-banner');
    expect(html).not.toContain('mode-nav-four');
    expect(html).toContain('data-testid="session-more"');
    expect(html).toContain('<details class="session-more"');
    expect(html).toContain('<summary class="session-more-summary">');
    expect(html).toContain('data-mode="learn"');
  });

  it('uses Exit and 2 / 6 in active chrome', () => {
    const html = renderSessionFrame({
      locale: 'en',
      current: 2,
      total: 6,
      body: '<article>reason</article>',
      actions: '<button type="button">Continue</button>',
    });
    expect(html).toContain('data-testid="session-exit"');
    expect(html).toContain('2 / 6');
    expect(html).not.toContain('mode-nav-four');
    expect(renderSessionChrome({ locale: 'en', current: 2, total: 6 })).toContain(
      'Step 2 of 6 in this round',
    );
  });

  it('labels a warm-up step in the session frame', () => {
    const html = renderSessionFrame({
      locale: 'en',
      current: 1,
      total: 5,
      label: 'Warm-up: last time you worked on Conjunction (∧)',
      body: '<article>reason</article>',
      actions: '<button type="button">Check</button>',
    });
    expect(html).toContain('data-testid="session-step-label"');
    expect(html).toContain('Warm-up: last time you worked on Conjunction (∧)');
  });

  it('labels a warm-up step in independently authored French', () => {
    const label = sessionStepLabel('fr', {
      id: 'warmup:eval-001',
      source: 'practice',
      itemId: 'eval-001',
      role: 'warmup',
      conceptId: 'conjunction',
    });
    expect(label).toMatch(/Rappel/);
    expect(label).toContain('Conjonction');
    expect(label).not.toBe(
      sessionStepLabel('en', {
        id: 'warmup:eval-001',
        source: 'practice',
        itemId: 'eval-001',
        role: 'warmup',
        conceptId: 'conjunction',
      }),
    );
    const html = renderSessionFrame({
      locale: 'fr',
      current: 1,
      total: 5,
      label,
      body: '<article>raison</article>',
      actions: '<button type="button">Vérifier</button>',
    });
    expect(html).toContain('data-testid="session-step-label"');
    expect(html).toContain(label!);
    expect(html).toContain('lang="fr"');
  });

  it('makes Done for now primary and another round secondary', () => {
    const html = renderRoundComplete({ locale: 'en' });
    expect(html).toContain('data-testid="session-done"');
    expect(html).toContain('Done for now');
    expect(html).toContain('data-testid="session-another"');
    expect(html).not.toContain('Keep practising');
  });
});

describe('source learn quiet chrome', () => {
  it('does not leak planner internals even with teach interventions', () => {
    const html = renderSourceLearnView({
      locale: 'en',
      practiceUnlocked: false,
      activeRouteId: LOGIC_AND_THEISM_READING_ROUTE_ID,
      depth: 'reading',
      plan: [
        {
          kind: 'teach',
          requirement: { concept: 'conditional', capability: 'apply' },
          itemIds: ['lat-conditional-bridge'],
        },
      ],
      itemIndex: 1,
      itemTotal: 6,
      isTerminal: false,
      routeComplete: false,
      lessonState: createLessonState('en', getSourceLesson('lat-conditional-bridge')!),
    });
    expect(html).not.toContain('planner-banner');
    expect(html).not.toMatch(/missing prerequisite/i);
    expect(html).not.toMatch(/prérequis manquant/i);
    expect(html).not.toMatch(/pont court/i);
  });
});


describe('language toggle accessibility copy', () => {
  it('labels the group and target language in the active locale', () => {
    const en = renderLanguageToggle('en');
    const fr = renderLanguageToggle('fr');
    expect(en).toContain('aria-label="Language"');
    expect(en).toContain('aria-label="Switch to French"');
    expect(fr).toContain('aria-label="Langue"');
    expect(fr).toContain('aria-label="Passer en anglais"');
  });
  it('keeps browse navigation accessible names aligned with the active locale', () => {
    const en = renderModeNav('en', 'learn', true);
    const fr = renderModeNav('fr', 'progress', true);
    expect(en).toContain('aria-label="Activity mode"');
    expect(en).toContain('aria-label="Course"');
    expect(fr).toContain('aria-label="Mode d’activité"');
    expect(fr).toMatch(/>\s*Suivi\s*<\/button>/);
  });

});
