
import { Page, expect } from '@playwright/test';

export class ChatPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.getByTestId('menu-chat').click();
  }

  async sendMessage(text: string) {
    await this.page.getByTestId('chat-input').fill(text);
    await this.page.getByTestId('chat-send').click();
  }

  async assertBubbleHas(text: string) {
    await expect(this.page.getByTestId('chat-bubble').filter({ hasText: text })).toBeVisible();
  }

  async assertBubbleHasTimestamp() {
    await expect(this.page.getByTestId('chat-bubble')).toContainText(/\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}/);
  }
}
