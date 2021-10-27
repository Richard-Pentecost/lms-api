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
    status: {
      type: DataTypes.ENUM,
      defaultValue: 'enabled',
      values: ['enabled', 'disabled']
    },
    accessCodes: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    comments: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  }

  const FarmModel = connection.define('Farm', schema);
  return FarmModel;
};