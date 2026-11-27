import { expect, test } from '@playwright/test';
import { ANIMAL_ID, API_URL, OTHER_TUTOR_ID, WEB_URL, makeToken } from './fixtures.js';

test('CT-01.2 Acesso não autorizado a animal de terceiros', async ({ page, request }) => {
  const token = makeToken(OTHER_TUTOR_ID);
  const headers = { Authorization: `Bearer ${token}` };
  const paths = [
    `/api/v1/animais/${ANIMAL_ID}`,
    `/api/v1/animais/${ANIMAL_ID}/historico-clinico`,
  ];

  for (const path of paths) {
    const response = await request.get(`${API_URL}${path}`, { headers });
    expect(response.status()).toBe(403);

    const body = await response.json();
    expect(body).toMatchObject({ status: 403, error: 'Forbidden' });
    expect(body.message).toMatch(/permissão insuficiente/i);
    expect(JSON.stringify(body)).not.toContain('Luna');
    expect(JSON.stringify(body)).not.toContain('Consulta de rotina');
  }

  await page.context().addCookies([{ name: 'miau_token', value: token, url: WEB_URL }]);
  await page.goto(WEB_URL);

  const alert = page.locator('main').getByRole('alert');
  await expect(alert).toBeVisible();
  await expect(alert).toContainText(/acesso negado|permissão insuficiente/i);

  const pageText = await page.locator('body').innerText();
  expect(pageText).not.toContain('Luna');
  expect(pageText).not.toContain('Consulta de rotina');
  expect(pageText).not.toContain('Hemograma completo');
});
