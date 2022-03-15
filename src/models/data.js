'use strict';

module.exports = (sequelize, DataTypes) => {
  const Data = sequelize.define(
    'Data',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      farmFk: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: 'The date must be given' },
          notEmpty: { msg: 'The date must be given' },
          notFutureDate (value) {
            if (value > new Date()) {
              throw new Error('Cannot input a future date');
            }
          }
        }
      },
      product: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'The product must be given' },
          notEmpty: { msg: 'The product must be given' },
        }
      },
      noOfCows: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'The number of cows must be given' },
          notEmpty: { msg: 'The number of cows must be given' },
        }
      },
      quantity: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: { msg: 'The product quantity must be given' },
          notEmpty: { msg: 'The product quantity must be given' },
          min: { args: [0], msg: 'The product quantity cannot be a negative number' },
        }
      },
      meterReading: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: { msg: 'The meter reading must be given' },
          notEmpty: { msg: 'The meter reading must be given' },
          min: { args: [0], msg: 'The meter reading cannot be a negative number' },
        }
      },
      waterUsage: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: { msg: 'The water usage must be given' },
          notEmpty: { msg: 'The water usage must be given' },
          min: { args: [0], msg: 'The water usage cannot be a negative number' },
        }
      },
      averageWaterIntake: {
        type: DataTypes.DECIMAL,
      },
      pumpDial: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: { msg: 'The pump dial must be given' },
          notEmpty: { msg: 'The pump dial must be given' },
          min: { args: [0], msg: 'The pump dial cannot be a negative number' },
        }
      },
      floatBeforeDelivery: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: { msg: 'The float before delivery must be given' },
          notEmpty: { msg: 'The float before delivery must be given' },
          min: { args: [0], msg: 'The float before delivery cannot be a negative number' },
        }
      },
      kgActual: {
        type: DataTypes.DECIMAL,
      },
      targetFeedRate: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: { msg: 'The target feed rate must be given' },
          notEmpty: { msg: 'The target feed rate must be given' },
          min: { args: [0], msg: 'The target feed rate cannot be a negative number' },
        }
      },
      actualFeedRate: {
        type: DataTypes.DECIMAL,
      },
      floatAfterDelivery: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: { msg: 'The float after delivery must be given' },
          notEmpty: { msg: 'The float after delivery must be given' },
          greaterThanBeforeFloat (value) {
            if (value < this.floatBeforeDelivery) throw new Error('The float after delivery cannot be less than the float before delivery');
          }
        }
      },
      comments: {
        type: DataTypes.TEXT,
      },
    },
    {
      defaultScope: { attributes: { exclude: ['id' ] } },
      createdAt: false,
      updatedAt: false,
    }
  )

  Data.associate = function (models) {
    Data.belongsTo(models.Farm, {
      foreignKey: 'farmFk',
      targetKey: 'uuid',
    });
  };

  Data.fetchPreviousDataForCalculations = function (uuid) {
    return this.findOne({
      where: { uuid },
      attributes: ['date', 'floatAfterDelivery', 'meterReading']
    });
  };

  return Data;
};