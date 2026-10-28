import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, type Locator, type Page } from '@playwright/test';
import { evaluate, parse } from '../../engine';
import { gotoWithProgress, lessonNext } from '../helpers/app';
import {
  progressLapseRetrieveAtStep2,
  progressSobelChainRetrieveAtStep2,
  emptyProgress,
} from '../helpers/progress';
import {
  beginOfferedSession,
  openBrowseMode,
  roundComplete,
  sessionPosition,
} from '../helpers/session';
import { setActiveRoute } from '../../src/app/source-route';
import { LOGIC_AND_THEISM_READING_ROUTE_ID } from '../../src/app/routes';

const ARTIFACT_DIR = process.env.SCREENSHOT_DIR ?? '/opt/cursor/artifacts/screenshots';
const HOLDS = '[data-action="select-choice"][data-choice-id="holds"]';
const FAILS = '[data-action="select-choice"][data-choice-id="fails"]';
const CHECK = '[data-action="check-classification"]';
const CONTINUE = '.actions [data-action="next"], .actions [data-action="source-next"]';
const TOUCH = { bubbles: true, pointerType: 'touch', isPrimary: true } as const;

async function screenshotIf390(page: Page, filename: string): Promise<void> {
  if (page.viewportSize()?.width !== 390) {
    return;
  }
  mkdirSync(ARTIFACT_DIR, { recursive: true });
  await page.screenshot({ path: join(ARTIFACT_DIR, filename), fullPage: false });
}

async function setLocale(page: Page, locale: 'en' | 'fr'): Promise<void> {
  await page.locator(`[data-action="set-locale"][data-locale="${locale}"]`).tap();
}

async function atomIsTrue(page: Page, atom: string): Promise<boolean> {
  const row = page.locator('.atom-row', {
    has: page.locator(`.atom-name:text-is("${atom}")`),
  });
  return (await row.locator('.atom-segment.true.active').count()) > 0;
}

async function passWarmupEvaluation(page: Page): Promise<void> {
  const formula = (await page.locator('.formula-display').innerText()).trim();
  const names = await page.locator('.atom-row .atom-name').allInnerTexts();
  const assignment: Record<string, boolean> = {};
  for (const name of names) {
    const atom = name.trim();
    assignment[atom] = await atomIsTrue(page, atom);
  }
  const value = evaluate(parse(formula), assignment);
  await page
    .locator(
      `[data-action="select-evaluation-prediction"][data-value="${value ? 'true' : 'false'}"]`,
    )
    .tap();
  await page.locator('[data-action="check-evaluation"]').tap();
  await expect(page.locator('.feedback-correct')).toBeVisible();
  await page.locator('[data-action="next"]').tap();
}

async function expectFillsParent(
  child: Locator,
  parent: Locator,
  ratio = 0.85,
): Promise<void> {
  const parentBox = await parent.boundingBox();
  const childBox = await child.boundingBox();
  expect(parentBox).toBeTruthy();
  expect(childBox).toBeTruthy();
  expect(childBox!.width).toBeGreaterThan(parentBox!.width * ratio);
}

async function expectChoiceSelectable(page: Page, choice: Locator): Promise<void> {
  await expect(choice).toBeVisible();
  await expect(choice).toBeEnabled();
  await expectFillsParent(choice, page.locator('.choice-list'));
  await choice.tap();
  await expect(choice).toHaveClass(/selected/);
  await expect(choice).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator(CHECK)).toBeEnabled();
}

async function expectRetrieveStep(page: Page, locale: 'en' | 'fr'): Promise<void> {
  await expect(page.locator('.exercise-prompt')).toBeVisible();
  if (locale === 'fr') {
    await expect(page.locator('.exercise-prompt')).toContainText(
      'F(a) → G(a) est-elle vraie ou fausse',
    );
    await expect(page.locator(HOLDS)).toHaveText('Vraie');
    await expect(page.locator(FAILS)).toHaveText('Fausse');
    await expect(page.locator(CHECK)).toContainText('Vérifier la sélection');
  } else {
    await expect(page.locator('.exercise-prompt')).toContainText(
      'Is F(a) → G(a) true or false',
    );
    await expect(page.locator(HOLDS)).toHaveText('True');
    await expect(page.locator(FAILS)).toHaveText('False');
    await expect(page.locator(CHECK)).toContainText('Check selection');
  }
}

