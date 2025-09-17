# Playwright E2E — Admin Only (v2)

Suite de testes end-to-end escrita em [Playwright](https://playwright.dev/) para garantir que os fluxos críticos da área administrativa sigam funcionando como esperado.

## Visão geral
- Automação baseada no padrão Page Object (arquivos em `src/pages`).
- Cobertura dos cenários essenciais de autenticação, fretes, chat, configurações e upload de logo.
- Seletores estáveis usando o atributo `data-testid` configurado globalmente no Playwright.
- Código em TypeScript com carregamento de variáveis sensíveis via `dotenv`.

## Funcionalidades cobertas
- Login com cenários positivos e negativos.
- Gestão de fretes: criação e cancelamento (apenas usuários administradores).
- Chat: verificação do balão com data e hora.
- Menu Configurações: abas de usuário e transportadora.
- Upload de logo: arquivos válidos e inválidos.

## Pré-requisitos
Antes de instalar, garanta que seu ambiente possui:
- [Node.js](https://nodejs.org/) 18 ou superior.
- Dependências de navegador do Playwright (instaladas pelo comando `npx playwright install --with-deps`).
- Acesso à aplicação que será testada (URL base e credenciais de administrador).

## Instalação
1. Instale as dependências do projeto:
   ```bash
   npm ci
   ```
2. Baixe os navegadores suportados pelo Playwright (inclui dependências do sistema operacional):
   ```bash
   npx playwright install --with-deps
   ```

## Configuração de variáveis de ambiente
1. Copie o arquivo de exemplo:
   ```bash
   cp env/.env.example env/.env
   ```
2. Edite `env/.env` e ajuste os valores conforme o seu ambiente:
   ```ini
   BASE_URL="https://sua-aplicacao.com"
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="senha-super-secreta"
    AUTH_PROVIDER="internal"
   ```
   > Observação: informe apenas o domínio (sem caminhos ou parâmetros). Fluxos especiais, como redirecionamentos ou autenticações externas, exigem ajustes no código dos testes para que o fluxo seja reproduzido corretamente.
   >
   > - `AUTH_PROVIDER` é opcional. Quando ausente, a fixture tenta detectar automaticamente se a URL de login está hospedada no Auth0 (`auth0.com`) para usar os seletores apropriados.
   > - Defina `AUTH_PROVIDER=auth0` para forçar o uso dos seletores do provedor mesmo em domínios personalizados, ou `AUTH_PROVIDER=internal` para manter o formulário nativo.
3. Novas chaves podem ser adicionadas ao `.env` conforme necessidade. Tudo é carregado automaticamente antes de cada teste.

## Executar os testes
Os scripts já consideram o carregamento do `.env`.

### Modo headless (sem interface gráfica)
```bash
npm test
```

### Modo UI (com visualização do fluxo)
```bash
npm run test:ui
```
> Use este modo para depurar cenários ou inspecionar seletores durante a execução.

### Depurar com o inspector interativo
```bash
npx playwright test --debug
```
> Pausa a execução e abre o Playwright Inspector para avançar passo a passo.

## Comandos úteis

### Playwright Codegen
Gera automaticamente os comandos e seletores enquanto você navega pela aplicação.
```bash
npm run codegen
```
- Abre o navegador apontando para `BASE_URL` definida em `env/.env`.
- Tudo que você clicar ou digitar será traduzido em código Playwright no terminal.
- Utilize o trecho gerado como ponto de partida e substitua seletores dinâmicos por `data-testid` para aumentar a estabilidade.

### Rodar apenas um arquivo de teste
```bash
npx playwright test src/tests/login.spec.ts
```

### Rodar um teste específico dentro do arquivo
```bash
npx playwright test src/tests/login.spec.ts --grep "Login deve exibir mensagem de erro"
```

## Estrutura de pastas
```
playwright-e2e-admin-only-v2/
├─ env/
│  └─ .env.example
├─ src/
│  ├─ fixtures/
│  │  └─ auth.ts
│  ├─ pages/
│  │  ├─ login.page.ts
│  │  ├─ fretes.page.ts
│  │  ├─ chat.page.ts
│  │  └─ settings.page.ts
│  ├─ tests/
│  │  ├─ login.spec.ts
│  │  ├─ freight-cancel.spec.ts
│  │  ├─ chat-timestamp.spec.ts
│  │  ├─ settings.spec.ts
│  │  ├─ upload-logo.spec.ts
│  │  └─ helpers.d.ts
│  └─ assets/
│     ├─ logo-valida.png
│     └─ invalido.pdf
├─ playwright.config.ts
├─ package.json
└─ tsconfig.json
```
> Essa estrutura separa as responsabilidades: fixtures tratam autenticação, pages encapsulam interações e tests descrevem os cenários executados.

## Boas práticas de seletores
- Prefira o atributo `data-testid` (já configurado em `playwright.config.ts` via `testIdAttribute`).
- Nomeie os `data-testid` com palavras simples e sem espaços, por exemplo: `input-email`, `btn-login`, `menu-settings`.
- Evite seletores frágeis como textos dinâmicos, índices de elementos ou caminhos CSS muito específicos.
- Quando necessário, combine `data-testid` com outros atributos estáveis, por exemplo:
  ```ts
  await page.getByTestId('frete-status').filter({ hasText: 'Cancelado' });
  ```
- Ao criar novos componentes na aplicação, peça para a equipe frontend incluir `data-testid` nos elementos-chave. Isso reduz a necessidade de refatorar testes no futuro.

## Dúvidas?
- Documentação oficial: [playwright.dev/docs](https://playwright.dev/docs).
- Fórum da comunidade: [github.com/microsoft/playwright/discussions](https://github.com/microsoft/playwright/discussions).

Contribuições são bem-vindas! Abra uma issue ou envie um PR com melhorias.
