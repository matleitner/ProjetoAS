import { readFileSync } from 'node:fs';
import mysql from 'mysql2/promise';
import { config } from '../src/config.js';

const schema = readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8');
const seed = readFileSync(new URL('../db/seed.sql', import.meta.url), 'utf8');

const connection = await mysql.createConnection({
  ...config.db,
  multipleStatements: true,
});

await connection.query(schema);
await connection.query(seed);
await connection.end();

console.log('Schema e seed determinístico aplicados.');
