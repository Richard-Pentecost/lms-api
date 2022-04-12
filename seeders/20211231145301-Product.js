'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Products',
      [
        { 
          uuid: uuidv4(),
          productName: 'Se&I-IBC',
          specificGravity: 1.0,
        },
        { 
          uuid: uuidv4(),
          productName: 'Mag-Drum',
          specificGravity: 2.8,
        },
        {
          uuid: uuidv4(),
          productName: 'MM-Tank',
          specificGravity: 1.08,
        },
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {}); 
  }
};
