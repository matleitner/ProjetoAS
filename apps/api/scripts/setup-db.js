import { existsSync } from 'node:fs';
import mysql from 'mysql2';
import mysqlPromise from 'mysql2/promise';
import { config } from '../src/config.js';

const localSocket = '/tmp/opencode/mysql.sock';
const rootUser = process.env.MYSQL_ROOT_USER ?? 'root';
const rootPassword = process.env.MYSQL_ROOT_PASSWORD ?? '';

const adminConfig = existsSync(localSocket)
  ? {
      socketPath: localSocket,
      user: rootUser,
      password: rootPassword,
      multipleStatements: true,
    }
  : {
      host: process.env.MYSQL_ADMIN_HOST ?? config.db.host,
      port: config.db.port,
      user: rootUser,
      password: rootPassword,
      multipleStatements: true,
    };

const connection = await mysqlPromise.createConnection(adminConfig);
const database = mysql.escapeId(config.db.database);
const user = mysql.escape(config.db.user);
const password = mysql.escape(config.db.password);
const userHost = mysql.escape('%');

await connection.query(`CREATE DATABASE IF NOT EXISTS ${database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
await connection.query(`CREATE USER IF NOT EXISTS ${user}@${userHost} IDENTIFIED BY ${password}`);
await connection.query(`GRANT ALL PRIVILEGES ON ${database}.* TO ${user}@${userHost}`);
await connection.query('FLUSH PRIVILEGES');
await connection.end();

console.log(`Base de dados ${config.db.database} e utilizador ${config.db.user} prontos (região: ${config.dataRegion}).`);
