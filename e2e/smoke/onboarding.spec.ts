import { test, expect } from '@playwright/test';

test.describe('First-run onboarding', () => {
  test('skip dismisses the intro overlay and shows the app', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/');

    await expect(page.locator('.onboarding-overlay')).toBeVisible();
    await expect(page.locator('#onboarding-title')).toContainText('See the structure');

    await page.locator('[data-action="onboarding-skip"]').click();

    await expect(page.locator('.onboarding-overlay')).toHaveCount(0);
    await expect(page.locator('main.app')).toBeVisible();
    await expect(page.locator('.lesson-card-title')).toBeVisible();
  });

  test('finish completes onboarding after stepping through screens', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/');

    await page.locator('[data-action="onboarding-next"]').click();
    await expect(page.locator('#onboarding-title')).toContainText('Tap T or F');

    await page.locator('[data-action="onboarding-next"]').click();
    await expect(page.locator('#onboarding-title')).toContainText('Your progress stays here');

    await page.locator('[data-action="onboarding-finish"]').click();

    await expect(page.locator('.onboarding-overlay')).toHaveCount(0);
    await expect(page.locator('main.app')).toBeVisible();
  });
});
