const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Data, Farm } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');

describe('DELETE /farms/:farmId/data/:dataId', () => {
  let farm;
  let data;
  let dataData;

  before(async () => Data.sequelize.sync());

  afterEach(async () => {
    sinon.restore();
    await Data.destroy({ where: {} });
    await Farm.destroy({ where: {} });
  });

  beforeEach(async () => {
    const farmData = DataFactory.farm();
    farm = await Farm.create(farmData);
    dataData = DataFactory.data({ farmFk: farm.uuid });
    data = await Data.create(dataData);
  });

  it('should delete a data entry in the database', async () => {
    const response = await request(app).delete(`/farms/${farm.uuid}/data/${data.uuid}`)
    
    const dataEntry = await Data.findByPk(data.id, { raw: true });
    expect(response.status).to.equal(201);
    expect(dataEntry).to.be.null;
  });

  it('should return a 401 if the data does not exist', async () => {
    const response = await request(app).delete(`/farms/${farm.uuid}/data/12345`)
    
    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('There was an error deleting the data');
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(Data, 'destroy').throws(() => new Error());
    const response = await request(app).delete(`/farms/${farm.uuid}/data/${data.uuid}`)
    
    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });

});