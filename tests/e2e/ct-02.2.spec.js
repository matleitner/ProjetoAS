import { expect, test } from '@playwright/test';
import { ANIMAL_ID, API_URL, WEB_URL, makeToken } from './fixtures.js';

const VETERINARIO_ID = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const SLOT_OCUPADO = '2026-12-13T15:00:00Z';
const SLOT_SOBREPOSTO = '2026-12-13T15:15:00Z';

test('CT-02.2 Conflito de horário no agendamento', async ({ page, request }) => {
  const token = makeToken();
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const authHeaders = { Authorization: `Bearer ${token}` };

  // Pré-condição: ambos os horários estão disponíveis (seed determinístico).
  const initialResponse = await request.get(
    `${API_URL}/api/v1/consultas?animalId=${ANIMAL_ID}`,
    { headers: authHeaders },
  );
  expect(initialResponse.status()).toBe(200);
  const initialSlots = await initialResponse.json();
  expect(initialSlots).toContainEqual(expect.objectContaining({
    veterinarioId: VETERINARIO_ID,
    dataHora: SLOT_OCUPADO,
    animalId: null,
  }));
  expect(initialSlots).toContainEqual(expect.objectContaining({
    veterinarioId: VETERINARIO_ID,
    dataHora: SLOT_SOBREPOSTO,
    animalId: null,
  }));

  // Ocupar o primeiro horário.
  const booking = await request.post(`${API_URL}/api/v1/consultas`, {
    headers,
    data: {
      animalId: ANIMAL_ID,
      veterinarioId: VETERINARIO_ID,
      dataHora: SLOT_OCUPADO,
      motivo: 'Consulta de rotina',
    },
  });
  expect(booking.status()).toBe(201);

  // Tentar marcar novamente o mesmo horário: 409 com Error e details.
  const duplicate = await request.post(`${API_URL}/api/v1/consultas`, {
    headers,
    data: {
      animalId: ANIMAL_ID,
      veterinarioId: VETERINARIO_ID,
      dataHora: SLOT_OCUPADO,
      motivo: 'Marcação duplicada',
    },
  });
  expect(duplicate.status()).toBe(409);
  const conflict = await duplicate.json();
  expect(conflict).toMatchObject({ status: 409, error: 'Conflict' });
  expect(conflict.message).toMatch(/conflito|ocupado/i);
  expect(conflict.timestamp).toBeTruthy();
  expect(conflict.details).toMatchObject({
    veterinarioId: VETERINARIO_ID,
    dataHora: SLOT_OCUPADO,
  });
  expect(conflict.details.conflictsWith).toBeTruthy();

  // Não foi gravada qualquer marcação adicional.
  const afterResponse = await request.get(
    `${API_URL}/api/v1/consultas?animalId=${ANIMAL_ID}`,
    { headers: authHeaders },
  );
  expect(afterResponse.status()).toBe(200);
  const afterSlots = await afterResponse.json();
  const bookingsForSlot = afterSlots.filter((item) => (
    item.animalId === ANIMAL_ID
    && item.veterinarioId === VETERINARIO_ID
    && item.dataHora === SLOT_OCUPADO
  ));
  expect(bookingsForSlot).toHaveLength(1);

  // Na UI, o horário sobreposto continua na lista, mas conflita com a consulta agendada.
  await page.context().addCookies([{ name: 'miau_token', value: token, url: WEB_URL }]);
  await page.goto(`${WEB_URL}/consultas`);
  await page.locator('#slot').selectOption(`${VETERINARIO_ID}|${SLOT_SOBREPOSTO}`);

  const [response] = await Promise.all([
    page.waitForResponse((candidate) => (
      candidate.url().endsWith('/api/v1/consultas') && candidate.request().method() === 'POST'
    )),
    page.getByRole('button', { name: 'Marcar consulta' }).click(),
  ]);
  expect(response.status()).toBe(409);

  const conflictBox = page.getByTestId('conflito-horario');
  await expect(conflictBox).toBeVisible();
  await expect(conflictBox.getByRole('alert')).toContainText(/conflito|ocupado/i);
  await expect(conflictBox.locator('li').first()).toBeVisible();
  await expect(page.locator('#slot')).toHaveValue('');
  await expect(page.getByTestId('confirmacao-consulta')).toHaveCount(0);
});
