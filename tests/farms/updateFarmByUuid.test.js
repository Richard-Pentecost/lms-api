const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const DataFactory = require('../helpers/data-factory');
const { Farm } = require('../../src/models');
const app = require('../../src/app');

describe('PATCH /farms/:uuid', () => {
  let farm;
  before(async () => Farm.sequelize.sync());

  beforeEach(async () => {
    farm = await Farm.create(DataFactory.farm());
  });

  afterEach(async () => {
    sinon.restore();
    await Farm.destroy({ where: {} })
  });

  it('updates farm by uuid', async () => {
    const response = await request(app)
    .patch(`/farms/${farm.uuid}`)
    .send({ farm: { farmName: 'Old Farm', postcode: 'OL0 4RM' }});

    const updatedFarm = await Farm.findByPk(farm.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(updatedFarm.uuid).to.equal(farm.uuid);
    expect(updatedFarm.farmName).to.equal('Old Farm');
    expect(updatedFarm.postcode).to.equal('OL0 4RM');
    expect(updatedFarm.contactName).to.equal(farm.contactName);
    expect(updatedFarm.contactNumber).to.equal(farm.contactNumber);
  });  

  it('returns a 401 if the farm does not exist', async () => {
    const invalidUuid = DataFactory.uuid;
    const response = await request(app)
      .patch(`/farms/${invalidUuid}`)
      .send({ farm: { farmName: 'Old Farm', postcode: 'OL0 4RM' } });
    
    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('The farm could not be found');
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(Farm, 'update').throws(() => new Error());

    const response = await request(app)
      .patch(`/farms/${farm.uuid}`)
      .send({ farm: { farmName: 'Old Farm', postcode: 'OLO 4RM' } });

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});
