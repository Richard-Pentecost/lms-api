const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Region, Farm } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('DELETE /regions/:uuid', () => {
  let region;

  afterEach(async () => {
    sinon.restore();
    await Region.destroy({ where: {} });
    await Farm.destroy({ where: {} });
  });

  beforeEach(async () => {
    region = await Region.create({ regionName: 'South West' });
    sinon.stub(jwt, 'verify').returns({ isAdmin: true });
  });
  
  it('should delete the region in the database', async () => {
    const response = await request(app).delete(`/regions/${region.uuid}`);

    const regionEntry = await Region.findByPk(region.id, { raw: true });
    expect(response.status).to.equal(201);
    expect(regionEntry).to.be.null;
  });

  it('should return a 401 if the region does not exist', async () => {
    const invalidUuid = DataFactory.uuid;
    const response = await request(app).delete(`/regions/${invalidUuid}`);

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('There was an error deleting the region');
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(Region, 'destroy').throws(() => new Error());
    const response = await request(app).delete(`/regions/${region.uuid}`);

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });

  it('should delete the region in any farms that have the association', async () => {
    const farmData = DataFactory.farm();
    const farmWithRegion = { ...farmData, regionFk: region.uuid };
    const farm = await Farm.create(farmWithRegion);

    await request(app).delete(`/regions/${region.uuid}`);

    const updatedFarm = await Farm.findByPk(farm.id, { raw: true });
    expect(updatedFarm.regionFk).to.be.null;
  });
});
