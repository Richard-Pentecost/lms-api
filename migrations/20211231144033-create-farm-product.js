'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FarmProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      farmId: {
        allowNull: false,
        type: Sequelize.UUID
      },
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FarmProducts');
  }
};