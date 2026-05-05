// backend/migrations/20260504120000-add-background-color-to-entry.js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Entries', 'backgroundColor', {
      type: Sequelize.STRING,
      defaultValue: '#FFE082',
      allowNull: false
    });
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.removeColumn('Entries', 'backgroundColor');
  }
};
