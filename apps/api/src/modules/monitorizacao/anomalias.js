export const FEVER_LIMIT_C = 39.0;

export function detetarAnomalias(leituras) {
  return leituras
    .filter((leitura) => leitura.temperatura > FEVER_LIMIT_C)
    .map((leitura) => ({
      tipo: 'FEVER',
      parametro: 'TEMPERATURE',
      valor: leitura.temperatura,
      limiar: FEVER_LIMIT_C,
      detetadoEm: leitura.recolhidaEm,
    }));
}
