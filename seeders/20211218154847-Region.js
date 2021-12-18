'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Regions',
      [
        { 
          uuid: uuidv4(),
          regionName: 'South West'
        },
        { 
          uuid: uuidv4(),
          regionName: 'North West' 
        },
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Regions', null, {});
  },
};
