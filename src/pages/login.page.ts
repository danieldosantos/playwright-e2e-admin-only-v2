
import { Page, expect } from '@playwright/test';

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

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async login(email: string, password: string) {
    const useAuth0 = shouldUseAuth0Selectors(this.page.url());

    if (useAuth0) {
      await fillAuth0LoginForm(this.page, email, password);
    } else {
      await fillInternalLoginForm(this.page, email, password);
    }
  }

  async assertLoggedIn() {
    await expect(this.page).toHaveURL(/dashboard|home|fretes/i);
  }

  async assertLoginError() {
    await expect(this.page.getByRole('alert')).toContainText(/inválida|não autorizado|erro/i);
  }
}
