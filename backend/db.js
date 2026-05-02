// backend/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://app:secret@localhost:5432/diary', {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;