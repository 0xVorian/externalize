import type { Page } from '@playwright/test';

export function sessionOpening(page: Page) {
  return page.getByTestId('session-opening');
}

export function sessionPrimary(page: Page) {
  return page.getByTestId('session-primary-action');
}

export function sessionPosition(page: Page) {
  return page.getByTestId('session-position');
}

export function sessionExit(page: Page) {
  return page.getByTestId('session-exit');
}

export function roundComplete(page: Page) {
  return page.getByTestId('session-complete').or(page.getByTestId('round-complete'));
}

export async function beginOfferedSession(page: Page): Promise<void> {
  await sessionPrimary(page).click();
  await page.getByTestId('session-active').waitFor();
}

export async function expandSessionMore(page: Page): Promise<void> {
  const more = page.getByTestId('session-more');
  if (!(await more.count())) {
    return;
  }
  const summary = more.locator('summary');
  if (!(await summary.count())) {
    return;
  }
  const isOpen = await more.evaluate(
    (el) => !(el instanceof HTMLDetailsElement) || el.open,
  );
  if (!isOpen) {
    await summary.click();
  }
}

export async function openBrowseMode(
  page: Page,
  mode: 'learn' | 'practice' | 'progress' | 'explore',
): Promise<void> {
  await expandSessionMore(page);
  await page.locator(`[data-action="set-mode"][data-mode="${mode}"]`).click();
}
