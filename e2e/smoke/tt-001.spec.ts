import { test, expect } from '@playwright/test';
import { progressReadyForExercise } from '../helpers/progress';
import { gotoWithProgress, clickMode } from '../helpers/app';

test.describe('tt-001 fill-truth-table exercise', () => {
  test('submits the hidden cell and shows correct feedback', async ({ page }) => {
    await gotoWithProgress(page, progressReadyForExercise('tt-001'));
    await clickMode(page, 'practice');

    await expect(page.locator('.truth-table')).toBeVisible();
    await expect(page.locator('.blank-cell')).toBeVisible();

    await page.locator('[data-action="select-evaluation-prediction"][data-value="false"]').click();
    await page.locator('[data-action="check-evaluation"]').click();

    await expect(page.locator('.feedback-correct')).toBeVisible();
    await expect(page.locator('[data-action="next"]')).toBeVisible();
  });
});
