import { test, expect, type Page } from '@playwright/test';
import type { ProgressStore } from '../../src/app/storage';
import { gotoWithProgress, modeButton } from '../helpers/app';
import { progressReadyForExercise, STORAGE_KEY } from '../helpers/progress';

async function storedProgress(page: Page): Promise<ProgressStore> {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY);
}

async function atomIsTrue(page: Page, atom: string): Promise<boolean> {
  const row = page.locator('.atom-row', {
    has: page.locator(`.atom-name:text-is("${atom}")`),
  });
  return (await row.locator('.atom-segment.true.active').count()) > 0;
}

test.describe('evaluate-formula attempt lifecycle', () => {
  test('requires prediction, repairs in place, and records once', async ({ page }) => {
    await gotoWithProgress(page, progressReadyForExercise('eval-001'));
    await modeButton(page, 'practice').click();

    await expect(page.locator('.result-cell')).toHaveText('—');
    let progress = await storedProgress(page);
    expect(progress.attempted).not.toContain('eval-001');
    expect(progress.passed).not.toContain('eval-001');

    await expect(page.locator('[data-action="set-atom-value"]')).toHaveCount(0);
    progress = await storedProgress(page);
    expect(progress.attempted).not.toContain('eval-001');
    expect(progress.exerciseStats['eval-001']).toBeUndefined();
    await expect(page.locator('[data-action="next"]')).toHaveCount(0);

    const p = await atomIsTrue(page, 'P');
    const q = await atomIsTrue(page, 'Q');
    const rootTrue = p && q;

    await page.locator(`[data-action="select-evaluation-prediction"][data-value="${rootTrue ? 'false' : 'true'}"]`).click();
    await page.locator('[data-action="check-evaluation"]').click();
    await expect(page.locator('.feedback-wrong')).toBeVisible();
    await expect(page.locator('[data-action="next"]')).toHaveCount(0);
    progress = await storedProgress(page);
    expect(progress.attempted).toContain('eval-001');
    expect(progress.passed).not.toContain('eval-001');
    expect(progress.exerciseStats['eval-001']).toBeUndefined();

    const attemptId = progress.practiceDraft!.attempt.id;
    await page.locator(`[data-action="select-evaluation-prediction"][data-value="${rootTrue ? 'true' : 'false'}"]`).click();
    await expect(page.locator('.feedback-wrong')).toBeVisible();
    await page.locator('[data-action="check-evaluation"]').click();
    await expect(page.locator('.feedback-correct')).toBeVisible();

    progress = await storedProgress(page);
    expect(progress.practiceDraft!.attempt.id).toBe(attemptId);
    expect(progress.passed).toContain('eval-001');
    expect(progress.exerciseStats['eval-001']).toMatchObject({
      attempts: 1,
      successes: 0,
      repairedPasses: 1,
    });
    expect(progress.queue.find((entry) => entry.exerciseId === 'eval-001')?.intervalDays).toBe(0);

    await page.locator('[data-action="next"]').click();
    const afterContinue = await storedProgress(page);
    expect(afterContinue.resume.exerciseId).toBe('eval-001');
    expect(afterContinue.exerciseStats['eval-001']).toEqual(progress.exerciseStats['eval-001']);
    expect(afterContinue.queue.find((entry) => entry.exerciseId === 'eval-001')).toEqual(
      progress.queue.find((entry) => entry.exerciseId === 'eval-001'),
    );
  });
});
