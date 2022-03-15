'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'Data',
      'kgActual',
      {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'Data',
      'kgActual',
      {
        type: Sequelize.DECIMAL,
        allowNull: false,
        validate: {
          notNull: { msg: 'The kg actual must be given'},
          notEmpty: { msg: 'The kg actual must be given' },
          min: { args: [0], msg: 'The kg actual cannot be a negative number' },
        },
      },
    );
  },
};
