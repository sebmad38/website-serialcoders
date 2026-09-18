import { test, expect } from './fixture.mjs';

test('Mobile navigation opens, closes and stays within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: /^(Menu|Fermer)$/ });
  await expect(page.locator('#main-navigation')).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#main-navigation')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#main-navigation')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator('#main-navigation')).toBeVisible();
  await expect(toggle).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('Consent makes no Google request before acceptance and disables tracking on withdrawal', async ({
  page,
}) => {
  let googleRequests = 0;
  await page.route('**/config.js', (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: 'window.SERIAL_CODERS_CONFIG={googleAnalyticsId:"G-TEST123"};',
    }),
  );
  await page.route('https://www.googletagmanager.com/**', (route) => {
    googleRequests++;
    return route.fulfill({ contentType: 'text/javascript', body: '' });
  });
  await page.goto('/');
  await expect(page.locator('#consent')).toBeVisible();
  expect(googleRequests).toBe(0);
  await page.getByRole('button', { name: 'Refuser', exact: true }).click();
  expect(googleRequests).toBe(0);
  await page.getByRole('button', { name: 'Gérer les cookies' }).click();
  await page.getByRole('button', { name: 'Accepter', exact: true }).click();
  await expect.poll(() => googleRequests).toBe(1);
  await page.getByRole('button', { name: 'Gérer les cookies' }).click();
  await page.getByRole('button', { name: 'Refuser', exact: true }).click();
  expect(await page.evaluate(() => window['ga-disable-G-TEST123'])).toBe(true);
});

async function fillContact(page) {
  await page.goto('/contact/');
  await page.getByLabel('Nom et prénom').fill('Test navigateur');
  await page.getByLabel('Email professionnel').fill('test@example.com');
  await page
    .getByLabel('Votre projet *', { exact: true })
    .fill('Une application à moderniser et à maintenir.');
}

test('Contact attaches documents, freezes values while sending and resets on success', async ({
  page,
}) => {
  let payload;
  let finish;
  const pending = new Promise((resolve) => {
    finish = resolve;
  });
  await page.route('**/api/contact', async (route) => {
    payload = route.request().postDataJSON();
    await pending;
    await route.fulfill({ json: { message: 'Demande reçue.' } });
  });
  await fillContact(page);
  await page.locator('#contact-documents').setInputFiles({
    name: 'projet.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('Cahier des charges'),
  });
  await expect(page.locator('#document-list')).toContainText('projet.txt');
  await page.getByRole('button', { name: 'Retirer projet.txt' }).click();
  await expect(page.locator('#document-list li')).toHaveCount(0);
  await page.locator('#contact-documents').setInputFiles({
    name: 'projet.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('Cahier des charges'),
  });
  await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
  await expect(page.locator('#contact-message')).toBeDisabled();
  await expect.poll(() => payload?.attachments?.length).toBe(1);
  expect(Buffer.from(payload.attachments[0].content, 'base64').toString()).toBe(
    'Cahier des charges',
  );
  finish();
  await expect(page.locator('#contact-status')).toHaveAttribute('data-state', 'success');
  await expect(page.locator('#contact-message')).toHaveValue('');
  await expect(page.locator('#document-list li')).toHaveCount(0);
  await expect(page.locator('#contact-message')).toBeEnabled();
});

test('Contact retains text and documents after a delivery failure', async ({ page }) => {
  await page.route('**/api/contact', (route) =>
    route.fulfill({ status: 503, json: { message: 'Service indisponible.' } }),
  );
  await fillContact(page);
  await page
    .locator('#contact-documents')
    .setInputFiles({ name: 'projet.txt', mimeType: 'text/plain', buffer: Buffer.from('Projet') });
  await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
  await expect(page.locator('#contact-status')).toHaveAttribute('data-state', 'error');
  await expect(page.locator('#contact-message')).toHaveValue(
    'Une application à moderniser et à maintenir.',
  );
  await expect(page.locator('#document-list')).toContainText('projet.txt');
  await expect(page.getByRole('button', { name: 'Envoyer ma demande' })).toBeEnabled();
});
