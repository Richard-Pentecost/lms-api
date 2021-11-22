const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Region } = require('../../src/models');
const app = require('../../src/app');

describe('GET /regions', () => {
  let regions;

  before(async () => Region.sequelize.sync());

  afterEach(async () => {
    sinon.restore();
    await Region.destroy({ where: {} });
  });

  beforeEach(async () => {
    regions = await Promise.all([
      Region.create({ region: 'North West' }),
      Region.create({ region: 'South East' }),
    ]);
  });

  it('gets all regions', async () => {
    const response = await request(app).get('/regions');

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(2);
    
    response.body.forEach(region => {
      const expected = regions.find(r => r.uuid === region.uuid);
      expect(region.region).to.equal(expected.region);
    });
  });

  it('should return a 401 if the regions are not retrieved', async () => {
    sinon.stub(Region, 'findAll').returns(null);
    const response = await request(app).get('/regions');

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('Could not retrieve regions');
  });

  it('should return a 501 if an error is thrown', async () => {
    sinon.stub(Region, 'findAll').throws(() => new Error());
    const response = await request(app).get('/regions');

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});
