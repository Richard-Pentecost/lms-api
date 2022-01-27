const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Farm } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('DELETE /farms/:farmId', () => {
  let farm;

  before(async () => Farm.sequelize.sync());

  afterEach(async () => {
    sinon.restore();
    await Farm.destroy({ where: {} });
  });

  beforeEach(async () => {
    farm = await Farm.create(DataFactory.farm());
    sinon.stub(jwt, 'verify').returns({ isAdmin: true });
  });

  it('should delete the farm in the database', async () => {
    const response = await request(app).delete(`/farms/${farm.uuid}`);

    const farmEntry = await Farm.findByPk(farm.id, { raw: true });
    expect(response.status).to.equal(201);
    expect(farmEntry).to.be.null;
  });

  it('should return a 401 if the farm does not exist', async () => {
    const invalidUuid = DataFactory.uuid;
    const response = await request(app).delete(`/farms/${invalidUuid}`);

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('There was an error deleting the farm');
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(Farm, 'destroy').throws(() => new Error());
    const response = await request(app).delete(`/farms/${farm.uuid}`);

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});
