'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint(
      'Data',
      {  
        fields: ['farmFk'],
        type: 'foreign key',
        name: 'Data_farmFk_fkey',
        references: {
          table: 'Farms',
          field: 'uuid',
        },
        onDelete: 'CASCADE',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Data', 'Data_farmFk_fkey');
  }
};
