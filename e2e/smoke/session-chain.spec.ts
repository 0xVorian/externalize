import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { evaluate, parse } from '../../engine';
import { gotoWithProgress } from '../helpers/app';
import { progressWithOneDueConjunctionReview } from '../helpers/progress';
import { beginOfferedSession, roundComplete, sessionPosition } from '../helpers/session';

const ARTIFACT_DIR = process.env.SCREENSHOT_DIR ?? '/opt/cursor/artifacts/screenshots';
const MOBILE = { width: 390, height: 844 };

async function atomIsTrue(page: Page, atom: string): Promise<boolean> {
  const row = page.locator('.atom-row', {
    has: page.locator(`.atom-name:text-is("${atom}")`),
  });
  return (await row.locator('.atom-segment.true.active').count()) > 0;
}

async function formulaValue(page: Page): Promise<boolean> {
  const formula = (await page.locator('.formula-display').innerText()).trim();
  const names = await page.locator('.atom-row .atom-name').allInnerTexts();
  const assignment: Record<string, boolean> = {};
  for (const name of names) {
    const atom = name.trim();
    assignment[atom] = await atomIsTrue(page, atom);
  }
  return evaluate(parse(formula), assignment);
}

async function passWarmupEvaluation(page: Page): Promise<void> {
  const value = await formulaValue(page);
  await page
    .locator(`[data-action="select-evaluation-prediction"][data-value="${value ? 'true' : 'false'}"]`)
    .click();
  await page.locator('[data-action="check-evaluation"]').click();
  await expect(page.locator('.feedback-correct')).toBeVisible();
  await page.locator('[data-action="next"]').click();
}

async function screenshotArtifact(page: Page, filename: string): Promise<void> {
  try {
    mkdirSync(ARTIFACT_DIR, { recursive: true });
    await page.screenshot({ path: join(ARTIFACT_DIR, filename) });
  } catch {
    // Artifact directory is optional in CI.
  }
}

test.describe('chaining after a recall round', () => {
  test.use({ viewport: MOBILE, hasTouch: true, isMobile: true });

  test('EN: Do another short round after recall goes to the next lesson, not another warm-up', async ({
    page,
  }) => {
    await gotoWithProgress(page, progressWithOneDueConjunctionReview());
    await beginOfferedSession(page);
    await expect(page.getByTestId('session-step-label')).toContainText(/Warm-up/i);
    await expect(sessionPosition(page)).toHaveText('1 / 1');

    await passWarmupEvaluation(page);
    await expect(roundComplete(page)).toBeVisible();
    await expect(page.getByTestId('session-another')).toContainText('Do another short round');
    await screenshotArtifact(page, 'en-post-recall-complete.png');

    await page.getByTestId('session-another').click();
    await expect(page.getByTestId('session-active')).toBeVisible();
    await expect(page.getByTestId('session-step-label')).toHaveCount(0);
    await expect(page.getByTestId('session-active')).not.toContainText(/Warm-up/i);
    await expect(page.locator('.lesson-card-title')).toContainText('Building complex formulas');
    await screenshotArtifact(page, 'en-after-do-another.png');
  });

  test('FR: Enchaîner une courte séance after Rappel goes to the next lesson, not another Rappel', async ({
    page,
  }) => {
    await gotoWithProgress(page, progressWithOneDueConjunctionReview());
    await page.locator('[data-action="set-locale"][data-locale="fr"]').click();
    await beginOfferedSession(page);
    await expect(page.getByTestId('session-step-label')).toContainText(/Rappel/);
    await expect(sessionPosition(page)).toHaveText('1 / 1');

    await passWarmupEvaluation(page);
    await expect(roundComplete(page)).toBeVisible();
    await expect(page.getByTestId('session-another')).toContainText('Enchaîner une courte séance');
    await screenshotArtifact(page, 'fr-post-recall-complete.png');

    await page.getByTestId('session-another').click();
    await expect(page.getByTestId('session-active')).toBeVisible();
    await expect(page.getByTestId('session-step-label')).toHaveCount(0);
    await expect(page.getByTestId('session-active')).not.toContainText(/Rappel/);
    await expect(page.locator('.lesson-card-title')).toContainText('Composer des formules complexes');
    await screenshotArtifact(page, 'fr-after-enchainer.png');
  });
});
