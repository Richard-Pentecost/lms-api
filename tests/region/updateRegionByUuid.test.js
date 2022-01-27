const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const DataFactory = require('../helpers/data-factory');
const { Region } = require('../../src/models');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('PATCH /regions/:uuid', () => {
  let region;

  beforeEach(async () => {
    region = await Region.create({ regionName: 'South East' });
    sinon.stub(jwt, 'verify').returns({ isAdmin: true });
  });

  afterEach(async () => {
    await Region.destroy({ where: {} });
    sinon.restore();
  });

  it('updates regions name when given a new name and the uuid', async () => {
    const response = await request(app)
      .patch(`/regions/${region.uuid}`)
      .send({ region: { regionName: 'South West' } });
    
    const updatedRegion = await Region.findByPk(region.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(updatedRegion.uuid).to.equal(region.uuid);
    expect(updatedRegion.regionName).to.equal('South West');
  });

  it('should return a 401 if the region does not exist', async () => {
    const invalidUuid = DataFactory.uuid;
    const response = await request(app)
      .patch(`/regions/${invalidUuid}`)
      .send({ region: { regionName: 'South West' }});

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('The region could not be found');
  });

  it('should return a 401 if the region name is changed to a name that already exists in the database', async () => {
    await Region.create({ regionName: 'South West' });
    const response = await request(app)
      .patch(`/regions/${region.uuid}`)
      .send({ region: { regionName: 'South West' }});

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('The region already exists');
  });
  
  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(Region, 'update').throws(() => new Error());
    const response = await request(app)
      .patch(`/regions/${region.uuid}`)
      .send({ region: { regionName: 'South West' } });
    
    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});