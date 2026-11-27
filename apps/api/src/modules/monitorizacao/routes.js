import { AuthError, verifyBearerToken } from '../../auth/jwt.js';
import { sendError } from '../../http.js';
import { corsHeaders } from '../animais/routes.js';
import { ForbiddenError, NotFoundError } from '../animais/service.js';
import { getAlertasSerie, getTelemetriaSerie } from './service.js';

const TELEMETRIA_ROUTE = /^\/api\/v1\/animais\/([^/]+)\/telemetria\/?$/;
const ALERTAS_ROUTE = /^\/api\/v1\/animais\/([^/]+)\/alertas\/?$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeDateTime(value) {
  if (typeof value !== 'string') return null;
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return null;
  return new Date(timestamp).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function readJanela(url) {
  const janela = {};

  const desde = normalizeDateTime(url.searchParams.get('desde'));
  if (desde) janela.desde = desde;

  const ate = normalizeDateTime(url.searchParams.get('ate'));
  if (ate) janela.ate = ate;

  const limiteParam = url.searchParams.get('limite');
  const parsedLimite = limiteParam === null ? NaN : Number.parseInt(limiteParam, 10);
  janela.limite = Number.isInteger(parsedLimite)
    ? Math.min(1000, Math.max(1, parsedLimite))
    : 100;

  return janela;
}

export async function handleMonitorizacaoRoutes(req, res, url) {
  const headers = corsHeaders();
  const telemetriaMatch = TELEMETRIA_ROUTE.exec(url.pathname);
  const alertasMatch = ALERTAS_ROUTE.exec(url.pathname);
  const match = telemetriaMatch ?? alertasMatch;

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

  const context = { role: auth.role, veterinarioId: auth.tutorId, animalId };

  try {
    const payload = telemetriaMatch
      ? await getTelemetriaSerie({ ...context, janela: readJanela(url) })
      : await getAlertasSerie(context);

    res.writeHead(200, { ...headers, 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
    return true;
  } catch (error) {
    if (error instanceof ForbiddenError) {
      sendError(res, 403, 'Forbidden', error.message, undefined, headers);
    } else if (error instanceof NotFoundError) {
      sendError(res, 404, 'Not Found', error.message, undefined, headers);
    } else {
      console.error('Erro ao consultar monitorização:', error);
      sendError(res, 500, 'Internal Server Error', 'Erro interno do servidor.', undefined, headers);
    }

    return true;
  }
}
