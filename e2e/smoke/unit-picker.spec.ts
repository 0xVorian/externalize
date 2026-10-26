import { test, expect } from '@playwright/test';
import { emptyProgress, progressAfterLevel0 } from '../helpers/progress';
import { gotoLearnWithProgress, unitTab } from '../helpers/app';

test.describe('Unit picker navigation', () => {
  test('shows later units locked for a new learner and does not start them', async ({
    page,
  }) => {
    await gotoLearnWithProgress(page, emptyProgress());

    await expect(page.getByTestId('unit-picker')).toBeVisible();
    await expect(unitTab(page, 0)).toHaveAttribute('aria-current', 'page');
    await expect(unitTab(page, 1)).toBeVisible();
    await expect(unitTab(page, 2)).toBeVisible();
    await expect(unitTab(page, 1)).toBeDisabled();
    await expect(unitTab(page, 2)).toBeDisabled();
    await expect(unitTab(page, 1)).toContainText('after Unit 0');
    await expect(unitTab(page, 2)).toContainText('after Unit 1');
    await expect(page.locator('h1')).toContainText('Unit 0 — Propositional syntax');

    await unitTab(page, 1).click({ force: true });
    await expect(unitTab(page, 0)).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('h1')).toContainText('Unit 0 — Propositional syntax');

    await page.locator('[data-action="set-locale"][data-locale="fr"]').click();
    await expect(unitTab(page, 1)).toContainText('après l’unité 0');
    await expect(unitTab(page, 2)).toBeDisabled();
  });

  test('switches between Unit 0 and Unit 1 after Level 0 is complete', async ({ page }) => {
    await gotoLearnWithProgress(page, progressAfterLevel0());

    await expect(page.locator('.unit-picker')).toBeVisible();
    await expect(unitTab(page, 1)).toHaveAttribute('aria-current', 'page');
    await expect(unitTab(page, 1)).toBeEnabled();
    await expect(unitTab(page, 2)).toBeVisible();
    await expect(unitTab(page, 2)).toBeDisabled();
    await expect(unitTab(page, 2)).toContainText('after Unit 1');
    await expect(page.locator('h1')).toContainText('Unit 1 — Connectives');
    await expect(page.locator('.lesson-card-title')).toContainText('¬P — truth-functional not');

    await unitTab(page, 0).click();
    await expect(unitTab(page, 0)).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('h1')).toContainText('Unit 0 — Propositional syntax');
    await expect(page.locator('.lesson-card-title')).toContainText('One letter for a whole statement');

    await unitTab(page, 1).click();
    await expect(unitTab(page, 1)).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('h1')).toContainText('Unit 1 — Connectives');

    await unitTab(page, 2).click({ force: true });
    await expect(unitTab(page, 1)).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('h1')).toContainText('Unit 1 — Connectives');
  });
});
