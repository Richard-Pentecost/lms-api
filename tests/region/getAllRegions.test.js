const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Region } = require('../../src/models');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('GET /regions', () => {
  let regions;

  afterEach(async () => {
    sinon.restore();
    await Region.destroy({ where: {} });
  });

  beforeEach(async () => {
    regions = await Promise.all([
      Region.create({ regionName: 'North West' }),
      Region.create({ regionName: 'South East' }),
    ]);

    sinon.stub(jwt, 'verify').returns({ isAdmin: false });
  });

  it('gets all regions', async () => {
    const response = await request(app).get('/regions');

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(2);
    
    response.body.forEach(region => {
      const expected = regions.find(r => r.uuid === region.uuid);
      expect(region.regionName).to.equal(expected.regionName);
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

    expect(response.status).to.equal(501);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});
