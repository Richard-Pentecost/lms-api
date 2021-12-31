'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Farms',
      'regionFk',
      {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Regions',
          key: 'uuid'
        },
        onDelete: 'SET NULL'
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Farms', 'regionFk');
  }
};
