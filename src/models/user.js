const bcrypt = require('bcrypt');

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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Name must be given' },
        notEmpty: { msg: 'Name must be given' },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: { msg: 'Email must be given' },
        isEmail: { msg: 'Must be a valid email address' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: 8,
          msg: 'Password must be at least 8 characters long',
        },
        notNull: { msg: 'Password must be given' },
      },
    },
    permissionLevel: {
      type: DataTypes.ENUM,
      defaultValue: 'user',
      values: ['admin', 'user'],
    },
  };

  const UserModel = connection.define('User', schema);

  const generateHash = async (user) => {
    const salt = await bcrypt.genSaltSync(10);
    user.password = await bcrypt.hash(user.password, salt);
  };

  UserModel.beforeCreate(generateHash);

  UserModel.prototype.validatePassword = async function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  UserModel.findByUuid = async function (uuid) {
    return await this.findOne({
      where: { uuid },
      attributes: ['uuid', 'name', 'email', 'permissionLevel'],
    });
  };

  return UserModel;
};
