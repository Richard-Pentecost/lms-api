'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Data', {
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
      farmFk: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      noOfCows: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      product: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      meterReading: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      waterUsage: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      averageWaterIntake: {
        type: Sequelize.INTEGER,
      },
      pumpDial: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      floatBeforeDelivery: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      kgActual: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      targetFeedRate: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      actualFeedRate: {
        type: Sequelize.INTEGER,
      },
      floatAfterDelivery: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      comments: {
        type: Sequelize.TEXT,
      },
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Data');
  }
};