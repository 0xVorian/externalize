import { test, expect } from '@playwright/test';
import { gotoWithProgress, insertPaletteToken, modeButton } from '../helpers/app';
import { progressReadyForExercise } from '../helpers/progress';

test('accepts swapped biconditional operands through translation UI', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('translate-005'));
  await modeButton(page, 'practice').click();
  await insertPaletteToken(page, 'paren', 'open');
  await insertPaletteToken(page, 'pred', 'Q');
  await insertPaletteToken(page, 'connective', 'iff');
  await insertPaletteToken(page, 'pred', 'P');
  await insertPaletteToken(page, 'paren', 'close');
  await page.locator('[data-action="check-translation"]').click();
  await expect(page.locator('.feedback-correct')).toBeVisible();
});
