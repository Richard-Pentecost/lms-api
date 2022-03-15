const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Farm, Region } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('GET /farms/allFarms', () => {
  let farms;

  afterEach(async () => {
    sinon.restore();
    await Region.destroy({ where: {} });
    await Farm.destroy({ where: {} });
  });

  beforeEach(async () => {
    const region = await Region.create({ regionName: 'North West' });
    farms = await Promise.all([
      Farm.create(DataFactory.farm({ farmName: 'First Farm', region: region.uuid})),
      Farm.create(DataFactory.farm()),
      Farm.create(DataFactory.farm({ isActive: false })),
    ]);
    sinon.stub(jwt, 'verify').returns({ isAdmin: false });
  });

  it('gets all farm records', async () => {
    const response = await request(app).get('/farms');

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(3);

    response.body.forEach(farm => {
      const expected = farms.find(f => f.uuid === farm.uuid);
      expect(farm.farmName).to.equal(expected.farmName);
      expect(farm.postcode).to.equal(expected.postcode);
      expect(farm.contactName).to.equal(expected.contactName);
      expect(farm.contactNumber).to.equal(expected.contactNumber);
      expect(farm.isActive).to.equal(expected.isActive);
      expect(farm.accessCodes).to.equal(expected.accessCodes);
      expect(farm.comments).to.equal(expected.comments);
      if (farm.farmName === 'First Farm') {
        expect(farm.region).to.exist;
      } else {
        expect(farm.region).to.be.null;
      }
    });
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(Farm, 'fetchAllFarms').throws(() => new Error());

    const response = await request(app).get('/farms');

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  })
});
