import { test, expect, type Page } from '@playwright/test';
import {
  gotoFresh,
  gotoWithProgress,
  lessonNext,
  modeButton,
} from '../helpers/app';
import { progressReadyForExercise } from '../helpers/progress';

async function expectNoPageOverflow(page: Page): Promise<void> {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);
}

test('Level 0 watch grid fits a narrow phone', async ({ page }) => {
  await gotoFresh(page);
  for (let card = 0; card < 3; card += 1) await lessonNext(page).click();
  await expect(page.locator('.watch-grid')).toBeVisible();
  await expectNoPageOverflow(page);
});

test('evaluation prediction remains usable', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('eval-001'));
  await modeButton(page, 'practice').click();
  await expect(page.locator('.evaluation-prediction')).toBeVisible();
  await page.locator('[data-action="select-evaluation-prediction"][data-value="true"]').click();
  await page.locator('[data-action="check-evaluation"]').click();
  await expect(page.locator('.feedback-wrong')).toBeVisible();
  await expect(page.locator('[data-action="select-evaluation-prediction"][data-value="false"]')).toBeVisible();
  await expectNoPageOverflow(page);
});

test('scope tree repair remains tappable', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('scope-001'));
  await modeButton(page, 'practice').click();
  const nodes = page.locator('[data-action="select-node"]');
  await nodes.nth(1).click();
  await expect(page.locator('.feedback-wrong')).toBeVisible();
  await nodes.first().click();
  await expect(page.locator('.feedback-correct')).toBeVisible();
  await expectNoPageOverflow(page);
});

test('translation palette wraps without page overflow in French', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('translate-003'));
  await page.locator('[data-action="set-locale"][data-locale="fr"]').click();
  await modeButton(page, 'practice').click();
  await expect(page.locator('.symbol-palette')).toBeVisible();
  await expect(page.locator('.atom-key')).toContainText('Il pleut.');
  await expectNoPageOverflow(page);
});

test('truth table stays contained on a phone', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('tt-001'));
  await modeButton(page, 'practice').click();
  await expect(page.locator('.truth-table')).toBeVisible();
  await expectNoPageOverflow(page);
});

test('and-elimination proof controls work on a phone', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('nd-002'));
  await modeButton(page, 'practice').click();
  await page.locator('[data-action="proof-select-rule"][data-rule="and-elim"]').click();
  await page.locator('[data-action="proof-toggle-cite"][data-line="1"]').click();
  await page.locator('[data-action="check-proof"]').click();
  await expect(page.locator('.feedback-correct')).toBeVisible();
  await expectNoPageOverflow(page);
});
