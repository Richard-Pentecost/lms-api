const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Data, Farm, Product } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('POST /farms/:farmId/data', () => {
  let farm;
  let previousData;
  let newData;

  afterEach(async () => {
    sinon.restore();
    await Data.destroy({ where: {} });
    await Farm.destroy({ where: {} });
    await Product.destroy({ where: {} });
  });

  beforeEach(async () => {
    sinon.stub(jwt, 'verify').returns({ isAdmin: true });
    const farmData = DataFactory.farm();
    const product = await Product.create(DataFactory.product({ specificGravity: 2.8 }));
    const response = await request(app).post('/farms').send({ farm: farmData, products: [product.uuid] });
    farm = response.body.farm;

    previousData = await Data.create(DataFactory.data({ 
      date: new Date('09/16/2021'),
      farmFk: farm.uuid,
      product: product.productName,
      meterReading: 1880,
      floatBeforeDelivery: 100,
      floatAfterDelivery: 131, 
    }));

    newData = DataFactory.data({ 
      date: new Date('10/01/2021'), 
      farmFk: farm.uuid, 
      product: product.productName,
      meterReading: 1995,
      noOfCows: 120,
      floatBeforeDelivery: 106,
      floatAfterDelivery: 120,
    });
    sinon.restore();
    sinon.stub(jwt, 'verify').returns({ isAdmin: false });
  });

  it('adds a new set of data to the database', async () => {
    const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: newData, previousDataUuid: previousData.uuid });
    const { id } = response.body.data; 
    const newDataRecord = await Data.findByPk(id, { raw: true });

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal('success');
    expect(newDataRecord).to.have.property('uuid');
    expect(newDataRecord.averageWaterIntake).not.to.be.null;
    expect(newDataRecord.actualFeedRate).not.to.be.null;
    expect(newDataRecord.farmFk).to.equal(newData.farmFk);
    // expect(new Date(newData.date)).to.deep.equal(newData.date);
    expect(newDataRecord.noOfCows).to.equal(newData.noOfCows);
    expect(newDataRecord.product).to.equal(newData.product);
    expect(+newDataRecord.quantity).to.equal(newData.quantity);
    expect(+newDataRecord.meterReading).to.equal(newData.meterReading);
    expect(+newDataRecord.waterUsage).to.equal(newData.waterUsage);
    expect(+newDataRecord.pumpDial).to.equal(newData.pumpDial);
    expect(+newDataRecord.floatBeforeDelivery).to.equal(newData.floatBeforeDelivery);
    expect(+newDataRecord.kgActual).to.exist;
    expect(+newDataRecord.averageWaterIntake).to.exist;
    expect(+newDataRecord.actualFeedRate).to.exist;
    expect(+newDataRecord.targetFeedRate).to.equal(newData.targetFeedRate);
    expect(+newDataRecord.floatAfterDelivery).to.equal(newData.floatAfterDelivery);
    expect(newDataRecord.comments).to.equal(newData.comments);
  });

  it('adds a new set of data to the database with no averageWaterIntake, kgActual actualFeedRate when there is no previous data', async () => {
    const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: newData });
    const { id } = response.body.data; 
    const newDataRecord = await Data.findByPk(id, { raw: true });

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal('success');
    expect(newDataRecord).to.have.property('uuid');
    expect(newDataRecord.averageWaterIntake).to.be.null;
    expect(newDataRecord.actualFeedRate).to.be.null;
    expect(newDataRecord.farmFk).to.equal(newData.farmFk);
    // expect(new Date(newData.date)).to.deep.equal(newData.date);
    expect(newDataRecord.noOfCows).to.equal(newData.noOfCows);
    expect(newDataRecord.product).to.equal(newData.product);
    expect(+newDataRecord.quantity).to.equal(newData.quantity);
    expect(+newDataRecord.meterReading).to.equal(newData.meterReading);
    expect(+newDataRecord.waterUsage).to.equal(newData.waterUsage);
    expect(+newDataRecord.pumpDial).to.equal(newData.pumpDial);
    expect(+newDataRecord.floatBeforeDelivery).to.equal(newData.floatBeforeDelivery);
    expect(newDataRecord.kgActual).not.to.exist;
    expect(newDataRecord.averageWaterIntake).not.to.exist;
    expect(newDataRecord.actualFeedRate).not.to.exist;
    expect(+newDataRecord.targetFeedRate).to.equal(newData.targetFeedRate);
    expect(+newDataRecord.floatAfterDelivery).to.equal(newData.floatAfterDelivery);
    expect(newDataRecord.comments).to.equal(newData.comments);
  });

  it('adds a new set of data to the database without comments when they are not included', async () => {
    const { comments, ...noComments } = newData;

    const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: noComments, previousDataUuid: previousData.uuid });
    const { id } = response.body.data; 
    const newDataRecord = await Data.findByPk(id, { raw: true });

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal('success');
    expect(newDataRecord).to.have.property('uuid');
    // expect(new Date(newData.date)).to.deep.equal(newData.date);
    expect(newDataRecord.noOfCows).to.equal(newData.noOfCows);
    expect(newDataRecord.product).to.equal(newData.product);
    expect(+newDataRecord.quantity).to.equal(newData.quantity);
    expect(+newDataRecord.meterReading).to.equal(newData.meterReading);
    expect(+newDataRecord.waterUsage).to.equal(newData.waterUsage);
    expect(+newDataRecord.pumpDial).to.equal(newData.pumpDial);
    expect(+newDataRecord.floatBeforeDelivery).to.equal(newData.floatBeforeDelivery);
    expect(+newDataRecord.kgActual).to.exist;
    expect(+newDataRecord.averageWaterIntake).to.exist;
    expect(+newDataRecord.actualFeedRate).to.exist;
    expect(+newDataRecord.targetFeedRate).to.equal(newData.targetFeedRate);
    expect(+newDataRecord.floatAfterDelivery).to.equal(newData.floatAfterDelivery);
    expect(newDataRecord.comments).to.be.null;
  });

  it('adds a new set of data to the database with no averageWaterIntake, kgActual or actualFeedRate when there is no previous data', async () => {
    const invalidUuid = DataFactory.uuid;
  
    const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: newData,  previousDataUuid: invalidUuid });
    const { id } = response.body.data; 
    const newDataRecord = await Data.findByPk(id, { raw: true });

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal('Data was added, but there was an error with the calculations');
    expect(newDataRecord).to.have.property('uuid');
    expect(newDataRecord.averageWaterIntake).to.be.null;
    expect(newDataRecord.actualFeedRate).to.be.null;
    expect(newDataRecord.farmFk).to.equal(newData.farmFk);
    // expect(new Date(newData.date)).to.deep.equal(newData.date);
    expect(newDataRecord.noOfCows).to.equal(newData.noOfCows);
    expect(newDataRecord.product).to.equal(newData.product);
    expect(+newDataRecord.quantity).to.equal(newData.quantity);
    expect(+newDataRecord.meterReading).to.equal(newData.meterReading);
    expect(+newDataRecord.waterUsage).to.equal(newData.waterUsage);
    expect(+newDataRecord.pumpDial).to.equal(newData.pumpDial);
    expect(+newDataRecord.floatBeforeDelivery).to.equal(newData.floatBeforeDelivery);
    expect(newDataRecord.kgActual).not.to.exist;
    expect(newDataRecord.averageWaterIntake).not.to.exist;
    expect(newDataRecord.actualFeedRate).not.to.exist;
    expect(+newDataRecord.targetFeedRate).to.equal(newData.targetFeedRate);
    expect(+newDataRecord.floatAfterDelivery).to.equal(newData.floatAfterDelivery);
    expect(newDataRecord.comments).to.equal(newData.comments);
  });

  it('adds a new set of data to the database with no averageWaterIntake, kgActual or actualFeedRate when there is no specific gravity', async () => {
    const dataWithInvalidProduct = { ...newData, product: 'invalidProduct' };
    const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataWithInvalidProduct,  previousDataUuid: previousData.uuid });
    const { id } = response.body.data; 
    const newDataRecord = await Data.findByPk(id, { raw: true });

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal('Data was added, but there was an error with the calculations');
    expect(newDataRecord).to.have.property('uuid');
    expect(newDataRecord.averageWaterIntake).to.be.null;
    expect(newDataRecord.actualFeedRate).to.be.null;
    expect(newDataRecord.farmFk).to.equal(newData.farmFk);
    // expect(new Date(newData.date)).to.deep.equal(newData.date);
    expect(newDataRecord.noOfCows).to.equal(newData.noOfCows);
    expect(newDataRecord.product).to.equal(dataWithInvalidProduct.product);
    expect(+newDataRecord.quantity).to.equal(newData.quantity);
    expect(+newDataRecord.meterReading).to.equal(newData.meterReading);
    expect(+newDataRecord.waterUsage).to.equal(newData.waterUsage);
    expect(+newDataRecord.pumpDial).to.equal(newData.pumpDial);
    expect(+newDataRecord.floatBeforeDelivery).to.equal(newData.floatBeforeDelivery);
    expect(newDataRecord.kgActual).not.to.exist;
    expect(newDataRecord.averageWaterIntake).not.to.exist;
    expect(newDataRecord.actualFeedRate).not.to.exist;
    expect(+newDataRecord.targetFeedRate).to.equal(newData.targetFeedRate);
    expect(+newDataRecord.floatAfterDelivery).to.equal(newData.floatAfterDelivery);
    expect(newDataRecord.comments).to.equal(newData.comments);
  });

  describe('farmFk', () => {
    it('returns 401 when the farmFk field is null', async () => {
      const { farmFk, ...noFarmFk } = newData;  
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: noFarmFk });
  
      expect(response.status).to.equal(401);
      expect(response.body.error).to.equal("Farm foreign key must be given");
    });

    it('returns 401 when the farmFk is invalid', async () => {
      const invalidFarmId = DataFactory.uuid;
      const invalidFarmFk = { ...newData, farmFk: invalidFarmId };  
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: invalidFarmFk });
  
      expect(response.status).to.equal(401);
      expect(response.body.error).to.equal("The farm this data is associated with, could not be found");
    });

    it('returns 401 when the farmFk is empty', async () => {
      const dataEmptyFarmFk = { ...newData, farmFk: '' } 
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: dataEmptyFarmFk });
  
      expect(response.status).to.equal(401);
      expect(response.body.error).to.equal("Farm foreign key must be given");
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

  describe('error thrown', () => {
    it('should return 500 if an error is thrown creating the data', async () => {
      sinon.stub(Data, 'create').throws(() => new Error());
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: newData });

      expect(response.status).to.equal(500);
      expect(response.body.error).to.equal('There was an error connecting to the database');
    });

    it('should return 500 if an error is thrown fetching the farm', async () => {
      sinon.stub(Farm, 'fetchFarmByUuid').throws(() => new Error());
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: newData });

      expect(response.status).to.equal(500);
      expect(response.body.error).to.equal('There was an error connecting to the database');
    });

    it('should return 500 if an error is thrown fetching the previousData', async () => {
      sinon.stub(Data, 'fetchPreviousDataForCalculations').throws(() => new Error());
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: newData, previousDataUuid: previousData.uuid });

      expect(response.status).to.equal(500);
      expect(response.body.error).to.equal('There was an error connecting to the database');
    });

    it('should return 500 if an error is thrown fetching the specific gravity', async () => {
      sinon.stub(Product, 'fetchProductByName').throws(() => new Error());
      const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: newData, previousDataUuid: previousData.uuid });

      expect(response.status).to.equal(500);
      expect(response.body.error).to.equal('There was an error connecting to the database');
    });
  });
});