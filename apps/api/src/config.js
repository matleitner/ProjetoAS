const numberFromEnv = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

export const config = {
  apiPort: numberFromEnv('API_PORT', 4000),
  jwtSecret: process.env.JWT_SECRET ?? 'miau-local-dev-secret',
  webOrigin: process.env.WEB_ORIGIN ?? 'http://127.0.0.1:3000',
  dataRegion: process.env.MYSQL_REGION ?? 'eu',
  db: {
    host: process.env.MYSQL_HOST ?? '127.0.0.1',
    port: numberFromEnv('MYSQL_PORT', 3306),
    user: process.env.MYSQL_USER ?? 'miau',
    password: process.env.MYSQL_PASSWORD ?? 'miau',
    database: process.env.MYSQL_DATABASE ?? 'miau',
  },
};
