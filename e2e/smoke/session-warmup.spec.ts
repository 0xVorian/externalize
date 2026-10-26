import { test, expect, type Page } from '@playwright/test';
import { evaluate, parse } from '../../engine';
import { gotoWithProgress } from '../helpers/app';
import {
  progressWithConjunctionPractice,
  progressWithOneDueConjunctionReview,
} from '../helpers/progress';
import { beginOfferedSession, roundComplete, sessionPosition } from '../helpers/session';

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

test.describe('session warm-up', () => {
  test('opens a continue round with a labelled warm-up, then new material after a pass', async ({
    page,
  }) => {
    await gotoWithProgress(page, progressWithConjunctionPractice());
    await beginOfferedSession(page);
    await expect(page.getByTestId('session-step-label')).toContainText(/Warm-up/i);
    await expect(page.getByTestId('session-step-label')).toContainText(/Conjunction/i);
    await expect(sessionPosition(page)).toHaveText('1 / 5');

    const value = await formulaValue(page);
    await page
      .locator(`[data-action="select-evaluation-prediction"][data-value="${value ? 'true' : 'false'}"]`)
      .click();
    await page.locator('[data-action="check-evaluation"]').click();
    await expect(page.locator('.feedback-correct')).toBeVisible();
    await page.locator('[data-action="next"]').click();

    await expect(page.getByTestId('session-step-label')).toHaveCount(0);
    await expect(sessionPosition(page)).toHaveText('2 / 5');
    await expect(page.locator('.lesson-card-title')).toContainText('truth-functional not');
  });

  test('a warm-up miss turns the rest of the round into a short repair', async ({ page }) => {
    await gotoWithProgress(page, progressWithConjunctionPractice());
    await beginOfferedSession(page);
    const value = await formulaValue(page);
    await page
      .locator(`[data-action="select-evaluation-prediction"][data-value="${value ? 'false' : 'true'}"]`)
      .click();
    await page.locator('[data-action="check-evaluation"]').click();
    await expect(page.locator('.feedback-wrong')).toBeVisible();
    await expect(sessionPosition(page)).toHaveText('1 / 5');
    await page.locator('[data-action="try-again"]').click();
    await expect(sessionPosition(page)).toHaveText('1 / 5');
    await page
      .locator(`[data-action="select-evaluation-prediction"][data-value="${value ? 'true' : 'false'}"]`)
      .click();
    await page.locator('[data-action="check-evaluation"]').click();
    await expect(page.locator('.feedback-correct')).toBeVisible();
    await expect(sessionPosition(page)).toHaveText('1 / 5');
    await page.locator('[data-action="next"]').click();

    await expect(page.getByTestId('session-step-label')).toContainText(/look back/i);
    await expect(page.getByTestId('session-step-label')).toContainText(/Conjunction/i);
    await expect(page.locator('.lesson-card-title')).toContainText(/and|∧|conjunction/i);
    await expect(sessionPosition(page)).toHaveText('2 / 4');
  });

  test('a single due review ends at 1 / 1 on a pass', async ({ page }) => {
    await gotoWithProgress(page, progressWithOneDueConjunctionReview());
    await beginOfferedSession(page);
    await expect(page.getByTestId('session-step-label')).toContainText(/Warm-up/i);
    await expect(sessionPosition(page)).toHaveText('1 / 1');
    await expect(page.locator('.formula-display')).toContainText('P ∧ Q');

    const value = await formulaValue(page);
    await page
      .locator(`[data-action="select-evaluation-prediction"][data-value="${value ? 'true' : 'false'}"]`)
      .click();
    await page.locator('[data-action="check-evaluation"]').click();
    await expect(page.locator('.feedback-correct')).toBeVisible();
    await page.locator('[data-action="next"]').click();
    await expect(roundComplete(page)).toBeVisible();
  });

  test('a single due review grows into same-concept repair on a miss', async ({ page }) => {
    await gotoWithProgress(page, progressWithOneDueConjunctionReview());
    await beginOfferedSession(page);
    await expect(sessionPosition(page)).toHaveText('1 / 1');
    const value = await formulaValue(page);
    await page
      .locator(`[data-action="select-evaluation-prediction"][data-value="${value ? 'false' : 'true'}"]`)
      .click();
    await page.locator('[data-action="check-evaluation"]').click();
    await expect(page.locator('.feedback-wrong')).toBeVisible();
    await expect(sessionPosition(page)).toHaveText('1 / 1');
    await page.locator('[data-action="try-again"]').click();
    await expect(sessionPosition(page)).toHaveText('1 / 1');
    await page
      .locator(`[data-action="select-evaluation-prediction"][data-value="${value ? 'true' : 'false'}"]`)
      .click();
    await page.locator('[data-action="check-evaluation"]').click();
    await expect(page.locator('.feedback-correct')).toBeVisible();
    await expect(sessionPosition(page)).toHaveText('1 / 1');
    await page.locator('[data-action="next"]').click();

    await expect(page.getByTestId('session-step-label')).toContainText(/look back/i);
    await expect(page.getByTestId('session-step-label')).toContainText(/Conjunction/i);
    await expect(page.locator('.lesson-card-title')).toContainText(/and|∧|conjunction/i);
    await expect(sessionPosition(page)).toHaveText('2 / 4');
  });

  test('labels the warm-up in French', async ({ page }) => {
    await gotoWithProgress(page, progressWithConjunctionPractice());
    await page.locator('[data-action="set-locale"][data-locale="fr"]').click();
    await beginOfferedSession(page);
    await expect(page.getByTestId('session-step-label')).toContainText(/Rappel/);
    await expect(page.getByTestId('session-step-label')).toContainText(/Conjonction/);
    await expect(sessionPosition(page)).toHaveText('1 / 5');
  });
});
