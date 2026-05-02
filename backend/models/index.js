// backend/models/index.js
const sequelize = require('../db'); // ugyanaz az instance, amit index.js is használ
const Sequelize = require('sequelize');

// importáld a model fájlt (ami a te projektedben már a sequelize-t használja)
const Entry = require('./entry');

module.exports = {
  sequelize,
  Sequelize,
  Entry
};
