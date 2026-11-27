import mysql from 'mysql2/promise';
import { config } from '../config.js';

let pool;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      charset: 'utf8mb4',
      waitForConnections: true,
      connectionLimit: 4,
    });
  }

  return pool;
}

export async function closePool() {
  if (!pool) return;
  await pool.end();
  pool = undefined;
}

function toAnimal(row) {
  if (!row) return null;
  return {
    ...row,
    weight: row.weight === null || row.weight === undefined ? undefined : Number(row.weight),
  };
}

export async function findAnimalById(animalId) {
  const [rows] = await getPool().execute(
    `SELECT
       id,
       name,
       species,
       breed,
       DATE_FORMAT(birth_date, '%Y-%m-%d') AS birthDate,
       weight,
       microchip,
       clinical_summary AS clinicalSummary
     FROM animals
     WHERE id = ?
     LIMIT 1`,
    [animalId],
  );

  return toAnimal(rows[0]);
}

export async function hasTutorAnimalAssociation(tutorId, animalId) {
  const [rows] = await getPool().execute(
    `SELECT 1
     FROM tutor_animals
     WHERE tutor_id = ? AND animal_id = ?
     LIMIT 1`,
    [tutorId, animalId],
  );

  return rows.length > 0;
}

export async function findClinicalHistory(animalId) {
  const [rows] = await getPool().execute(
    `SELECT
       id,
       type,
       DATE_FORMAT(recorded_at, '%Y-%m-%dT%H:%i:%sZ') AS date,
       description,
       veterinarian
     FROM clinical_records
     WHERE animal_id = ?
     ORDER BY recorded_at ASC`,
    [animalId],
  );

  return { records: rows };
}
