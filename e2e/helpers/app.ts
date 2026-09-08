import type { Page } from '@playwright/test';
import type { ProgressStore } from '../../src/app/storage';
import { STORAGE_KEY } from './progress';
import { openBrowseMode } from './session';

export async function skipOnboarding(page: Page): Promise<void> {
  const overlay = page.locator('.onboarding-overlay');
  if (await overlay.count()) {
    await page.locator('[data-action="onboarding-skip"]').click();
  }
  await page.waitForSelector('main.app');
}

export async function enterLearn(page: Page): Promise<void> {
  if (await page.getByTestId('session-opening').count()) {
    await openBrowseMode(page, 'learn');
  }
}

export async function clickMode(
  page: Page,
  mode: 'learn' | 'practice' | 'progress' | 'explore',
): Promise<void> {
  if (await page.getByTestId('session-opening').count()) {
    await openBrowseMode(page, mode);
    return;
  }
  await page.locator(`[data-action="set-mode"][data-mode="${mode}"]`).click();
}

export async function gotoFresh(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.clear();
  });
  await page.goto('/');
  await skipOnboarding(page);
}

export async function gotoLearn(page: Page): Promise<void> {
  await gotoFresh(page);
  await enterLearn(page);
}

export async function gotoWithProgress(page: Page, store: ProgressStore): Promise<void> {
  await page.goto('/');
  await page.evaluate(
    ({ key, data }) => {
      localStorage.setItem(key, JSON.stringify(data));
    },
    { key: STORAGE_KEY, data: store },
  );
  await page.reload();
  await skipOnboarding(page);
}

export async function gotoLearnWithProgress(page: Page, store: ProgressStore): Promise<void> {
  await gotoWithProgress(page, store);
  await enterLearn(page);
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
  const guidedChoice = page.locator(
    `[data-action="select-guided-value"][data-value="${value ? 'true' : 'false'}"]`,
  );
  if (await guidedChoice.count()) {
    await guidedChoice.click();
    await page.locator('[data-action="check-guided-value"]').click();
    return;
  }
  await page
    .locator(`[data-action="set-atom-value"][data-atom="${atom}"][data-value="${value ? 'true' : 'false'}"]`)
    .click();
}

export async function insertPaletteToken(
  page: Page,
  token: 'pred' | 'connective' | 'paren',
  value: string,
): Promise<void> {
  await page
    .locator(`[data-action="palette-insert"][data-token="${token}"][data-value="${value}"]`)
    .click();
}
