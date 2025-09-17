
import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async login(email: string, password: string) {
    await this.page.getByTestId('input-email').fill(email);
    await this.page.getByTestId('input-password').fill(password);
    await this.page.getByTestId('btn-login').click();
  }

  async assertLoggedIn() {
    await expect(this.page).toHaveURL(/dashboard|home|fretes/i);
  }

  async assertLoginError() {
    await expect(this.page.getByRole('alert')).toContainText(/inválida|não autorizado|erro/i);
  }
}
