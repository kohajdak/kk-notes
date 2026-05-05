// backend/migrations/20260504120000-add-background-color-to-entry.js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Entries');
    if (!table.backgroundColor) {
      await queryInterface.addColumn('Entries', 'backgroundColor', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '#FFE082'
      });
    }
  },
  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Entries');
    if (table.backgroundColor) {
      await queryInterface.removeColumn('Entries', 'backgroundColor');
    }
  }
};
