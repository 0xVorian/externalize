import { test, expect } from '@playwright/test';
import { clickMode, gotoWithProgress } from '../helpers/app';
import { progressAfterLevel0, progressAtLesson } from '../helpers/progress';
import { sessionOpening, sessionPrimary } from '../helpers/session';

test('Home and Progress offer the same named round', async ({ page }) => {
  await gotoWithProgress(page, progressAtLesson('level1-03-neg-guided'));
  await expect(sessionOpening(page)).toBeVisible();
  const topic = (await page.getByTestId('opening-topic').innerText()).trim();
  const effort = (await page.getByTestId('opening-effort').innerText()).trim();
  expect(topic.length).toBeGreaterThan(0);
  expect(effort).toMatch(/\d+\s+steps?/);

  await clickMode(page, 'progress');
  await expect(page.getByTestId('progress-next')).toBeVisible();
  await expect(page.getByTestId('opening-topic')).toHaveText(topic);
  await expect(page.getByTestId('opening-effort')).toHaveText(effort);
  await expect(page.getByTestId('progress-session-begin')).toBeVisible();
  await expect(page.locator('[data-action="practice-exercise"]')).toHaveCount(0);

  await page.getByTestId('progress-session-begin').click();
  await expect(page.getByTestId('session-active')).toBeVisible();
  await expect(page.getByTestId('session-position')).toBeVisible();
});

test('Progress outline shows all three units after Unit 0', async ({ page }) => {
  await gotoWithProgress(page, progressAfterLevel0());
  await clickMode(page, 'progress');
  const outline = page.getByTestId('course-outline');
  await expect(outline).toBeVisible();
  await expect(outline).toContainText('Unit 0 — Propositional syntax');
  await expect(outline).toContainText('Unit 1 — Connectives');
  await expect(outline).toContainText('Unit 2 — Nested formulas');
  await expect(outline).toContainText('5 of 5 lessons');
  await expect(page.getByTestId('course-outline-here')).toBeVisible();
  await expect(page.getByTestId('course-outline-unit-2')).toContainText('after Unit 1');
  await expect(page.getByTestId('course-outline-unit-0-lessons')).toBeVisible();
  await expect(page.getByTestId('course-outline-unit-2-lessons')).toBeVisible();
  await expect(page.getByTestId('capability-up-next')).toHaveText(
    (await page.getByTestId('opening-topic').innerText()).trim(),
  );
  await expect(sessionPrimary(page)).toHaveCount(0);
});
