const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Farm } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('GET /farms/active', () => {
  let farms;

  afterEach(async () => {
    sinon.restore();
    await Farm.destroy({ where: {} });
  });

  beforeEach(async () => {
    farms = await Promise.all([
      Farm.create(DataFactory.farm()),
      Farm.create(DataFactory.farm()),
      Farm.create(DataFactory.farm({ isActive: false })),
    ]);
    sinon.stub(jwt, 'verify').returns({ isAdmin: false });
  });

  it('should return all active farm', async () => {
    const response = await request(app).get('/farms/active');

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(2);

    const activeFarms = farms.filter(farm => {
      return farm.isActive && farm;
    });
    
    response.body.forEach(farm => {
      const expected = activeFarms.find(activeFarm => activeFarm.uuid === farm.uuid);
      expect(farm.farmName).to.equal(expected.farmName);
      expect(farm.postcode).to.equal(expected.postcode);
      expect(farm.contactName).to.equal(expected.contactName);
      expect(farm.contactNumber).to.equal(expected.contactNumber);
      expect(farm.isActive).to.be.true;
      expect(farm.regionFk).to.equal(expected.regionFk);
      expect(farm.accessCodes).to.equal(expected.accessCodes);
      expect(farm.comments).to.equal(expected.comments);
    });
  });

  it('should return a 500 if an error is thrown',  async () => {
    sinon.stub(Farm, 'fetchActiveFarms').throws(() => new Error());

    const response = await request(app).get('/farms/active');

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});