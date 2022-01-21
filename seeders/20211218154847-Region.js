'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Regions',
      [
        { 
          // uuid: uuidv4(),
          uuid: 'ae3ce38c-0ae1-4117-abb5-30c1dca824b8',
          regionName: 'South West'
        },
        { 
          // uuid: uuidv4(),
          uuid: '4c811657-179c-41a8-a2cf-3e613c857f76',
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