async function openRetrieveAtStep2(page: Page, locale: 'en' | 'fr'): Promise<void> {
  await gotoWithProgress(page, progressLapseRetrieveAtStep2());
  if (locale === 'fr') {
    await setLocale(page, 'fr');
  }
  await beginOfferedSession(page);
  await passWarmupEvaluation(page);
  await expect(sessionPosition(page)).toHaveText('2 / 5');
}

async function selectHoldsAndCheck(
  page: Page,
  locale: 'en' | 'fr',
  screenshotBase: string,
  options?: { afterContinue?: boolean },
): Promise<void> {
  await expectRetrieveStep(page, locale);
  const holds = page.locator(HOLDS);
  await expectChoiceSelectable(page, holds);
  await screenshotIf390(page, `${screenshotBase}-selected.png`);
  await page.locator(CHECK).tap();
  await expect(page.locator('.feedback-correct')).toBeVisible();
  const continueBtn = page.locator(CONTINUE);
  await expect(continueBtn).toBeVisible();
  await expectFillsParent(continueBtn, page.locator('.actions'));
  if (!options?.afterContinue) {
    return;
  }
  if (locale === 'fr') {
    await expect(continueBtn).toContainText('Continuer');
  } else {
    await expect(continueBtn).toContainText('Continue');
  }
  await continueBtn.tap();
  await expect(sessionPosition(page)).toHaveText('3 / 5');
  await screenshotIf390(page, `${screenshotBase}-after-continue.png`);
}

