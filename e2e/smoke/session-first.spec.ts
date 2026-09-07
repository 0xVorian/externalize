import { test, expect } from '@playwright/test';
import {
  clickMode,
  completeGuidedStep,
  gotoFresh,
  gotoWithProgress,
  lessonNext,
} from '../helpers/app';
import { emptyProgress, progressAtLesson, STORAGE_KEY } from '../helpers/progress';
import {
  beginOfferedSession,
  sessionExit,
  sessionOpening,
  sessionPosition,
  sessionPrimary,
} from '../helpers/session';
import { completeLesson, type ProgressStore } from '../../src/app/storage';
import { ALL_LEARN_LESSONS } from '../../src/app/lessons';
import { evidenceKey } from '../../src/app/curriculum';
import { setActiveRoute } from '../../src/app/source-route';
import { LOGIC_AND_THEISM_READING_ROUTE_ID } from '../../src/app/routes';

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
    await expect(sessionOpening(page)).toContainText('5 steps');
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
    await expect(sessionPosition(page)).toHaveText('1 / 5');
    await expect(page.getByTestId('route-picker')).toHaveCount(0);
    await expect(page.locator('.depth-toggle')).toHaveCount(0);
    await lessonNext(page).click();
    await expect(sessionPosition(page)).toHaveText('2 / 5');
    await lessonNext(page).click();
    await expect(sessionPosition(page)).toHaveText('3 / 5');
  });

  test('an interrupted round resumes the same steps', async ({ page }) => {
    await gotoFresh(page);
    await beginOfferedSession(page);
    await lessonNext(page).click();
    await expect(sessionPosition(page)).toHaveText('2 / 5');
    await sessionExit(page).click();
    await expect(sessionOpening(page)).toBeVisible();
    await expect(sessionPrimary(page)).toContainText('Resume');
    await beginOfferedSession(page);
    await expect(sessionPosition(page)).toHaveText('2 / 5');
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
});
