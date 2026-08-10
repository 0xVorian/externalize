import { test, expect } from '@playwright/test';
import { gotoWithProgress, modeButton } from '../helpers/app';
import { progressReadyForExercise } from '../helpers/progress';

test('renders French-authored translation prompts and atom glosses', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('translate-003'));
  await page.locator('[data-action="set-locale"][data-locale="fr"]').click();
  await modeButton(page, 'practice').click();

  await expect(page.locator('.exercise-prompt')).toContainText('Le terrain est fermé');
  await expect(page.locator('.atom-key')).toContainText('Il pleut.');
  await expect(page.locator('.atom-key')).toContainText('Le match est annulé.');
  await expect(page.locator('.palette-atom').first()).toContainText('Il pleut.');
});
