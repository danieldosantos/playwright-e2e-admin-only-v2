
import { test } from '@fixtures/auth';
import { SettingsPage } from '@pages/settings.page';

test.describe('Configurações (Admin)', () => {
  test('alterar nome de exibição do usuário reflete no header', async ({ page, loginAdmin }) => {
    await loginAdmin();
    const settings = new SettingsPage(page);

    await settings.open();
    const novoNome = `Admin QA ${Date.now()}`;
    await settings.changeUserDisplayName(novoNome);
    await settings.assertHeaderHas(novoNome);
  });

  test('alterar nome e endereço da transportadora', async ({ page, loginAdmin }) => {
    await loginAdmin();
    const settings = new SettingsPage(page);

    await settings.open();
    await settings.goToTransportadoraTab();
    const novoNome = `Transportadora QA ${Date.now()}`;
    await settings.changeTransportadora(novoNome, 'Av. Ipiranga, 1000, Porto Alegre - RS');
    await settings.assertToastSuccess();
  });
});
