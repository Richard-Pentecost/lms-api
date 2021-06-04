const { expect } = require('chai');
const request = require('supertest');
const { User } = require('../src/models');
const app = require('../src/app');

describe('POST /users', () => {
  before(async () => User.sequelize.sync());

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  it('creates a new user in the database', async () => {
    const newUser = { 
      name: "Joe Bloggs",
      email: 'Joe@email.com', 
      password: 'password',
      permissionLevel: 'admin',
    };

    const response = await request(app).post('/users').send(newUser);
    const newUserRecord = await User.findByPk(response.body.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(response.body.name).to.equal('Joe Bloggs');
    expect(response.body.email).to.equal('Joe@email.com');
    expect(!!response.body.password).to.be.false;
    expect(response.body.permissionLevel).to.equal('admin');

    expect(newUserRecord.name).to.equal('Joe Bloggs');
    expect(newUserRecord.email).to.equal('Joe@email.com');
    expect(newUserRecord.password).to.equal('password');
    expect(newUserRecord.permissionLevel).to.equal('admin');
  });

  it('creates a new user in the database with default permission level if not provided', async () => {
    const newUser = {
      name: 'Joe Bloggs',
      email: 'Joe@email.com',
      password: 'longerPassword',
    };

    const response = await request(app).post('/users').send(newUser);
    const newUserRecord = await User.findByPk(response.body.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(response.body.name).to.equal('Joe Bloggs');
    expect(response.body.email).to.equal('Joe@email.com');
    expect(!!response.body.password).to.be.false;
    expect(response.body.permissionLevel).to.equal('user');

    expect(newUserRecord.name).to.equal('Joe Bloggs');
    expect(newUserRecord.email).to.equal('Joe@email.com');
    expect(newUserRecord.password).to.equal('longerPassword');
    expect(newUserRecord.permissionLevel).to.equal('user');
  });

  it('returns 401 when the name field is empty', async () => {
    const noNameUser = {
      email: 'Joe@email.com',
      password: 'password',
    };
    const response = await request(app).post('/users').send(noNameUser);

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Name must be given.");
  });

  it('returns 401 when the email field is empty', async () => {
    const noEmailUser = {
      name: 'Joe Bloggs',
      password: 'password',
    };
    const response = await request(app).post('/users').send(noEmailUser);

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Email must be given.");
  });

  it('returns 401 when the password field is empty', async () => {
    const noPasswordUser = {
      name: 'Joe Bloggs',
      email: 'Joe@email.com',
    };
    const response = await request(app).post('/users').send(noPasswordUser);

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Password must be given.");
  });

  it('returns 401 if an invalid email is given', async () => {
    const noPasswordUser = {
      name: 'Joe Bloggs',
      email: 'invalid email',
      password: 'password'
    };
    const response = await request(app).post('/users').send(noPasswordUser);

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal('Must be a valid email address.');
  });

  it('returns 401 if the password does not have at least 8 characters', async () => {
    const noPasswordUser = {
      name: 'Joe Bloggs',
      email: 'Joe@email.com',
      password: 'asdf'
    };
    const response = await request(app).post('/users').send(noPasswordUser);

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal('Password must be at least 8 characters long.');
  });
});
