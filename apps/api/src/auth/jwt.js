import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
  }
}

export function signToken(tutorId, options = {}) {
  return jwt.sign(
    { sub: tutorId, role: 'TUTOR' },
    config.jwtSecret,
    { algorithm: 'HS256', expiresIn: '1h', ...options },
  );
}

export function verifyBearerToken(authorizationHeader) {
  if (typeof authorizationHeader !== 'string' || !authorizationHeader.startsWith('Bearer ')) {
    throw new AuthError('Token JWT em falta ou inválido.');
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();
  if (!token) {
    throw new AuthError('Token JWT em falta ou inválido.');
  }

  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
  } catch {
    throw new AuthError('Token JWT inválido ou expirado.');
  }

  if (!payload || typeof payload.sub !== 'string' || !payload.sub) {
    throw new AuthError('Token JWT sem identificador de tutor.');
  }

  return { tutorId: payload.sub, role: payload.role };
}
