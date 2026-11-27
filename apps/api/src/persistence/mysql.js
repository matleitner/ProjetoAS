import { randomUUID } from 'node:crypto';
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

const SLOT_DATE_FORMAT = "%Y-%m-%dT%H:%i:%sZ";

function toConsulta(row) {
  return {
    consultaId: row.id,
    animalId: row.animal_id ?? null,
    veterinarioId: row.veterinario_id,
    dataHora: row.data_hora,
  };
}

export async function findVeterinarioById(veterinarioId) {
  const [rows] = await getPool().execute(
    'SELECT id, name FROM veterinarios WHERE id = ? LIMIT 1',
    [veterinarioId],
  );

  return rows[0] ?? null;
}

export async function findAvailableSlots(filters = {}) {
  const conditions = ['c.id IS NULL'];
  const params = [];

  if (filters.veterinarioId) {
    conditions.push('d.veterinario_id = ?');
    params.push(filters.veterinarioId);
  }
  if (filters.animalId) {
    conditions.push('EXISTS (SELECT 1 FROM tutor_animals ta WHERE ta.animal_id = ?)');
    params.push(filters.animalId);
  }

  const [rows] = await getPool().execute(
    `SELECT d.id, d.veterinario_id,
            DATE_FORMAT(d.data_hora, '${SLOT_DATE_FORMAT}') AS data_hora
       FROM disponibilidades d
       LEFT JOIN consultas c ON c.disponibilidade_id = d.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY d.data_hora ASC`,
    params,
  );

  return rows.map((row) => ({
    consultaId: row.id,
    animalId: null,
    veterinarioId: row.veterinario_id,
    dataHora: row.data_hora,
  }));
}

export async function findBookedConsultas(tutorId, filters = {}) {
  const conditions = ['c.tutor_id = ?'];
  const params = [tutorId];

  if (filters.animalId) {
    conditions.push('c.animal_id = ?');
    params.push(filters.animalId);
  }
  if (filters.veterinarioId) {
    conditions.push('c.veterinario_id = ?');
    params.push(filters.veterinarioId);
  }

  const [rows] = await getPool().execute(
    `SELECT c.id, c.animal_id, c.veterinario_id,
            DATE_FORMAT(c.data_hora, '${SLOT_DATE_FORMAT}') AS data_hora
       FROM consultas c
      WHERE ${conditions.join(' AND ')}
      ORDER BY c.data_hora ASC`,
    params,
  );

  return rows.map(toConsulta);
}

export async function findAvailableSlot(veterinarioId, dataHora) {
  const [rows] = await getPool().execute(
    `SELECT d.id, d.veterinario_id,
            DATE_FORMAT(d.data_hora, '${SLOT_DATE_FORMAT}') AS data_hora
       FROM disponibilidades d
       LEFT JOIN consultas c ON c.disponibilidade_id = d.id
      WHERE d.veterinario_id = ?
        AND DATE_FORMAT(d.data_hora, '${SLOT_DATE_FORMAT}') = ?
        AND c.id IS NULL
      LIMIT 1`,
    [veterinarioId, dataHora],
  );

  return rows[0] ?? null;
}

export async function slotExists(veterinarioId, dataHora) {
  const [rows] = await getPool().execute(
    `SELECT 1 FROM disponibilidades
      WHERE veterinario_id = ?
        AND DATE_FORMAT(data_hora, '${SLOT_DATE_FORMAT}') = ?
      LIMIT 1`,
    [veterinarioId, dataHora],
  );

  return rows.length > 0;
}

