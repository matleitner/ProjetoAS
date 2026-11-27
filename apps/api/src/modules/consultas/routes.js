import { AuthError, verifyBearerToken } from '../../auth/jwt.js';
import { sendError } from '../../http.js';
import { corsHeaders } from '../animais/routes.js';
import { ForbiddenError, NotFoundError } from '../animais/service.js';
import {
  ConflictError,
  UnprocessableError,
  ValidationError,
  createConsulta,
  listConsultas,
} from './service.js';

const CONSULTAS_ROUTE = /^\/api\/v1\/consultas\/?$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new ValidationError('Payload demasiado grande.'));
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new ValidationError('Corpo JSON inválido.'));
      }
    });
    req.on('error', reject);
  });
}

export async function handleConsultasRoutes(req, res, url) {
  const headers = corsHeaders();
  if (!CONSULTAS_ROUTE.test(url.pathname)) {
    return false;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return true;
  }

  let tutorId;
  try {
    tutorId = verifyBearerToken(req.headers.authorization).tutorId;
  } catch (error) {
    const message = error instanceof AuthError ? error.message : 'Token JWT inválido.';
    sendError(res, 401, 'Unauthorized', message, undefined, headers);
    return true;
  }

  try {
    if (req.method === 'GET') {
      const filters = {};
      for (const key of ['animalId', 'veterinarioId']) {
        const value = url.searchParams.get(key);
        if (value && UUID_PATTERN.test(value)) {
          filters[key] = value;
        }
      }
      const payload = await listConsultas(tutorId, filters);
      res.writeHead(200, { ...headers, 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(payload));
      return true;
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const payload = await createConsulta(tutorId, body);
      res.writeHead(201, { ...headers, 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(payload));
      return true;
    }

    sendError(res, 404, 'Not Found', 'Endpoint não encontrado.', undefined, headers);
    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      sendError(res, 400, 'Bad Request', error.message, undefined, headers);
    } else if (error instanceof ForbiddenError) {
      sendError(res, 403, 'Forbidden', error.message, undefined, headers);
    } else if (error instanceof NotFoundError) {
      sendError(res, 404, 'Not Found', error.message, undefined, headers);
    } else if (error instanceof ConflictError) {
      sendError(res, 409, 'Conflict', error.message, error.details, headers);
    } else if (error instanceof UnprocessableError) {
      sendError(res, 422, 'Unprocessable Entity', error.message, undefined, headers);
    } else {
      console.error('Erro ao processar consultas:', error);
      sendError(res, 500, 'Internal Server Error', 'Erro interno do servidor.', undefined, headers);
    }
    return true;
  }
}
