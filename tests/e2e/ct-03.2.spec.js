import { expect, test } from '@playwright/test';
import {
  registarLeituraSimulada,
} from '../../apps/api/src/integrations/iot.js';
import { gerarLeituraAnomala } from '../../apps/api/src/integrations/iot-simulator.js';
import { findAlertasAtivos } from '../../apps/api/src/persistence/mysql.js';
import { ANIMAL_ID, API_URL, WEB_URL, makeToken, makeVetToken } from './fixtures.js';

const ALERTAS_PATH = `/api/v1/animais/${ANIMAL_ID}/alertas`;

test('CT-03.2 Disparo de alerta visual prioritário por parâmetro anómalo', async ({ page, request }) => {
  const token = makeVetToken();
  const headers = { Authorization: `Bearer ${token}` };

  // Antes da injeção: animal sem alertas ativos.
  const before = await request.get(`${API_URL}${ALERTAS_PATH}`, { headers });
  expect(before.status()).toBe(200);
  expect(await before.json()).toMatchObject({
    animalId: ANIMAL_ID,
    anomalyState: 'NORMAL',
    activeCount: 0,
  });

  // Injetar telemetria anómala (febre) através do simulador do adaptador IoT.
  await registarLeituraSimulada(gerarLeituraAnomala(ANIMAL_ID));

  // O alerta tem de estar disponível em menos de 2 segundos (RNF-02).
  const startedAt = Date.now();
  const response = await request.get(`${API_URL}${ALERTAS_PATH}`, { headers });
  const latencyMs = Date.now() - startedAt;
  expect(response.status()).toBe(200);
  expect(latencyMs).toBeLessThan(2000);

  const alertList = await response.json();
  expect(alertList.animalId).toBe(ANIMAL_ID);
  expect(alertList.anomalyState).toBe('ANOMALOUS');
  expect(alertList.activeCount).toBe(1);
  expect(alertList.alerts).toHaveLength(1);
  expect(alertList.alerts[0]).toMatchObject({
    animalId: ANIMAL_ID,
    type: 'FEVER',
    parameter: 'TEMPERATURE',
    value: 39.5,
    limit: 39,
    detectedAt: '2026-11-27T10:15:00Z',
    status: 'ACTIVE',
  });
  expect(alertList.alerts[0].alertId).toBeTruthy();

  // O evento anómalo ficou registado no processo do animal (persistência na UE).
  const persisted = await findAlertasAtivos(ANIMAL_ID);
  expect(persisted).toHaveLength(1);
  expect(persisted[0]).toMatchObject({
    alertId: alertList.alerts[0].alertId,
    type: 'FEVER',
    status: 'ACTIVE',
  });

  // Sem diagnóstico autónomo: o payload contém apenas metadados do alerta (BR-04).
  expect(JSON.stringify(alertList)).not.toMatch(/diagnostic|diagnóstico/i);

  // Respostas de erro do contrato.
  const unauthorized = await request.get(`${API_URL}${ALERTAS_PATH}`);
  expect(unauthorized.status()).toBe(401);
  expect(await unauthorized.json()).toMatchObject({ status: 401, error: 'Unauthorized' });

  const forbidden = await request.get(`${API_URL}${ALERTAS_PATH}`, {
    headers: { Authorization: `Bearer ${makeToken()}` },
  });
  expect(forbidden.status()).toBe(403);
  expect(await forbidden.json()).toMatchObject({ status: 403, error: 'Forbidden' });

  const notFound = await request.get(
    `${API_URL}/api/v1/animais/00000000-0000-4000-8000-000000000000/alertas`,
    { headers },
  );
  expect(notFound.status()).toBe(404);
  expect(await notFound.json()).toMatchObject({ status: 404, error: 'Not Found' });

  // Destaque visual prioritário no dashboard clínico.
  await page.context().addCookies([{ name: 'miau_token', value: token, url: WEB_URL }]);
  await page.goto(`${WEB_URL}/monitorizacao`);

  await expect(page.getByTestId('estado-anomalia')).toHaveText('Estado de anomalia: ANOMALOUS');
  const priorityAlert = page.getByTestId('alerta-prioritario');
  await expect(priorityAlert).toBeVisible();
  await expect(priorityAlert).toContainText('FEVER');
  await expect(priorityAlert).toContainText('39.5');
  await expect(priorityAlert).toContainText('39');
  await expect(priorityAlert).toContainText('2026-11-27T10:15:00Z');
  await expect(page.getByTestId('alerta-linha')).toHaveCount(1);
});
