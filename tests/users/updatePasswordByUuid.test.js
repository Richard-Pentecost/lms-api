const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { User } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('PATCH /users/:uuid/security', () => {
  let userData;
  let user;

  beforeEach(async () => {
    userData = DataFactory.user();
    user = await User.create(userData);
    sinon.stub(jwt, 'verify').returns({ isAdmin: false });
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
    sinon.restore();
  });

  it('updates a users password when given a valid old password',  async () => {
    const existingPassword = userData.password;
    const newPassword = 'newPassword';
    const { password: previousPassword } = await User.scope('withPassword').findByPk(user.id);

    const response = await request(app)
      .patch(`/users/${user.uuid}/security`)
      .send({ existingPassword, newPassword });
    
    const { password: updatedPassword } = await User.scope('withPassword').findByPk(user.id);

    expect(response.status).to.equal(201);
    expect(updatedPassword).not.to.equal(previousPassword);
    expect(updatedPassword.length).to.equal(60);
  });

  it('should return 401 if the user does not exist in the db', async () => {
    const invalidUuid = DataFactory.uuid;
    const existingPassword = userData.password;
    const newPassword = 'newPassword';
    const response = await request(app)
      .patch(`/users/${invalidUuid}/security`)
      .send({ existingPassword, newPassword });
    
    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('The user could not be found');
  });

  it('should return a 401 if the old password is incorrect', async () => {
    const incorrectPassword = userData.password.split('').filter((letter, index) => {
      if (index !== userData.password.length - 1) {
        return letter;
      }
    }).join('');
    const newPassword = 'newPassword';

    const response = await request(app)
      .patch(`/users/${user.uuid}/security`)
      .send({ existingPassword: incorrectPassword, newPassword });
    
    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('Existing password given is incorrect');
  });

  it('should return a 401 if the password cannot be updated', async () => {
    sinon.stub(User, 'updatePassword').returns([0]);
    const existingPassword = userData.password;
    const newPassword = 'newPassword';
    const { password: previousPassword } = await User.scope('withPassword').findByPk(user.id);

    const response = await request(app)
      .patch(`/users/${user.uuid}/security`)
      .send({ existingPassword, newPassword });
    
    const { password: notUpdatedPassword } = await User.scope('withPassword').findByPk(user.id);

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('There was an error updating your password');
    expect(notUpdatedPassword).to.equal(previousPassword);
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(User, 'findOne').throws(() => new Error());

    const existingPassword = userData.password;
    const newPassword = 'newPassword';

    const response = await request(app)
      .patch(`/users/${user.uuid}/security`)
      .send({ existingPassword, newPassword });
    
    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');

  })
});