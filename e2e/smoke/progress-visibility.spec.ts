import { test, expect, type Page } from '@playwright/test';
import { evaluate, parse } from '../../engine';
import { gotoFresh, gotoWithProgress, lessonNext, modeButton } from '../helpers/app';
import { LEVEL_1_LESSONS, LEVEL_2_LESSONS } from '../../src/app/lessons';
import {
  progressAtLesson,
  progressAtMaxScaffold,
  progressReadyForExercise,
  progressReadyForScaffoldAdvance,
  withSkillStats,
} from '../helpers/progress';

async function atomIsTrue(page: Page, atom: string): Promise<boolean> {
  const row = page.locator('.atom-row', {
    has: page.locator(`.atom-name:text-is("${atom}")`),
  });
  return (await row.locator('.atom-segment.true.active').count()) > 0;
}

async function readAssignment(page: Page): Promise<Record<string, boolean>> {
  const names = await page.locator('.atom-row .atom-name').allInnerTexts();
  const assignment: Record<string, boolean> = {};
  for (const name of names) {
    const atom = name.trim();
    assignment[atom] = await atomIsTrue(page, atom);
  }
  return assignment;
}

async function completeEvalCorrect(page: Page): Promise<void> {
  const formula = (await page.locator('.formula-display').innerText()).trim();
  const assignment = await readAssignment(page);
  const value = evaluate(parse(formula), assignment);
  await page
    .locator(`[data-action="select-evaluation-prediction"][data-value="${value ? 'true' : 'false'}"]`)
    .click();
  await page.locator('[data-action="check-evaluation"]').click();
  await expect(page.locator('.feedback-correct')).toBeVisible();
}

async function completeEvalWrongThenCorrect(page: Page): Promise<void> {
  const formula = (await page.locator('.formula-display').innerText()).trim();
  const assignment = await readAssignment(page);
  const value = evaluate(parse(formula), assignment);
  await page
    .locator(`[data-action="select-evaluation-prediction"][data-value="${value ? 'false' : 'true'}"]`)
    .click();
  await page.locator('[data-action="check-evaluation"]').click();
  await expect(page.locator('.feedback-wrong')).toBeVisible();
  await page.locator('[data-action="try-again"]').click();
  await page
    .locator(`[data-action="select-evaluation-prediction"][data-value="${value ? 'true' : 'false'}"]`)
    .click();
  await page.locator('[data-action="check-evaluation"]').click();
  await expect(page.locator('.feedback-correct')).toBeVisible();
}

async function finalizeCurrentPractice(page: Page): Promise<void> {
  if (await page.locator('[data-action="check-evaluation"]').count()) {
    await completeEvalCorrect(page);
    return;
  }
  if (await page.locator('[data-action="submit-cell-value"]').count()) {
    await page.locator('[data-action="submit-cell-value"][data-value="false"]').click();
    if (await page.locator('.feedback-correct').count()) {
      return;
    }
    await expect(page.locator('.feedback-wrong')).toBeVisible();
    await page.locator('[data-action="try-again"]').click();
    await page.locator('[data-action="submit-cell-value"][data-value="true"]').click();
    await expect(page.locator('.feedback-correct')).toBeVisible();
    return;
  }
  if (await page.locator('[data-action="check-counterexample"]').count()) {
    const names = await page.locator('.atom-row .atom-name').allInnerTexts();
    const atoms = names.map((name) => name.trim());
    const total = 1 << atoms.length;
    for (let mask = 0; mask < total; mask += 1) {
      for (let i = 0; i < atoms.length; i += 1) {
        const value = Boolean(mask & (1 << i));
        await page
          .locator(`[data-action="set-atom-value"][data-atom="${atoms[i]}"][data-value="${value}"]`)
          .click();
      }
      await page.locator('[data-action="check-counterexample"]').click();
      if (await page.locator('.feedback-correct').count()) {
        return;
      }
      if (await page.locator('[data-action="try-again"]').count()) {
        await page.locator('[data-action="try-again"]').click();
      }
    }
    throw new Error('Could not complete counterexample exercise');
  }
  throw new Error('Unsupported practice exercise in session helper');
}

