import { test, expect, type Page } from '@playwright/test';
import { clickMode, gotoLearnWithProgress, gotoWithProgress, unitTab } from '../helpers/app';
import { emptyProgress, progressAtLesson } from '../helpers/progress';
import { expectNoPageOverflow } from '../helpers/tables';

function onFirstScreen(
  box: { y: number; height: number } | null,
  viewportHeight: number,
): boolean {
  return Boolean(box && box.y >= 0 && box.y < viewportHeight);
}

function fullyOnFirstScreen(
  box: { y: number; height: number } | null,
  viewportHeight: number,
): boolean {
  return Boolean(box && box.y >= 0 && box.y + box.height <= viewportHeight);
}

async function expectEmptyFirstScreen(page: Page): Promise<void> {
  const viewportHeight = page.viewportSize()!.height;
  await expect(page.getByTestId('progress-next')).toBeVisible();
  const nextBox = await page.getByTestId('progress-next').boundingBox();
  expect(onFirstScreen(nextBox, viewportHeight)).toBe(true);
  for (const unit of [0, 1, 2] as const) {
    const header = await page
      .locator(`[data-testid="course-outline-unit-${unit}"] .course-outline-unit-header`)
      .boundingBox();
    expect(fullyOnFirstScreen(header, viewportHeight), `unit ${unit} header`).toBe(true);
    const count = await page
      .locator(`[data-testid="course-outline-unit-${unit}"] .course-outline-unit-count`)
      .boundingBox();
    expect(fullyOnFirstScreen(count, viewportHeight), `unit ${unit} count`).toBe(true);
    expect(count).toBeTruthy();
    expect(count!.height).toBeLessThan(28);
  }
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

  await expectEmptyFirstScreen(page);

  await page.locator('[data-action="set-locale"][data-locale="fr"]').click();
  await expect(page.getByTestId('course-outline')).toContainText('Le cours');
  await expectEmptyFirstScreen(page);
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

test('Course tab shows later units locked without starting them', async ({ page }) => {
  await gotoLearnWithProgress(page, emptyProgress());
  await expect(page.getByTestId('unit-picker')).toBeVisible();
  await expect(unitTab(page, 0)).toHaveAttribute('aria-current', 'page');
  await expect(unitTab(page, 1)).toBeDisabled();
  await expect(unitTab(page, 2)).toBeDisabled();
  await expect(unitTab(page, 1)).toContainText('after Unit 0');
  await unitTab(page, 2).click({ force: true });
  await expect(page.locator('h1')).toContainText('Unit 0');
  await expectNoPageOverflow(page);
});
