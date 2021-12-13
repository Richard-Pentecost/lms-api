'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Farms', {
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
      farmName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      postcode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contactName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contactNumber: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isActive: {
        defaultValue: true,
        type: Sequelize.BOOLEAN
      },
      accessCodes: {
        type: Sequelize.TEXT
      },
      comments: {
        type: Sequelize.TEXT
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Farms');
  }
};