import { test, expect, type Page } from '@playwright/test';
import { updateResume } from '../../src/app/storage';
import { emptyProgress, progressAfterLevel0, progressReadyForExercise, STORAGE_KEY } from '../helpers/progress';
import { gotoWithProgress, modeButton } from '../helpers/app';

async function storedAttemptId(page: Page): Promise<string> {
  return page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!).practiceDraft.attempt.id,
    STORAGE_KEY,
  );
}

test('watch uses a real two-dimensional table with one active case at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  const store = updateResume(emptyProgress(), { mode: 'learn', lessonId: 'level0-04-watch' });
  await gotoWithProgress(page, store);

  const grid = page.locator('.watch-grid');
  await expect(grid).toBeVisible();
  await expect(grid.locator('tbody tr')).toHaveCount(2);
  await expect(grid.locator('tbody tr').first().locator('.watch-grid-cell')).toHaveCount(2);
  await expect(grid.locator('.watch-grid-cell.active')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('scope marks only the selected node and repairs without Try again', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('scope-001'));
  await modeButton(page, 'practice').click();

  await page.locator('[data-action="select-node"]').filter({ hasText: '→' }).click();
  await expect(page.locator('.feedback-wrong')).toBeVisible();
  const attemptId = await storedAttemptId(page);
  await expect(page.locator('[data-action="try-again"]')).toHaveCount(0);

  await page.locator('[data-action="select-node"]').filter({ hasText: '∧' }).click();
  await expect(page.locator('.feedback-correct')).toBeVisible();
  expect(await storedAttemptId(page)).toBe(attemptId);
  await expect(page.locator('.tree-node.selected')).toHaveCount(1);
});

test('evaluation and truth-table answer controls meet the mobile target size', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await gotoWithProgress(page, progressReadyForExercise('eval-001'));
  await modeButton(page, 'practice').click();

  for (const button of await page.locator('.evaluation-prediction .cell-segment').all()) {
    const box = await button.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  }

  await gotoWithProgress(page, progressReadyForExercise('tt-001'));
  await modeButton(page, 'practice').click();
  for (const button of await page.locator('.blank-cell .cell-segment').all()) {
    const box = await button.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  }
});

test('translation atom letters and glosses are visibly separated at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await gotoWithProgress(page, progressReadyForExercise('translate-001'));
  await modeButton(page, 'practice').click();

  const item = page.locator('.atom-key-list li').first();
  const letter = await item.locator('.atom-key-letter').boundingBox();
  const gloss = await item.locator('.atom-key-gloss').boundingBox();
  expect(letter).not.toBeNull();
  expect(gloss).not.toBeNull();
  expect((gloss?.x ?? 0) - ((letter?.x ?? 0) + (letter?.width ?? 0))).toBeGreaterThanOrEqual(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('proof repair remains one attempt while feedback stays visible', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('nd-001'));
  await modeButton(page, 'practice').click();

  await page.locator('[data-action="proof-select-rule"]').click();
  await page.locator('[data-action="proof-toggle-cite"][data-line="1"]').click();
  await page.locator('[data-action="check-proof"]').click();
  await expect(page.locator('.feedback-wrong')).toBeVisible();
  const attemptId = await storedAttemptId(page);

  await page.locator('[data-action="proof-toggle-cite"][data-line="2"]').click();
  await expect(page.locator('.feedback-wrong')).toBeVisible();
  await page.locator('[data-action="check-proof"]').click();
  await expect(page.locator('.feedback-correct')).toBeVisible();
  expect(await storedAttemptId(page)).toBe(attemptId);
});

test('Learn reference is closed by default and unit navigation does not claim tab semantics', async ({ page }) => {
  await gotoWithProgress(page, progressAfterLevel0());
  await modeButton(page, 'learn').click();

  await expect(page.locator('.reference-panel')).not.toHaveAttribute('open', '');
  await expect(page.locator('[role="tablist"]')).toHaveCount(0);
  await expect(page.locator('[role="tab"]')).toHaveCount(0);
  await expect(page.locator('[data-action="select-unit"]')).toHaveCount(2);
});

test('locked Practice has no dangling aria-describedby', async ({ page }) => {
  await gotoWithProgress(page, emptyProgress());
  const practice = modeButton(page, 'practice');
  await expect(practice).toBeDisabled();
  await expect(practice).not.toHaveAttribute('aria-describedby', /.+/);
});

test('Progress is resume-first with detail closed but reachable', async ({ page }) => {
  const store = updateResume(progressAfterLevel0(), { mode: 'progress' });
  await gotoWithProgress(page, store);

  const cards = page.locator('main.app > .progress-card');
  await expect(cards.first()).toHaveClass(/what-next-card/);
  await expect(page.locator('.progress-overview')).toBeVisible();
  const detail = page.locator('.progress-disclosure');
  expect(await detail.count()).toBeGreaterThan(0);
  for (const disclosure of await detail.all()) {
    await expect(disclosure).not.toHaveAttribute('open', '');
  }
});
