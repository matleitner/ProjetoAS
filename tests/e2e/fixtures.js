import jwt from 'jsonwebtoken';

export const TUTOR_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
export const OTHER_TUTOR_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
export const ANIMAL_ID = '11111111-1111-4111-8111-111111111111';
export const JWT_SECRET = process.env.JWT_SECRET ?? 'miau-local-dev-secret';
export const API_URL = process.env.API_BASE_URL ?? 'http://127.0.0.1:4000';
export const WEB_URL = process.env.WEB_BASE_URL ?? 'http://127.0.0.1:3000';

export function makeToken(tutorId = TUTOR_ID) {
  return jwt.sign({ sub: tutorId, role: 'TUTOR' }, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
}
