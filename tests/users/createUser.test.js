const { expect } = require('chai');
const request = require('supertest');
const { User } = require('../../src/models');
const app = require('../../src/app');

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

    const response = await request(app).post('/users').send({ user: newUser });
    const newUserRecord = await User.findByPk(response.body.user.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(response.body.user.uuid).to.have.length(36);
    expect(response.body.user.name).to.equal('Joe Bloggs');
    expect(response.body.user.email).to.equal('Joe@email.com');
    expect(!!response.body.user.password).to.be.false;
    expect(response.body.user.permissionLevel).to.equal('admin');

    expect(newUserRecord).to.have.property('uuid');
    expect(newUserRecord.name).to.equal('Joe Bloggs');
    expect(newUserRecord.email).to.equal('Joe@email.com');
    expect(newUserRecord.password).to.have.length(60);
    expect(newUserRecord.permissionLevel).to.equal('admin');
  });

  it('creates a new user in the database with default permission level if not provided', async () => {
    const newUser = {
      name: 'Joe Bloggs',
      email: 'Joe@email.com',
      password: 'longerPassword',
    };

    const response = await request(app).post('/users').send({ user: newUser });
    const newUserRecord = await User.findByPk(response.body.user.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(response.body.user.uuid).to.have.length(36);
    expect(response.body.user.name).to.equal('Joe Bloggs');
    expect(response.body.user.email).to.equal('Joe@email.com');
    expect(!!response.body.user.password).to.be.false;
    expect(response.body.user.permissionLevel).to.equal('user');

    expect(newUserRecord).to.have.property('uuid');
    expect(newUserRecord.name).to.equal('Joe Bloggs');
    expect(newUserRecord.email).to.equal('Joe@email.com');
    expect(newUserRecord.password).to.have.length(60);
    expect(newUserRecord.permissionLevel).to.equal('user');
  });

  it('returns 401 when the name field is null', async () => {
    const noNameUser = {
      email: 'Joe@email.com',
      password: 'password',
    };
    const response = await request(app).post('/users').send({ user: noNameUser });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Name must be given");
  });

  it('returns 401 when the name field is empty', async () => {
    const emptyNameUser = {
      name: '',
      email: 'Joe@email.com',
      password: 'password',
    };
    const response = await request(app).post('/users').send({ user: emptyNameUser });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Name must be given");
  });

  it('returns 401 when the email field is null', async () => {
    const noEmailUser = {
      name: 'Joe Bloggs',
      password: 'password',
    };
    const response = await request(app).post('/users').send({ user: noEmailUser });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Email must be given");
  });

  it('returns 401 if an invalid email is given', async () => {
    const invalidEmailUser = {
      name: 'Joe Bloggs',
      email: 'invalid email',
      password: 'password'
    };
    const response = await request(app).post('/users').send({ user: invalidEmailUser });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal('Must be a valid email address');
  });

  it('returns 401 when the password field is null', async () => {
    const noPasswordUser = {
      name: 'Joe Bloggs',
      email: 'Joe@email.com',
    };
    const response = await request(app).post('/users').send({ user: noPasswordUser });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Password must be given");
  });

  it('returns 401 if the password does not have at least 8 characters', async () => {
    const invalidPasswordUser = {
      name: 'Joe Bloggs',
      email: 'Joe@email.com',
      password: 'asdf'
    };
    const response = await request(app).post('/users').send({ user: invalidPasswordUser });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal('Password must be at least 8 characters long');
  });
});
