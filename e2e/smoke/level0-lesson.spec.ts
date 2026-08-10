import { test, expect } from '@playwright/test';
import {
  gotoFresh,
  lessonNext,
  completeGuidedStep,
  modeButton,
} from '../helpers/app';

test.describe('Level 0 lesson completion', () => {
  test('completes the five introductory lessons and unlocks practice', async ({ page }) => {
    await gotoFresh(page);

    await expect(page.locator('.lesson-card-title')).toContainText('Letters stand for statements');

    for (let card = 0; card < 3; card += 1) {
      await lessonNext(page).click();
    }

    await expect(page.locator('.exercise-prompt')).toBeVisible();
    await expect(page.locator('.watch-grid')).toBeVisible();
    for (let step = 0; step < 5; step += 1) {
      await lessonNext(page).click();
    }

    await completeGuidedStep(page, 'P', true);
    await completeGuidedStep(page, 'Q', false);
    await expect(page.locator('.feedback-correct')).toBeVisible();

    await expect(lessonNext(page)).toContainText('Continue');
    await lessonNext(page).click();

    await expect(page.locator('.unit-picker')).toBeVisible();
    await expect(modeButton(page, 'practice')).toBeEnabled();
    await expect(page.locator('h1')).toContainText('Unit 1 — Connectives');
  });
});
