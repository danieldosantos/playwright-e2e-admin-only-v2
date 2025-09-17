
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login.page';

test.describe('Login - Admin', () => {
  test('login válido', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!);
    await login.assertLoggedIn();
  });

  test('erro com senha incorreta', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(process.env.ADMIN_EMAIL!, 'SenhaErrada!123');
    await login.assertLoginError();
  });
});
