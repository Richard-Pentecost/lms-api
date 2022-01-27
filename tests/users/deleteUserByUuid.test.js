const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { User } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('DELETE /users/:uuid', () => {
  let user;

  afterEach(async () => {
    sinon.restore();
    await User.destroy({ where: {} });
  });

  beforeEach(async () => {
    user = await User.create(DataFactory.user());
    sinon.stub(jwt, 'verify').returns({ isAdmin: true });
  });
  
  it('should delete the user in the database', async () => {
    const response = await request(app).delete(`/users/${user.uuid}`);

    const userEntry = await User.findByPk(user.id, { raw: true });
    expect(response.status).to.equal(201);
    expect(userEntry).to.be.null;
  });

  it('should return a 401 if the user does not exist', async () => {
    const invalidUuid = DataFactory.uuid;
    const response = await request(app).delete(`/users/${invalidUuid}`);

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('There was an error deleting the user');
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(User, 'destroy').throws(() => new Error());
    const response = await request(app).delete(`/users/${user.uuid}`);

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});