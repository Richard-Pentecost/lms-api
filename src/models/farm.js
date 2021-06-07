module.exports = (connection, DataTypes) => {
  const schema = {
    farmName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Farm name must be given.'}
      },
    },
    postcode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Postcode must be given.'}
      },
    },
    contactName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Contact name must be given.'}
      },
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Contact number must be given.'}
      },
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
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