const API_BASE_URL = process.env.API_BASE_URL ?? 'http://127.0.0.1:4000';
const ANIMAL_ID = '11111111-1111-4111-8111-111111111111';
const ANIMAIS = [
  { id: ANIMAL_ID, name: 'Luna' },
  { id: '22222222-2222-4222-8222-222222222222', name: 'Milo' },
];

function readCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  const entry = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
}

export async function getServerSideProps({ req, query }) {
  const token = readCookie(req.headers.cookie, 'miau_token');
  const animalId = typeof query.animalId === 'string' ? query.animalId : ANIMAL_ID;

  if (!token) {
    return {
      props: {
        animalId,
        internamento: null,
        error: 'Sessão não autenticada: é necessário o token JWT de tutor.',
      },
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/animais/${encodeURIComponent(animalId)}/internamento`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
    );

    if (!response.ok) {
      let message = `A API devolveu ${response.status} para /api/v1/animais/${animalId}/internamento.`;
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

    return { props: { animalId, internamento: await response.json(), error: null } };
  } catch (error) {
    return { props: { animalId, internamento: null, error: error.message } };
  }
}

export default function InternamentosPage({ animalId, internamento, error }) {
  return (
    <main>
      <h1>MIAU — Internamentos</h1>

      <form method="get">
        <label htmlFor="animal">Animal internado</label>
        <select id="animal" name="animalId" defaultValue={animalId}>
          {ANIMAIS.map((animal) => (
            <option key={animal.id} value={animal.id}>{animal.name}</option>
          ))}
        </select>
        <button type="submit">Consultar internamento</button>
      </form>

      {error && <p role="alert">{error}</p>}

      {internamento && (
        <section aria-labelledby="estado-internamento">
          <h2 id="estado-internamento">Estado do internamento</h2>
          <dl>
            <dt>Estado atual</dt>
            <dd data-testid="estado-atual">{internamento.estadoAtual}</dd>
            <dt>Equipa responsável</dt>
            <dd data-testid="responsavel">{internamento.responsavel ?? 'Não informado'}</dd>
            <dt>Previsão de alta</dt>
            <dd data-testid="previsao-alta">
              {internamento.previsaoAlta
                ? `${internamento.previsaoAlta.previstaPara}${internamento.previsaoAlta.observacoes ? ` — ${internamento.previsaoAlta.observacoes}` : ''}`
                : 'Não disponível'}
            </dd>
          </dl>

          <section aria-labelledby="telemetria-recente" data-testid="telemetria-recente">
            <h3 id="telemetria-recente">Telemetria mais recente</h3>
            {internamento.telemetriaMaisRecente ? (
              <dl>
                <dt>Recolhida em</dt>
                <dd data-testid="telemetria-recolhida-em">{internamento.telemetriaMaisRecente.recolhidaEm}</dd>
                <dt>Temperatura</dt>
                <dd data-testid="telemetria-temperatura">{internamento.telemetriaMaisRecente.temperatura} °C</dd>
                <dt>Frequência cardíaca</dt>
                <dd data-testid="telemetria-fc">{internamento.telemetriaMaisRecente.frequenciaCardiaca} bpm</dd>
                <dt>Frequência respiratória</dt>
                <dd data-testid="telemetria-fr">{internamento.telemetriaMaisRecente.frequenciaRespiratoria} rpm</dd>
              </dl>
            ) : (
              <p>Sem telemetria recente.</p>
            )}
          </section>

          <section aria-labelledby="evolucao-internamento" data-testid="evolucao">
            <h3 id="evolucao-internamento">Evolução do internamento</h3>
            <ul>
              {internamento.evolucao.map((registo) => (
                <li key={registo.registadoEm} data-testid="registo-evolucao">
                  {registo.registadoEm} — {registo.estado}
                  {registo.descricao ? `: ${registo.descricao}` : ''}
                </li>
              ))}
            </ul>
          </section>
        </section>
      )}
    </main>
  );
}
