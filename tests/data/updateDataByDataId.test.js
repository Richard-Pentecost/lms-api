const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Data, Farm } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');

describe('PATCH /farms/:farmId/data/:dataId', () => {
  let farm;
  let data;
  let dataData;

  before(async () => Data.sequelize.sync());

  afterEach(async () => {
    await Data.destroy({ where: {} });
    await Data.destroy({ where: {} });
    sinon.restore();
  });

  beforeEach(async () => {
    const farmData = DataFactory.farm();
    farm = await Farm.create(farmData);
    dataData = DataFactory.data({ farmFk: farm.uuid });
    data = await Data.create(dataData);
  });

  it('should update the all data fields in the database when they have all been changed', async () => {
    const newData = DataFactory.data({ farmFk: farm.uuid });

    const response = await request(app)
      .patch(`/farms/${farm.uuid}/data/${data.uuid}`)
      .send({ data: newData });

    expect(response.status).to.equal(201);
    
    const updatedData = await Data.findByPk(data.id, { raw: true });

    expect(updatedData).to.have.property('date');
    expect(updatedData.noOfCows).to.equal(newData.noOfCows);
    expect(updatedData.product).to.equal(newData.product);
    expect(updatedData.quantity).to.equal(newData.quantity);
    expect(updatedData.meterReading).to.equal(newData.meterReading);
    expect(updatedData.waterUsage).to.equal(newData.waterUsage);
    expect(updatedData.pumpDial).to.equal(newData.pumpDial);
    expect(updatedData.floatBeforeDelivery).to.equal(newData.floatBeforeDelivery);
    expect(updatedData.kgActual).to.equal(newData.kgActual);
    expect(updatedData.targetFeedRate).to.equal(newData.targetFeedRate);
    expect(updatedData.floatAfterDelivery).to.equal(newData.floatAfterDelivery);
    expect(updatedData.comments).to.equal(newData.comments);
  });

  it('should update the only specific data fields in the database when only those fields have been changed', async () => {
    const newData = { noOfCows: dataData.noOfCows + 3 };

    const response = await request(app)
      .patch(`/farms/${farm.uuid}/data/${data.uuid}`)
      .send({ data: newData });

    expect(response.status).to.equal(201);
    
    const updatedData = await Data.findByPk(data.id, { raw: true });

    expect(updatedData).to.have.property('date');
    expect(updatedData.noOfCows).to.equal(newData.noOfCows);
    expect(updatedData.product).to.equal(dataData.product);
    expect(updatedData.quantity).to.equal(dataData.quantity);
    expect(updatedData.meterReading).to.equal(dataData.meterReading);
    expect(updatedData.waterUsage).to.equal(dataData.waterUsage);
    expect(updatedData.pumpDial).to.equal(dataData.pumpDial);
    expect(updatedData.floatBeforeDelivery).to.equal(dataData.floatBeforeDelivery);
    expect(updatedData.kgActual).to.equal(dataData.kgActual);
    expect(updatedData.targetFeedRate).to.equal(dataData.targetFeedRate);
    expect(updatedData.floatAfterDelivery).to.equal(dataData.floatAfterDelivery);
    expect(updatedData.comments).to.equal(dataData.comments);
  });

  it('should return a 401 if the data does not exist', async () => {
    const invalidUuid = DataFactory.uuid;
    const newData = { ...dataData, noOfCows: dataData.noOfCows + 3 };

    const response = await request(app)
      .patch(`/farms/${farm.uuid}/data/${invalidUuid}`)
      .send({ data: newData });

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('There was an error updating the data');
  });

  it('should return a 401 if the date given is in the future', async () => {
    const futureDate = new Date();
    const newData = { ...dataData, date: futureDate.setDate(futureDate.getDate() + 5) };

    const response = await request(app)
      .patch(`/farms/${farm.uuid}/data/${data.uuid}`)
      .send({ data: newData });

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('Cannot input a future date');
  });

  it('should return a 401 if the float after delivery is less than the float before', async () => {
    const newData = { ...dataData, floatAfterDelivery: dataData.floatBeforeDelivery - 1 };

    const response = await request(app)
      .patch(`/farms/${farm.uuid}/data/${data.uuid}`)
      .send({ data: newData });

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('The float after delivery cannot be less than the float before delivery');
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(Data, 'update').throws(() => new Error());

    const newData = { ...dataData, noOfCows: dataData.noOfCows + 3 };
    
    const response = await request(app)
      .patch(`/farms/${farm.uuid}/data/${data.uuid}`)
      .send({ data: newData });

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  }); 
});
