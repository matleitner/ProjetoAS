import { findLeiturasTelemetria, insertLeituraTelemetria } from '../persistence/mysql.js';
import { garantirSerieSimulada } from './iot-simulator.js';

export async function consultarLeiturasIot(animalId, janela = {}) {
  await garantirSerieSimulada(animalId);
  return findLeiturasTelemetria(animalId, janela);
}


export async function registarLeituraSimulada(leitura) {
  await insertLeituraTelemetria(leitura);
}
