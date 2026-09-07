import { test, expect } from '@playwright/test';
import {
  clickMode,
  completeGuidedStep,
  gotoFresh,
  gotoWithProgress,
  lessonNext,
  skipOnboarding,
} from '../helpers/app';
import { emptyProgress, progressAtLesson, STORAGE_KEY } from '../helpers/progress';
import {
  beginOfferedSession,
  sessionExit,
  sessionOpening,
  sessionPosition,
  sessionPrimary,
} from '../helpers/session';
import { completeLesson, serializeProgressExport, type ProgressStore } from '../../src/app/storage';
import { ALL_LEARN_LESSONS } from '../../src/app/lessons';
import { evidenceKey } from '../../src/app/curriculum';
import { setActiveRoute } from '../../src/app/source-route';
import { LOGIC_AND_THEISM_READING_ROUTE_ID } from '../../src/app/routes';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PLANNER_LEAK =
  /missing prerequisite|prérequis manquant|pont court|unsupported bridge|planner intervention|avant de poursuivre/i;

const QUANTIFIER_JARGON = /∀|∃|vacuous|vacuité|quantifier|quantificateur|implication/i;

async function progressSnapshot(page: { evaluate: (fn: (key: string) => unknown, arg: string) => Promise<unknown> }) {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    const store = JSON.parse(raw) as ProgressStore;
    return {
      conceptEvidence: store.conceptEvidence,
      queue: store.queue,
      passed: store.passed,
    };
  }, STORAGE_KEY);
}

function progressAllLessonsStale(): ProgressStore {
  let store = emptyProgress();
  for (const lesson of ALL_LEARN_LESSONS) {
    store = completeLesson(store, lesson.id);
  }
  return {
    ...store,
    passed: ['eval-001', 'eval-011', 'tt-001', 'counter-001'],
    queue: [],
    conceptEvidence: {
      [evidenceKey('conditional', 'apply')]: {
        attempts: 4,
        cleanPasses: 4,
        transferPasses: 0,
        recentErrors: [],
        lastSeenAt: '2025-01-01T00:00:00.000Z',
      },
    },
  };
}

