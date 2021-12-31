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
        type: Sequelize.DECIMAL,
      },
      meterReading: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      waterUsage: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      averageWaterIntake: {
        type: Sequelize.DECIMAL,
      },
      pumpDial: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      floatBeforeDelivery: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      kgActual: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      targetFeedRate: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      actualFeedRate: {
        type: Sequelize.DECIMAL,
      },
      floatAfterDelivery: {
        allowNull: false,
        type: Sequelize.DECIMAL,
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