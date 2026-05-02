// backend/models/entry.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Entry = sequelize.define('Entry', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: true },
    body: { type: DataTypes.TEXT, allowNull: false },
    tags: { type: DataTypes.STRING, allowNull: true },
}, {
    tableName: 'entries',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Entry;