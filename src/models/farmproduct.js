'use strict';
module.exports = (sequelize, DataTypes) => {
  const FarmProduct = sequelize.define(
    'FarmProduct',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      productId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      farmId: {
        allowNull: false,
        type: DataTypes.UUID,
      }
    },
    {
      timestamps: false,
    },
  );

  return FarmProduct;
};