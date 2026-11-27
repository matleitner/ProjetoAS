import { consultarLeiturasIot } from '../../integrations/iot.js';
import {
  findAnimalById,
  findEvolucaoInternamento,
  findInternamentoByAnimal,
  hasTutorAnimalAssociation,
} from '../../persistence/mysql.js';
import { ForbiddenError, NotFoundError } from '../animais/service.js';

export async function getInternamentoForTutor({ role, tutorId, animalId }) {
  if (role !== 'TUTOR') {
    throw new ForbiddenError('Apenas o tutor associado pode consultar o internamento.');
  }

  const animal = await findAnimalById(animalId);
  if (!animal) {
    throw new NotFoundError('Animal não encontrado.');
  }

  if (!(await hasTutorAnimalAssociation(tutorId, animalId))) {
    throw new ForbiddenError('Permissão insuficiente para aceder a este animal.');
  }

  const internamento = await findInternamentoByAnimal(animalId);
  if (!internamento) {
    throw new NotFoundError('Internamento não encontrado para este animal.');
  }

  const [leituras, evolucao] = await Promise.all([
    consultarLeiturasIot(animalId, { limite: 1 }),
    findEvolucaoInternamento(animalId),
  ]);

  return {
    animalId,
    estadoAtual: internamento.estado,
    responsavel: internamento.equipa_responsavel ?? null,
    previsaoAlta: internamento.previsao_alta
      ? {
        previstaPara: internamento.previsao_alta,
        observacoes: internamento.previsao_alta_observacoes ?? undefined,
      }
      : null,
    telemetriaMaisRecente: leituras[0] ?? null,
    evolucao,
  };
}
