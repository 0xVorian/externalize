import type { Page } from '@playwright/test';
import type { ProgressStore } from '../../src/app/storage';

export async function skipOnboarding(page: Page): Promise<void> {
  const overlay = page.locator('.onboarding-overlay');
  if (await overlay.count()) {
    await page.locator('[data-action="onboarding-skip"]').click();
  }
  await page.waitForSelector('main.app');
}
import { STORAGE_KEY } from './progress';

export async function gotoFresh(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.clear();
  });
  await page.goto('/');
  await skipOnboarding(page);
}

export async function gotoWithProgress(page: Page, store: ProgressStore): Promise<void> {
  await page.addInitScript(
    ({ key, data }) => {
      localStorage.setItem(key, JSON.stringify(data));
    },
    { key: STORAGE_KEY, data: store },
  );
  await page.goto('/');
  await skipOnboarding(page);
}

export function lessonNext(page: Page) {
  return page.locator('[data-action="lesson-next"]');
}

export function modeButton(page: Page, mode: 'learn' | 'practice' | 'progress') {
  return page.locator(`[data-action="set-mode"][data-mode="${mode}"]`);
}

export function unitTab(page: Page, unit: 0 | 1) {
  return page.locator(`[data-action="select-unit"][data-unit="${unit}"]`);
}

export async function completeGuidedStep(
  page: Page,
  atom: string,
  value: boolean,
): Promise<void> {
  await page
    .locator(`[data-action="set-atom-value"][data-atom="${atom}"][data-value="${value ? 'true' : 'false'}"]`)
    .click();
}

export async function insertPaletteToken(
  page: Page,
  token: 'atom' | 'connective' | 'paren',
  value: string,
): Promise<void> {
  await page
    .locator(`[data-action="palette-insert"][data-token="${token}"][data-value="${value}"]`)
    .click();
}
