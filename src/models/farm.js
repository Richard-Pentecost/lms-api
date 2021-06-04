module.exports = (connection, DataTypes) => {
  const schema = {
    farmName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deliveryMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    accessCodes: DataTypes.STRING,
    comments: DataTypes.STRING,
  }

  const FarmModel = connection.define('Farm', schema);
  return FarmModel;
};