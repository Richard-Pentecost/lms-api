'use strict';

module.exports = (sequelize, DataTypes) => {
  const Region = sequelize.define(
    'Region',
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
        type: DataTypes.UUID
      },
      regionName: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: { msg: 'The region must be given' },
          notEmpty: { msg: 'The region must be given' },
        }
      },
    },
    {
      defaultScope: { attributes: { exclude: ['id'] } },
      timestamps: false,
    },
  );

  Region.associate = function (models) {
    Region.hasMany(models.Farm, {
      as: 'farms',
      foreignKey: 'regionFk',
      targetKey: 'uuid',
    });
  }

  Region.fetchRegions = function () {
    return this.findAll({
      order: [['regionName', 'ASC']],
    });
  };

  return Region;
};