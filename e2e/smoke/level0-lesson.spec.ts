import { test, expect } from '@playwright/test';
import {
  gotoFresh,
  lessonNext,
  completeGuidedStep,
  modeButton,
  enterLearn,
} from '../helpers/app';
import { beginOfferedSession, sessionPosition } from '../helpers/session';

test.describe('Level 0 lesson completion', () => {
  test('completes the five introductory lessons and unlocks practice', async ({ page }) => {
    await gotoFresh(page);
    await beginOfferedSession(page);

    await expect(sessionPosition(page)).toContainText('1 / 5');
    await expect(page.locator('.lesson-card-title')).toContainText('One letter for a whole statement');

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

    await expect(page.getByTestId('round-complete')).toBeVisible();
    await expect(page.getByTestId('session-done')).toBeVisible();
    await page.getByTestId('session-done').click();

    await enterLearn(page);
    await expect(page.locator('.unit-picker')).toBeVisible();
    await expect(modeButton(page, 'practice')).toBeEnabled();
    await expect(page.locator('h1')).toContainText('Unit 1 — Connectives');
  });
});
