// backend/db.js
const { Sequelize } = require('sequelize');

const connectionString = process.env.DATABASE_URL ||
  (process.env.NODE_ENV === 'test'
    ? (process.env.DB_NAME_TEST
        ? `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME_TEST}`
        : '')
    : (process.env.DB_NAME
        ? `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME}`
        : ''));

if (!connectionString) {
  console.error('No database connection string provided. Set DATABASE_URL or DB_* env vars.');
  process.exit(1);
}

const sequelize = new Sequelize(connectionString, { dialect: 'postgres', logging: false });

module.exports = sequelize;
