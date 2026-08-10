import { test, expect } from '@playwright/test';
import type { RuleId } from '../../engine';
import { gotoWithProgress, modeButton } from '../helpers/app';
import { progressReadyForExercise } from '../helpers/progress';

const cases: Array<{ id: string; rule: RuleId; cites: number[]; derived: string }> = [
  { id: 'nd-001', rule: 'mp', cites: [1, 2], derived: 'Q' },
  { id: 'nd-002', rule: 'and-elim', cites: [1], derived: 'P' },
];

for (const exercise of cases) {
  test(`${exercise.id} completes through its rendered rule controls`, async ({ page }) => {
    await gotoWithProgress(page, progressReadyForExercise(exercise.id));
    await modeButton(page, 'practice').click();

    const rule = page.locator(
      `[data-action="proof-select-rule"][data-rule="${exercise.rule}"]`,
    );
    await expect(rule).toBeVisible();
    await rule.click();
    await expect(rule).toHaveAttribute('aria-pressed', 'true');
    for (const line of exercise.cites) {
      await page.locator(`[data-action="proof-toggle-cite"][data-line="${line}"]`).click();
    }
    await page.locator('[data-action="check-proof"]').click();
    await expect(page.locator('.feedback-correct')).toBeVisible();
    await expect(page.locator('[data-action="next"]')).toBeVisible();
    await page.reload();
    await expect(page.locator('.proof-line-missing .proof-formula')).toHaveText(
      exercise.derived,
    );
  });
}
