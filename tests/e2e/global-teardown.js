import { existsSync, readFileSync, unlinkSync } from 'node:fs';

const PID_FILE = '/tmp/opencode/miau-e2e-pids.json';

export default async function globalTeardown() {
  if (!existsSync(PID_FILE)) return;

  const pids = JSON.parse(readFileSync(PID_FILE, 'utf8'));
  for (const pid of pids) {
    try {
      process.kill(-pid, 'SIGTERM');
    } catch {
      // O processo já terminou.
    }
  }

  unlinkSync(PID_FILE);
}
