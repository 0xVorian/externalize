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
  await screenshotIf390(page, `${screenshotBase}-after-check.png`);
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
      const touch = { bubbles: true, pointerType: 'touch', isPrimary: true, pointerId: 1 };
      el.dispatchEvent(new PointerEvent('pointerdown', touch));
      el.dispatchEvent(new PointerEvent('pointerup', touch));
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
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
    const continueBtn = page.locator(CONTINUE);
    await expect(continueBtn).toBeVisible();
    await dispatchTouchPointerThenClick(continueBtn);
    await expect(sessionPosition(page)).toHaveText('3 / 5');
  });

  test('a drag that starts on an option does not select', async ({ page }) => {
    await openRetrieveAtStep2(page, 'fr');
    const holds = page.locator(HOLDS);
    await expect(holds).toBeVisible();
    await holds.evaluate((el) => {
      const base = { bubbles: true, pointerType: 'touch', isPrimary: true, pointerId: 1 };
      el.dispatchEvent(new PointerEvent('pointerdown', { ...base, clientX: 40, clientY: 40 }));
      el.dispatchEvent(new PointerEvent('pointerup', { ...base, clientX: 40, clientY: 72 }));
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    });
    await expect(holds).not.toHaveClass(/selected/);
    await expect(holds).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator(CHECK)).toBeDisabled();
  });

  test('pointercancel on an option does not select later', async ({ page }) => {
    await openRetrieveAtStep2(page, 'fr');
    const holds = page.locator(HOLDS);
    await expect(holds).toBeVisible();
    await holds.evaluate((el) => {
      const touch = { bubbles: true, pointerType: 'touch', isPrimary: true, pointerId: 1 };
      el.dispatchEvent(new PointerEvent('pointerdown', touch));
      el.dispatchEvent(new PointerEvent('pointercancel', touch));
      el.dispatchEvent(new PointerEvent('pointerup', touch));
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    });
    await expect(holds).not.toHaveClass(/selected/);
    await expect(page.locator(CHECK)).toBeDisabled();
  });

  test('a press that starts on one option and ends on another selects neither', async ({
    page,
  }) => {
    await openRetrieveAtStep2(page, 'fr');
    const holds = page.locator(HOLDS);
    const fails = page.locator(FAILS);
    await expect(holds).toBeVisible();
    await expect(fails).toBeVisible();
    await page.evaluate(
      ([holdsSel, failsSel]) => {
        const start = document.querySelector(holdsSel);
        const end = document.querySelector(failsSel);
        if (!(start instanceof HTMLElement) || !(end instanceof HTMLElement)) {
          throw new Error('missing choice buttons');
        }
        const touch = { bubbles: true, pointerType: 'touch', isPrimary: true, pointerId: 1 };
        start.dispatchEvent(new PointerEvent('pointerdown', touch));
        end.dispatchEvent(new PointerEvent('pointerup', touch));
        end.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
      },
      [HOLDS, FAILS] as const,
    );
    await expect(holds).not.toHaveClass(/selected/);
    await expect(fails).not.toHaveClass(/selected/);
    await expect(page.locator(CHECK)).toBeDisabled();
  });

  async function selectHoldsWithTouchNoClick(page: Page): Promise<void> {
    const holds = page.locator(HOLDS);
    await holds.evaluate((el) => {
      const touch = { bubbles: true, pointerType: 'touch', isPrimary: true, pointerId: 1 };
      el.dispatchEvent(new PointerEvent('pointerdown', touch));
      el.dispatchEvent(new PointerEvent('pointerup', touch));
    });
    await expect(holds).toHaveClass(/selected/);
    await expect(page.locator(CHECK)).toBeEnabled();
    await expect(page.locator('.feedback-correct')).toHaveCount(0);
  }

  test('Check still submits from a pointerup without a follow-up click', async ({ page }) => {
    await openRetrieveAtStep2(page, 'fr');
    await selectHoldsWithTouchNoClick(page);
    await page.locator(CHECK).evaluate((el) => {
      const touch = { bubbles: true, pointerType: 'touch', isPrimary: true, pointerId: 2 };
      el.dispatchEvent(new PointerEvent('pointerdown', touch));
      el.dispatchEvent(new PointerEvent('pointerup', touch));
    });
    await expect(page.locator('.feedback-correct')).toBeVisible();
    await expect(sessionPosition(page)).toHaveText('2 / 5');
  });

  test('Check still submits when iOS mouse pointer events arrive mid-tap', async ({
    page,
  }) => {
    await openRetrieveAtStep2(page, 'fr');
    await selectHoldsWithTouchNoClick(page);
    await page.evaluate((checkSel) => {
      const check = document.querySelector(checkSel);
      if (!(check instanceof HTMLElement)) {
        throw new Error('missing Check');
      }
      const touch = { bubbles: true, pointerType: 'touch', isPrimary: true, pointerId: 2 };
      const mouse = { bubbles: true, pointerType: 'mouse', isPrimary: true, pointerId: 1 };
      check.dispatchEvent(new PointerEvent('pointerdown', touch));
      // Compatibility mouse events from the option tap, delayed into this gesture.
      check.dispatchEvent(new PointerEvent('pointerdown', mouse));
      check.dispatchEvent(new PointerEvent('pointerup', mouse));
      check.dispatchEvent(new PointerEvent('pointerup', touch));
    }, CHECK);
    await expect(page.locator('.feedback-correct')).toBeVisible();
  });

  test('Check still submits when a late option click re-renders the button', async ({
    page,
  }) => {
    await openRetrieveAtStep2(page, 'fr');
    await selectHoldsWithTouchNoClick(page);
    await page.evaluate(([checkSel, holdsSel]) => {
      const check = document.querySelector(checkSel);
      if (!(check instanceof HTMLElement)) {
        throw new Error('missing Check');
      }
      const touch = {
        bubbles: true,
        pointerType: 'touch',
        isPrimary: true,
        pointerId: 2,
        clientX: 24,
        clientY: 24,
      };
      check.dispatchEvent(new PointerEvent('pointerdown', touch));
      const holds = document.querySelector(holdsSel);
      if (!(holds instanceof HTMLElement)) {
        throw new Error('missing option');
      }
      holds.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
      const checkAfter = document.querySelector(checkSel);
      if (!(checkAfter instanceof HTMLElement)) {
        throw new Error('missing Check after render');
      }
      checkAfter.dispatchEvent(new PointerEvent('pointerup', touch));
      checkAfter.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
    }, [CHECK, HOLDS] as const);
    await expect(page.locator('.feedback-correct')).toBeVisible();
    await expect(sessionPosition(page)).toHaveText('2 / 5');
  });

  test('a late click on the re-rendered Continue does not skip the feedback', async ({
    page,
  }) => {
    await openRetrieveAtStep2(page, 'fr');
    await selectHoldsWithTouchNoClick(page);
    await page.evaluate((checkSel) => {
      const check = document.querySelector(checkSel);
      if (!(check instanceof HTMLElement)) {
        throw new Error('missing Check');
      }
      const touch = { bubbles: true, pointerType: 'touch', isPrimary: true, pointerId: 2 };
      check.dispatchEvent(new PointerEvent('pointerdown', touch));
      check.dispatchEvent(new PointerEvent('pointerup', touch));
    }, CHECK);
    await expect(page.locator('.feedback-correct')).toBeVisible();
    const continueBtn = page.locator(CONTINUE);
    await expect(continueBtn).toBeVisible();
    await continueBtn.evaluate((el) => {
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
    });
    await expect(sessionPosition(page)).toHaveText('2 / 5');
  });

  test('a mouse click after a touch drag is not eaten', async ({ page }) => {
    await openRetrieveAtStep2(page, 'fr');
    const holds = page.locator(HOLDS);
    await holds.evaluate((el) => {
      const base = { bubbles: true, pointerType: 'touch', isPrimary: true, pointerId: 1 };
      el.dispatchEvent(new PointerEvent('pointerdown', { ...base, clientX: 40, clientY: 40 }));
      el.dispatchEvent(new PointerEvent('pointerup', { ...base, clientX: 40, clientY: 72 }));
    });
    await expect(holds).not.toHaveClass(/selected/);
    await page.evaluate(() => {
      const exit = document.querySelector('[data-action="session-exit"]');
      if (!(exit instanceof HTMLElement)) {
        throw new Error('missing session exit');
      }
      const mouse = { bubbles: true, pointerType: 'mouse', isPrimary: true, pointerId: 1 };
      exit.dispatchEvent(new PointerEvent('pointerdown', mouse));
      exit.dispatchEvent(new PointerEvent('pointerup', mouse));
      exit.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
    });
    await expect(page.getByTestId('session-opening')).toBeVisible();
  });

  test('a keyboard click is not eaten after a touch drag', async ({ page }) => {
    await openRetrieveAtStep2(page, 'fr');
    const holds = page.locator(HOLDS);
    await holds.evaluate((el) => {
      const base = { bubbles: true, pointerType: 'touch', isPrimary: true, pointerId: 1 };
      el.dispatchEvent(new PointerEvent('pointerdown', { ...base, clientX: 40, clientY: 40 }));
      el.dispatchEvent(new PointerEvent('pointerup', { ...base, clientX: 40, clientY: 72 }));
    });
    await page.evaluate(() => {
      const exit = document.querySelector('[data-action="session-exit"]');
      if (!(exit instanceof HTMLElement)) {
        throw new Error('missing session exit');
      }
      exit.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 0 }));
    });
    await expect(page.getByTestId('session-opening')).toBeVisible();
  });

  test('language toggle EN and FR stay at least 44px', async ({ page }) => {
    await gotoWithProgress(page, progressLapseRetrieveAtStep2());
    for (const locale of ['en', 'fr'] as const) {
      const box = await page
        .locator(`[data-action="set-locale"][data-locale="${locale}"]`)
        .boundingBox();
      expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
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
    for (let i = 0; i < 8; i += 1) {
      if (await page.locator('.exercise-prompt').filter({ hasText: 'F(a) → G(a)' }).count()) {
        break;
      }
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
