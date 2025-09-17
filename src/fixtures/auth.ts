
import { test as base, expect, Page } from '@playwright/test';

const shouldUseAuth0Selectors = (url: string) => {
  const provider = process.env.AUTH_PROVIDER?.toLowerCase();

  if (provider === 'auth0') {
    return true;
  }

  if (provider === 'internal') {
    return false;
  }

  const normalizedUrl = url?.toLowerCase() ?? '';

  return normalizedUrl.includes('auth0.com');
};

const fillInternalLoginForm = async (page: Page, email: string, password: string) => {
  await page.getByTestId('input-email').fill(email);
  await page.getByTestId('input-password').fill(password);
  await page.getByTestId('btn-login').click();
};

const fillAuth0LoginForm = async (page: Page, email: string, password: string) => {
  const usernameInput = page.locator('input[name="username"]');
  await usernameInput.waitFor({ state: 'visible' });
  await usernameInput.fill(email);

  const passwordInput = page.locator('input[name="password"]');
  await passwordInput.fill(password);

  await page.getByRole('button', { name: /continuar|entrar/i }).click();
};

export const test = base.extend<{
  loginAdmin: () => Promise<void>;
}>({
  loginAdmin: async ({ page }, use) => {
    const fn = async () => {
      await page.goto('/');

      const useAuth0 = shouldUseAuth0Selectors(page.url());
      if (useAuth0) {
        await fillAuth0LoginForm(page, process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!);
      } else {
        await fillInternalLoginForm(page, process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!);
      }
      await expect(page).toHaveURL(/dashboard|home|fretes/i);
    };
    await use(fn);
  },
});

export { expect };
