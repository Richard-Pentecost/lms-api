'use strict';

module.exports = (sequelize, DataTypes) => {
  const Region = sequelize.define(
    'Region',
    {
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
      createdAt: false,
      updatedAt: false,
    },
  );

  // Region.associate = function (models) {
  //   Region.belongsTo(models.Farm,
  //     foreignKey: 'regionFk',
  //      targetKey: 'uuid'
  //   )
  // };

  return Region;
};