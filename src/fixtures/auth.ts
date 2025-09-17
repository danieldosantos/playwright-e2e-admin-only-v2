
import { test as base, expect } from '@playwright/test';

export const test = base.extend<{
  loginAdmin: () => Promise<void>;
}>({
  loginAdmin: async ({ page }, use) => {
    const fn = async () => {
      await page.goto('/');
      await page.getByTestId('input-email').fill(process.env.ADMIN_EMAIL!);
      await page.getByTestId('input-password').fill(process.env.ADMIN_PASSWORD!);
      await page.getByTestId('btn-login').click();
      await expect(page).toHaveURL(/dashboard|home|fretes/i);
    };
    await use(fn);
  },
});

export { expect };
