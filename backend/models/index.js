// backend/models/index.js (ellenőrzés)
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../db'); // vagy a te db.js exportja

const db = {};
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(name => {
  if (db[name].associate) db[name].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
