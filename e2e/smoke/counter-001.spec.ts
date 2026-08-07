import { test, expect } from '@playwright/test';
import { progressReadyForExercise } from '../helpers/progress';
import { completeGuidedStep, gotoWithProgress, modeButton } from '../helpers/app';

test.describe('counter-001 find-counterexample exercise', () => {
  test('toggles Q false and passes the counterexample check', async ({ page }) => {
    await gotoWithProgress(page, progressReadyForExercise('counter-001'));
    await modeButton(page, 'practice').click();

    await expect(page.locator('.truth-table')).toBeVisible();
    await expect(page.locator('[data-action="check-counterexample"]')).toBeVisible();

    await completeGuidedStep(page, 'Q', false);

    await page.locator('[data-action="check-counterexample"]').click();

    await expect(page.locator('.feedback-correct')).toBeVisible();
    await expect(page.locator('[data-action="next"]')).toBeVisible();
  });
});
