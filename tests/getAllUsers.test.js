const { expect } = require('chai');
const request = require('supertest');
const { User } = require('../src/models');
const app = require('../src/app');

describe('GET /users', () => {
  before(async () => User.sequelize.sync());

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  it('gets all user records', async () => {
    const users = await Promise.all([
      User.create({ 
        name: "Joe Bloggs",
        email: 'Joe@email.com', 
        password: 'password',
        permissionLevel: 'admin',
      }),
      User.create({ 
        name: "John Doe",
        email: 'JohnDoe@email.com', 
        password: 'password',
        permissionLevel: 'user',
      }),
    ]);

    const response = await request(app).get('/users');

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(2);

    response.body.forEach(user => {
      const expected = users.find(u => u.id === user.id);
      expect(user.uuid).to.equal(expected.uuid);
      expect(user.name).to.equal(expected.name);
      expect(user.email).to.equal(expected.email);
      expect(user.permissionLevel).to.equal(expected.permissionLevel);
    });
  });
})