test.describe('session-first UX', () => {
  test('default entry has one obvious useful action without route or depth', async ({ page }) => {
    await gotoFresh(page);
    await expect(sessionOpening(page)).toBeVisible();
    await expect(page.locator('button.primary')).toHaveCount(1);
    await expect(sessionPrimary(page)).toBeVisible();
    await expect(sessionOpening(page)).toContainText('6 steps');
    await expect(sessionOpening(page)).toContainText('about');
    await expect(page.getByTestId('route-picker')).toHaveCount(0);
    await expect(page.locator('.depth-toggle')).toHaveCount(0);
    await expect(page.locator('[data-testid="planner-banner"]')).toHaveCount(0);
    expect(await sessionOpening(page).innerText()).not.toMatch(PLANNER_LEAK);
  });

  test('normal useful work starts in one tap and keeps a fixed envelope', async ({ page }) => {
    await gotoFresh(page);
    await beginOfferedSession(page);
    await expect(page.getByTestId('session-active')).toBeVisible();
    await expect(sessionPosition(page)).toHaveText('1 / 6');
    await expect(page.getByTestId('route-picker')).toHaveCount(0);
    await expect(page.locator('.depth-toggle')).toHaveCount(0);
    await lessonNext(page).click();
    await expect(sessionPosition(page)).toHaveText('2 / 6');
    await lessonNext(page).click();
    await expect(sessionPosition(page)).toHaveText('3 / 6');
  });

  test('an interrupted round resumes the same steps', async ({ page }) => {
    await gotoFresh(page);
    await beginOfferedSession(page);
    await lessonNext(page).click();
    await expect(sessionPosition(page)).toHaveText('2 / 6');
    await sessionExit(page).click();
    await expect(sessionOpening(page)).toBeVisible();
    await expect(sessionPrimary(page)).toContainText('Resume');
    await beginOfferedSession(page);
    await expect(sessionPosition(page)).toHaveText('2 / 6');
    await expect(page.locator('.lesson-card-title')).toContainText('True or false');
  });

  test('completion is explicit, another round is optional, and Done writes no mastery', async ({
    page,
  }) => {
    await gotoWithProgress(page, progressAtLesson('level0-05-guided'));
    await beginOfferedSession(page);
    await completeGuidedStep(page, 'P', true);
    await completeGuidedStep(page, 'Q', false);
    await expect(page.locator('.feedback-correct')).toBeVisible();
    await lessonNext(page).click();
    await expect(page.getByTestId('round-complete')).toBeVisible();
    await expect(page.getByTestId('session-done')).toBeVisible();
    await expect(page.getByTestId('session-another')).toBeVisible();
    const beforeDone = await progressSnapshot(page);
    await page.getByTestId('session-done').click();
    await expect(sessionOpening(page)).toBeVisible();
    expect(await progressSnapshot(page)).toEqual(beforeDone);
  });

  test('Do another short round is optional after completion', async ({ page }) => {
    await gotoWithProgress(page, progressAtLesson('level0-05-guided'));
    await beginOfferedSession(page);
    await completeGuidedStep(page, 'P', true);
    await completeGuidedStep(page, 'Q', false);
    await lessonNext(page).click();
    await page.getByTestId('session-another').click();
    await expect(page.getByTestId('session-active')).toBeVisible();
    await expect(sessionPosition(page)).toContainText('1 /');
  });

  test('planner internals stay out of learner-facing copy in EN and FR', async ({ page }) => {
    await gotoFresh(page);
    expect(await page.locator('main.app').innerText()).not.toMatch(PLANNER_LEAK);
    await page.locator('[data-action="set-locale"][data-locale="fr"]').click();
    await expect(sessionOpening(page)).toContainText('Une courte séance de logique');
    expect(await sessionOpening(page).innerText()).not.toMatch(PLANNER_LEAK);
    await expect(sessionPrimary(page)).toContainText('Commencer');
  });

  test('Sobel opening establishes meaning before quantifier terminology', async ({ page }) => {
    await gotoWithProgress(
      page,
      setActiveRoute(emptyProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID),
    );
    await expect(sessionOpening(page)).toContainText('preparation');
    await expect(page.getByTestId('route-picker')).toHaveCount(0);
    await beginOfferedSession(page);
    const active = page.getByTestId('session-active');
    await expect(active).toBeVisible();
    const text = await active.innerText();
    expect(text).not.toMatch(QUANTIFIER_JARGON);
    expect(text).not.toMatch(PLANNER_LEAK);
    await expect(active).toContainText('club');
    await expect(page.getByTestId('route-picker')).toHaveCount(0);
    await expect(page.locator('.depth-toggle')).toHaveCount(0);
  });

  test('lapse recovery still presents the retrieve check, not planner copy', async ({ page }) => {
    await gotoWithProgress(page, progressAllLessonsStale());
    await expect(sessionOpening(page)).toContainText('See what stuck');
    await beginOfferedSession(page);
    await expect(page.locator('[data-action="select-choice"]').first()).toBeVisible();
    expect(await page.getByTestId('session-active').innerText()).not.toMatch(PLANNER_LEAK);
  });

  test('functional modes remain reachable outside the session', async ({ page }) => {
    await gotoFresh(page);
    await clickMode(page, 'learn');
    await expect(page.locator('[data-testid="learn-progress"]')).toBeVisible();
    await clickMode(page, 'explore');
    await expect(page.locator('.formula-picker')).toBeVisible();
  });

  test('a watch case is one advertised unit, not a hidden Next-case sequence', async ({ page }) => {
    await gotoFresh(page);
    await expect(sessionOpening(page)).toContainText('6 steps');
    await beginOfferedSession(page);
    for (let card = 0; card < 3; card += 1) {
      await lessonNext(page).click();
    }
    await expect(page.getByTestId('session-watch-unit')).toBeVisible();
    await expect(sessionPosition(page)).toHaveText('4 / 6');
    await expect(page.getByTestId('session-active')).not.toContainText('Case 1 of 4');
    await lessonNext(page).click();
    await expect(sessionPosition(page)).toHaveText('5 / 6');
    await expect(page.getByTestId('session-watch-unit')).toBeVisible();
  });

  test('Sobel requires a checked prediction before the counterexample explanation', async ({ page }) => {
    await gotoWithProgress(
      page,
      setActiveRoute(emptyProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID),
    );
    await beginOfferedSession(page);
    const active = page.getByTestId('session-active');
    expect(await active.innerText()).not.toMatch(QUANTIFIER_JARGON);
    await expect(active).toContainText('club');
    expect(await active.innerText()).not.toMatch(/counterexample|contre-exemple/i);
    await lessonNext(page).click();

    await expect(page.locator('[data-action="select-choice"]').first()).toBeVisible();
    await expect(page.locator('[data-action="lesson-next"]')).toHaveCount(0);
    await expect(page.locator('[data-action="source-next"]')).toHaveCount(0);
    expect(await active.innerText()).not.toMatch(/vacuity|vacuité|∀|∃/i);
    expect(await active.innerText()).not.toMatch(/What would disprove it|Ce qui la ferait chuter/i);

    await page.locator('[data-action="select-choice"][data-choice-id="needs-instance"]').click();
    await page.locator('[data-action="check-classification"]').click();
    await expect(page.locator('.feedback-wrong')).toBeVisible();
    await expect(page.getByTestId('try-again')).toBeVisible();
    await expect(page.locator('[data-action="lesson-next"]')).toHaveCount(0);
    await page.getByTestId('try-again').click();
    await page.locator('[data-action="select-choice"][data-choice-id="still-true"]').click();
    await page.locator('[data-action="check-classification"]').click();
    await expect(page.locator('.feedback-correct')).toBeVisible();
    await page.locator('[data-action="source-next"]').click();

    expect(await active.innerText()).toMatch(/counterexample|contre-exemple/i);
    expect(await active.innerText()).not.toMatch(/vacuity|vacuité|∀|∃/i);
    await lessonNext(page).click();
    await expect(active).toContainText(/vacuity|vacuité/i);
    expect(await active.innerText()).not.toMatch(/∀|∃/);
  });

  test('Sobel teaches if–then, then →, then ∀x (F(x) → G(x))', async ({ page }) => {
    await gotoWithProgress(
      page,
      setActiveRoute(emptyProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID),
    );
    await beginOfferedSession(page);
    const active = page.getByTestId('session-active');
    await lessonNext(page).click();
    await page.locator('[data-action="select-choice"][data-choice-id="still-true"]').click();
    await page.locator('[data-action="check-classification"]').click();
    await page.locator('[data-action="source-next"]').click();
    await lessonNext(page).click();
    await lessonNext(page).click();
    expect(await active.innerText()).toMatch(/if someone is a member, then that person signed/i);
    expect(await active.innerText()).not.toMatch(/∀|→/);
    await lessonNext(page).click();
    expect(await active.innerText()).toContain('→');
    expect(await active.innerText()).toContain('F(x) → G(x)');
    expect(await active.innerText()).not.toContain('∀');
  });

  test('mid-course stale evidence is offered as lapse recovery before new lessons', async ({ page }) => {
    let store = emptyProgress();
    for (const lesson of ALL_LEARN_LESSONS.slice(0, 6)) {
      store = completeLesson(store, lesson.id);
    }
    store = {
      ...store,
      passed: ['eval-001', 'eval-011'],
      queue: [],
      conceptEvidence: {
        [evidenceKey('conditional', 'apply')]: {
          attempts: 4,
          cleanPasses: 4,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: '2025-01-01T00:00:00.000Z',
        },
      },
    };
    await gotoWithProgress(page, store);
    await expect(sessionOpening(page)).toContainText('See what stuck');
    await expect(sessionOpening(page)).not.toContainText('Continue your reading');
  });

  test('progress import clears a persisted interrupted session', async ({ page }) => {
    await gotoFresh(page);
    await beginOfferedSession(page);
    await lessonNext(page).click();
    await sessionExit(page).click();
    await expect(sessionPrimary(page)).toContainText('Resume');

    const imported = emptyProgress();
    imported.lessonsCompleted = ['level0-01-letters', 'level0-02-truth', 'level0-03-and'];
    imported.level0Complete = false;
    const exportJson = serializeProgressExport(imported, 'en');
    const importFile = join(mkdtempSync(join(tmpdir(), 'externalize-session-import-')), 'progress.json');
    writeFileSync(importFile, exportJson);

    await clickMode(page, 'progress');
    await page
      .locator('.progress-disclosure')
      .filter({ has: page.locator('[data-action="import-progress"]') })
      .locator('summary')
      .click();
    await page.locator('input[type="file"]').setInputFiles(importFile);
    await expect(page.locator('.progress-notice-success')).toBeVisible();

    await page.reload();
    await skipOnboarding(page);
    await expect(sessionOpening(page)).toBeVisible();
    await expect(sessionPrimary(page)).not.toContainText('Resume');
    await expect(sessionOpening(page)).toContainText(/Continue|Start/);
  });
});
