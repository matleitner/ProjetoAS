import { expect, test } from '@playwright/test';
import { ANIMAL_ID, API_URL, WEB_URL, makeToken } from './fixtures.js';

test('CT-02.1 Agendamento bem-sucedido de consulta', async ({ page, request }) => {
  const token = makeToken();
  const headers = { Authorization: `Bearer ${token}` };

  const listResponse = await request.get(`${API_URL}/api/v1/consultas?animalId=${ANIMAL_ID}`, { headers });
  expect(listResponse.status()).toBe(200);
  const slots = await listResponse.json();
  const slot = slots.find((item) => item.animalId === null);
  expect(slot).toBeTruthy();

  await page.context().addCookies([{ name: 'miau_token', value: token, url: WEB_URL }]);
  await page.goto(`${WEB_URL}/consultas`);

  await page.locator('#slot').selectOption(`${slot.veterinarioId}|${slot.dataHora}`);

  const [response] = await Promise.all([
    page.waitForResponse((candidate) => (
      candidate.url().endsWith('/api/v1/consultas') && candidate.request().method() === 'POST'
    )),
    page.getByRole('button', { name: 'Marcar consulta' }).click(),
  ]);

  expect(response.status()).toBe(201);
  const created = await response.json();
  expect(created).toMatchObject({
    animalId: ANIMAL_ID,
    veterinarioId: slot.veterinarioId,
    dataHora: slot.dataHora,
  });
  expect(created.consultaId).toBeTruthy();

  await expect(page.getByTestId('confirmacao-consulta')).toContainText('Consulta agendada com sucesso');
});
