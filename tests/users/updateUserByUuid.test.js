const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { User } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');

describe('PATCH /users/:uuid', () => {
  let user;
  let userData;

  before(async () => User.sequelize.sync());

  beforeEach(async () => {
    userData = DataFactory.user();
    user = await User.create(userData);
  });

  afterEach(async () => {
    sinon.restore();
    await User.destroy({ where: {} });
  });

  it('updates a users name when given a new name and the uuid', async () => {
    const response = await request(app)
      .patch(`/users/${user.uuid}`)
      .send({ user: { name: 'Jane Doe' } });
    
    const updatedUser = await User.findByPk(user.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(updatedUser).not.to.have.property('password');
    expect(updatedUser.uuid).to.equal(user.uuid);
    expect(updatedUser.name).to.equal('Jane Doe');
    expect(updatedUser.email).to.equal(userData.email);
    expect(updatedUser.isAdmin).to.be.false;
  });

  it('should return a 401 if the user does not exist', async () => {
    const invalidUuid = DataFactory.uuid;
    const response = await request(app)
      .patch(`/users/${invalidUuid}`)
      .send({ user: { name: 'Jane Doe' } });
    
      expect(response.status).to.equal(401);
      expect(response.body.error).to.equal('The user could not be found');
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(User, 'update').throws(() => new Error());

    const response = await request(app)
      .patch(`/users/${user.uuid}`)
      .send({ user: { name: 'Jane Doe' } });

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});