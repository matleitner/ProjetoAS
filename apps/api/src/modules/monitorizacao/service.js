import { consultarLeiturasIot } from '../../integrations/iot.js';
import {
  findAlertasAtivos,
  findAnimalById,
  findInternamentoByAnimal,
  hasVeterinarioAnimalAssociation,
  insertAlerta,
} from '../../persistence/mysql.js';
import { ForbiddenError, NotFoundError } from '../animais/service.js';
import { detetarAnomalias } from './anomalias.js';

async function assertVeterinarioPodeAceder(role, veterinarioId, animalId) {
  if (role !== 'VETERINARIO') {
    throw new ForbiddenError('Apenas a equipa veterinária pode consultar dados clínicos.');
  }

  const animal = await findAnimalById(animalId);
  if (!animal) {
    throw new NotFoundError('Animal não encontrado.');
  }

  if (!(await hasVeterinarioAnimalAssociation(veterinarioId, animalId))) {
    throw new ForbiddenError('Sem permissão para aceder aos dados clínicos deste animal.');
  }

  const internamento = await findInternamentoByAnimal(animalId);
  if (!internamento || internamento.estado !== 'internado'
      || !Number(internamento.dispositivo_iot_ativo)) {
    throw new NotFoundError('Dados clínicos indisponíveis: animal sem internamento ativo ou dispositivo IoT inativo.');
  }
}

export async function getTelemetriaSerie({ role, veterinarioId, animalId, janela = {} }) {
  await assertVeterinarioPodeAceder(role, veterinarioId, animalId);
  const leituras = await consultarLeiturasIot(animalId, janela);
  return { animalId, leituras };
}

export async function getAlertasSerie({ role, veterinarioId, animalId }) {
  await assertVeterinarioPodeAceder(role, veterinarioId, animalId);

  const leituras = await consultarLeiturasIot(animalId, { limite: 1000 });
  for (const anomalia of detetarAnomalias(leituras)) {
    await insertAlerta({ animalId, ...anomalia });
  }

  const alertas = await findAlertasAtivos(animalId);
  return {
    animalId,
    anomalyState: alertas.length > 0 ? 'ANOMALOUS' : 'NORMAL',
    alerts: alertas,
    activeCount: alertas.length,
  };
}
