const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { User } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('POST /users', () => {
  let newUser;

  afterEach(async () => {
    sinon.restore();
    await User.destroy({ where: {} });
  });

  beforeEach(async () => {
    newUser = DataFactory.user();
    sinon.stub(jwt, 'verify').returns({ isAdmin: true });
  });

  it('creates a new user in the database, with isAdmin defaulting to null', async () => {
    const response = await request(app).post('/users').send({ user: newUser });
    const newUserRecord = await User.findByPk(response.body.user.id, { raw: true });

    expect(response.status).to.equal(201);
    
    expect(newUserRecord).not.to.have.property('password');
    expect(newUserRecord).to.have.property('uuid');
    expect(newUserRecord.name).to.equal(newUser.name);
    expect(newUserRecord.email).to.equal(newUser.email);
    expect(newUserRecord.isAdmin).to.be.false;
  });

  it('creates a new user in the database, with isAdmin set to true', async () => {
    const response = await request(app).post('/users').send({ user: { ...newUser, isAdmin: true } });
    const newUserRecord = await User.findByPk(response.body.user.id, { raw: true });
    
    expect(response.status).to.equal(201);
    
    expect(newUserRecord).not.to.have.property('password');
    expect(newUserRecord).to.have.property('uuid');
    expect(newUserRecord.name).to.equal(newUser.name);
    expect(newUserRecord.email).to.equal(newUser.email);
    expect(newUserRecord.isAdmin).to.be.true;
  });

  it('returns 401 when the name field is null', async () => {
    const { name, ...noName } = newUser;
    const response = await request(app).post('/users').send({ user: noName });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Name must be given");
  });

  it('returns 401 when the name field is empty', async () => {
    const response = await request(app).post('/users').send({ user: { ...newUser, name: ' ' } });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Name must be given");
  });

  it('returns 401 when the email field is null', async () => {
    const { email, ...noEmail } = newUser;
    const response = await request(app).post('/users').send({ user: noEmail });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Email must be given");
  });

  it('returns 401 if an invalid email is given', async () => {
    const response = await request(app).post('/users').send({ user: { ...newUser, email: 'invalidEmail' } });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal('Must be a valid email address');
  });

  it('returns 401 when the password field is null', async () => {
    const { password, ...noPassword } = newUser;
    const response = await request(app).post('/users').send({ user: noPassword });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Password must be given");
  });

  it('returns 401 if the password does not have at least 8 characters', async () => {
    const response = await request(app).post('/users').send({ user: { ...newUser, password: 'asdf' } });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal('Password must be at least 8 characters long');
  });
});
