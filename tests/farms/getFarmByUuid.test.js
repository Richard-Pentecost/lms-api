const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const DataFactory = require('../helpers/data-factory');
const { Farm } = require('../../src/models');
const app = require('../../src/app');

describe('POST /farms/:uiid', () => {
  let farms;

  before(async () => Farm.sequelize.sync());

  beforeEach(async () => {
    farms = await Promise.all([
      Farm.create(DataFactory.farm()),
      Farm.create(DataFactory.farm()),
    ]);
  });

  afterEach(async () => {
    sinon.restore();
    await Farm.destroy({ where: {} });
  });

  it('gets farm record by uuid', async () => {
    const farm = farms[0];
    const response = await request(app).get(`/farms/${farm.uuid}`);
    
    expect(response.status).to.equal(201);
    expect(response.body.farm.farmName).to.equal(farm.farmName);
    expect(response.body.farm.postcode).to.equal(farm.postcode);
    expect(response.body.farm.uuid).to.have.length(36);
    expect(response.body.farm.contactName).to.equal(farm.contactName);
    expect(response.body.farm.contactNumber).to.equal(farm.contactNumber);
    expect(response.body.farm.isActive).to.equal(true);
    expect(response.body.farm.accessCodes).to.be.null;
    expect(response.body.farm.comments).to.be.null;
  });

  it('returns 401 if the farm does not exist', async () => {
    const invalidUuid = DataFactory.uuid;
    const response = await request(app).get(`/farms/${invalidUuid}`);

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('The farm could not be found');
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(Farm, 'findOne').throws(() => new Error());

    const response = await request(app).get(`/farms/${farms[0].uuid}`);

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});
