import { test, expect } from '@playwright/test';
import { gotoWithProgress, insertPaletteToken, clickMode, skipOnboarding } from '../helpers/app';
import { progressReadyForExercise } from '../helpers/progress';

test.describe('practice draft resume', () => {
  test('restores translation palette work after reload', async ({ page }) => {
    await gotoWithProgress(page, progressReadyForExercise('translate-001'));
    await clickMode(page, 'practice');
    await insertPaletteToken(page, 'pred', 'P');
    await insertPaletteToken(page, 'connective', 'imp');

    await page.reload();
    await skipOnboarding(page);
    await clickMode(page, 'practice');
    await insertPaletteToken(page, 'pred', 'Q');
    await expect(page.locator('.built-formula')).toContainText('P → Q');
  });

  test('restores proof rule and citations after reload', async ({ page }) => {
    await gotoWithProgress(page, progressReadyForExercise('nd-002'));
    await clickMode(page, 'practice');
    await page.locator('[data-action="proof-select-rule"][data-rule="and-elim"]').click();
    await page.locator('[data-action="proof-toggle-cite"][data-line="1"]').click();

    await page.reload();
    await skipOnboarding(page);
    await clickMode(page, 'practice');
    await expect(
      page.locator('[data-action="proof-select-rule"][data-rule="and-elim"]'),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(
      page.locator('[data-action="proof-toggle-cite"][data-line="1"]'),
    ).toHaveClass(/selected/);
  });
});
