const { expect } = require('chai');
const request = require('supertest');
const { User } = require('../../src/models');
const app = require('../../src/app');

describe('GET /users/:uuid', () => {
  let users;

  before(async () => User.sequelize.sync());

  beforeEach(async () => {
    users = await Promise.all([
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
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  it('gets user record by uuid', async () => {
    const user = users[0];
    const response = await request(app).get(`/users/${user.uuid}`);

    expect(response.status).to.equal(201);
    expect(response.body.user).to.not.have.property('password');
    expect(response.body.user.name).to.equal('Joe Bloggs');
    expect(response.body.user.email).to.equal('Joe@email.com');
    expect(response.body.user.permissionLevel).to.equal('admin');
    expect(response.body.user.uuid).to.equal(user.uuid);
  });

  it('returns a 401 if the user does not exist', async () => {
    const response = await request(app).get('/users/12345');

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('User could not be found');
  })
});