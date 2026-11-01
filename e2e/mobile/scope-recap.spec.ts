import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { gotoWithProgress } from '../helpers/app';
import { progressCourseCompleteWithDueScopeReview } from '../helpers/progress';
import { beginOfferedSession, missThenPassScopeWarmup } from '../helpers/session';

const ARTIFACT_DIR = process.env.SCREENSHOT_DIR ?? '/opt/cursor/artifacts/screenshots';

async function screenshotIf390(page: Page, filename: string): Promise<void> {
  if (page.viewportSize()?.width !== 390) {
    return;
  }
  mkdirSync(ARTIFACT_DIR, { recursive: true });
  await page.screenshot({ path: join(ARTIFACT_DIR, filename), fullPage: false });
}

test('scope warm-up miss recaps Unit 2 nesting on a phone', async ({ page }) => {
  await gotoWithProgress(page, progressCourseCompleteWithDueScopeReview());
  await beginOfferedSession(page);
  await missThenPassScopeWarmup(page);
  await expect(page.locator('.lesson-card')).toBeVisible();
  await expect(page.locator('.lesson-card')).toContainText('Building complex formulas');
  await expect(page.locator('.lesson-card')).toContainText('(P ∧ Q) → R');
  await expect(page.locator('.lesson-card')).not.toContainText('(P ∧ Q) ∨ R');
  await screenshotIf390(page, 'scope-warmup-miss-recap-en-390x844.png');
});

test('scope warm-up miss recaps the Unit 2 card in French on a phone', async ({ page }) => {
  await gotoWithProgress(page, progressCourseCompleteWithDueScopeReview());
  await page.locator('[data-action="set-locale"][data-locale="fr"]').click();
  await beginOfferedSession(page);
  await missThenPassScopeWarmup(page);
  await expect(page.locator('.lesson-card')).toBeVisible();
  await expect(page.locator('.lesson-card')).toContainText('Composer des formules complexes');
  await expect(page.locator('.lesson-card')).toContainText(
    "l'antécédent est la conjonction tout entière",
  );
  await expect(page.locator('.lesson-card')).toContainText('(P ∧ Q) → R');
  await expect(page.locator('.lesson-card')).not.toContainText('(P ∧ Q) ∨ R');
  await screenshotIf390(page, 'scope-warmup-miss-recap-fr-390x844.png');
});
