
import { test } from '@fixtures/auth';
import { SettingsPage } from '@pages/settings.page';
import path from 'path';

test.describe('Upload de Logo (Admin)', () => {
  test('upload válido e preview', async ({ page, loginAdmin }) => {
    await loginAdmin();
    const settings = new SettingsPage(page);
    await settings.open();

    const filePath = path.resolve(__dirname, '../assets/logo-valida.png');
    await settings.uploadLogoOk(filePath);
    await settings.assertToastSuccess();
  });

  test('bloqueio de tipo/tamanho inválido', async ({ page, loginAdmin }) => {
    await loginAdmin();
    const settings = new SettingsPage(page);
    await settings.open();

    const filePath = path.resolve(__dirname, '../assets/invalido.pdf');
    await page.getByTestId('input-logo').setInputFiles(filePath);
    await settings.assertToastUploadError();
  });
});
