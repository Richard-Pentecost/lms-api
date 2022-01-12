'use strict';

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
      timestamps: false,
    },
  );

  Product.associate = function (models) {
    Product.belongsToMany(models.Farm, {
      through: 'FarmProducts',
      as: 'farms',
      foreignKey: 'productId',
      otherKey: 'farmId',
    });
  };

  Product.fetchProducts = function () {
    return this.findAll({
      attributes: ['uuid', 'productName', 'specificGravity'],
    });
  };

  Product.fetchProductByName = function (productName) {
    return this.findOne({
      where: { productName },
      attributes: ['specificGravity'],
    });
  };

  return Product;
};