const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { User } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');

describe('GET /users', () => {
  let users;

  before(async () => User.sequelize.sync());

  afterEach(async () => {
    await User.destroy({ where: {} });
    sinon.restore();
  });

  beforeEach(async () => {
    users = await Promise.all([
      User.create(DataFactory.user()),
      User.create(DataFactory.user()),
    ]);
  });

  it('gets all user records', async () => {
    const response = await request(app).get('/users');

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(2);

    response.body.forEach(user => {
      const expected = users.find(u => u.id === user.id);
      expect(user).to.not.have.property('password');
      expect(user.uuid).to.equal(expected.uuid);
      expect(user.name).to.equal(expected.name);
      expect(user.email).to.equal(expected.email);
      expect(user.permissionLevel).to.equal(expected.permissionLevel);
    });
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(User, 'findAll').throws(() => new Error());

    const response = await request(app).get('/users');

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});