test.describe('progress visibility', () => {
  test('Learn shows unit/lesson progress and advances after completion', async ({ page }) => {
    await gotoFresh(page);
    const chrome = page.locator('[data-testid="learn-progress"]');
    await expect(chrome).toContainText('Lesson 1 of 5');
    await expect(chrome).toContainText('0 completed');
    await expect(page.locator('.progress-meter')).toHaveAttribute('aria-valuenow', '0');

    await lessonNext(page).click();
    await expect(chrome).toContainText('Lesson 2 of 5');
    await expect(chrome).toContainText('1 completed');
    await expect(page.locator('.progress-meter')).toHaveAttribute('aria-valuenow', '1');
  });

  test('completing the last Unit 0 lesson makes the unit transition explicit', async ({ page }) => {
    await gotoWithProgress(page, progressAtLesson('level0-05-guided'));
    await page.locator('[data-action="set-atom-value"][data-atom="P"][data-value="true"]').click();
    await page.locator('[data-action="set-atom-value"][data-atom="Q"][data-value="false"]').click();
    await expect(page.locator('.feedback-correct')).toBeVisible();
    await lessonNext(page).click();
    await expect(page.locator('[data-testid="unit-complete"]')).toBeVisible();
    await expect(page.locator('[data-testid="learn-progress"]')).toContainText(
      `Lesson 1 of ${LEVEL_1_LESSONS.length}`,
    );
  });

  test('Practice shows capability state and session 0 / 5', async ({ page }) => {
    await gotoWithProgress(page, progressReadyForExercise('eval-001'));
    await modeButton(page, 'practice').click();
    await expect(page.locator('[data-testid="capability-state"]')).toContainText('Ready');
    await expect(page.locator('[data-testid="practice-session"]')).toHaveText('0 / 5');
  });

  test('finalizing one clean exercise advances the session to 1 / 5', async ({ page }) => {
    await gotoWithProgress(page, progressReadyForExercise('eval-001'));
    await modeButton(page, 'practice').click();
    await completeEvalCorrect(page);
    await expect(page.locator('[data-testid="practice-session"]')).toHaveText('1 / 5');
    await expect(page.locator('[data-testid="capability-state"]')).toContainText('Developing');
  });

  test('wrong then repair then correct advances the session only once', async ({ page }) => {
    await gotoWithProgress(page, progressReadyForExercise('eval-001'));
    await modeButton(page, 'practice').click();
    await completeEvalWrongThenCorrect(page);
    await expect(page.locator('[data-testid="practice-session"]')).toHaveText('1 / 5');
  });

  test('crossing the reliability threshold surfaces a progress moment', async ({ page }) => {
    const store = withSkillStats(
      progressReadyForExercise('eval-001'),
      'practice:evaluate-formula',
      2,
      2,
    );
    await gotoWithProgress(page, store);
    await modeButton(page, 'practice').click();
    await completeEvalCorrect(page);
    await expect(page.locator('[data-testid="progress-moment"]')).toContainText('reliable');
  });

  test('scaffold advancement explains that the learner will carry more reasoning', async ({ page }) => {
    const store = progressReadyForScaffoldAdvance('eval-007');
    await gotoWithProgress(page, store);
    await modeButton(page, 'practice').click();
    await completeEvalCorrect(page);
    await expect(page.locator('[data-testid="progress-moment"]')).toContainText('intermediate');
  });

  test('scaffold already at maximum does not announce further withdrawal', async ({ page }) => {
    const store = progressAtMaxScaffold('eval-007');
    await gotoWithProgress(page, store);
    await modeButton(page, 'practice').click();
    await page
      .locator('[data-action="select-learner-node-value"][data-node-id="root.R"][data-value="true"]')
      .click();
    await completeEvalCorrect(page);
    await expect(page.locator('[data-testid="progress-moment"]')).toHaveCount(0);
  });

  test('Unit 2 completion is visible once then clears after continuing Practice', async ({
    page,
  }) => {
    const lastUnit2 = LEVEL_2_LESSONS[LEVEL_2_LESSONS.length - 1]!;
    await gotoWithProgress(page, progressAtLesson(lastUnit2.id));
    await page.locator('[data-action="set-atom-value"][data-atom="P"][data-value="true"]').click();
    await page.locator('[data-action="set-atom-value"][data-atom="Q"][data-value="false"]').click();
    await expect(page.locator('.feedback-correct')).toBeVisible();
    await lessonNext(page).click();

    const notice = page.locator('[data-testid="unit-complete"]');
    await expect(notice).toBeVisible();
    await expect(notice).toContainText('Unit 2 complete');
    await expect(page.locator('[data-testid="practice-session"]')).toHaveText('0 / 5');

    await completeEvalCorrect(page);
    await page.locator('[data-action="next"]').click();
    await expect(notice).toHaveCount(0);

    await page.locator('[data-action="set-locale"][data-locale="fr"]').click();
    await expect(page.locator('[data-testid="unit-complete"]')).toHaveCount(0);
  });

  test('five finalized exercises complete the session and Keep practising resets it', async ({
    page,
  }) => {
    await gotoWithProgress(page, progressReadyForExercise('eval-001'));
    await modeButton(page, 'practice').click();

    for (let index = 0; index < 5; index += 1) {
      await finalizeCurrentPractice(page);
      if (index < 4) {
        await page.locator('[data-action="next"]').click();
      }
    }

    const complete = page.locator('[data-testid="session-complete"]');
    await expect(complete).toBeVisible();
    await expect(complete).toContainText('5');
    await expect(page.locator('[data-action="next"]')).toHaveCount(0);

    await page.locator('[data-action="session-continue"]').click();
    await expect(page.locator('[data-testid="practice-session"]')).toHaveText('0 / 5');
    await expect(complete).toHaveCount(0);
  });

  test('Progress view renders the capability-first summary', async ({ page }) => {
    await gotoWithProgress(page, progressReadyForExercise('eval-001'));
    await modeButton(page, 'progress').click();
    const summary = page.locator('[data-testid="capability-summary"]');
    await expect(summary).toBeVisible();
    await expect(summary).toContainText('You can now');
    await expect(summary).toContainText('In progress');
    await expect(summary).toContainText('Up next');
    await expect(summary).toContainText('Evaluating formulas');
  });
});
