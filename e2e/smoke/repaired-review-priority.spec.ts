import { test, expect, type Page } from '@playwright/test';
import type { ProgressStore } from '../../src/app/storage';
import { gotoWithProgress, modeButton } from '../helpers/app';
import { progressReadyForExercise, STORAGE_KEY } from '../helpers/progress';

async function storedProgress(page: Page): Promise<ProgressStore> {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY);
}

test('routes Continue to a due repaired review before a newly unlocked exercise', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('eval-001'));
  await modeButton(page, 'practice').click();

  await page.locator('[data-action="select-evaluation-prediction"][data-value="true"]').click();
  await page.locator('[data-action="check-evaluation"]').click();
  await page.locator('[data-action="try-again"]').click();
  await page.locator('[data-action="select-evaluation-prediction"][data-value="false"]').click();
  await page.locator('[data-action="check-evaluation"]').click();
  await page.locator('[data-action="next"]').click();

  const progress = await storedProgress(page);
  expect(progress.passed).toContain('eval-001');
  expect(getUnlocked(progress)).toContain('eval-011');
  expect(progress.resume.exerciseId).toBe('eval-001');
  await expect(page.locator('.exercise-prompt')).toBeVisible();
});

function getUnlocked(progress: ProgressStore): string[] {
  if (!progress.level0Complete) return [];
  const unit0 = ['eval-001', 'eval-011'];
  const unlocked = [];
  for (const id of unit0) {
    unlocked.push(id);
    if (!progress.passed.includes(id)) break;
  }
  return unlocked;
}
