import { spawn, spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import { ANIMAL_ID, API_URL, WEB_URL, makeToken } from './fixtures.js';

const PID_FILE = '/tmp/opencode/miau-e2e-pids.json';

async function waitFor(url, options = {}, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return;
      lastError = new Error(`HTTP ${response.status} em ${url}`);
    } catch (error) {
      lastError = error;
    }

    await delay(250);
  }

  throw new Error(`Serviço não ficou pronto: ${url}. ${lastError?.message ?? ''}`);
}

function stopProcessGroups(pids) {
  for (const pid of pids) {
    try {
      process.kill(-pid, 'SIGTERM');
    } catch {
      // O processo já terminou.
    }
  }
}

export default async function globalSetup() {
  const reset = spawnSync('npm', ['run', 'db:reset'], { stdio: 'inherit' });
  if (reset.status !== 0) {
    throw new Error('Falha ao aplicar o seed determinístico antes dos testes E2E.');
  }

  const api = spawn('npm', ['run', 'dev:api'], { stdio: 'ignore', detached: true });
  const web = spawn('npm', ['run', 'dev:web'], { stdio: 'ignore', detached: true });
  const pids = [api.pid, web.pid];

  writeFileSync(PID_FILE, JSON.stringify(pids));

  try {
    const token = makeToken();
    await waitFor(`${API_URL}/api/v1/animais/${ANIMAL_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await waitFor(WEB_URL);
  } catch (error) {
    stopProcessGroups(pids);
    throw error;
  }
}
