const { expect } = require('chai');
const request = require('supertest');
const { User } = require('../../src/models');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('POST/login', () => {
  let user;

  before(async () => User.sequelize.sync());

  beforeEach(async () => {
    user = await User.create({
      name: 'John Doe',
      email: 'j@d.com',
      password: 'password',
      permissionLevel: 'user',
    })
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  it('logs in the user and returns a token when the correct email and password are given', async () => {
    const credentials = { email: 'j@d.com', password: 'password' };
    const response = await request(app).post('/login').send(credentials);

    const decodedToken = jwt.decode(response.body.token);

    expect(response.status).to.equal(201);
    expect(decodedToken).to.have.property('permissionLevel');
    expect(decodedToken).to.contain({ permissionLevel: 'user' });
    expect(decodedToken).to.have.property('uuid')
    expect(decodedToken).to.contain({ uuid: user.uuid });
  });

  it('returns an error when an incorrect email is given', async () => {
    const credentials = { email: 'r@r.com', password: 'password' };
    const response = await request(app).post('/login').send(credentials);

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('Incorrect email');
  });

  it('returns an error when an incorrect password is given', async () => {
    const credentials = { email: 'j@d.com', password: 'incorrectPassword' };
    const response = await request(app).post('/login').send(credentials);

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('Incorrect password');
  });
})