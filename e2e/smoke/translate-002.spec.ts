import { test, expect, type Page } from '@playwright/test';
import { progressReadyForExercise } from '../helpers/progress';
import { gotoWithProgress, insertPaletteToken, modeButton } from '../helpers/app';

async function buildConjunctionWithoutNegation(page: Page): Promise<void> {
  await insertPaletteToken(page, 'paren', 'open');
  await insertPaletteToken(page, 'pred', 'P');
  await insertPaletteToken(page, 'connective', 'and');
  await insertPaletteToken(page, 'pred', 'Q');
  await insertPaletteToken(page, 'paren', 'close');
}

async function buildNegatedConjunction(page: Page): Promise<void> {
  await insertPaletteToken(page, 'connective', 'not');
  await insertPaletteToken(page, 'paren', 'open');
  await insertPaletteToken(page, 'pred', 'P');
  await insertPaletteToken(page, 'connective', 'and');
  await insertPaletteToken(page, 'pred', 'Q');
  await insertPaletteToken(page, 'paren', 'close');
}

test.describe('translate-002 translation exercise', () => {
  test('shows try again on a wrong check, then accepts the corrected formula', async ({ page }) => {
    await gotoWithProgress(page, progressReadyForExercise('translate-002'));
    await modeButton(page, 'practice').click();

    await expect(page.locator('.symbol-palette')).toBeVisible();

    await buildConjunctionWithoutNegation(page);
    await page.locator('[data-action="check-translation"]').click();

    await expect(page.locator('.feedback-wrong')).toBeVisible();
    await expect(page.locator('[data-action="try-again"]')).toBeVisible();

    await page.locator('[data-action="try-again"]').click();
    await expect(page.locator('.feedback-wrong')).toHaveCount(0);
    await expect(page.locator('[data-action="check-translation"]')).toBeVisible();

    for (let i = 0; i < 5; i += 1) {
      await page.locator('[data-action="palette-backspace"]').click();
    }

    await buildNegatedConjunction(page);
    await page.locator('[data-action="check-translation"]').click();

    await expect(page.locator('.feedback-correct')).toBeVisible();
    await expect(page.locator('[data-action="next"]')).toBeVisible();
  });
});
