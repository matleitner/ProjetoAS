import { AuthError, verifyBearerToken } from '../../auth/jwt.js';
import { config } from '../../config.js';
import { sendError } from '../../http.js';
import {
  ForbiddenError,
  NotFoundError,
  getAnimalDetailsForTutor,
  getClinicalHistoryForTutor,
} from './service.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ANIMAL_ROUTE = /^\/api\/v1\/animais\/([^/]+)(?:\/(historico-clinico))?\/?$/;

export function corsHeaders() {
  return {
    'access-control-allow-origin': config.webOrigin,
    'access-control-allow-headers': 'authorization, content-type',
    'access-control-allow-methods': 'GET, OPTIONS',
  };
}

export async function handleAnimaisRoutes(req, res, pathname) {
  const headers = corsHeaders();

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return true;
  }

  const match = ANIMAL_ROUTE.exec(pathname);
  if (!match) {
    return false;
  }

  if (req.method !== 'GET') {
    sendError(res, 404, 'Not Found', 'Endpoint não encontrado.', undefined, headers);
    return true;
  }

  let tutorId;
  try {
    ({ tutorId } = verifyBearerToken(req.headers.authorization));
  } catch (error) {
    const message = error instanceof AuthError ? error.message : 'Token JWT inválido.';
    sendError(res, 401, 'Unauthorized', message, undefined, headers);
    return true;
  }

  let animalId;
  try {
    animalId = decodeURIComponent(match[1]);
  } catch {
    sendError(res, 404, 'Not Found', 'Animal não encontrado.', undefined, headers);
    return true;
  }

  if (!UUID_PATTERN.test(animalId)) {
    sendError(res, 404, 'Not Found', 'Animal não encontrado.', undefined, headers);
    return true;
  }

  try {
    const payload = match[2] === 'historico-clinico'
      ? await getClinicalHistoryForTutor(tutorId, animalId)
      : await getAnimalDetailsForTutor(tutorId, animalId);

    res.writeHead(200, { ...headers, 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
    return true;
  } catch (error) {
    if (error instanceof ForbiddenError) {
      sendError(res, 403, 'Forbidden', error.message, undefined, headers);
    } else if (error instanceof NotFoundError) {
      sendError(res, 404, 'Not Found', error.message, undefined, headers);
    } else {
      console.error('Erro ao consultar animais:', error);
      sendError(res, 500, 'Internal Server Error', 'Erro interno do servidor.', undefined, headers);
    }

    return true;
  }
}
