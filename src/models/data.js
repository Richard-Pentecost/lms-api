module.exports = (connection, DataTypes) => {
  const schema = {
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
        notFutureDate(value) {
          if (value > new Date()) {
            throw new Error('Cannot input a future date');
          }
        }
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
    product: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'The product must be given' },
        notEmpty: { msg: 'The product must be given' },
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'The product quantity must be given' },
        notEmpty: { msg: 'The product quantity must be given' },
        min: { args: [0], msg: 'The product quantity cannot be a negative number' },
      }
    },
    meterReading: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'The meter reading must be given' },
        notEmpty: { msg: 'The meter reading must be given' },
        min: { args: [0], msg: 'The meter reading cannot be a negative number' },
      }
    },
    waterUsage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'The water usage must be given' },
        notEmpty: { msg: 'The water usage must be given' },
        min: { args: [0], msg: 'The water usage cannot be a negative number' },
      }
    },
    averageWaterIntake: {
      type: DataTypes.INTEGER,
    },
    pumpDial: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'The pump dial must be given' },
        notEmpty: { msg: 'The pump dial must be given' },
        min: { args: [0], msg: 'The pump dial cannot be a negative number' },
      }
    },
    floatBeforeDelivery: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'The float before delivery must be given' },
        notEmpty: { msg: 'The float before delivery must be given' },
        min: { args: [0], msg: 'The float before delivery cannot be a negative number' },
      }
    },
    kgActual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'The kg actual must be given' },
        notEmpty: { msg: 'The kg actual must be given' },
        min: { args: [0], msg: 'The kg actual cannot be a negative number' },
      }
    },
    targetFeedRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'The target feed rate must be given' },
        notEmpty: { msg: 'The target feed rate must be given' },
        min: { args: [0], msg: 'The target feed rate cannot be a negative number' },
      }
    },
    actualFeedRate: {
      type: DataTypes.INTEGER,
    },
    floatAfterDelivery: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'The float before delivery must be given' },
        notEmpty: { msg: 'The float before delivery must be given' },
        min: { args: [0], msg: 'The float after delivery cannot be a negative number' },
      }
    },
    comments: {
      type: DataTypes.TEXT,
    },
  }

  const DataModel = connection.define('Data', schema);

  DataModel.associate = function (models) {
    DataModel.belongsTo(models.Farm, {
      foreignKey: 'farmFk',
      targetKey: 'id',
    });
  };

  return DataModel;
}