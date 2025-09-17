
import { Page, expect } from '@playwright/test';

export class SettingsPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.getByTestId('menu-settings').click();
  }

  async changeUserDisplayName(name: string) {
    await this.page.getByTestId('input-display-name').fill(name);
    await this.page.getByTestId('btn-salvar-user').click();
  }

  async assertHeaderHas(name: string) {
    await expect(this.page.getByRole('banner')).toContainText(name);
  }

  async goToTransportadoraTab() {
    await this.page.getByTestId('tab-transportadora').click();
  }

  async changeTransportadora(name: string, endereco: string) {
    await this.page.getByTestId('input-transp-display-name').fill(name);
    await this.page.getByTestId('input-transp-endereco').fill(endereco);
    await this.page.getByTestId('btn-salvar-transp').click();
  }

  async uploadLogoOk(filePath: string) {
    await this.page.getByTestId('input-logo').setInputFiles(filePath);
    await expect(this.page.getByTestId('img-preview-logo')).toBeVisible();
    await this.page.getByTestId('btn-salvar-user').click();
  }

  async assertToastSuccess() {
    await expect(this.page.getByRole('alert')).toContainText(/salvo|sucesso|atualizada/i);
  }

  async assertToastUploadError() {
    await expect(this.page.getByRole('alert')).toContainText(/inválido|tipo não suportado|tamanho/i);
  }
}
