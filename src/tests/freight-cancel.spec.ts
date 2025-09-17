
import { expect, test } from '@fixtures/auth';
import { FretesPage } from '@pages/fretes.page';

test.describe('Frete - Cancelar (Admin)', () => {
  test('Admin cria e cancela frete em Aberto', async ({ page, loginAdmin }) => {
    await loginAdmin();
    const fretes = new FretesPage(page);

    await fretes.openList();
    await fretes.createFrete('Porto Alegre - RS', 'São Paulo - SP');

    await fretes.openList();
    const origemSegundoFrete = 'Curitiba - PR';
    const destinoSegundoFrete = 'Rio de Janeiro - RJ';
    await fretes.createFrete(origemSegundoFrete, destinoSegundoFrete);

    await fretes.openDetalheDoFretePorTexto('Curitiba');
    await expect(page.getByText(origemSegundoFrete, { exact: false })).toBeVisible();
    await expect(page.getByText(destinoSegundoFrete, { exact: false })).toBeVisible();

    await fretes.cancelarFrete('Cliente desistiu');
    await fretes.assertStatusCancelado();
  });
});
