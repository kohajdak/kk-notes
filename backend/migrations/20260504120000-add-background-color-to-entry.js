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
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Entries', 'backgroundColor');
  }
};
