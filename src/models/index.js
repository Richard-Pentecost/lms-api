const Sequelize = require('sequelize');
const UserModel = require('./user');
const FarmModel = require('./farm');

const { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_PORT } = process.env;

const setupDatabase = () => {
  const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
  });
  
  const User = UserModel(connection, Sequelize);

  connection.sync({ alter: true });
  return {
    User,
    Farm,
  };
};

module.exports = setupDatabase();

