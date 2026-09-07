import { test, expect, type Page } from '@playwright/test';
import { gotoWithProgress, clickMode } from '../helpers/app';
import { emptyProgress } from '../helpers/progress';
import { evidenceKey } from '../../src/app/curriculum';
import { getExerciseDefinition } from '../../src/app/exercises';
import { getExerciseCopy } from '../../src/i18n';
import { SOURCE_EXERCISE_IDS } from '../../src/app/source-route';
import {
  LOGIC_AND_THEISM_READING_ROUTE_ID,
  LOGIC_FOUNDATIONS_ROUTE_ID,
} from '../../src/app/routes';

function sobelWalkthroughProgress() {
  return {
    ...emptyProgress(),
    conceptEvidence: {
      [evidenceKey('conditional', 'apply')]: {
        attempts: 4,
        cleanPasses: 4,
        transferPasses: 0,
        recentErrors: [],
        lastSeenAt: new Date().toISOString(),
      },
      [evidenceKey('universal-quantifier', 'recognize')]: {
        attempts: 1,
        cleanPasses: 0,
        transferPasses: 0,
        recentErrors: ['incorrect-evaluation'],
      },
    },
  };
}

function exerciseIdFromPage(prompt: string, formula: string): string {
  const matches = SOURCE_EXERCISE_IDS.filter((itemId) => getExerciseCopy('en', itemId).prompt === prompt);
  if (matches.length === 1) {
    return matches[0]!;
  }
  const byFormula = matches.find((itemId) => getExerciseDefinition(itemId)?.formula === formula);
  if (byFormula) {
    return byFormula;
  }
  throw new Error(`Unknown source exercise prompt: ${prompt}`);
}

async function answerCurrentClassify(page: Page, options?: { wrongFirst?: boolean }): Promise<void> {
  await expect(page.locator('.exercise-prompt')).toBeVisible();
  const prompt = (await page.locator('.exercise-prompt').innerText()).trim();
  const formulaLocator = page.locator('.formula-display');
  const formula = (await formulaLocator.count())
    ? ((await formulaLocator.textContent()) ?? '').trim()
    : '';
  const exercise = getExerciseDefinition(exerciseIdFromPage(prompt, formula))!;
  const correct = exercise.correctChoiceId!;
  const wrong = exercise.choiceIds?.find((choiceId) => choiceId !== correct);
  if (options?.wrongFirst && wrong) {
    await page.locator(`[data-action="select-choice"][data-choice-id="${wrong}"]`).click();
    await page.locator('[data-action="check-classification"]').click();
    await expect(page.locator('.feedback-wrong')).toBeVisible();
    await expect(page.getByTestId('try-again')).toBeVisible();
    await page.getByTestId('try-again').click();
    await expect(page.locator('[data-action="check-classification"]')).toBeVisible();
    await expect(page.locator('[data-action="select-choice"]').first()).toBeEnabled();
  }
  const correctChoice = page.locator(
    `[data-action="select-choice"][data-choice-id="${correct}"]`,
  );
  await correctChoice.click();
  await expect(correctChoice).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-action="check-classification"]').click();
  await expect(page.locator('.feedback-correct')).toBeVisible();
  const terminal = page.locator('[data-testid="source-complete"]');
  if (await terminal.count()) {
    await terminal.click();
    return;
  }
  await page.locator('[data-action="source-next"]').click();
}

test.describe('Logic and Theism source route', () => {
  test('walks the Sobel slice through prerequisite repair, completion, and revisit', async ({
    page,
  }) => {
    await gotoWithProgress(page, sobelWalkthroughProgress());
    await clickMode(page, 'learn');
    await page
      .locator(`[data-action="set-route"][data-route-id="${LOGIC_AND_THEISM_READING_ROUTE_ID}"]`)
      .click();

    await expect(page.locator('[data-testid="planner-banner"]')).toHaveCount(0);

    await expect(page.locator('.exercise-prompt')).toBeVisible();
    await answerCurrentClassify(page, { wrongFirst: true });

    for (let step = 0; step < 20; step += 1) {
      if (await page.locator('[data-testid="source-route-complete"]').count()) {
        break;
      }
      if (await page.locator('[data-testid="source-complete"]').count()) {
        await expect(page.locator('[data-testid="source-complete"]')).toBeVisible();
        await expect(page.locator('[data-testid="source-complete"]')).toContainText(
          'return to the book',
        );
        await expect(page.locator('[data-testid="source-route-complete"]')).toHaveCount(0);
        await page.locator('[data-testid="source-complete"]').click();
        break;
      }
      if (await page.locator('[data-action="source-next"]').count()) {
        await page.locator('[data-action="source-next"]').click();
        continue;
      }
      if (await page.locator('[data-action="select-choice"]').count()) {
        await answerCurrentClassify(page);
        continue;
      }
      await page.locator('[data-action="lesson-next"]').click();
    }

    await expect(page.locator('[data-testid="source-route-complete"]')).toBeVisible();
    await expect(page.locator('[data-testid="source-complete"]')).toHaveCount(0);
    await expect(page.locator('h1')).toContainText('Return to the passage');
    await expect(page.locator('[data-testid="source-route-complete"]')).toContainText(
      'Continue in Sobel',
    );

    await page
      .locator(`[data-action="set-route"][data-route-id="${LOGIC_FOUNDATIONS_ROUTE_ID}"]`)
      .click();
    await expect(page.locator('h1')).not.toContainText('Return to the passage');
    await page
      .locator(`[data-action="set-route"][data-route-id="${LOGIC_AND_THEISM_READING_ROUTE_ID}"]`)
      .click();
    await expect(page.locator('[data-testid="source-route-complete"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Return to the passage');
    await expect(page.locator('[data-testid="source-complete"]')).toHaveCount(0);

    await page.locator('[data-action="set-route-depth"][data-depth="mastery"]').click();
    await expect(page.locator('.exercise-prompt')).toBeVisible();
    await expect(page.locator('[data-testid="source-route-complete"]')).toHaveCount(0);
  });
});
