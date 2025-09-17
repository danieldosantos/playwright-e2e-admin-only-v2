
import { Page, expect } from '@playwright/test';

export class FretesPage {
  constructor(private page: Page) {}

  async openList() {
    await this.page.getByTestId('menu-fretes').click();
  }

  async createFrete(origem: string, destino: string) {
    await this.page.getByTestId('btn-novo-frete').click();
    await this.page.getByTestId('input-origem').fill(origem);
    await this.page.getByTestId('input-destino').fill(destino);
    await this.page.getByTestId('btn-salvar-frete').click();
  }

  async openDetalheDoFretePorTexto(texto: string) {
    // Requer que a sua tabela/linha tenha data-testid de detalhe ou link
    await this.page.getByTestId('link-detalhe-frete', { hasText: texto }).first().click();
  }

  async cancelarFrete(motivo: string) {
    await this.page.getByTestId('btn-cancelar-frete').click();
    await this.page.getByTestId('input-motivo-cancelamento').fill(motivo);
    await this.page.getByTestId('btn-confirmar-cancelamento').click();
  }

  async assertStatusCancelado() {
    await expect(this.page.getByTestId('frete-status')).toHaveText(/cancelado/i);
  }
}
