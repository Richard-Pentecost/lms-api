'use strict';
const { Op } = require('sequelize');

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
    Farm.hasMany(models.Data, {
      as: 'data',
      foreignKey: 'farmFk',
      sourceKey: 'uuid',
    });
  };

  Farm.fetchActiveFarms = function (searchString) {
    const search = searchString ?
      { 
        [Op.or]: [
          {
            farmName: { [Op.iLike]: `%${searchString}%` },
          },
          {
            contactName: { [Op.iLike]: `%${searchString}%` },
          },
          sequelize.where(sequelize.fn('REPLACE', sequelize.col('postcode'), ' ', ''), {
            [Op.iLike]: `%${searchString.replace(/\s+/g, '')}%` }
          )
        ]  
      } : {};
    return this.findAll({ 
      where: { 
        isActive: true,
        ...search, 
      },
      
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
          through: {
            model: sequelize.models.FarmProduct,
            attributes: ['retrievedOrder'],
            as: 'farmProducts',
          },
        },
        {
          model: sequelize.models.Data,
          attributes: ['date', 'deliveryDate', 'product'],
          as: 'data',
          separate: true,
          order: [['date', 'desc']],
        },
      ],
      order: [
        ['farmName', 'asc'],
        [sequelize.literal(`"products.farmProducts.retrievedOrder"`), 'asc']
      ],
      // logging: console.log,
    });
  };

  Farm.fetchAllFarms = function() {
    return this.findAll({
      order: [['farmName', 'asc']],
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