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
        notNull: { msg: 'Name must be given.'}
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: { msg: 'Must be a valid email address.' },
        notNull: { msg: 'Email must be given.'},
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: 8,
          msg: 'Password must be at least 8 characters long.',
        },
        notNull: { msg: 'Password must be given.' },
      },
    },
    permissionLevel: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    }
  };

  const UserModel = connection.define('User', schema);
  return UserModel;
};
