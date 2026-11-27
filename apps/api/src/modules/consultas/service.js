import { ForbiddenError, NotFoundError } from '../animais/service.js';
import {
  findAnimalById,
  findAvailableSlot,
  findAvailableSlots,
  findBookedConsultas,
  findBookedSlotsForVeterinario,
  findVeterinarioById,
  hasTutorAnimalAssociation,
  insertConsulta,
  slotExists,
} from '../../persistence/mysql.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const CONSULTA_DURATION_MS = 30 * 60 * 1000;

async function assertNoScheduleConflict(veterinarioId, dataHora) {
  const requestedStart = Date.parse(dataHora);
  const requestedEnd = requestedStart + CONSULTA_DURATION_MS;
  const booked = await findBookedSlotsForVeterinario(veterinarioId);
  const conflicting = booked.find((row) => {
    const start = Date.parse(row.data_hora);
    const end = start + CONSULTA_DURATION_MS;
    return start < requestedEnd && end > requestedStart;
  });

  if (!conflicting) return;

  const error = new ConflictError('O horário selecionado entra em conflito com uma consulta já agendada.');
  error.details = { veterinarioId, dataHora, conflictsWith: conflicting.id };
  throw error;
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class UnprocessableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnprocessableError';
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
  }
}

export async function listConsultas(tutorId, filters = {}) {
  const [slots, booked] = await Promise.all([
    findAvailableSlots(filters),
    findBookedConsultas(tutorId, filters),
  ]);

  return [...slots, ...booked];
}

export async function createConsulta(tutorId, body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ValidationError('Payload inválido.');
  }

  const { animalId, veterinarioId, dataHora, motivo } = body;
  if (!UUID_PATTERN.test(animalId ?? '') || !UUID_PATTERN.test(veterinarioId ?? '')
      || typeof dataHora !== 'string' || !DATE_TIME_PATTERN.test(dataHora)
      || (motivo !== undefined && typeof motivo !== 'string')) {
    throw new ValidationError('ConsultaRequest inválido: animalId, veterinarioId e dataHora são obrigatórios.');
  }

  const animal = await findAnimalById(animalId);
  if (!animal) {
    throw new NotFoundError('Animal não encontrado.');
  }
  if (!(await hasTutorAnimalAssociation(tutorId, animalId))) {
    throw new ForbiddenError('Permissão insuficiente para marcar consulta para este animal.');
  }

  const veterinario = await findVeterinarioById(veterinarioId);
  if (!veterinario) {
    throw new NotFoundError('Serviço veterinário não encontrado.');
  }

  await assertNoScheduleConflict(veterinarioId, dataHora);

  const slot = await findAvailableSlot(veterinarioId, dataHora);
  if (!slot) {
    if (await slotExists(veterinarioId, dataHora)) {
      throw new ConflictError('O horário selecionado já se encontra ocupado.');
    }
    throw new UnprocessableError('O horário selecionado não está disponível para marcação.');
  }

  return insertConsulta({ tutorId, animalId, veterinarioId, dataHora, motivo, slotId: slot.id });
}
