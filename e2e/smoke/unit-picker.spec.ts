import { test, expect } from '@playwright/test';
import { progressAfterLevel0 } from '../helpers/progress';
import { gotoWithProgress, unitTab } from '../helpers/app';

test.describe('Unit picker navigation', () => {
  test('switches between Unit 0 and Unit 1 after Level 0 is complete', async ({ page }) => {
    await gotoWithProgress(page, progressAfterLevel0());

    await expect(page.locator('.unit-picker')).toBeVisible();
    await expect(unitTab(page, 1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('h1')).toContainText('Unit 1 — Connectives');
    await expect(page.locator('.lesson-card-title')).toContainText('¬P — truth-functional not');

    await unitTab(page, 0).click();
    await expect(unitTab(page, 0)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('h1')).toContainText('Unit 0 — Propositional syntax');
    await expect(page.locator('.lesson-card-title')).toContainText('Letters stand for statements');

    await unitTab(page, 1).click();
    await expect(unitTab(page, 1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('h1')).toContainText('Unit 1 — Connectives');
  });
});
