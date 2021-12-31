const { expect } = require('chai');
const request = require('supertest');
const { Data, Farm } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');

describe('POST /farms/:farmId/data', () => {
  let farm;
  let newData;

  before(async () => Data.sequelize.sync());

  afterEach(async () => {
    await Data.destroy({ where: {} });
    await Farm.destroy({ where: {} });
  });

  beforeEach(async () => {
    const farmData = DataFactory.farm();
    const response = await request(app).post('/farms').send({ farm: farmData });
    farm = response.body.farm;
    newData = DataFactory.data({ farmFk: farm.uuid });
  });

  it('adds a new set of data to the database', async () => {
    const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: newData });

    const { id } = response.body.data; 
    const newDataRecord = await Data.findByPk(id, { raw: true });

    expect(response.status).to.equal(201);

    expect(newDataRecord).to.have.property('uuid');
    // expect(new Date(newData.date)).to.deep.equal(newData.date);
    expect(newDataRecord.noOfCows).to.equal(newData.noOfCows);
    expect(newDataRecord.product).to.equal(newData.product);
    expect(parseInt(newDataRecord.quantity)).to.equal(newData.quantity);
    expect(parseInt(newDataRecord.meterReading)).to.equal(newData.meterReading);
    expect(parseInt(newDataRecord.waterUsage)).to.equal(newData.waterUsage);
    expect(parseInt(newDataRecord.pumpDial)).to.equal(newData.pumpDial);
    expect(parseInt(newDataRecord.floatBeforeDelivery)).to.equal(newData.floatBeforeDelivery);
    expect(parseInt(newDataRecord.kgActual)).to.equal(newData.kgActual);
    expect(parseInt(newDataRecord.targetFeedRate)).to.equal(newData.targetFeedRate);
    expect(parseInt(newDataRecord.floatAfterDelivery)).to.equal(newData.floatAfterDelivery);
    expect(newDataRecord.comments).to.equal(newData.comments);
  });

  it('a new set of data to the database without comments when they are not included', async () => {
    const { comments, ...noComments } = newData;

    const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: noComments });
    const { id } = response.body.data; 
    const newDataRecord = await Data.findByPk(id, { raw: true });

    expect(response.status).to.equal(201);

    expect(newDataRecord).to.have.property('uuid');
    // expect(new Date(newData.date)).to.deep.equal(newData.date);
    expect(newDataRecord.noOfCows).to.equal(newData.noOfCows);
    expect(newDataRecord.product).to.equal(newData.product);
    expect(parseInt(newDataRecord.quantity)).to.equal(newData.quantity);
    expect(parseInt(newDataRecord.meterReading)).to.equal(newData.meterReading);
    expect(parseInt(newDataRecord.waterUsage)).to.equal(newData.waterUsage);
    expect(parseInt(newDataRecord.pumpDial)).to.equal(newData.pumpDial);
    expect(parseInt(newDataRecord.floatBeforeDelivery)).to.equal(newData.floatBeforeDelivery);
    expect(parseInt(newDataRecord.kgActual)).to.equal(newData.kgActual);
    expect(parseInt(newDataRecord.targetFeedRate)).to.equal(newData.targetFeedRate);
    expect(parseInt(newDataRecord.floatAfterDelivery)).to.equal(newData.floatAfterDelivery);
    expect(newDataRecord.comments).to.be.null;
  });

  describe('farmFk', () => {
    it('returns 401 when the farmFk field is null', async () => {
      const { farmFk, ...noFarmFk } = newData;  
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: noFarmFk });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("Data.farmFk cannot be null");
    });
  });

  describe('date', () => {
    it('returns 401 when the date field is null', async () => {
      const { date, ...noDate } = newData; 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: noDate });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The date must be given");
    });
  
    it('returns 401 when the date field is empty', async () => {
      const dataEmptyDate = { ...newData, date: '' } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataEmptyDate });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The date must be given");
    });
  
    it('returns 401 when the date is a future date', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dataWithFutureDate = { ...newData, date: tomorrow } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataWithFutureDate });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("Cannot input a future date");
    });
  });

  describe('noOfCows', () => {
    it('returns 401 when the number of cows field is null', async () => {
      const { noOfCows, ...noNoOfCows } = newData; 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: noNoOfCows });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The number of cows must be given");
    });
  
    it('returns 401 when the number of cows field is empty', async () => {
      const dataEmptyNoOfCows = { ...newData, noOfCows: '' } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataEmptyNoOfCows });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The number of cows must be given");
    });
  });

  describe('product', () => {
    it('returns 401 when the product field is null', async () => {
      const { product, ...noProduct } = newData; 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: noProduct });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The product must be given");
    });
  
    it('returns 401 when the product field is empty', async () => {
      const dataEmptyProduct = { ...newData, product: '' } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataEmptyProduct });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The product must be given");
    });
  });

  describe('quantity', () => {
    it('returns 401 when the quantity field is null', async () => {
      const { quantity, ...noQuantity } = newData; 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: noQuantity });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The product quantity must be given");
    });
  
    it('returns 401 when the quantity field is empty', async () => {
      const dataEmptyQuantity = { ...newData, quantity: '' } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataEmptyQuantity });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The product quantity must be given");
    });
  
    it('returns 401 when the quantity field is a negative number', async () => {
      const dataNegativeQuantity = { ...newData, quantity: -1 } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataNegativeQuantity });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The product quantity cannot be a negative number");
    });
  });

  describe('meterReading', () => {
    it('returns 401 when the meter reading field is null', async () => {
      const { meterReading, ...noMeterReading } = newData; 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: noMeterReading });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The meter reading must be given");
    });
  
    it('returns 401 when the meter reading field is empty', async () => {
      const dataEmptyMeterReading = { ...newData, meterReading: '' } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataEmptyMeterReading });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The meter reading must be given");
    });
  
    it('returns 401 when the meter reading field is a negative number', async () => {
      const dataNegativeMeterReading = { ...newData, meterReading: -1 } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataNegativeMeterReading });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The meter reading cannot be a negative number");
    });
  });

  describe('waterUsage', () => {
    it('returns 401 when the water usage field is null', async () => {
      const { waterUsage, ...noWaterUsage } = newData; 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: noWaterUsage });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The water usage must be given");
    });
  
    it('returns 401 when the water usage field is empty', async () => {
      const dataEmptyWaterUsage = { ...newData, waterUsage: '' } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataEmptyWaterUsage });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The water usage must be given");
    });
  
    it('returns 401 when the water usage field is a negative number', async () => {
      const dataNegativeWaterUsage = { ...newData, waterUsage: -1 } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataNegativeWaterUsage });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The water usage cannot be a negative number");
    });
  });

  describe('pumpDial', () => {
    it('returns 401 when the pump dial field is null', async () => {
      const { pumpDial, ...noPumpDial } = newData; 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: noPumpDial });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The pump dial must be given");
    });
  
    it('returns 401 when the pump dial field is empty', async () => {
      const dataEmptyPumpDial = { ...newData, pumpDial: '' } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataEmptyPumpDial });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The pump dial must be given");
    });
  
    it('returns 401 when the pump dial field is a negative number', async () => {
      const dataNegativePumpDial = { ...newData, pumpDial: -1 } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataNegativePumpDial });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The pump dial cannot be a negative number");
    });
  });

  describe('floatBeforeDelivery', () => {
    it('returns 401 when the float before delivery field is null', async () => {
      const { floatBeforeDelivery, ...noFloatBeforeDelivery } = newData; 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: noFloatBeforeDelivery });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The float before delivery must be given");
    });
  
    it('returns 401 when the float before delivery field is empty', async () => {
      const dataEmptyFloatBeforeDelivery = { ...newData, floatBeforeDelivery: '' } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataEmptyFloatBeforeDelivery });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The float before delivery must be given");
    });
  
    it('returns 401 when the float before delivery field is a negative number', async () => {
      const dataNegativeFloatBeforeDelivery = { ...newData, floatBeforeDelivery: -1 } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataNegativeFloatBeforeDelivery });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The float before delivery cannot be a negative number");
    });
  });

  describe('kgActual', () => {
    it('returns 401 when the kg actual field is null', async () => {
      const { kgActual, ...noKgActual } = newData; 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: noKgActual });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The kg actual must be given");
    });
  
    it('returns 401 when the kg actual field is empty', async () => {
      const dataEmptyKgActual = { ...newData, kgActual: '' } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataEmptyKgActual });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The kg actual must be given");
    });
  
    it('returns 401 when the kg actual field is a negative number', async () => {
      const dataNegativeKgActual = { ...newData, kgActual: -1 } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataNegativeKgActual });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The kg actual cannot be a negative number");
    });
  });

  describe('targetFeedRate', () => {
    it('returns 401 when the target feed rate field is null', async () => {
      const { targetFeedRate, ...noTargetFeedRate } = newData; 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: noTargetFeedRate });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The target feed rate must be given");
    });
  
    it('returns 401 when the target feed rate field is empty', async () => {
      const dataEmptyTargetFeedRate = { ...newData, targetFeedRate: '' } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataEmptyTargetFeedRate });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The target feed rate must be given");
    });
  
    it('returns 401 when the target feed rate field is a negative number', async () => {
      const dataNegativeTargetFeedRate = { ...newData, targetFeedRate: -1 } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataNegativeTargetFeedRate });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The target feed rate cannot be a negative number");
    });
  });

  describe('floatAfterDelivery', () => {
    it('returns 401 when the float after delivery field is null', async () => {
      const { floatAfterDelivery, ...noFloatAfterDelivery } = newData; 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: noFloatAfterDelivery });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The float after delivery must be given");
    });
  
    it('returns 401 when the float after delivery field is empty', async () => {
      const dataEmptyFloatAfterDelivery = { ...newData, floatBeforeDelivery: 0, floatAfterDelivery: '' } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataEmptyFloatAfterDelivery });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The float after delivery must be given");
    });

    it('returns 401 when the float after delivery field is lower than the float before delivery', async () => {
      const dataSmallerFloatAfterDelivery = { ...newData, floatBeforeDelivery: 20, floatAfterDelivery: 10 } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataSmallerFloatAfterDelivery });
  
      expect(response.status).to.equal(401);
      expect(response.body.error.errors[0].message).to.equal("The float after delivery cannot be less than the float before delivery");
    });
  });
});