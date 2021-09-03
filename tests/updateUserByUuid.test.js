const { expect } = require('chai');
const request = require('supertest');
const { User } = require('../src/models');
const app = require('../src/app');

describe.only('PATCH /users/:uuid', () => {
  let user;
  before(async () => User.sequelize.sync());

  beforeEach(async () => {
    user = await Promise.resolve(
      User.create({
        name: "Joe Bloggs",
        email: 'Joe@email.com', 
        password: 'password',
        permissionLevel: 'admin',
      })
    );
  });

  afterEach(async () => {
    await User.destroy({ where: {} })
  });

  it('updates a users name when given a new name and the uuid', async () => {
    const response = await request(app)
      .patch(`/users/${user.dataValues.uuid}`)
      .send({ user: { name: 'Jane Doe' } })
    
    const updatedUser = await User.findByPk(user.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(updatedUser.uuid).to.equal(user.uuid);
    expect(updatedUser.name).to.equal('Jane Doe');
    expect(updatedUser.email).to.equal('Joe@email.com');
    expect(updatedUser.permissionLevel).to.equal('admin');
    expect(updatedUser.password.length).to.equal(60);
  });

  it('return a 401 if the user does not exist', async () => {
    const response = await request(app)
      .patch('/users/12345')
      .send({ user: { name: 'Jane Doe' } });
    
      expect(response.status).to.equal(401);
      expect(response.body.error).to.equal('The user could not be found.');
  });
});