
import { Page, expect } from '@playwright/test';
import {
  fillAuth0LoginForm,
  fillInternalLoginForm,
  shouldUseAuth0Selectors,
} from '../utils/auth-helpers';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async login(email: string, password: string) {
    const useAuth0 = await shouldUseAuth0Selectors(this.page);

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
