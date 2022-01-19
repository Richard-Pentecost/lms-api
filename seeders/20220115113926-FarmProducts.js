'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'FarmProducts',
      [
        { farmId: 1, productId: 1 },
        { farmId: 1, productId: 2 },
        { farmId: 1, productId: 3 },
        { farmId: 2, productId: 1 },
        { farmId: 2, productId: 2 },
        { farmId: 2, productId: 3 },
        { farmId: 3, productId: 1 },
        { farmId: 3, productId: 2 },
        { farmId: 3, productId: 3 },
        { farmId: 4, productId: 1 },
        { farmId: 4, productId: 2 },
        { farmId: 4, productId: 3 },
      ]
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('FarmProducts', null, {});
  }
};
