'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        allowNull: false,
        unique: true,
        type: Sequelize.UUID
      },
      productName: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      specificGravity: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  }
};