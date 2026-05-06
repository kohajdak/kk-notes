// backend/config/config.js
require('dotenv').config();
const buildUrl = ({ host, port, user, pass, name }) =>
  `postgres://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${name}`;

const getBase = () => ({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || '5432',
  user: process.env.DB_USER || 'app',
  pass: process.env.DB_PASSWORD || '',
  name: process.env.DB_NAME || 'notes'
});

const getDatabaseUrl = (env = 'development') => {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  if (env === 'test') {
    const cfg = {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || '5432',
      user: process.env.DB_USER || 'app',
      pass: process.env.DB_PASSWORD || '',
      name: process.env.DB_NAME_TEST || process.env.DB_NAME || 'notes_test'
    };
    return buildUrl(cfg);
  }

  const cfg = getBase();
  if (!cfg.pass) {
    console.warn('Warning: DB password is empty. Set DB_PASSWORD or DATABASE_URL in environment.');
  }
  return buildUrl(cfg);
};

module.exports = {
  development: { url: getDatabaseUrl('development'), dialect: 'postgres' },
  test: { url: getDatabaseUrl('test'), dialect: 'postgres' },
  production: { url: process.env.DATABASE_URL, dialect: 'postgres' }
};
