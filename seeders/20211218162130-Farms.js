'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Farms',
      [
        {
          uuid: uuidv4(),
          farmName: 'New Farm',
          postcode: 'NE3 4RM',
          contactName: 'Giles',
          contactNumber: '01234567890',
          isActive: true,
          accessCodes: 'Some codes',
          comments: 'Some comments about this farm',
        },
        {
          uuid: uuidv4(),
          farmName: 'Old Farm',
          postcode: 'OL0 4RM',
          contactName: 'John Doe',
          contactNumber: '01234567809',
          isActive: true,
        },
        {
          uuid: uuidv4(),
          farmName: 'Beech Farm',
          postcode: 'BE3 4RM',
          contactName: 'Jane Doe',
          contactNumber: '01234567098',
          isActive: true,
        },
        {
          uuid: uuidv4(),
          farmName: 'The Farm',
          postcode: 'TH3 4RM',
          contactName: 'Bobbins',
          contactNumber: '01234560987',
          isActive: true,
        },
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Farms', null, {}); 
  }
};
