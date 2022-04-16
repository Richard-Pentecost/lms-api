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
        type: DataTypes.INTEGER,
      },
      farmId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      retrievedOrder: {
        allowNull: true,
        type: DataTypes.INTEGER,
      }
    },
    {
      timestamps: false,
    },
  );

  FarmProduct.fetchAssociationsByFarmId = function (id) {
    return this.findAll({ where: { farmId: id } });
  };

  return FarmProduct;
};