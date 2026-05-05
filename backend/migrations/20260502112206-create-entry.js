// backend/migrations/20260502112206-create-entry.js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    await queryInterface.createTable('Entries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: _Sequelize.INTEGER
      },
      body: {
        type: _Sequelize.TEXT
      },
      tags: {
        type: _Sequelize.STRING
      },
      backgroundColor: {
        type: _Sequelize.STRING,
        defaultValue: '#FFE082'
      },
      createdAt: {
        allowNull: false,
        type: _Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: _Sequelize.DATE
      }
    });
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('Entries');
  }
};
