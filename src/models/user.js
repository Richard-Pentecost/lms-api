'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
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
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      defaultScope: { attributes: { exclude: ['password'] } },
      scopes: {
        withPassword: {
          attributes: { include: ['password'] },
        },
      },
      createdAt: false,
      updatedAt: false,
    },
  );

  const generateHash = async user => {
    const salt = await bcrypt.genSaltSync(10);
    user.password = await bcrypt.hash(user.password, salt);
  };

  User.beforeCreate(generateHash);

  User.prototype.validatePassword = async function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.findByUuid = async function (uuid) {
    return await this.findOne({
      where: { uuid },
      attributes: ['uuid', 'name', 'email', 'isAdmin'],
    });
  };

  User.updatePassword = async function (uuid, data) {
    await generateHash(data);
    return await this.update(data, { where: { uuid } });
  };

  User.fetchUsers = function () {
    return this.findAll({
      order: [['name', 'ASC']],
    });
  }

  return User;
};
