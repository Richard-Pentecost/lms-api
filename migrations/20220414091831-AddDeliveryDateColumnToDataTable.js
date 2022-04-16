'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Data',
      'deliveryDate',
      {
        type: Sequelize.DATE,
        allowNull: true,
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Data', 'deliveryDate');
  }
};
