import { test, expect } from '@playwright/test';
import { clickMode, gotoWithProgress } from '../helpers/app';
import { progressAtLesson } from '../helpers/progress';
import { expectNoPageOverflow } from '../helpers/tables';

test('Progress outline fits a phone viewport and keeps later units visible', async ({ page }) => {
  await gotoWithProgress(page, progressAtLesson('level1-07-imp'));
  await clickMode(page, 'progress');

  const outline = page.getByTestId('course-outline');
  await expect(outline).toBeVisible();
  await expect(page.getByTestId('progress-next')).toBeVisible();
  await expect(page.getByTestId('opening-topic')).toBeVisible();
  await expect(page.getByTestId('course-outline-unit-0')).toBeVisible();
  await expect(page.getByTestId('course-outline-unit-1')).toBeVisible();
  await expect(page.getByTestId('course-outline-unit-2')).toBeVisible();
  await expect(page.getByTestId('course-outline-here')).toBeVisible();
  await expect(page.getByTestId('course-outline-here')).toContainText('you are here');
  await expect(page.getByTestId('course-outline-unit-2')).toContainText('after Unit 1');
  await expect(outline).toContainText('lessons');
  await expect(outline).not.toContainText('Introductory unit');
  await expect(outline).not.toContainText('sections complete');

  const nextBox = await page.getByTestId('progress-next').boundingBox();
  const outlineBox = await outline.boundingBox();
  expect(nextBox).toBeTruthy();
  expect(outlineBox).toBeTruthy();
  expect(outlineBox!.y).toBeGreaterThan(nextBox!.y);
  expect(outlineBox!.width).toBeLessThanOrEqual(page.viewportSize()!.width);

  await expectNoPageOverflow(page);
});
