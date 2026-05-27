'use strict';
const { randomUUID: uuidv4 } = require('crypto');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          uuid: uuidv4(),
          name: 'Admin',
          email: 'admin@email.com',
          password: await bcrypt.hash('password', await bcrypt.genSaltSync(10)),
          isAdmin: true,
        },
        {
          uuid: uuidv4(),
          name: 'User',
          email: 'user@email.com',
          password: await bcrypt.hash('password', await bcrypt.genSaltSync(10)),
          isAdmin: false,
        },
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {}); 
  }
};
