// backend/db.js
const { Sequelize } = require('sequelize');

const connectionString = process.env.DATABASE_URL
  || (process.env.NODE_ENV === 'test'
      ? 'postgres://app:secret@127.0.0.1:5432/notes_test'
      : 'postgres://app:secret@127.0.0.1:5432/notes');

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;
