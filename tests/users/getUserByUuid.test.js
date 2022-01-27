const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { User } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('GET /users/:uuid', () => {
  let users;

  beforeEach(async () => {
    users = await Promise.all([
      User.create(DataFactory.user()),
      User.create(DataFactory.user()),
    ]);
    sinon.stub(jwt, 'verify').returns({ isAdmin: false });
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
    sinon.restore();
  });

  it('gets user record by uuid', async () => {
    const user = users[0];
    const response = await request(app).get(`/users/${user.uuid}`);

    expect(response.status).to.equal(201);
    expect(response.body.user).not.to.have.property('password');
    expect(response.body.user.name).to.equal(user.name);
    expect(response.body.user.email).to.equal(user.email);
    expect(response.body.user.isAdmin).to.equal(user.isAdmin);
    expect(response.body.user.uuid).to.equal(user.uuid);
  });

  it('should return a 401 if the user does not exist', async () => {
    const invalidUuid = DataFactory.uuid; 
    const response = await request(app).get(`/users/${invalidUuid}`);

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('User could not be found');
  });

  it('should return a 500 if an error is thrown', async () => {
    const user = users[0];
    sinon.stub(User, 'findByUuid').throws(() => new Error());

    const response = await request(app).get(`/users/${user.uuid}`);

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});