const { expect } = require('chai');
const request = require('supertest');
const { Farm } = require('../src/models');
const app = require('../src/app');

describe('GET /farms', () => {
  let farms;

  before(async () => Farm.sequelize.sync());

  afterEach(async () => {
    await Farm.destroy({ where: {} });
  });

  it('gets all farm records', async () => {
    farms = await Promise.all([
      Farm.create({
        farmName: 'New Farm',
        postcode: 'NE3 4RM',
        contactName: 'Farmer Giles',
        contactNumber: '01234567890',
        deliveryMethod: 'IBC',
      }),
      Farm.create({
        farmName: 'Second Farm',
        postcode: 'SE0 4RM',
        contactName: 'Farmer Smith',
        contactNumber: '019876543210',
        deliveryMethod: 'Drum',
      }),
    ]);

    const response = await request(app).get('/farms');

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(2);

    response.body.forEach(farm => {
      const expected = farms.find(f => f.id === farm.id);
      expect(farm.farmName).to.equal(expected.farmName);
      expect(farm.postcode).to.equal(expected.postcode);
      expect(farm.contactName).to.equal(expected.contactName);
      expect(farm.contactNumber).to.equal(expected.contactNumber);
      expect(farm.deliveryMethod).to.equal(expected.deliveryMethod);
    });
  });

  it('returns 401 if there are no farms in the database', async () => {
    const response = await request(app).get('/farms');

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('There are no farms in the database.');
  });
});
