import { expect, test } from '@playwright/test';
import { ANIMAL_ID, API_URL, WEB_URL, makeToken } from './fixtures.js';

test('CT-01.1 Consulta bem-sucedida de dados do animal', async ({ page, request }) => {
  const token = makeToken();
  const headers = { Authorization: `Bearer ${token}` };

  const detailsResponse = await request.get(`${API_URL}/api/v1/animais/${ANIMAL_ID}`, { headers });
  expect(detailsResponse.status()).toBe(200);
  const details = await detailsResponse.json();
  expect(details).toMatchObject({
    id: ANIMAL_ID,
    name: 'Luna',
    species: 'Canino',
    breed: 'Labrador',
  });
  expect(details.clinicalSummary).toBeTruthy();

  const historyResponse = await request.get(
    `${API_URL}/api/v1/animais/${ANIMAL_ID}/historico-clinico`,
    { headers },
  );
  expect(historyResponse.status()).toBe(200);
  const history = await historyResponse.json();
  expect(Array.isArray(history.records)).toBe(true);
  expect(history.records.length).toBeGreaterThan(0);
  expect(history.records[0]).toMatchObject({
    id: '33333333-3333-4333-8333-333333333333',
    type: 'consultation',
    description: 'Consulta de rotina',
  });

  await page.context().addCookies([{ name: 'miau_token', value: token, url: WEB_URL }]);
  await page.goto(WEB_URL);

  await expect(page.getByRole('heading', { name: 'Luna' })).toBeVisible();
  await expect(page.getByText('Labrador')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Histórico clínico' })).toBeVisible();
  await expect(page.getByText('Consulta de rotina')).toBeVisible();
});
