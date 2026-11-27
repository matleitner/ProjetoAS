import { expect, test } from '@playwright/test';
import { ANIMAL_ID, API_URL, WEB_URL, makeToken, makeVetToken } from './fixtures.js';

const TELEMETRIA_PATH = `/api/v1/animais/${ANIMAL_ID}/telemetria`;

test('CT-03.1 Visualização de telemetria', async ({ page, request }) => {
  const token = makeVetToken();
  const headers = { Authorization: `Bearer ${token}` };

  const response = await request.get(`${API_URL}${TELEMETRIA_PATH}`, { headers });
  expect(response.status()).toBe(200);
  const serie = await response.json();
  expect(serie.animalId).toBe(ANIMAL_ID);
  expect(Array.isArray(serie.leituras)).toBe(true);
  expect(serie.leituras.length).toBeGreaterThan(0);

  for (const leitura of serie.leituras) {
    expect(leitura.animalId).toBe(ANIMAL_ID);
    expect(leitura.recolhidaEm).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    expect(typeof leitura.temperatura).toBe('number');
    expect(typeof leitura.frequenciaCardiaca).toBe('number');
    expect(typeof leitura.frequenciaRespiratoria).toBe('number');
  }

  const timestamps = serie.leituras.map((leitura) => leitura.recolhidaEm);
  expect(timestamps).toEqual([...timestamps].sort().reverse());

  // Janela temporal e limite (série temporal com desde/ate/limite).
  const windowResponse = await request.get(
    `${API_URL}${TELEMETRIA_PATH}?desde=2026-11-27T10:05:00Z&limite=2`,
    { headers },
  );
  expect(windowResponse.status()).toBe(200);
  const windowSerie = await windowResponse.json();
  expect(windowSerie.leituras).toHaveLength(2);
  expect(windowSerie.leituras[0].recolhidaEm).toBe('2026-11-27T10:10:00Z');

  // Um tutor não tem acesso à telemetria clínica.
  const forbidden = await request.get(`${API_URL}${TELEMETRIA_PATH}`, {
    headers: { Authorization: `Bearer ${makeToken()}` },
  });
  expect(forbidden.status()).toBe(403);
  expect(await forbidden.json()).toMatchObject({ status: 403, error: 'Forbidden' });

  await page.context().addCookies([{ name: 'miau_token', value: token, url: WEB_URL }]);
  await page.goto(`${WEB_URL}/monitorizacao`);

  await expect(page.getByTestId('ultima-leitura')).toBeVisible();
  await expect(page.getByTestId('timestamp-leitura')).toHaveText(serie.leituras[0].recolhidaEm);
  await expect(page.getByTestId('temperatura')).toContainText(String(serie.leituras[0].temperatura));
  await expect(page.getByTestId('frequencia-cardiaca')).toContainText(String(serie.leituras[0].frequenciaCardiaca));
  await expect(page.getByTestId('frequencia-respiratoria')).toContainText(String(serie.leituras[0].frequenciaRespiratoria));
  expect(await page.getByTestId('serie-telemetria').locator('tbody tr').count()).toBe(serie.leituras.length);
});
