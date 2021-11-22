const { expect } = require('chai');
const request = require('supertest');
const { Farm } = require('../../src/models');
const app = require('../../src/app');

describe('GET /farms', () => {
  before(async () => Farm.sequelize.sync());

  afterEach(async () => {
    await Farm.destroy({ where: {} });
  });

  it('gets all farm records', async () => {
    const farms = await Promise.all([
      Farm.create({
        farmName: 'New Farm',
        postcode: 'NE3 4RM',
        contactName: 'Farmer Giles',
        contactNumber: '01234567890',
      }),
      Farm.create({
        farmName: 'Second Farm',
        postcode: 'SE0 4RM',
        contactName: 'Farmer Smith',
        contactNumber: '019876543210',
      }),
    ]);

    const response = await request(app).get('/farms');

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(2);

    response.body.forEach(farm => {
      const expected = farms.find(f => f.uuid === farm.uuid);
      expect(farm.farmName).to.equal(expected.farmName);
      expect(farm.postcode).to.equal(expected.postcode);
      expect(farm.contactName).to.equal(expected.contactName);
      expect(farm.contactNumber).to.equal(expected.contactNumber);
    });
  });
});
