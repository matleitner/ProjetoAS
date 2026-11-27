import { useState } from 'react';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://127.0.0.1:4000';
const ANIMAL_ID = '11111111-1111-4111-8111-111111111111';
const VETERINARIOS = {
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc': 'Dra. Marta',
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd': 'Dr. Pedro',
};

function readCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  const entry = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
}

async function fetchAlternatives(token) {
  const response = await fetch(`${API_BASE_URL}/api/v1/consultas?animalId=${ANIMAL_ID}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!response.ok) return null;
  const consultas = await response.json();
  return consultas.filter((item) => item.animalId === null);
}

export async function getServerSideProps({ req }) {
  const token = readCookie(req.headers.cookie, 'miau_token');
  if (!token) {
    return { props: { slots: [], error: 'Sessão não autenticada: é necessário o token JWT de tutor.' } };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/consultas?animalId=${ANIMAL_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`A API devolveu ${response.status} para /api/v1/consultas.`);
    }
    const consultas = await response.json();
    return { props: { slots: consultas.filter((item) => item.animalId === null), error: null } };
  } catch (error) {
    return { props: { slots: [], error: error.message } };
  }
}

export default function ConsultasPage({ slots, error }) {
  const [availableSlots, setAvailableSlots] = useState(slots);
  const [selected, setSelected] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [conflict, setConflict] = useState(null);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);
    setConflict(null);

    if (!selected) {
      setMessage('Selecione um horário disponível.');
      return;
    }

    const token = readCookie(document.cookie, 'miau_token');
    if (!token) {
      setMessage('Sessão não autenticada.');
      return;
    }

    const [veterinarioId, dataHora] = selected.split('|');
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/consultas`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animalId: ANIMAL_ID,
          veterinarioId,
          dataHora,
          motivo: 'Consulta de rotina',
        }),
      });
      const body = await response.json();

      if (response.status === 409) {
        setConflict(body.message ?? 'Conflito de horário.');
        setSelected('');
        const alternatives = await fetchAlternatives(token);
        if (alternatives) setAvailableSlots(alternatives);
        return;
      }

      if (!response.ok) {
        setMessage(body.message ?? `A API devolveu ${response.status}.`);
        return;
      }

      setConfirmation(body);
    } catch (submitError) {
      setMessage(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <h1>MIAU — Marcar consulta</h1>

      {error && <p role="alert">{error}</p>}

      {!error && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="animal">Animal</label>
          <select id="animal" value={ANIMAL_ID} onChange={() => {}}>
            <option value={ANIMAL_ID}>Luna</option>
          </select>

          <label htmlFor="slot">Horário disponível</label>
          <select
            id="slot"
            value={selected}
            onChange={(event) => {
              setSelected(event.target.value);
              setConflict(null);
            }}
          >
            <option value="">Selecione um horário</option>
            {availableSlots.map((slot) => (
              <option
                key={`${slot.veterinarioId}|${slot.dataHora}`}
                value={`${slot.veterinarioId}|${slot.dataHora}`}
              >
                {VETERINARIOS[slot.veterinarioId] ?? slot.veterinarioId} — {slot.dataHora}
              </option>
            ))}
          </select>

          <button type="submit" disabled={submitting}>Marcar consulta</button>
        </form>
      )}

      {message && <p role="alert">{message}</p>}

      {conflict && (
        <div data-testid="conflito-horario">
          <p role="alert">{conflict}</p>
          <p>Escolha um dos horários alternativos:</p>
          <ul>
            {availableSlots.map((slot) => (
              <li key={`${slot.veterinarioId}|${slot.dataHora}`}>
                {VETERINARIOS[slot.veterinarioId] ?? slot.veterinarioId} — {slot.dataHora}
              </li>
            ))}
          </ul>
        </div>
      )}

      {confirmation && (
        <p role="status" data-testid="confirmacao-consulta">
          Consulta agendada com sucesso: {confirmation.dataHora} (consulta {confirmation.consultaId}).
        </p>
      )}
    </main>
  );
}
