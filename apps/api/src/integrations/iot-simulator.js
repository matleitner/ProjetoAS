import { countLeiturasTelemetria, insertLeituraTelemetria } from '../persistence/mysql.js';

const BASE_TIMESTAMP = Date.UTC(2026, 10, 27, 10, 0, 0);
const INTERVALO_MS = 5 * 60 * 1000;
const AMOSTRAS = [
  [38.5, 92, 24],
  [38.6, 94, 25],
  [38.7, 96, 26],
];

export function gerarSerieSimulada(animalId) {
  return AMOSTRAS.map(([temperatura, frequenciaCardiaca, frequenciaRespiratoria], indice) => ({
    animalId,
    recolhidaEm: new Date(BASE_TIMESTAMP + indice * INTERVALO_MS).toISOString(),
    temperatura,
    frequenciaCardiaca,
    frequenciaRespiratoria,
    sinaisVitais: { origem: 'sensor-iot' },
  }));
}

export async function garantirSerieSimulada(animalId) {
  if (await countLeiturasTelemetria(animalId) > 0) return;

  for (const leitura of gerarSerieSimulada(animalId)) {
    await insertLeituraTelemetria(leitura);
  }
}


const ANOMALOUS_TIMESTAMP = '2026-11-27T10:15:00Z';

export function gerarLeituraAnomala(animalId) {
  return {
    animalId,
    recolhidaEm: ANOMALOUS_TIMESTAMP,
    temperatura: 39.5,
    frequenciaCardiaca: 110,
    frequenciaRespiratoria: 30,
    sinaisVitais: { origem: 'sensor-iot', simulacao: 'FEVER' },
  };
}
