import { test, expect } from '@playwright/test';
import {
  completeGuidedStep,
  gotoWithProgress,
  lessonNext,
} from '../helpers/app';
import { beginOfferedSession } from '../helpers/session';
import { progressAtLesson } from '../helpers/progress';

test.describe('guided evaluation visual grammar', () => {
  test('single-target P ∧ Q uses a blank cell, True/False, then Check', async ({ page }) => {
    await gotoWithProgress(page, progressAtLesson('level0-05-guided'));
    await beginOfferedSession(page);

    await expect(page.locator('.formula-display')).toContainText('P ∧ Q');
    await expect(page.locator('.atom-panel')).toHaveCount(0);
    await expect(page.getByTestId('guided-target-cell')).toHaveCount(1);
    await expect(page.locator('.truth-table-drop-slot.empty')).toBeVisible();
    await expect(page.getByTestId('guided-response-workspace')).toBeVisible();
    await expect(page.locator('[data-action="select-guided-value"][data-value="true"]')).toHaveText('True');
    await expect(page.locator('[data-action="select-guided-value"][data-value="false"]')).toHaveText('False');
    await expect(page.locator('[data-action="check-guided-value"]')).toBeDisabled();
    await expect(page.locator('.guided-prompt')).toHaveCount(1);

    await page.locator('[data-action="select-guided-value"][data-value="false"]').click();
    await expect(page.locator('.truth-table-drop-slot.filled')).toContainText('F');
    await expect(page.locator('.feedback-wrong')).toHaveCount(0);
    await expect(page.locator('.feedback-correct')).toHaveCount(0);
    await expect(page.locator('[data-action="lesson-next"]')).toHaveCount(0);

    await page.locator('[data-action="check-guided-value"]').click();
    await expect(page.locator('.feedback-wrong')).toBeVisible();
    await expect(page.getByTestId('guided-response-workspace')).toBeVisible();

    await page.locator('[data-action="select-guided-value"][data-value="true"]').click();
    await expect(page.locator('.truth-table-drop-slot.filled')).toContainText('T');
    await page.locator('[data-action="check-guided-value"]').click();
    await expect(page.locator('.feedback-wrong')).toHaveCount(0);
    await expect(page.locator('.guided-prompt')).toContainText('Choose the value for Q.');

    await completeGuidedStep(page, 'Q', false);
    await expect(page.locator('.feedback-correct')).toBeVisible();
    await expect(page.getByTestId('guided-response-workspace')).toHaveCount(0);
    await expect(lessonNext(page)).toContainText('Continue');
  });

  test('French uses Vrai / Faux in the workspace and V / F in the table', async ({ page }) => {
    await gotoWithProgress(page, progressAtLesson('level0-05-guided'));
    await page.locator('[data-action="set-locale"][data-locale="fr"]').click();
    await beginOfferedSession(page);

    await expect(page.locator('[data-action="select-guided-value"][data-value="true"]')).toHaveText('Vrai');
    await expect(page.locator('[data-action="select-guided-value"][data-value="false"]')).toHaveText('Faux');
    await expect(page.locator('[data-action="check-guided-value"]')).toHaveText('Vérifier');
    await page.locator('[data-action="select-guided-value"][data-value="true"]').click();
    await expect(page.locator('.truth-table-drop-slot.filled')).toContainText('V');
  });
});
