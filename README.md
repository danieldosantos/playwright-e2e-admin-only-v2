
# Playwright E2E — Admin Only (v2)

Suite E2E atualizada e padronizada com **data-testid**, cobrindo:
- Login (positivo/negativo)
- Fretes: criação e **cancelamento** (Admin)
- Chat: balão com **data/hora**
- Menu **Configurações** (usuário e transportadora)
- Upload de **logo** (válido/inválido)

## Requisitos
- Node.js 18+
- Browsers do Playwright

## Setup
```bash
npm ci
npx playwright install --with-deps
cp env/.env.example env/.env
# edite BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD
```

## Rodar
```bash
npm test        # headless
npm run test:ui # modo visual
```

## Usando o Playwright Codegen
O **Codegen** é útil para descobrir seletores automaticamente navegando pela sua aplicação.

```bash
npm run codegen
```

- O script usa `dotenv` para carregar automaticamente as variáveis definidas em `env/.env`.
- Ele abrirá o navegador já apontado para `BASE_URL` configurada no `.env`.
- Cada clique, digitação ou ação vai gerar código no terminal com os seletores.
- Exemplo gerado pelo codegen:
  ```ts
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@example.com');
  await page.getByLabel('Senha').fill('admin123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  ```
- Recomendação: troque esses seletores por `data-testid` para ficar mais estável.  
  Exemplo refatorado:
  ```ts
  await page.getByTestId('input-email').fill('admin@example.com');
  await page.getByTestId('input-password').fill('admin123');
  await page.getByTestId('btn-login').click();
  ```

## Padrão de seletores
- Configurado `testIdAttribute: 'data-testid'` no `playwright.config.ts`.
- Use `page.getByTestId('...')` ou `page.locator('[data-testid=...]')`.

## Estrutura
```
playwright-e2e-admin-only-v2/
  .github/workflows/playwright.yml
  env/
    .env.example
  src/
    fixtures/auth.ts
    pages/
      login.page.ts
      fretes.page.ts
      chat.page.ts
      settings.page.ts
    tests/
      login.spec.ts
      freight-cancel.spec.ts
      chat-timestamp.spec.ts
      settings.spec.ts
      upload-logo.spec.ts
      helpers.d.ts
    assets/
      logo-valida.png
      invalido.pdf
  playwright.config.ts
  package.json
  tsconfig.json
```

## Dicas
- Se a UI ainda não tiver `data-testid`, adicione nos elementos-chave:
  - `input-email`, `input-password`, `btn-login`
  - `menu-fretes`, `menu-chat`, `menu-settings`
  - `btn-novo-frete`, `input-origem`, `input-destino`, `btn-salvar-frete`
  - `link-detalhe-frete`, `btn-cancelar-frete`, `input-motivo-cancelamento`, `frete-status`
  - `chat-input`, `chat-send`, `chat-bubble`
  - `input-display-name`, `btn-salvar-user`
  - `tab-transportadora`, `input-transp-display-name`, `input-transp-endereco`, `btn-salvar-transp`
  - `input-logo`, `img-preview-logo`
