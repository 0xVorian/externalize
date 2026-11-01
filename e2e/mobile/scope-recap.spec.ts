import { test, expect } from '@playwright/test';
import { gotoWithProgress } from '../helpers/app';
import { progressCourseCompleteWithDueScopeReview } from '../helpers/progress';
import { beginOfferedSession, missThenPassScopeWarmup } from '../helpers/session';

test('scope warm-up miss recaps Unit 2 nesting on a phone', async ({ page }) => {
  await gotoWithProgress(page, progressCourseCompleteWithDueScopeReview());
  await beginOfferedSession(page);
  await missThenPassScopeWarmup(page);
  await expect(page.locator('.lesson-card')).toBeVisible();
  await expect(page.locator('.lesson-card')).toContainText('(P ∧ Q) → R');
  await expect(page.locator('.lesson-card')).not.toContainText('(P ∧ Q) ∨ R');
});

test('scope warm-up miss recaps the Unit 2 card in French on a phone', async ({ page }) => {
  await gotoWithProgress(page, progressCourseCompleteWithDueScopeReview());
  await page.locator('[data-action="set-locale"][data-locale="fr"]').click();
  await beginOfferedSession(page);
  await missThenPassScopeWarmup(page);
  await expect(page.locator('.lesson-card')).toBeVisible();
  await expect(page.locator('.lesson-card')).toContainText('(P ∧ Q) → R');
  await expect(page.locator('.lesson-card')).not.toContainText('(P ∧ Q) ∨ R');
});
