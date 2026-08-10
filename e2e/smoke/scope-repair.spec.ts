import { test, expect } from '@playwright/test';
import type { ProgressStore } from '../../src/app/storage';
import { gotoWithProgress, modeButton } from '../helpers/app';
import { progressReadyForExercise, STORAGE_KEY } from '../helpers/progress';

test('repairs a scope error inside one attempt', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('scope-001'));
  await modeButton(page, 'practice').click();

  const nodes = page.locator('[data-action="select-node"]');
  await nodes.nth(1).click();
  await expect(page.locator('.feedback-wrong')).toBeVisible();
  await expect(page.locator('[data-action="next"]')).toHaveCount(0);

  const wrong = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!) as ProgressStore,
    STORAGE_KEY,
  );
  const attemptId = wrong.practiceDraft!.attempt.id;
  expect(wrong.attempted).toContain('scope-001');
  expect(wrong.passed).not.toContain('scope-001');

  await page.locator('[data-action="try-again"]').click();
  await nodes.first().click();
  await expect(page.locator('.feedback-correct')).toBeVisible();

  const repaired = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!) as ProgressStore,
    STORAGE_KEY,
  );
  expect(repaired.practiceDraft!.attempt.id).toBe(attemptId);
  expect(repaired.exerciseStats['scope-001']?.attempts).toBe(1);
  expect(repaired.exerciseStats['scope-001']?.repairedPasses).toBe(1);
});
