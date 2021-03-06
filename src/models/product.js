'use strict';
const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        unique: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      productName: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: { msg: 'A product must be given' },
          notEmpty: { msg: 'A product must be given' },
        }
      },
      specificGravity: {
        allowNull: false,
        type: DataTypes.DECIMAL,
        validate: {
          notNull: { msg: 'A specific gravity must be given' },
          notEmpty: { msg: 'A specific gravity must be given' },
          min: { args: [0], msg: 'The target feed rate cannot be a negative number' },
        }
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

  Product.associate = function (models) {
    Product.belongsToMany(models.Farm, {
      through: models.FarmProduct,
      as: 'farms',
      foreignKey: 'productId',
      otherKey: 'farmId',
    });
  };

  Product.fetchProducts = function () {
    return this.findAll({
      order: [['productName', 'ASC']],
      attributes: ['uuid', 'productName', 'specificGravity'],
    });
  };

  Product.fetchProductByName = function (productName) {
    return this.findOne({
      where: { productName },
      attributes: ['specificGravity'],
    });
  };

  Product.fetchProductByUuid = function (uuid) {
    return this.findOne({ where: { uuid } });
  };

  Product.fetchProductsByUuid = function (uuids) {
    return this.findAll({
      where: {
        uuid: {
          [Op.in]: uuids,
        }
      }
    })
  }

  return Product;
};