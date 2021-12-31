'use strict';

module.exports = (sequelize, DataTypes) => {
  const Farm = sequelize.define(
    'Farm',
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
      farmName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Farm name must be given' },
          notEmpty: { msg: 'Farm name must be given' }
        },
      },
      postcode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Postcode must be given' },
          notEmpty: { msg: 'Postcode must be given' },
        },
      },
      contactName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Contact name must be given' },
          notEmpty: { msg: 'Contact name must be given' },
        },
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Contact number must be given' },
          notEmpty: { msg: 'Contact number must be given' },
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      accessCodes: {
        type: DataTypes.TEXT,
      },
      comments: {
        type: DataTypes.TEXT,
      },
      regionFk: {
        type: DataTypes.UUID,
      }
    },
    {
      defaultScope: { attributes: { exclude: ['id'] } },
      timestamps: false,
    },
  );

  Farm.associate = function (models) {
    Farm.belongsTo(models.Region, {
      as: 'region',
      foreignKey: 'regionFk',
      targetKey: 'uuid',
    });
    // Farm.hasMany(models.Data, {
    //   foreignKey: 'farmFk',
    //   targetKey: 'uuid',
    //   as: 'data',
    // });
    // Farm.hasOne(models.Region, {
    //   foreignKey: 'regionFk',
    //   targetKey: 'uuid',
      // as: 'region',
    // })
  };

  Farm.fetchFarms = function (isActive = false) {
    const param = isActive ? { isActive: true } : {};
    return this.findAll({ 
      where: param,
      include: [{
        model: sequelize.models.Region,
        attributes: ['regionName'],
        as: 'region',
      }]
    });
  };
  
  return Farm;
};