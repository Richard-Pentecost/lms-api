const { expect } = require('chai');
const request = require('supertest');
const { Farm } = require('../src/models');
const app = require('../src/app');

describe('POST /farms/:id', () => {
  let farms;

  before(async () => Farm.sequelize.sync());

  beforeEach(async () => {
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
  });

  afterEach(async () => {
    await Farm.destroy({ where: {} });
  });

  it('gets farm record by id', async () => {
    const farm = farms[0];
    const response = await request(app).get(`/farms/${farm.id}`);

    expect(response.status).to.equal(201);
    expect(response.body.farmName).to.equal('New Farm');
    expect(response.body.postcode).to.equal('NE3 4RM');
    expect(response.body.contactName).to.equal('Farmer Giles');
    expect(response.body.contactNumber).to.equal('01234567890');
    expect(response.body.deliveryMethod).to.equal('IBC');
    expect(response.body.status).to.equal(1);
    expect(response.body.accessCodes).to.be.null;
    expect(response.body.comments).to.be.null;
  });

  it('returns 401 if the farm does not exist', async () => {
    const response = await request(app).get('/farms/12345');

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('The farm could not be found.');
  });
});
