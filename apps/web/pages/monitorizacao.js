const API_BASE_URL = process.env.API_BASE_URL ?? 'http://127.0.0.1:4000';
const ANIMAL_ID = '11111111-1111-4111-8111-111111111111';

function readCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  const entry = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
}

async function fetchFromApi(path, token) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    let message = `A API devolveu ${response.status} para ${path}.`;
    try {
      const body = await response.json();
      if (typeof body?.message === 'string' && body.message) {
        message = body.message;
      }
    } catch {
      // Mantém a mensagem genérica quando o corpo não é JSON.
    }
    throw new Error(message);
  }

  return response.json();
}

export async function getServerSideProps({ req }) {
  const token = readCookie(req.headers.cookie, 'miau_token');

  if (!token) {
    return {
      props: {
        serie: null,
        alertas: null,
        error: 'Sessão não autenticada: é necessário o token JWT de veterinário.',
      },
    };
  }

  try {
    const [serie, alertas] = await Promise.all([
      fetchFromApi(`/api/v1/animais/${ANIMAL_ID}/telemetria`, token),
      fetchFromApi(`/api/v1/animais/${ANIMAL_ID}/alertas`, token),
    ]);

    return { props: { serie, alertas, error: null } };
  } catch (error) {
    return { props: { serie: null, alertas: null, error: error.message } };
  }
}

export default function MonitorizacaoPage({ serie, alertas, error }) {
  if (error) {
    return (
      <main>
        <h1>MIAU — Monitorização clínica</h1>
        <p role="alert">{error}</p>
      </main>
    );
  }

  const latest = serie.leituras[0];

  return (
    <main>
      <h1>MIAU — Monitorização clínica</h1>

      <p data-testid="estado-anomalia">Estado de anomalia: {alertas.anomalyState}</p>

      {alertas.anomalyState === 'ANOMALOUS' && (
        <section data-testid="alerta-prioritario" role="alert">
          <h2>ALERTA PRIORITÁRIO — parâmetro fora dos limites de normalidade</h2>
          {alertas.alerts.map((alerta) => (
            <p key={alerta.alertId} data-testid="alerta-linha">
              {alerta.type}: {alerta.parameter} = {alerta.value} (limiar {alerta.limit}),
              detetado em {alerta.detectedAt} — {alerta.status}
            </p>
          ))}
        </section>
      )}

      <section aria-labelledby="ultima-leitura" data-testid="ultima-leitura">
        <h2 id="ultima-leitura">Última leitura</h2>
        {latest ? (
          <dl>
            <dt>Recolhida em</dt>
            <dd data-testid="timestamp-leitura">{latest.recolhidaEm}</dd>
            <dt>Temperatura</dt>
            <dd data-testid="temperatura">{latest.temperatura} °C</dd>
            <dt>Frequência cardíaca</dt>
            <dd data-testid="frequencia-cardiaca">{latest.frequenciaCardiaca} bpm</dd>
            <dt>Frequência respiratória</dt>
            <dd data-testid="frequencia-respiratoria">{latest.frequenciaRespiratoria} rpm</dd>
          </dl>
        ) : (
          <p>Sem leituras disponíveis.</p>
        )}
      </section>

      <section aria-labelledby="serie-temporal">
        <h2 id="serie-temporal">Série temporal</h2>
        <table data-testid="serie-telemetria">
          <thead>
            <tr>
              <th>Recolhida em</th>
              <th>Temperatura (°C)</th>
              <th>Frequência cardíaca (bpm)</th>
              <th>Frequência respiratória (rpm)</th>
            </tr>
          </thead>
          <tbody>
            {serie.leituras.map((leitura) => (
              <tr key={leitura.recolhidaEm}>
                <td>{leitura.recolhidaEm}</td>
                <td>{leitura.temperatura}</td>
                <td>{leitura.frequenciaCardiaca}</td>
                <td>{leitura.frequenciaRespiratoria}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
