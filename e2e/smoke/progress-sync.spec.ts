import { test, expect } from '@playwright/test';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { completeLesson, serializeProgressExport } from '../../src/app/storage';
import { emptyProgress, STORAGE_KEY } from '../helpers/progress';
import { modeButton, skipOnboarding } from '../helpers/app';

test.describe('Progress export/import', () => {
  test('round-trips progress through export and file import', async ({ page }) => {
    let store = emptyProgress();
    store = completeLesson(store, 'level0-01-letters');
    store = completeLesson(store, 'level0-02-truth');

    await page.goto('/');
    await skipOnboarding(page);
    await page.evaluate(
      ({ key, data }) => {
        localStorage.setItem(key, JSON.stringify(data));
      },
      { key: STORAGE_KEY, data: store },
    );
    await page.reload();
    await skipOnboarding(page);

    await modeButton(page, 'progress').click();

    const downloadPromise = page.waitForEvent('download');
    await page.locator('[data-action="export-progress"]').click();
    const download = await downloadPromise;
    const exportPath = await download.path();
    expect(exportPath).toBeTruthy();

    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await skipOnboarding(page);

    await modeButton(page, 'progress').click();
    await expect(page.locator('.progress-item.done')).toHaveCount(0);

    const exportJson = serializeProgressExport(store, 'en');
    const importDir = mkdtempSync(join(tmpdir(), 'externalize-import-'));
    const importFile = join(importDir, 'externalize-progress.json');
    writeFileSync(importFile, exportJson);
    await page.locator('input[type="file"]').setInputFiles(importFile);

    await expect(page.locator('.progress-notice-success')).toBeVisible();
    await expect(page.locator('.progress-item.done')).toHaveCount(2);
  });
});
