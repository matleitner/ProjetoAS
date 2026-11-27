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
    throw new Error(`A API devolveu ${response.status} para ${path}.`);
  }

  return response.json();
}

export async function getServerSideProps({ req }) {
  const token = readCookie(req.headers.cookie, 'miau_token');

  if (!token) {
    return { props: { error: 'Sessão não autenticada: é necessário o token JWT de tutor.' } };
  }

  try {
    const [animal, history] = await Promise.all([
      fetchFromApi(`/api/v1/animais/${ANIMAL_ID}`, token),
      fetchFromApi(`/api/v1/animais/${ANIMAL_ID}/historico-clinico`, token),
    ]);

    return { props: { animal, history } };
  } catch (error) {
    return { props: { error: error.message } };
  }
}

export default function AnimaisPage({ animal, history, error }) {
  if (error) {
    return (
      <main>
        <h1>MIAU — Área de animais</h1>
        <p role="alert">{error}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>MIAU — Área de animais</h1>

      <section aria-labelledby="perfil-do-animal">
        <h2 id="perfil-do-animal">Perfil do animal</h2>
        <h3>{animal.name}</h3>
        <dl>
          <dt>Espécie</dt>
          <dd>{animal.species}</dd>
          <dt>Raça</dt>
          <dd>{animal.breed}</dd>
          <dt>Data de nascimento</dt>
          <dd>{animal.birthDate}</dd>
          <dt>Peso</dt>
          <dd>{animal.weight} kg</dd>
          <dt>Microchip</dt>
          <dd>{animal.microchip}</dd>
        </dl>
        <p>{animal.clinicalSummary}</p>
      </section>

      <section aria-labelledby="historico-clinico">
        <h2 id="historico-clinico">Histórico clínico</h2>
        <ul>
          {history.records.map((record) => (
            <li key={record.id}>
              <strong>{record.type}</strong> — {record.date}: {record.description}
              {record.veterinarian ? ` (${record.veterinarian})` : ''}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
