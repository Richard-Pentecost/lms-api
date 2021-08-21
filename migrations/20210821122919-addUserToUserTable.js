'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      `INSERT INTO lms_dm.Users (name, email, password, permissionLevel) 
      VALUES ("Admin", "admin@email.com", "password", "admin");`);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      `DELETE FROM lms_db.Users WHERE name = "Admin" AND email = "admin@email.com";`
    )
  }
};
