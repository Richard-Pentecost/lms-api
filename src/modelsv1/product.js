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
    product: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'A product name must be given' },
        notEmpty: { msg: 'A product name must be given' },
      }
    },
    specificGravityDrum: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: { args: [0], msg: 'The specific gravity cannot be a negative numer' },
      }
    },
    specificGravityTank: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: { args: [0], msg: 'The specific gravity value cannot be a negative numer' },
      }
    },
    specificGravityIBC: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: { args: [0], msg: 'The specific gravity value cannot be a negative numer' },
      }
    }
  };

  const ProductModel = connection.define(
    'Product',
    schema,
    {
      defaultScope: { attributes: { exclude: ['id'] } },
    }
  );

  ProductModel.associate = function (models) {
    ProductModel.belongsTo(models.Farm, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  }

  return ProductModel;
}