import {
  findAnimalById,
  findClinicalHistory,
  hasTutorAnimalAssociation,
} from '../../persistence/mysql.js';

export class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

async function assertTutorCanAccessAnimal(tutorId, animalId) {
  const animal = await findAnimalById(animalId);

  if (!animal) {
    throw new NotFoundError('Animal não encontrado.');
  }

  const associated = await hasTutorAnimalAssociation(tutorId, animalId);
  if (!associated) {
    throw new ForbiddenError('Permissão insuficiente para aceder a este animal.');
  }

  return animal;
}

export async function getAnimalDetailsForTutor(tutorId, animalId) {
  return assertTutorCanAccessAnimal(tutorId, animalId);
}

export async function getClinicalHistoryForTutor(tutorId, animalId) {
  await assertTutorCanAccessAnimal(tutorId, animalId);
  return findClinicalHistory(animalId);
}
