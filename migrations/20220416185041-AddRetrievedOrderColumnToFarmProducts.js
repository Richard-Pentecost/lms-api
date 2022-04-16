'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'FarmProducts',
      'retrievedOrder',
      {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('FarmProducts', 'retrievedOrder');
  }
};
