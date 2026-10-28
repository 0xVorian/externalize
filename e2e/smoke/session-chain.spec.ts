import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { evaluate, parse } from '../../engine';
import { completeGuidedStep, gotoWithProgress, lessonNext } from '../helpers/app';
import {
  progressCourseCompleteWithRepairedDueReviews,
  progressWithLeftoverDueReviews,
  progressWithOneDueConjunctionReview,
} from '../helpers/progress';
import {
  beginOfferedSession,
  openBrowseMode,
  roundComplete,
  sessionOpening,
  sessionPosition,
  sessionPrimary,
} from '../helpers/session';

const ARTIFACT_DIR = process.env.SCREENSHOT_DIR ?? '/opt/cursor/artifacts/screenshots';
const MOBILE = { width: 390, height: 844 };

async function atomIsTrue(page: Page, atom: string): Promise<boolean> {
  const row = page.locator('.atom-row', {
    has: page.locator(`.atom-name:text-is("${atom}")`),
  });
  return (await row.locator('.atom-segment.true.active').count()) > 0;
}

async function formulaValue(page: Page): Promise<boolean> {
  const formula = (await page.locator('.formula-display').innerText()).trim();
  const names = await page.locator('.atom-row .atom-name').allInnerTexts();
  const assignment: Record<string, boolean> = {};
  for (const name of names) {
    const atom = name.trim();
    assignment[atom] = await atomIsTrue(page, atom);
  }
  return evaluate(parse(formula), assignment);
}

async function passEvaluation(page: Page): Promise<void> {
  const value = await formulaValue(page);
  await page
    .locator(`[data-action="select-evaluation-prediction"][data-value="${value ? 'true' : 'false'}"]`)
    .click();
  await page.locator('[data-action="check-evaluation"]').click();
  await expect(page.locator('.feedback-correct')).toBeVisible();
  await page.locator('[data-action="next"]').click();
}

async function repairEvaluation(page: Page): Promise<void> {
  const value = await formulaValue(page);
  await page
    .locator(`[data-action="select-evaluation-prediction"][data-value="${value ? 'false' : 'true'}"]`)
    .click();
  await page.locator('[data-action="check-evaluation"]').click();
  await expect(page.locator('.feedback-wrong')).toBeVisible();
  await page.locator('[data-action="try-again"]').click();
  await page
    .locator(`[data-action="select-evaluation-prediction"][data-value="${value ? 'true' : 'false'}"]`)
    .click();
  await page.locator('[data-action="check-evaluation"]').click();
  await expect(page.locator('.feedback-correct')).toBeVisible();
  await page.locator('[data-action="next"]').click();
}

async function screenshotArtifact(page: Page, filename: string): Promise<void> {
  try {
    mkdirSync(ARTIFACT_DIR, { recursive: true });
    await page.screenshot({ path: join(ARTIFACT_DIR, filename) });
  } catch {
    // Artifact directory is optional in CI.
  }
}

