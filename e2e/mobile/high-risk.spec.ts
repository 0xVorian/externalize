import { test, expect, type Page } from '@playwright/test';
import {
  gotoFresh,
  gotoWithProgress,
  lessonNext,
  clickMode,
  enterLearn,
} from '../helpers/app';
import { emptyProgress, progressAtLesson, progressReadyForExercise } from '../helpers/progress';
import { beginOfferedSession, sessionOpening, sessionPosition, sessionPrimary } from '../helpers/session';
import { setActiveRoute } from '../../src/app/source-route';
import { LOGIC_AND_THEISM_READING_ROUTE_ID } from '../../src/app/routes';

async function expectNoPageOverflow(page: Page): Promise<void> {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);
}

test('guided evaluation fits a narrow phone with a distinct response workspace', async ({
  page,
}) => {
  await gotoWithProgress(page, progressAtLesson('level0-05-guided'));
  await beginOfferedSession(page);
  await expect(page.getByTestId('guided-response-workspace')).toBeVisible();
  await expect(page.locator('.atom-panel')).toHaveCount(0);
  await expect(page.getByTestId('guided-target-cell')).toHaveCount(1);
  await expect(page.locator('.guided-prompt')).toContainText('Set P to true.');
  await expect(page.locator('.unknown-cell')).toHaveText('—');
  await expect(page.getByTestId('truth-result-cell')).toHaveText('—');
  const workspaceBox = await page.getByTestId('guided-response-workspace').boundingBox();
  const tableBox = await page.locator('.truth-table').boundingBox();
  expect(workspaceBox).toBeTruthy();
  expect(tableBox).toBeTruthy();
  expect(workspaceBox!.y).toBeGreaterThan(tableBox!.y + tableBox!.height - 1);
  await page.locator('[data-action="select-guided-value"][data-value="true"]').click();
  await expect(page.locator('.truth-table-drop-slot.filled')).toContainText('T');
  await page.locator('[data-action="check-guided-value"]').click();
  await expect(page.locator('.guided-prompt')).toContainText('Now set Q to false.');
  await expect(page.getByTestId('truth-result-cell')).toHaveText('—');
  await expectNoPageOverflow(page);
});

test('guided ¬P on a narrow phone does not treat unset P as false', async ({ page }) => {
  await gotoWithProgress(page, progressAtLesson('level1-03-neg-guided'));
  await beginOfferedSession(page);
  await expect(page.getByTestId('guided-response-workspace')).toBeVisible();
  await expect(page.locator('.guided-prompt')).toContainText('Choose P so that ¬P is false.');
  await expect(page.getByTestId('truth-result-cell')).toHaveText('—');
  await page.locator('[data-action="select-guided-value"][data-value="false"]').click();
  await expect(page.getByTestId('truth-result-cell')).toHaveText('T');
  await page.locator('[data-action="check-guided-value"]').click();
  await expect(page.locator('.feedback-wrong')).toBeVisible();
  await expect(page.getByTestId('guided-response-workspace')).toBeVisible();
  await expectNoPageOverflow(page);
});

test('Level 0 watch grid fits a narrow phone', async ({ page }) => {
  await gotoFresh(page);
  await beginOfferedSession(page);
  for (let card = 0; card < 3; card += 1) await lessonNext(page).click();
  await expect(page.locator('.watch-grid')).toBeVisible();
  await expectNoPageOverflow(page);
});

test('evaluation prediction remains usable', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('eval-001'));
  await clickMode(page, 'practice');
  await expect(page.locator('.evaluation-prediction')).toBeVisible();
  const p = (await page.locator('.atom-row', { has: page.locator('.atom-name:text-is("P")') }).locator('.atom-segment.true.active').count()) > 0;
  const q = (await page.locator('.atom-row', { has: page.locator('.atom-name:text-is("Q")') }).locator('.atom-segment.true.active').count()) > 0;
  const rootTrue = p && q;
  await page.locator(`[data-action="select-evaluation-prediction"][data-value="${rootTrue ? 'false' : 'true'}"]`).click();
  await page.locator('[data-action="check-evaluation"]').click();
  await expect(page.locator('.feedback-wrong')).toBeVisible();
  await expect(page.locator(`[data-action="select-evaluation-prediction"][data-value="${rootTrue ? 'true' : 'false'}"]`)).toBeVisible();
  await expectNoPageOverflow(page);
});

