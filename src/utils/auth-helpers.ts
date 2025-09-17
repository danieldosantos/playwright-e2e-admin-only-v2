import { Page } from '@playwright/test';

const AUTH0_IDENTIFIER_SELECTORS = [
  'input[name="username"]',
  'input[id="username"]',
  'input[name="email"]',
  'input[id="email"]',
  'input[name="identifier"]',
  'input[id="1-email"]',
  'input[type="email"]',
].join(', ');

const AUTH0_PASSWORD_SELECTORS = [
  'input[name="password"]',
  'input[id="password"]',
  'input[id="1-password"]',
  'input[type="password"]',
].join(', ');

const AUTH0_DETECTOR_IDENTIFIER_SELECTORS = [
  'input[name="username"]',
  'input[id="username"]',
  'input[name="identifier"]',
  'input[id="1-email"]',
].join(', ');

const AUTH0_DETECTOR_PASSWORD_SELECTORS = [
  'input[name="password"]',
  'input[id="password"]',
  'input[id="1-password"]',
].join(', ');

const NEXT_BUTTON_ROLE_NAME = /continuar|continue|próximo|proximo|next|avançar|avancar/i;
const SUBMIT_BUTTON_ROLE_NAME = /entrar|logar|login|log in|sign in|continuar|continue/i;

export const shouldUseAuth0Selectors = async (page: Page) => {
  const provider = process.env.AUTH_PROVIDER?.toLowerCase();

  if (provider === 'auth0') {
    return true;
  }

  if (provider === 'internal') {
    return false;
  }

  const detectorPromises: Promise<boolean>[] = [
    page
      .waitForSelector('[data-testid="input-email"]', { state: 'visible' })
      .then(() => false),
    page
      .waitForSelector('[data-testid="input-password"]', { state: 'visible' })
      .then(() => false),
    page
      .waitForSelector('[data-testid="btn-login"]', { state: 'visible' })
      .then(() => false),
    page.waitForURL(/auth0\.com/i).then(() => true),
    page
      .waitForSelector(AUTH0_DETECTOR_IDENTIFIER_SELECTORS, { state: 'visible' })
      .then(() => true),
    page
      .waitForSelector(AUTH0_DETECTOR_PASSWORD_SELECTORS, { state: 'visible' })
      .then(() => true),
  ].map((promise) => promise.catch(() => new Promise<boolean>(() => {})));

  const fallback = page.waitForTimeout(30000).then(() => {
    throw new Error('Timed out waiting for login form to become available.');
  });

  return Promise.race([...detectorPromises, fallback]);
};

export const fillInternalLoginForm = async (
  page: Page,
  email: string,
  password: string,
) => {
  await page.getByTestId('input-email').fill(email);
  await page.getByTestId('input-password').fill(password);
  await page.getByTestId('btn-login').click();
};

const locateAuth0Identifier = (page: Page) => page.locator(AUTH0_IDENTIFIER_SELECTORS).first();
const locateAuth0Password = (page: Page) => page.locator(AUTH0_PASSWORD_SELECTORS).first();

export const fillAuth0LoginForm = async (
  page: Page,
  email: string,
  password: string,
) => {
  const identifierInput = locateAuth0Identifier(page);
  await identifierInput.waitFor({ state: 'visible' });
  await identifierInput.fill(email);

  let passwordInput = locateAuth0Password(page);

  if (!(await passwordInput.isVisible())) {
    const advanceButton = page.getByRole('button', { name: NEXT_BUTTON_ROLE_NAME }).first();
    try {
      await advanceButton.waitFor({ state: 'visible', timeout: 5000 });
      await advanceButton.click();
    } catch {
      // When the flow does not require an intermediate step the button might never appear.
    }
    passwordInput = locateAuth0Password(page);
  }

  await passwordInput.waitFor({ state: 'visible' });
  await passwordInput.fill(password);

  const submitButton = page.getByRole('button', { name: SUBMIT_BUTTON_ROLE_NAME }).first();
  await submitButton.waitFor({ state: 'visible' });
  await submitButton.click();
};
