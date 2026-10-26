import { expect, test, type CDPSession, type Page } from '@playwright/test';
import { completeLesson } from '../../src/app/storage';
import { clickMode, skipOnboarding } from '../helpers/app';
import {
  accountsBaseURL,
  startAccountsServer,
  stopAccountsServer,
} from '../helpers/accounts-server';
import { emptyProgress, STORAGE_KEY } from '../helpers/progress';
import { openBrowseMode } from '../helpers/session';

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
  await startAccountsServer();
});

test.afterAll(async () => {
  await stopAccountsServer();
});

test.use({ baseURL: accountsBaseURL() });

async function attachVirtualAuthenticator(page: Page): Promise<CDPSession> {
  const client = await page.context().newCDPSession(page);
  await client.send('WebAuthn.enable');
  await client.send('WebAuthn.addVirtualAuthenticator', {
    options: {
      protocol: 'ctap2',
      transport: 'internal',
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
      automaticPresenceSimulation: true,
    },
  });
  return client;
}

async function addAnotherVirtualAuthenticator(page: Page): Promise<void> {
  const client = await page.context().newCDPSession(page);
  await client.send('WebAuthn.enable');
  await client.send('WebAuthn.addVirtualAuthenticator', {
    options: {
      protocol: 'ctap2',
      transport: 'usb',
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
      automaticPresenceSimulation: true,
    },
  });
}

async function openProgressSync(page: Page): Promise<void> {
  await clickMode(page, 'progress');
  await page
    .locator('.progress-disclosure')
    .filter({ has: page.locator('[data-action="export-progress"]') })
    .locator('summary')
    .click();
  await expect(page.getByTestId('account-panel')).toBeVisible();
}

async function seedLessons(page: Page, lessonIds: string[]): Promise<void> {
  let store = emptyProgress();
  for (const id of lessonIds) {
    store = completeLesson(store, id);
  }
  await page.evaluate(
    ({ key, data }) => {
      localStorage.setItem(key, JSON.stringify(data));
    },
    { key: STORAGE_KEY, data: store },
  );
  await page.reload();
  await skipOnboarding(page);
}

test.describe('Passkey accounts', () => {
  for (const width of [320, 390] as const) {
    test(`sign-up, sign-in, sync and merge at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 320 ? 640 : 844 });
      await page.goto('/');
      await skipOnboarding(page);
      await seedLessons(page, ['level0-01-letters', 'level0-02-truth']);
      await attachVirtualAuthenticator(page);
      await openProgressSync(page);

      await page.locator('[data-action="create-passkey"]').click();
      await expect(page.getByTestId('account-signed-in')).toBeVisible({ timeout: 15_000 });
      await expect(page.locator('.progress-item.done')).toHaveCount(2);

      await page.locator('[data-action="sign-out-account"]').click();
      await expect(page.getByTestId('account-signed-in')).toHaveCount(0);
      await expect(page.locator('.progress-item.done')).toHaveCount(2);

      await seedLessons(page, ['level0-03-and']);
      await openProgressSync(page);
      await expect(page.locator('.progress-item.done')).toHaveCount(1);

      await page.locator('[data-action="use-passkey"]').click();
      await expect(page.getByTestId('account-signed-in')).toBeVisible({ timeout: 15_000 });
      await expect(page.locator('.progress-item.done')).toHaveCount(3);

      await addAnotherVirtualAuthenticator(page);
      await page.locator('[data-action="add-passkey"]').click();
      await expect(page.getByTestId('account-signed-in')).toBeVisible({ timeout: 15_000 });
      await expect(page.getByText('Another passkey is ready on this device.')).toBeVisible();

      await page.locator('[data-action="delete-account"]').click();
      await page.locator('[data-action="confirm-delete-account"]').click();
      await expect(page.getByTestId('account-signed-in')).toHaveCount(0);
      await expect(page.locator('.progress-item.done')).toHaveCount(3);
    });
  }

  test('signed-out More/Progress still opens without an account API delay', async ({ page }) => {
    await page.goto('/');
    await skipOnboarding(page);
    if (await page.getByTestId('session-opening').count()) {
      await openBrowseMode(page, 'progress');
    } else {
      await clickMode(page, 'progress');
    }
    await expect(page.locator('.app-header')).toBeVisible();
  });
});
