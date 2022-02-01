const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const DataFactory = require('../helpers/data-factory');
const { Farm } = require('../../src/models');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe.only('PATCH /farms/:uuid/disable', () => {
  let activeFarm;
  let inactiveFarm;

  beforeEach(async () => {
    activeFarm = await Farm.create(DataFactory.farm());
    inactiveFarm = await Farm.create(DataFactory.farm({ isActive: false }))
    sinon.stub(jwt, 'verify').returns({ isAdmin: true });
  });

  afterEach(async () => {
    sinon.restore();
    await Farm.destroy({ where: {} });
  });

  it('disables an active farm by uuid with admin permissions', async () => {
    const response = await request(app)
      .patch(`/farms/${activeFarm.uuid}/disable`)
      .send({ farm: { isActive: false } });
    
    const updatedFarm = await Farm.findByPk(activeFarm.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(updatedFarm.isActive).to.be.false;
  });

  it('enables an inactive farm by uuid with admin permissions', async () => {
    const response = await request(app)
      .patch(`/farms/${inactiveFarm.uuid}/disable`)
      .send({ farm: { isActive: true } });

    const updatedFarm = await Farm.findByPk(inactiveFarm.id, { raw: true });
    
    expect(response.status).to.equal(201);
    expect(updatedFarm.isActive).to.be.true;
  });

  it('returns a 401 if an non admin tries to disable or enable a farm',  async () => {
    sinon.restore();
    sinon.stub(jwt, 'verify').returns({ isAdmin: false });

    const response = await request(app)
      .patch(`/farms/${activeFarm.uuid}/disable`)
      .send({ farm: {isActive: false } });

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('You must be an admin to do this');
  });

  it('farm remains enabled if isActive true is passed to a farm the is already active', async () => {
    const response = await request(app)
      .patch(`/farms/${activeFarm.uuid}/disable`)
      .send({ farm: { isActive: true } });
    
    const updatedFarm = await Farm.findByPk(activeFarm.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(updatedFarm.isActive).to.be.true;
  });

  it('returns a 401 if the farm cannot be found', async () => {
    const invalidUuid = DataFactory.uuid;
    const response = await request(app)
      .patch(`/farms/${invalidUuid}/disable`)
      .send({ farm: { isActive: false } });
    
    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('The farm could not be found');
  });

  it('returns a 500 if an error is thrown',  async () => {
    sinon.stub(Farm, 'update').throws(() => new Error());

    const response = await request(app)
      .patch(`/farms/${activeFarm.uuid}/disable`)
      .send({ farm: { isActive: false } });
  
    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});