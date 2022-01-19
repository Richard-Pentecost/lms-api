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
      scopes: {
        withId: {
          attributes: { include: ['id'] },
        }
      },
      timestamps: false,
    },
  );

  Farm.associate = function (models) {
    Farm.belongsTo(models.Region, {
      as: 'region',
      foreignKey: 'regionFk',
      targetKey: 'uuid',
    });
    Farm.belongsToMany(models.Product, {
      through: models.FarmProduct,
      as: 'products',
      foreignKey: 'farmId',
      otherKey: 'productId',
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

  Farm.fetchActiveFarms = function () {
    return this.findAll({ 
      where: { isActive: true },
      include: [
        {
          model: sequelize.models.Region,
          attributes: ['regionName'],
          as: 'region',
        },
        {
          model: sequelize.models.Product,
          attributes: ['productName', 'uuid', 'specificGravity'],
          as: 'products',
        }
      ]
    });
  };

  Farm.fetchAllFarms = function() {
    return this.findAll({
      include: [
        {
          model: sequelize.models.Region,
          attributes: ['regionName'],
          as: 'region',
        },
      ]
    });
  }

  Farm.fetchFarmByUuid = function (uuid) {
    return this.findOne({ where: { uuid } });
  };
  
  return Farm;
};