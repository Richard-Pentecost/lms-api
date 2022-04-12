const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Data, Product, Farm } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe.only('PATCH /farms/:farmId/data/:dataId', () => {
  let farm;
  let previousData;
  let data;
  let dataObj;
  let product;

  afterEach(async () => {
    sinon.restore();
    await Data.destroy({ where: {} });
    await Farm.destroy({ where: {} });
    await Product.destroy({ where: {} });
  });

  beforeEach(async () => {
    // mock jwt token with isAdmin set to true, to allow post('/farms') to work
    sinon.stub(jwt, 'verify').returns({ isAdmin: true });
    const farmData = DataFactory.farm();
    product = await Product.create(DataFactory.product({ specificGravity: 1 }));
    const response = await request(app).post('/farms').send({ farm: farmData, products: [product.uuid] });
    farm = response.body.farm;

    previousData = await Data.create(DataFactory.fullData({
      date: new Date('09/16/2021'),
      farmFk: farm.uuid,
      product: product.productName,
      noOfCows: 120,
      meterReading: 1880,
      waterUsage: 60,
      kgActual: 108,
      pumpDial: 100,
      averageWaterIntake: 73.8,
      floatBeforeDelivery: 108,
      targetFeedRate: 5,
      actualFeedRate: 5,
      floatAfterDelivery: 108,
    }));

    dataObj = DataFactory.fullData({
      date: new Date('10/01/2021'),
      farmFk: farm.uuid,
      product: product.productName,
      noOfCows: 120,
      meterReading: 1995,
      waterUsage: 40,
      kgActual: 99,
      pumpDial: 100,
      averageWaterIntake: 63.9,
      floatBeforeDelivery: 99,
      targetFeedRate: 5,
      actualFeedRate: 5,
      floatAfterDelivery: 99,
    });

    data = await Data.create(dataObj);

    // reset jwt token mock to set isAdmin to false for the data functionality
    sinon.restore();
    sinon.stub(jwt, 'verify').returns({ isAdmin: false });
  });

  it('should update the all data fields in the database when they have all been changed and redo calculations when there is previous data', async () => {
    const newData = DataFactory.data({ farmFk: farm.uuid, product: product.productName });

    const response = await request(app)
      .patch(`/farms/${farm.uuid}/data/${data.uuid}`)
      .send({ data: newData, previousDataUuid: previousData.uuid });

    expect(response.status).to.equal(201);
    
    const updatedData = await Data.findByPk(data.id, { raw: true });

    expect(updatedData).to.have.property('date');
    expect(updatedData.kgActual).to.exist;
    expect(updatedData.kgActual).not.to.equal(dataObj.kgActual);
    expect(updatedData.averageWaterIntake).to.exist;
    expect(updatedData.averageWaterIntake).not.to.equal(dataObj.averageWaterIntake);
    expect(updatedData.actualFeedRate).to.exist;
    expect(updatedData.actualFeedRate).not.to.equal(dataObj.actualFeedRate);
    expect(+updatedData.noOfCows).to.equal(newData.noOfCows);
    expect(updatedData.product).to.equal(newData.product);
    expect(+updatedData.quantity).to.equal(newData.quantity);
    expect(+updatedData.meterReading).to.equal(newData.meterReading);
    expect(+updatedData.waterUsage).to.equal(newData.waterUsage);
    expect(+updatedData.pumpDial).to.equal(newData.pumpDial);
    expect(+updatedData.floatBeforeDelivery).to.equal(newData.floatBeforeDelivery);
    expect(+updatedData.targetFeedRate).to.equal(newData.targetFeedRate);
    expect(+updatedData.floatAfterDelivery).to.equal(newData.floatAfterDelivery);
    expect(updatedData.comments).to.equal(newData.comments);
  });

  it('should update the data in the database with no averageWaterIntake and no actualFeedRate when there is no previous data', async () => {
    const dataNoCalcs = await Data.create(DataFactory.data({
      date: new Date('01/10/2021'),
      farmFk: farm.uuid,
      product: product.productName,
      noOfCows: 120,
      meterReading: 1995,
      waterUsage: 40,
      kgActual: 99,
      pumpDial: 100,
      floatBeforeDelivery: 99,
      targetFeedRate: 5,
      floatAfterDelivery: 99,
    }));
    
    const newData = DataFactory.data({ farmFk: farm.uuid, product: product.productName });

    const response = await request(app)
      .patch(`/farms/${farm.uuid}/data/${dataNoCalcs.uuid}`)
      .send({ data: newData });

    expect(response.status).to.equal(201);
    
    const updatedData = await Data.findByPk(dataNoCalcs.id, { raw: true });

    expect(updatedData).to.have.property('date');
    expect(updatedData.kgActual).to.exist;
    expect(updatedData.kgActual).not.to.equal(99);
    expect(updatedData.averageWaterIntake).not.to.exist;
    expect(updatedData.actualFeedRate).not.to.exist;
    expect(+updatedData.noOfCows).to.equal(newData.noOfCows);
    expect(updatedData.product).to.equal(newData.product);
    expect(+updatedData.quantity).to.equal(newData.quantity);
    expect(+updatedData.meterReading).to.equal(newData.meterReading);
    expect(+updatedData.waterUsage).to.equal(newData.waterUsage);
    expect(+updatedData.pumpDial).to.equal(newData.pumpDial);
    expect(+updatedData.floatBeforeDelivery).to.equal(newData.floatBeforeDelivery);
    expect(+updatedData.targetFeedRate).to.equal(newData.targetFeedRate);
    expect(+updatedData.floatAfterDelivery).to.equal(newData.floatAfterDelivery);
    expect(updatedData.comments).to.equal(newData.comments);
  });

  it('should update only specific data fields in the database when only those fields have been changed', async () => {
    const newData = { ...dataObj, targetFeedRate: dataObj.targetFeedRate + 3 };

    const response = await request(app)
      .patch(`/farms/${farm.uuid}/data/${data.uuid}`)
      .send({ data: newData, previousDataUuid: previousData.uuid });

    expect(response.status).to.equal(201);
    
    const updatedData = await Data.findByPk(data.id, { raw: true });

    expect(updatedData).to.have.property('date');
    expect(+updatedData.noOfCows).to.equal(dataObj.noOfCows);
    expect(+updatedData.kgActual).to.equal(dataObj.kgActual);
    expect(+updatedData.averageWaterIntake).to.equal(dataObj.averageWaterIntake);
    expect(+updatedData.actualFeedRate).to.equal(dataObj.actualFeedRate);
    expect(updatedData.product).to.equal(dataObj.product);
    expect(+updatedData.quantity).to.equal(dataObj.quantity);
    expect(+updatedData.meterReading).to.equal(dataObj.meterReading);
    expect(+updatedData.waterUsage).to.equal(dataObj.waterUsage);
    expect(+updatedData.pumpDial).to.equal(dataObj.pumpDial);
    expect(+updatedData.floatBeforeDelivery).to.equal(dataObj.floatBeforeDelivery);
    expect(+updatedData.targetFeedRate).to.equal(newData.targetFeedRate);
    expect(+updatedData.floatAfterDelivery).to.equal(dataObj.floatAfterDelivery);
    expect(updatedData.comments).to.equal(dataObj.comments);
  });

  it('should update the data in the database with no averageWaterIntake and no actualFeedRate when the previousData uuid is invalid', async () => {
    const invalidUuid = DataFactory.uuid;

    const newData = DataFactory.data({ farmFk: farm.uuid, product: product.productName });

    const response = await request(app)
      .patch(`/farms/${farm.uuid}/data/${data.uuid}`)
      .send({ data: newData, previousDataUuid: invalidUuid });

    expect(response.status).to.equal(201);
    
    const updatedData = await Data.findByPk(data.id, { raw: true });

    expect(updatedData).to.have.property('date');
    expect(updatedData.kgActual).to.exist;
    expect(updatedData.kgActual).not.to.equal(99);
    expect(updatedData.averageWaterIntake).not.to.exist;
    expect(updatedData.actualFeedRate).not.to.exist;
    expect(+updatedData.noOfCows).to.equal(newData.noOfCows);
    expect(updatedData.product).to.equal(newData.product);
    expect(+updatedData.quantity).to.equal(newData.quantity);
    expect(+updatedData.meterReading).to.equal(newData.meterReading);
    expect(+updatedData.waterUsage).to.equal(newData.waterUsage);
    expect(+updatedData.pumpDial).to.equal(newData.pumpDial);
    expect(+updatedData.floatBeforeDelivery).to.equal(newData.floatBeforeDelivery);
    expect(+updatedData.targetFeedRate).to.equal(newData.targetFeedRate);
    expect(+updatedData.floatAfterDelivery).to.equal(newData.floatAfterDelivery);
    expect(updatedData.comments).to.equal(newData.comments);
  });

  it('should return a 401 if the data does not exist', async () => {
    const invalidUuid = DataFactory.uuid;
    const newData = { ...dataObj, noOfCows: dataObj.noOfCows + 3 };

    const response = await request(app)
      .patch(`/farms/${farm.uuid}/data/${invalidUuid}`)
      .send({ data: newData });

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('There was an error updating the data');
  });

  it('should return a 401 if the date given is in the future', async () => {
    const futureDate = new Date();
    const newData = { ...dataObj, date: futureDate.setDate(futureDate.getDate() + 5) };

    const response = await request(app)
      .patch(`/farms/${farm.uuid}/data/${data.uuid}`)
      .send({ data: newData });

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('Cannot input a future date');
  });

  it('should return a 401 if the float after delivery is less than the float before', async () => {
    const newData = { ...dataObj, floatAfterDelivery: dataObj.floatBeforeDelivery - 1 };
    
    const response = await request(app)
      .patch(`/farms/${farm.uuid}/data/${data.uuid}`)
      .send({ data: newData });

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('The float after delivery cannot be less than the float before delivery');
  });

  it('should return a 401 if the farm could not be found', async () => {
    const invalidUuid = DataFactory.uuid;

    const response = await request(app)
      .patch(`/farms/${invalidUuid}/data/${data.uuid}`)
      .send({ data: { ...data, farmFk: invalidUuid }, previousDataUuid: previousData.uuid });
    
    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('The farm this data is associated with could not be found');
  });

  it('should return a 500 if an error is thrown fetching a farm', async () => {
    sinon.stub(Farm, 'fetchFarmByUuid').throws(() => new Error());

    const response = await request(app)
      .patch(`/farms/${farm.uuid}/data/${data.uuid}`)
      .send({ data, previousDataUuid: previousData.uuid });
    
    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });

  it('should return a 500 if an error is thrown updating the data', async () => {
    sinon.stub(Data, 'update').throws(() => new Error());

    const newData = { ...dataObj, noOfCows: dataObj.noOfCows + 3 };
    
    const response = await request(app)
      .patch(`/farms/${farm.uuid}/data/${data.uuid}`)
      .send({ data: newData });

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  }); 
});