test.describe('classify-choice taps on a phone', () => {
  test.use({ hasTouch: true, isMobile: true });

  test('a touch pointerup without a click still selects the option', async ({ page }) => {
    await openRetrieveAtStep2(page, 'fr');
    const holds = page.locator(HOLDS);
    await expect(holds).toBeVisible();
    await holds.dispatchEvent('pointerdown', TOUCH);
    await holds.dispatchEvent('pointerup', TOUCH);
    await expect(holds).toHaveClass(/selected/);
    await expect(holds).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(CHECK)).toBeEnabled();
    await expect(page.locator('.feedback-correct')).toHaveCount(0);
  });

  async function dispatchTouchPointerThenClick(target: Locator): Promise<void> {
    await target.evaluate((el) => {
      const touch = { bubbles: true, pointerType: 'touch', isPrimary: true };
      el.dispatchEvent(new PointerEvent('pointerdown', touch));
      el.dispatchEvent(new PointerEvent('pointerup', touch));
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
  }

  test('pointerup then a compatibility click does not double-toggle or submit', async ({
    page,
  }) => {
    await openRetrieveAtStep2(page, 'fr');
    const holds = page.locator(HOLDS);
    await expect(holds).toBeVisible();
    await dispatchTouchPointerThenClick(holds);
    await expect(holds).toHaveClass(/selected/);
    await expect(page.locator(FAILS)).not.toHaveClass(/selected/);
    await expect(page.locator('.feedback-correct')).toHaveCount(0);
    await expect(sessionPosition(page)).toHaveText('2 / 5');

    await dispatchTouchPointerThenClick(page.locator(CHECK));
    await expect(page.locator('.feedback-correct')).toBeVisible();
    await expect(sessionPosition(page)).toHaveText('2 / 5');
    await expect(page.locator(CONTINUE)).toBeVisible();
  });

  test('a drag that starts on an option does not select', async ({ page }) => {
    await openRetrieveAtStep2(page, 'fr');
    const holds = page.locator(HOLDS);
    await expect(holds).toBeVisible();
    await holds.dispatchEvent('pointerdown', { ...TOUCH, clientX: 40, clientY: 40 });
    await holds.dispatchEvent('pointerup', { ...TOUCH, clientX: 40, clientY: 120 });
    await expect(holds).not.toHaveClass(/selected/);
    await expect(holds).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator(CHECK)).toBeDisabled();
  });

  test('pointercancel on an option does not select later', async ({ page }) => {
    await openRetrieveAtStep2(page, 'fr');
    const holds = page.locator(HOLDS);
    await expect(holds).toBeVisible();
    await holds.dispatchEvent('pointerdown', TOUCH);
    await holds.dispatchEvent('pointercancel', TOUCH);
    await holds.dispatchEvent('pointerup', TOUCH);
    await expect(holds).not.toHaveClass(/selected/);
    await expect(page.locator(CHECK)).toBeDisabled();
  });

  test('Home FR: Vraie/Fausse on retrieve at 2/5 can be selected and checked', async ({
    page,
  }) => {
    await gotoWithProgress(page, progressLapseRetrieveAtStep2());
    await setLocale(page, 'fr');
    await beginOfferedSession(page);
    await expect(sessionPosition(page)).toHaveText('1 / 5');
    await passWarmupEvaluation(page);
    await expect(sessionPosition(page)).toHaveText('2 / 5');
    await selectHoldsAndCheck(page, 'fr', 'fr-retrieve', { afterContinue: true });
  });

  test('Home EN: True/False on retrieve at 2/5 can be selected and checked', async ({
    page,
  }) => {
    await gotoWithProgress(page, progressLapseRetrieveAtStep2());
    await beginOfferedSession(page);
    await passWarmupEvaluation(page);
    await expect(sessionPosition(page)).toHaveText('2 / 5');
    await selectHoldsAndCheck(page, 'en', 'en-retrieve', { afterContinue: true });
  });

  test('Progress FR: same retrieve step is tappable', async ({ page }) => {
    await gotoWithProgress(page, progressLapseRetrieveAtStep2());
    await setLocale(page, 'fr');
    await openBrowseMode(page, 'progress');
    await page.getByTestId('progress-session-begin').tap();
    await expect(page.getByTestId('session-active')).toBeVisible();
    await passWarmupEvaluation(page);
    await expect(sessionPosition(page)).toHaveText('2 / 5');
    await selectHoldsAndCheck(page, 'fr', 'fr-retrieve-from-progress');
  });

  test('Course FR: Sobel retrieve check is tappable', async ({ page }) => {
    await gotoWithProgress(
      page,
      setActiveRoute(emptyProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID),
    );
    await setLocale(page, 'fr');
    await openBrowseMode(page, 'learn');
    await expect(
      page.locator(`[data-action="set-route"][data-route-id="${LOGIC_AND_THEISM_READING_ROUTE_ID}"]`),
    ).toBeVisible();
    await lessonNext(page).tap();
    await expect(page.locator('[data-action="select-choice"]').first()).toBeVisible();
    const emptyClub = page.locator(
      '[data-action="select-choice"][data-choice-id="still-true"]',
    );
    await emptyClub.tap();
    await expect(emptyClub).toHaveClass(/selected/);
    await page.locator(CHECK).tap();
    await expect(page.locator('.feedback-correct')).toBeVisible();
    await page.locator('[data-action="source-next"]').tap();
    for (let i = 0; i < 4; i += 1) {
      await lessonNext(page).tap();
    }
    await expectRetrieveStep(page, 'fr');
    await selectHoldsAndCheck(page, 'fr', 'fr-retrieve-from-course');
  });

  test('empty-club prediction choices also select from a touch pointerup', async ({
    page,
  }) => {
    await gotoWithProgress(
      page,
      setActiveRoute(emptyProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID),
    );
    await setLocale(page, 'fr');
    await beginOfferedSession(page);
    await lessonNext(page).tap();
    const stillTrue = page.locator(
      '[data-action="select-choice"][data-choice-id="still-true"]',
    );
    await expect(stillTrue).toBeVisible();
    await stillTrue.dispatchEvent('pointerdown', TOUCH);
    await stillTrue.dispatchEvent('pointerup', TOUCH);
    await expect(stillTrue).toHaveClass(/selected/);
    await page.locator(CHECK).tap();
    await expect(page.locator('.feedback-correct')).toBeVisible();
  });

  test('after Enchaîner une courte séance, retrieve at 2/5 is tappable', async ({
    page,
  }) => {
    await gotoWithProgress(page, progressSobelChainRetrieveAtStep2());
    await setLocale(page, 'fr');
    await beginOfferedSession(page);
    await expect(sessionPosition(page)).toHaveText('1 / 1');
    await passWarmupEvaluation(page);
    await expect(roundComplete(page)).toBeVisible();
    await page.getByTestId('session-another').tap();
    await expect(page.getByTestId('session-active')).toBeVisible();
    await expect(sessionPosition(page)).toHaveText('1 / 5');
    await lessonNext(page).tap();
    await expect(sessionPosition(page)).toHaveText('2 / 5');
    await selectHoldsAndCheck(page, 'fr', 'fr-retrieve-from-chain');
  });
});
