import { test, expect } from '@playwright/test';
import { clickMode, gotoWithProgress } from '../helpers/app';
import { emptyProgress, progressAtLesson } from '../helpers/progress';
import { expectNoPageOverflow } from '../helpers/tables';

function onFirstScreen(
  box: { y: number; height: number } | null,
  viewportHeight: number,
): boolean {
  return Boolean(box && box.y >= 0 && box.y < viewportHeight);
}

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
  await expect(page.getByTestId('course-outline-done-lessons')).toBeVisible();
  await expect(page.getByTestId('course-outline-unit-2-lessons')).toBeVisible();
  await expect(page.getByTestId('capability-up-next')).toHaveText(
    (await page.getByTestId('opening-topic').innerText()).trim(),
  );

  const nextBox = await page.getByTestId('progress-next').boundingBox();
  const outlineBox = await outline.boundingBox();
  expect(nextBox).toBeTruthy();
  expect(outlineBox).toBeTruthy();
  expect(outlineBox!.y).toBeGreaterThan(nextBox!.y);
  expect(outlineBox!.width).toBeLessThanOrEqual(page.viewportSize()!.width);

  await expectNoPageOverflow(page);
});

test('empty Progress shows all three unit headers on the first 390px screen', async ({
  page,
}) => {
  test.skip(page.viewportSize()?.width !== 390, '390×844 first-screen check');
  await gotoWithProgress(page, emptyProgress());
  await clickMode(page, 'progress');

  const viewportHeight = page.viewportSize()!.height;
  await expect(page.getByTestId('progress-next')).toBeVisible();
  const nextBox = await page.getByTestId('progress-next').boundingBox();
  const unit0 = await page
    .locator('#course-outline-unit-0-heading')
    .boundingBox();
  const unit1 = await page
    .locator('#course-outline-unit-1-heading')
    .boundingBox();
  const unit2 = await page
    .locator('#course-outline-unit-2-heading')
    .boundingBox();
  expect(onFirstScreen(nextBox, viewportHeight)).toBe(true);
  expect(onFirstScreen(unit0, viewportHeight)).toBe(true);
  expect(onFirstScreen(unit1, viewportHeight)).toBe(true);
  expect(onFirstScreen(unit2, viewportHeight)).toBe(true);
});

test('mid-Unit 1 Progress shows you-are-here on the first 390px screen', async ({
  page,
}) => {
  test.skip(page.viewportSize()?.width !== 390, '390×844 first-screen check');
  await gotoWithProgress(page, progressAtLesson('level1-07-imp'));
  await clickMode(page, 'progress');

  const viewportHeight = page.viewportSize()!.height;
  const hereBox = await page.getByTestId('course-outline-here').boundingBox();
  expect(onFirstScreen(hereBox, viewportHeight)).toBe(true);
});