test.describe('chaining after a recall round', () => {
  test.use({ viewport: MOBILE, hasTouch: true, isMobile: true });

  test('EN: Do another short round after recall goes to the next lesson, not another warm-up', async ({
    page,
  }) => {
    await gotoWithProgress(page, progressWithOneDueConjunctionReview());
    await beginOfferedSession(page);
    await expect(page.getByTestId('session-step-label')).toContainText(/Warm-up/i);
    await expect(sessionPosition(page)).toHaveText('1 / 1');

    await passEvaluation(page);
    await expect(roundComplete(page)).toBeVisible();
    await expect(page.getByTestId('session-another')).toContainText('Do another short round');
    await screenshotArtifact(page, 'en-post-recall-complete.png');

    await page.getByTestId('session-another').click();
    await expect(page.getByTestId('session-active')).toBeVisible();
    await expect(page.getByTestId('session-step-label')).toHaveCount(0);
    await expect(page.getByTestId('session-active')).not.toContainText(/Warm-up/i);
    await expect(page.locator('.lesson-card-title')).toContainText('Building complex formulas');
    await screenshotArtifact(page, 'en-after-do-another.png');
  });

  test('FR: Enchaîner une courte séance after Rappel goes to the next lesson, not another Rappel', async ({
    page,
  }) => {
    await gotoWithProgress(page, progressWithOneDueConjunctionReview());
    await page.locator('[data-action="set-locale"][data-locale="fr"]').click();
    await beginOfferedSession(page);
    await expect(page.getByTestId('session-step-label')).toContainText(/Rappel/);
    await expect(sessionPosition(page)).toHaveText('1 / 1');

    await passEvaluation(page);
    await expect(roundComplete(page)).toBeVisible();
    await expect(page.getByTestId('session-another')).toContainText('Enchaîner une courte séance');
    await screenshotArtifact(page, 'fr-post-recall-complete.png');

    await page.getByTestId('session-another').click();
    await expect(page.getByTestId('session-active')).toBeVisible();
    await expect(page.getByTestId('session-step-label')).toHaveCount(0);
    await expect(page.getByTestId('session-active')).not.toContainText(/Rappel/);
    await expect(page.locator('.lesson-card-title')).toContainText('Composer des formules complexes');
    await screenshotArtifact(page, 'fr-after-enchainer.png');
  });

  test('EN: repaired still-due item with no lessons left chains to idle, not a review', async ({
    page,
  }) => {
    await gotoWithProgress(page, progressCourseCompleteWithRepairedDueReviews());
    await expect(sessionOpening(page)).toContainText('Ready for a quick review');
    await beginOfferedSession(page);
    await expect(sessionPosition(page)).toHaveText('1 / 2');
    await passEvaluation(page);
    await repairEvaluation(page);
    await expect(roundComplete(page)).toBeVisible();

    await page.getByTestId('session-another').click();
    await expect(sessionOpening(page)).toBeVisible();
    await expect(sessionOpening(page)).toContainText("You're good for now");
    await expect(sessionPrimary(page)).toHaveCount(0);
    await expect(sessionOpening(page)).not.toContainText(/Ready for a quick review|Warm-up/i);
    await screenshotArtifact(page, 'en-idle-from-continue.png');

    await openBrowseMode(page, 'progress');
    await expect(page.getByTestId('progress-next')).toContainText('Ready for a quick review');

    await page.reload();
    await expect(sessionOpening(page)).toContainText('Ready for a quick review');
    await expect(sessionPrimary(page)).toBeVisible();
  });

  test('FR: repaired still-due item with no lessons left chains to idle, not a review', async ({
    page,
  }) => {
    await gotoWithProgress(page, progressCourseCompleteWithRepairedDueReviews());
    await page.locator('[data-action="set-locale"][data-locale="fr"]').click();
    await expect(sessionOpening(page)).toContainText('Une révision brève');
    await beginOfferedSession(page);
    await expect(sessionPosition(page)).toHaveText('1 / 2');
    await passEvaluation(page);
    await repairEvaluation(page);
    await expect(roundComplete(page)).toBeVisible();

    await page.getByTestId('session-another').click();
    await expect(sessionOpening(page)).toBeVisible();
    await expect(sessionOpening(page)).toContainText(/Rien de pressé/);
    await expect(sessionPrimary(page)).toHaveCount(0);
    await expect(sessionOpening(page)).not.toContainText(/révision brève|Rappel/);
    await screenshotArtifact(page, 'fr-idle-from-continue.png');
  });

  test('a second chained round still skips leftover interval-0 reviews', async ({ page }) => {
    await gotoWithProgress(page, progressWithLeftoverDueReviews());
    await beginOfferedSession(page);
    await expect(sessionPosition(page)).toHaveText('1 / 2');
    await passEvaluation(page);
    await repairEvaluation(page);
    await expect(roundComplete(page)).toBeVisible();

    await page.getByTestId('session-another').click();
    await expect(page.getByTestId('session-active')).toBeVisible();
    await expect(page.getByTestId('session-step-label')).toHaveCount(0);
    await expect(sessionPosition(page)).toHaveText('1 / 4');
    await expect(page.locator('.lesson-card-title')).toContainText(/not|negation|¬/i);

    await lessonNext(page).click();
    await lessonNext(page).click();
    await lessonNext(page).click();
    await completeGuidedStep(page, 'P', true);
    await expect(page.locator('.feedback-correct')).toBeVisible();
    await lessonNext(page).click();
    await expect(roundComplete(page)).toBeVisible();

    await page.getByTestId('session-another').click();
    await expect(page.getByTestId('session-active')).toBeVisible();
    await expect(page.getByTestId('session-step-label')).toHaveCount(0);
    await expect(page.getByTestId('session-active')).not.toContainText(/Warm-up/i);
    await expect(sessionPosition(page)).toContainText('1 /');
    await expect(page.locator('.lesson-card-title')).toContainText(/disjunction|∨|at least one/i);
  });
});
