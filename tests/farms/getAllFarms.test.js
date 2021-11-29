const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Farm } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');

describe('GET /farms/allFarms', () => {
  let farms;

  before(async () => Farm.sequelize.sync());

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
      expect(farm.region).to.equal(expected.region);
      expect(farm.accessCodes).to.equal(expected.accessCodes);
      expect(farm.comments).to.equal(expected.comments);
    });
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(Farm, 'findAll').throws(() => new Error());

    const response = await request(app).get('/farms');

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  })
});
