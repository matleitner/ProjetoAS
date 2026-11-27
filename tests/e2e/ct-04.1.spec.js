import { expect, test } from '@playwright/test';
import { ANIMAL_ID, API_URL, OTHER_TUTOR_ID, WEB_URL, makeToken } from './fixtures.js';

const INTERNAMENTO_PATH = `/api/v1/animais/${ANIMAL_ID}/internamento`;

test('CT-04.1 Consulta de estado de internamento', async ({ page, request }) => {
  const token = makeToken();
  const headers = { Authorization: `Bearer ${token}` };

  const response = await request.get(`${API_URL}${INTERNAMENTO_PATH}`, { headers });
  expect(response.status()).toBe(200);
  const internamento = await response.json();

  expect(internamento.animalId).toBe(ANIMAL_ID);
  expect(internamento.estadoAtual).toBe('internado');
  expect(internamento.responsavel).toBe('Dra. Marta');
  expect(internamento.previsaoAlta).toMatchObject({ previstaPara: '2026-12-01T12:00:00Z' });
  expect(internamento.previsaoAlta.observacoes).toBeTruthy();

  expect(internamento.telemetriaMaisRecente).toMatchObject({ animalId: ANIMAL_ID });
  expect(internamento.telemetriaMaisRecente.recolhidaEm).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  expect(typeof internamento.telemetriaMaisRecente.temperatura).toBe('number');
  expect(Array.isArray(internamento.evolucao)).toBe(true);
  expect(internamento.evolucao.length).toBeGreaterThan(0);
  for (const registo of internamento.evolucao) {
    expect(registo.registadoEm).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    expect(registo.estado).toBeTruthy();
  }

  // Controlo de acesso (BR-01).
  const unauthorized = await request.get(`${API_URL}${INTERNAMENTO_PATH}`);
  expect(unauthorized.status()).toBe(401);
  expect(await unauthorized.json()).toMatchObject({ status: 401, error: 'Unauthorized' });

  const forbidden = await request.get(`${API_URL}${INTERNAMENTO_PATH}`, {
    headers: { Authorization: `Bearer ${makeToken(OTHER_TUTOR_ID)}` },
  });
  expect(forbidden.status()).toBe(403);
  expect(await forbidden.json()).toMatchObject({ status: 403, error: 'Forbidden' });

  const notFound = await request.get(
    `${API_URL}/api/v1/animais/00000000-0000-4000-8000-000000000000/internamento`,
    { headers },
  );
  expect(notFound.status()).toBe(404);
  expect(await notFound.json()).toMatchObject({ status: 404, error: 'Not Found' });

  // Área de internamentos: o tutor seleciona o animal internado associado.
  await page.context().addCookies([{ name: 'miau_token', value: token, url: WEB_URL }]);
  await page.goto(`${WEB_URL}/internamentos`);
  await page.locator('#animal').selectOption(ANIMAL_ID);
  await Promise.all([
    page.waitForURL(/internamentos\?animalId=/),
    page.getByRole('button', { name: 'Consultar internamento' }).click(),
  ]);

  await expect(page.getByTestId('estado-atual')).toHaveText(internamento.estadoAtual);
  await expect(page.getByTestId('responsavel')).toHaveText(internamento.responsavel);
  await expect(page.getByTestId('previsao-alta')).toContainText(internamento.previsaoAlta.previstaPara);
  await expect(page.getByTestId('telemetria-recolhida-em')).toHaveText(
    internamento.telemetriaMaisRecente.recolhidaEm,
  );
  await expect(page.getByTestId('telemetria-temperatura')).toContainText(
    String(internamento.telemetriaMaisRecente.temperatura),
  );
  await expect(page.getByTestId('registo-evolucao')).toHaveCount(internamento.evolucao.length);
});
