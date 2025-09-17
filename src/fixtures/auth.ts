
import { test as base, expect } from '@playwright/test';
import {
  fillAuth0LoginForm,
  fillInternalLoginForm,
  shouldUseAuth0Selectors,
} from '../utils/auth-helpers';

export const test = base.extend<{
  loginAdmin: () => Promise<void>;
}>({
  loginAdmin: async ({ page }, use) => {
    const fn = async () => {
      await page.goto('/');

      const useAuth0 = await shouldUseAuth0Selectors(page);
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
