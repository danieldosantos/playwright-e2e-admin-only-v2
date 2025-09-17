
import { test } from '@fixtures/auth';
import { FretesPage } from '@pages/fretes.page';

test.describe('Frete - Cancelar (Admin)', () => {
  test('Admin cria e cancela frete em Aberto', async ({ page, loginAdmin }) => {
    await loginAdmin();
    const fretes = new FretesPage(page);

    await fretes.openList();
    await fretes.createFrete('Porto Alegre - RS', 'São Paulo - SP');
    await fretes.openDetalheDoFretePorTexto('Porto Alegre');
    await fretes.cancelarFrete('Cliente desistiu');
    await fretes.assertStatusCancelado();
  });
});
