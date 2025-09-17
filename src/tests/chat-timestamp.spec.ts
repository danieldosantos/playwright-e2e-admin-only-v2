
import { test } from '@fixtures/auth';
import { ChatPage } from '@pages/chat.page';

test.describe('Chat - Data/Hora no balão', () => {
  test('mensagem exibe data e hora', async ({ page, loginAdmin }) => {
    await loginAdmin();
    const chat = new ChatPage(page);

    await chat.open();
    const msg = `Teste timestamp ${Date.now()}`;
    await chat.sendMessage(msg);
    await chat.assertBubbleHas(msg);
    await chat.assertBubbleHasTimestamp();
  });
});
