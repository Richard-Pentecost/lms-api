'use strict';

module.exports = (sequelize, DataTypes) => {
  const Farm = sequelize.define(
    'Farm',
    {
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
    },
    {
      defaultScope: { attributes: { exclude: ['id'] } },
      createdAt: false,
      updatedAt: false,
    },
  );

  Farm.associate = function (models) {
    Farm.hasMany(models.Data, {
      foreignKey: 'farmFk',
      as: 'data',
    })
  };

  Farm.fetchFarms = function () {
    return this.findAll();
  };
  
  return Farm;
};