test('scope tree repair remains tappable', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('scope-001'));
  await clickMode(page, 'practice');
  const nodes = page.locator('[data-action="select-node"]');
  await nodes.nth(1).click();
  await page.locator('[data-action="check-scope"]').click();
  await page.locator('[data-action="try-again"]').click();
  await nodes.first().click();
  await page.locator('[data-action="check-scope"]').click();
  await expect(page.locator('.feedback-correct')).toBeVisible();
  await expectNoPageOverflow(page);
});

test('translation palette wraps without page overflow in French', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('translate-003'));
  await page.locator('[data-action="set-locale"][data-locale="fr"]').click();
  await clickMode(page, 'practice');
  await expect(page.locator('.symbol-palette')).toBeVisible();
  await expect(page.locator('.atom-key')).toContainText('Il pleut.');
  await expectNoPageOverflow(page);
});

test('truth table stays contained on a phone', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('tt-001'));
  await clickMode(page, 'practice');
  await expect(page.locator('.truth-table')).toBeVisible();
  await expectNoPageOverflow(page);
});

test('and-elimination proof controls work on a phone', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('nd-002'));
  await clickMode(page, 'practice');
  await page.locator('[data-action="proof-select-rule"][data-rule="and-elim"]').click();
  await page.locator('[data-action="proof-toggle-cite"][data-line="1"]').click();
  await page.locator('[data-action="check-proof"]').click();
  await expect(page.locator('.feedback-correct')).toBeVisible();
  await expectNoPageOverflow(page);
});

test('learn progress chrome stays inside a narrow phone', async ({ page }) => {
  await gotoFresh(page);
  await enterLearn(page);
  await expect(page.locator('[data-testid="learn-progress"]')).toBeVisible();
  await expectNoPageOverflow(page);
});

test('Logic and Theism route chrome fits a narrow phone', async ({ page }) => {
  await gotoWithProgress(page, emptyProgress());
  await enterLearn(page);
  await page.locator('[data-action="set-route"][data-route-id="logic-and-theism-reading"]').click();
  await expect(page.locator('[data-testid="route-picker"]')).toBeVisible();
  await expect(page.locator('[data-testid="planner-banner"]')).toHaveCount(0);
  await expectNoPageOverflow(page);
});

test('practice and progress chrome stay inside a narrow phone', async ({ page }) => {
  await gotoWithProgress(page, progressReadyForExercise('eval-001'));
  await clickMode(page, 'practice');
  await expect(page.locator('[data-testid="practice-progress"]')).toBeVisible();
  await expectNoPageOverflow(page);

  await clickMode(page, 'progress');
  await expect(page.locator('[data-testid="capability-summary"]')).toBeVisible();
  await expectNoPageOverflow(page);
});

test('session opening and one-tap start fit a narrow phone', async ({ page }) => {
  await gotoFresh(page);
  await expect(sessionOpening(page)).toBeVisible();
  await expect(sessionPrimary(page)).toBeVisible();
  await expectNoPageOverflow(page);
  const primaryBox = await sessionPrimary(page).boundingBox();
  expect(primaryBox).toBeTruthy();
  expect((primaryBox?.height ?? 0) >= 40).toBe(true);

  await sessionPrimary(page).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('session-active')).toBeVisible();
    await expect(sessionPosition(page)).toHaveText('1 / 6');
  await expectNoPageOverflow(page);
  await expect(page.getByTestId('session-exit')).toBeVisible();
});

test('Sobel empty-club prediction remains usable on a narrow phone', async ({ page }) => {
  await gotoWithProgress(
    page,
    setActiveRoute(emptyProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID),
  );
  await beginOfferedSession(page);
  await lessonNext(page).click();
  await expect(page.locator('[data-action="select-choice"]').first()).toBeVisible();
  await expectNoPageOverflow(page);
  await page.locator('[data-action="select-choice"][data-choice-id="needs-instance"]').click();
  await page.locator('[data-action="check-classification"]').click();
  await expect(page.getByTestId('try-again')).toBeVisible();
  await expectNoPageOverflow(page);
  await page.getByTestId('try-again').click();
  await page.locator('[data-action="select-choice"][data-choice-id="still-true"]').click();
  await page.locator('[data-action="check-classification"]').click();
  await expect(page.locator('.feedback-correct')).toBeVisible();
  await expectNoPageOverflow(page);
});
