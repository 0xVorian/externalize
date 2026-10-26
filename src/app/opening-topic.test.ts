import { describe, expect, it } from 'vitest';
import { LEVEL_0_LESSONS } from './lessons';
import { openingTopic } from './opening-topic';
import { offerOpening } from './session-plan';
import { completeLesson, loadProgress } from './storage';
import { renderProgressView } from './progress-render';
import { renderSessionOpening } from './session-opening-render';

function completeIds(ids: readonly string[]) {
  let store = loadProgress();
  for (const id of ids) {
    store = completeLesson(store, id);
  }
  return store;
}

describe('openingTopic', () => {
  it('names the first lesson on a fresh start round', () => {
    const offer = offerOpening(loadProgress(), null);
    expect(openingTopic('en', offer)).toBe('Sentence letters');
    expect(openingTopic('fr', offer)).toBe('Variables propositionnelles');
  });

  it('names the concept a mid-unit continue round covers', () => {
    const store = completeIds([
      ...LEVEL_0_LESSONS.map((lesson) => lesson.id),
      'level1-01-neg',
    ]);
    const offer = offerOpening(store, null);
    expect(offer.kind).toBe('continue');
    expect(openingTopic('en', offer)).toBe('Negation (¬)');
    expect(openingTopic('fr', offer)).toBe('Négation (¬)');
  });
});

describe('Home and Progress share one next', () => {
  it('renders the same topic, effort, and session-begin action', () => {
    const store = completeIds([
      ...LEVEL_0_LESSONS.map((lesson) => lesson.id),
      'level1-01-neg',
    ]);
    const offer = offerOpening(store, null);
    const home = renderSessionOpening({ locale: 'en', offer, practiceUnlocked: true });
    const progress = renderProgressView('en', store, true, { offer });
    expect(home).toContain('data-testid="opening-topic"');
    expect(progress).toContain('data-testid="opening-topic"');
    expect(home).toContain('Negation (¬)');
    expect(progress).toContain('Negation (¬)');
    expect(progress).toContain('data-action="session-begin"');
    expect(progress).not.toContain('data-action="practice-exercise"');
    const effort = offer.plan
      ? `${offer.plan.steps.length} ${offer.plan.steps.length === 1 ? 'step' : 'steps'}`
      : '';
    expect(home).toContain(effort);
    expect(progress).toContain(effort);
  });
});
