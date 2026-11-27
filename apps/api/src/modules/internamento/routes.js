import { AuthError, verifyBearerToken } from '../../auth/jwt.js';
import { sendError } from '../../http.js';
import { corsHeaders } from '../animais/routes.js';
import { ForbiddenError, NotFoundError } from '../animais/service.js';
import { getInternamentoForTutor } from './service.js';

const INTERNAMENTO_ROUTE = /^\/api\/v1\/animais\/([^/]+)\/internamento\/?$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function handleInternamentoRoutes(req, res, url) {
  const headers = corsHeaders();
  const match = INTERNAMENTO_ROUTE.exec(url.pathname);
  if (!match) {
    return false;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return true;
  }

  if (req.method !== 'GET') {
    sendError(res, 404, 'Not Found', 'Endpoint não encontrado.', undefined, headers);
    return true;
  }

  let auth;
  try {
    auth = verifyBearerToken(req.headers.authorization);
  } catch (error) {
    const message = error instanceof AuthError ? error.message : 'Token JWT inválido.';
    sendError(res, 401, 'Unauthorized', message, undefined, headers);
    return true;
  }

  let animalId;
  try {
    animalId = decodeURIComponent(match[1]);
  } catch {
    animalId = '';
  }

  if (!UUID_PATTERN.test(animalId)) {
    sendError(res, 404, 'Not Found', 'Animal não encontrado.', undefined, headers);
    return true;
  }

  try {
    const payload = await getInternamentoForTutor({
      role: auth.role,
      tutorId: auth.tutorId,
      animalId,
    });

    res.writeHead(200, { ...headers, 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
    return true;
  } catch (error) {
    if (error instanceof ForbiddenError) {
      sendError(res, 403, 'Forbidden', error.message, undefined, headers);
    } else if (error instanceof NotFoundError) {
      sendError(res, 404, 'Not Found', error.message, undefined, headers);
    } else {
      console.error('Erro ao consultar internamento:', error);
      sendError(res, 500, 'Internal Server Error', 'Erro interno do servidor.', undefined, headers);
    }

    return true;
  }
}
