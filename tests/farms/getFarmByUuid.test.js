const { expect } = require('chai');
const request = require('supertest');
const { Farm } = require('../../src/models');
const app = require('../../src/app');

describe('POST /farms/:uiid', () => {
  let farms;

  before(async () => Farm.sequelize.sync());

  beforeEach(async () => {
    farms = await Promise.all([
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
  });

  afterEach(async () => {
    await Farm.destroy({ where: {} });
  });

  it('gets farm record by uuid', async () => {
    const farm = farms[0];
    const response = await request(app).get(`/farms/${farm.uuid}`);
    
    expect(response.status).to.equal(201);
    expect(response.body.farm.farmName).to.equal('New Farm');
    expect(response.body.farm.postcode).to.equal('NE3 4RM');
    expect(response.body.farm.uuid).to.have.length(36);
    expect(response.body.farm.contactName).to.equal('Farmer Giles');
    expect(response.body.farm.contactNumber).to.equal('01234567890');
    expect(response.body.farm.isActive).to.equal(true);
    expect(response.body.farm.accessCodes).to.be.null;
    expect(response.body.farm.comments).to.be.null;
  });

  it('returns 401 if the farm does not exist', async () => {
    const response = await request(app).get('/farms/12345');

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('The farm could not be found');
  });
});
