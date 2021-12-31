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
      },
      specificGravity: {
        allowNull: false,
        type: DataTypes.DECIMAL,
      }
    },
    {
      defaultScope: { attributes: { exclude: ['id'] } },
      timestamps: false,
    },
  );

  return Product;
};