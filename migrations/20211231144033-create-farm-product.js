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
        type: Sequelize.UUID,
        references: {
          model: 'Products',
          key: 'uuid',
        },
        onDelete: 'CASCADE',
      },
      farmId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Farms',
          key: 'uuid',
        },
        onDelete: 'CASCADE',
      },
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FarmProducts');
  }
};