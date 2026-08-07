import { test, expect } from '@playwright/test';
import { progressReadyForExercise } from '../helpers/progress';
import { gotoWithProgress, insertPaletteToken, modeButton } from '../helpers/app';

test.describe('translate-001 translation exercise', () => {
  test('builds (P → Q) via the palette and passes the check', async ({ page }) => {
    await gotoWithProgress(page, progressReadyForExercise('translate-001'));
    await modeButton(page, 'practice').click();

    await expect(page.locator('.symbol-palette')).toBeVisible();

    await insertPaletteToken(page, 'paren', 'open');
    await insertPaletteToken(page, 'pred', 'P');
    await insertPaletteToken(page, 'connective', 'imp');
    await insertPaletteToken(page, 'pred', 'Q');
    await insertPaletteToken(page, 'paren', 'close');

    await page.locator('[data-action="check-translation"]').click();

    await expect(page.locator('.feedback-correct')).toBeVisible();
    await expect(page.locator('[data-action="next"]')).toBeVisible();
  });
});
