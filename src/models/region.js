module.exports = (connection, DataTypes) => {
  const schema = {
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
    regionName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'The region must be given' },
        notEmpty: { msg: 'The region must be given' },
      }
    },
  };

  const RegionModel = connection.define(
    'Region', 
    schema,
    {
      defaultScope: { attributes: { exclude: ['id'] } },
      createdAt: false,
      updatedAt: false,
    },
  );

  RegionModel.associate = function (models) {
    RegionModel.belongsTo(models.Farm, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  }

  return RegionModel;
};
