import { expect, Page, type FilePayload } from '@playwright/test';

export type TravelStatus = 'in-transit' | 'delivered';

export class FreightNegotiationPage {
  constructor(private readonly page: Page) {}

  async openConversationByReference(reference: string) {
    await expect(this.page.getByTestId('negotiations-list')).toBeVisible();
    await this.page
      .getByTestId('freight-negotiation-card')
      .filter({ hasText: new RegExp(reference, 'i') })
      .first()
      .click();
    await expect(this.page.getByTestId('chat-message-input')).toBeVisible();
  }

  async postMessage(message: string) {
    const input = this.page.getByTestId('chat-message-input');
    await input.fill(message);
    await input.press('Enter');
    await expect(
      this.page
        .getByTestId('chat-message-bubble')
        .filter({ hasText: new RegExp(message, 'i') })
    ).toBeVisible();
  }

  async uploadAttachment(file: string | FilePayload) {
    await this.page.getByTestId('chat-upload-trigger').click();
    await this.page.getByTestId('chat-upload-input').setInputFiles(file);
    await expect(this.page.getByTestId('chat-upload-success')).toBeVisible();
  }

  async moveToHomologation(message: string) {
    await this.openActionsMenu();
    await this.page.getByTestId('action-move-homologation').click();
    await this.postMessage(message);
    await this.assertStatusChip('Homologação');
  }

  async moveToApproved(message: string) {
    await this.openActionsMenu();
    await this.page.getByTestId('action-move-approved').click();
    await this.postMessage(message);
    await this.assertStatusChip('Aprovado');
  }

  async confirmApproval(message: string) {
    await this.postMessage(message);
    await expect(
      this.page
        .getByTestId('chat-message-bubble')
        .filter({ hasText: new RegExp(message, 'i') })
    ).toBeVisible();
  }

  async updateTravelStatus(status: TravelStatus) {
    await this.page.getByTestId('select-travel-status').click();
    const optionTestId =
      status === 'in-transit' ? 'travel-status-in-transit' : 'travel-status-delivered';
    await this.page.getByTestId(optionTestId).click();
    await this.assertTripStatus(status === 'in-transit' ? 'Em trânsito' : 'Entregue');
  }

  async openFreightDataTab() {
    await this.page.getByTestId('tab-freight-data').click();
    await expect(this.page.getByTestId('freight-data-panel')).toBeVisible();
  }

  async openTripsTab() {
    await this.page.getByTestId('tab-trips').click();
    await expect(this.page.getByTestId('trips-panel')).toBeVisible();
  }

  async openNegotiationsTab() {
    await this.page.getByTestId('tab-negotiations').click();
    await expect(this.page.getByTestId('negotiations-list')).toBeVisible();
  }

  async openDriverDataTab() {
    await this.page.getByTestId('tab-driver-data').click();
    await expect(this.page.getByTestId('driver-data-panel')).toBeVisible();
  }

  private async openActionsMenu() {
    await this.page.getByTestId('negotiation-actions-trigger').click();
  }

  private async assertStatusChip(expected: string) {
    await expect(
      this.page
        .getByTestId('negotiation-status-chip')
        .filter({ hasText: new RegExp(expected, 'i') })
    ).toBeVisible();
  }

  private async assertTripStatus(expected: string) {
    await expect(
      this.page
        .getByTestId('trip-status-chip')
        .filter({ hasText: new RegExp(expected, 'i') })
    ).toBeVisible();
  }
}
