import { describe, expect, it } from 'vitest';
import { LEVEL_0_LESSONS, LEVEL_1_LESSONS } from './lessons';
import { renderProgressView } from './progress-render';
import { completeLesson, isPracticeUnlocked, loadProgress } from './storage';
import { learnUi, progressUi } from '../i18n';

function completeIds(ids: readonly string[]) {
  let store = loadProgress();
  for (const id of ids) {
    store = completeLesson(store, id);
  }
  return store;
}

describe('progress view course map', () => {
  it('leads with the shared next card and an always-visible three-unit outline', () => {
    const store = completeIds([
      ...LEVEL_0_LESSONS.map((lesson) => lesson.id),
      'level1-01-neg',
      'level1-02-neg-watch',
    ]);
    const html = renderProgressView('en', store, isPracticeUnlocked(store));
    const nextIndex = html.indexOf('data-testid="progress-next"');
    const outlineIndex = html.indexOf('data-testid="course-outline"');
    const exercisesIndex = html.indexOf('progress-exercises-heading');
    expect(nextIndex).toBeGreaterThan(0);
    expect(outlineIndex).toBeGreaterThan(nextIndex);
    expect(html).toContain('data-testid="course-outline-unit-0"');
    expect(html).toContain('data-testid="course-outline-unit-1"');
    expect(html).toContain('data-testid="course-outline-unit-2"');
    expect(html).toContain(learnUi('en').level0Title);
    expect(html).toContain(learnUi('en').level1Title);
    expect(html).toContain(learnUi('en').level2Title);
    expect(html).toContain('you are here');
    expect(html).toContain('data-testid="course-outline-here"');
    expect(html).toContain('after Unit 1 — Connectives');
    expect(html).toMatch(
      /data-testid="course-outline-unit-0"[\s\S]*course-outline-details[\s\S]*data-testid="course-outline-unit-1"/,
    );
    expect(html).not.toMatch(
      /data-testid="course-outline-unit-0"[\s\S]*<details class="course-outline-details" open/,
    );
    expect(html).toContain('data-testid="course-outline-done-lessons"');
    expect(html).toContain('data-testid="course-outline-unit-2-lessons"');
    expect(html).toMatch(/0 of 9 lessons/);
    expect(html).not.toMatch(/Introductory unit/);
    expect(html).not.toMatch(/sections complete/);
    expect(exercisesIndex).toBeGreaterThan(outlineIndex);
    expect(html).toContain('data-action="session-begin"');
  });

  it('uses independent French unit names and lessons wording', () => {
    const html = renderProgressView('fr', loadProgress(), false);
    expect(html).toContain('Le cours');
    expect(html).toContain(learnUi('fr').level0Title);
    expect(html).toContain(learnUi('fr').level1Title);
    expect(html).toContain('vous êtes ici');
    expect(html).toContain('après Unité 0 — Syntaxe propositionnelle');
    expect(html).toMatch(/0 leçons sur 5/);
    expect(html).not.toContain(progressUi('en').outlineHeading);
    expect(html).not.toMatch(/sections complete|sections sur/);
  });

  it('collapses locked units and does not repeat identical concept and lesson titles', () => {
    const html = renderProgressView('en', loadProgress(), false);
    expect(html).toContain('data-testid="course-outline-unit-1-lessons"');
    expect(html).toContain('data-testid="course-outline-unit-2-lessons"');
    expect(html).not.toMatch(
      /data-testid="course-outline-unit-1-lessons"[^>]*open/,
    );
    const unit0 = html.slice(
      html.indexOf('data-testid="course-outline-unit-0"'),
      html.indexOf('data-testid="course-outline-unit-1"'),
    );
    expect(unit0).not.toMatch(
      /course-outline-concept-title[^>]*>Sentence letters/,
    );
    expect(unit0.match(/progress-item-label">Sentence letters/g)).toEqual([
      'progress-item-label">Sentence letters',
    ]);
    expect(html).toContain('course-outline-here-marker" aria-hidden="true"');
    const topic = html.match(
      /data-testid="opening-topic"[^>]*>([^<]+)</,
    )?.[1];
    const upNext = html.match(
      /data-testid="capability-up-next"[^>]*>([^<]+)</,
    )?.[1];
    expect(topic).toBeTruthy();
    expect(upNext).toBe(topic);
  });

  it('keeps the exercise list collapsed after the outline', () => {
    const store = completeIds(LEVEL_1_LESSONS.map((lesson) => lesson.id).concat(
      LEVEL_0_LESSONS.map((lesson) => lesson.id),
    ));
    const html = renderProgressView('en', store, true);
    const outlineIndex = html.indexOf('data-testid="course-outline"');
    const exercisesOpen = html.match(
      /<details class="progress-card progress-disclosure"[^>]*aria-labelledby="progress-exercises-heading"/,
    )?.[0];
    expect(outlineIndex).toBeGreaterThan(0);
    expect(exercisesOpen).toBeTruthy();
    expect(exercisesOpen).not.toContain(' open');
    expect(html.indexOf('progress-exercises-heading')).toBeGreaterThan(outlineIndex);
  });
});