export async function insertConsulta({ tutorId, animalId, veterinarioId, dataHora, motivo, slotId }) {
  const consultaId = randomUUID();
  const storedDataHora = dataHora.replace('T', ' ').replace('Z', '');

  await getPool().execute(
    `INSERT INTO consultas
       (id, disponibilidade_id, animal_id, veterinario_id, tutor_id, data_hora, motivo)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [consultaId, slotId, animalId, veterinarioId, tutorId, storedDataHora, motivo ?? null],
  );

  return {
    consultaId,
    animalId,
    veterinarioId,
    dataHora,
  };
}

export async function findBookedSlotsForVeterinario(veterinarioId) {
  const [rows] = await getPool().execute(
    `SELECT id, DATE_FORMAT(data_hora, '${SLOT_DATE_FORMAT}') AS data_hora
       FROM consultas
      WHERE veterinario_id = ?
      ORDER BY data_hora ASC`,
    [veterinarioId],
  );

  return rows;
}

function toLeitura(row) {
  let sinaisVitais = {};
  if (row.sinais_vitais) {
    try {
      sinaisVitais = JSON.parse(row.sinais_vitais);
    } catch {
      sinaisVitais = {};
    }
  }

  return {
    animalId: row.animal_id,
    recolhidaEm: row.recolhida_em,
    temperatura: Number(row.temperatura),
    frequenciaCardiaca: Number(row.frequencia_cardiaca),
    frequenciaRespiratoria: Number(row.frequencia_respiratoria),
    sinaisVitais,
  };
}

export async function findInternamentoByAnimal(animalId) {
  const [rows] = await getPool().execute(
    `SELECT id, animal_id, estado, equipa_responsavel,
            DATE_FORMAT(previsao_alta, '${SLOT_DATE_FORMAT}') AS previsao_alta,
            previsao_alta_observacoes,
            dispositivo_iot_ativo
       FROM internamentos
      WHERE animal_id = ?
      LIMIT 1`,
    [animalId],
  );

  return rows[0] ?? null;
}

export async function hasVeterinarioAnimalAssociation(veterinarioId, animalId) {
  const [rows] = await getPool().execute(
    `SELECT 1 FROM veterinario_animais
      WHERE veterinario_id = ? AND animal_id = ?
      LIMIT 1`,
    [veterinarioId, animalId],
  );

  return rows.length > 0;
}

export async function countLeiturasTelemetria(animalId) {
  const [rows] = await getPool().execute(
    'SELECT COUNT(*) AS total FROM leituras_telemetria WHERE animal_id = ?',
    [animalId],
  );

  return Number(rows[0].total);
}

export async function findLeiturasTelemetria(animalId, janela = {}) {
  const conditions = ['animal_id = ?'];
  const params = [animalId];

  if (janela.desde) {
    conditions.push('recolhida_em >= ?');
    params.push(janela.desde.replace('T', ' ').replace('Z', ''));
  }
  if (janela.ate) {
    conditions.push('recolhida_em <= ?');
    params.push(janela.ate.replace('T', ' ').replace('Z', ''));
  }

  const [rows] = await getPool().execute(
    `SELECT animal_id,
            DATE_FORMAT(recolhida_em, '${SLOT_DATE_FORMAT}') AS recolhida_em,
            temperatura, frequencia_cardiaca, frequencia_respiratoria, sinais_vitais
       FROM leituras_telemetria
      WHERE ${conditions.join(' AND ')}
      ORDER BY recolhida_em DESC
      LIMIT ?`,
    [...params, janela.limite ?? 100],
  );

  return rows.map(toLeitura);
}

export async function insertLeituraTelemetria({ animalId, recolhidaEm, temperatura, frequenciaCardiaca, frequenciaRespiratoria, sinaisVitais }) {
  await getPool().execute(
    `INSERT INTO leituras_telemetria
       (id, animal_id, recolhida_em, temperatura, frequencia_cardiaca, frequencia_respiratoria, sinais_vitais)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      randomUUID(),
      animalId,
      recolhidaEm.replace('T', ' ').replace('Z', ''),
      temperatura,
      frequenciaCardiaca,
      frequenciaRespiratoria,
      JSON.stringify(sinaisVitais ?? {}),
    ],
  );
}

export async function insertAlerta({ animalId, tipo, parametro, valor, limiar, detetadoEm }) {
  await getPool().execute(
    `INSERT IGNORE INTO alertas
       (id, animal_id, tipo, parametro, valor, limiar, detetado_em, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
    [
      randomUUID(),
      animalId,
      tipo,
      parametro,
      valor,
      limiar,
      detetadoEm.replace('T', ' ').replace('Z', ''),
    ],
  );
}

export async function findAlertasAtivos(animalId) {
  const [rows] = await getPool().execute(
    `SELECT id, animal_id, tipo, parametro, valor, limiar, estado,
            DATE_FORMAT(detetado_em, '${SLOT_DATE_FORMAT}') AS detetado_em
       FROM alertas
      WHERE animal_id = ? AND estado = 'ACTIVE'
      ORDER BY detetado_em DESC`,
    [animalId],
  );

  return rows.map((row) => ({
    alertId: row.id,
    animalId: row.animal_id,
    type: row.tipo,
    parameter: row.parametro,
    value: Number(row.valor),
    limit: Number(row.limiar),
    detectedAt: row.detetado_em,
    status: row.estado,
  }));
}

export async function findEvolucaoInternamento(animalId) {
  const [rows] = await getPool().execute(
    `SELECT DATE_FORMAT(registado_em, '${SLOT_DATE_FORMAT}') AS registado_em,
            estado, descricao
       FROM evolucao_internamento
      WHERE animal_id = ?
      ORDER BY registado_em ASC`,
    [animalId],
  );

  return rows.map((row) => ({
    registadoEm: row.registado_em,
    estado: row.estado,
    descricao: row.descricao ?? undefined,
  }));
}
