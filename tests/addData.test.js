const { expect } = require('chai');
const request = require('supertest');
const { Data } = require('../src/models');
const DataFactory = require('./helpers/data-factory');
const app = require('../src/app');

describe('POST /farms/:farmId/data', () => {
  const farmData = DataFactory.farm();
  let farm;

  before(async () => Data.sequelize.sync());

  afterEach(async () => {
    await Data.destroy({ where: {} });
  });

  beforeEach(async () => {
    response = await request(app).post('/farms').send({ farm: farmData });
    farm = response.body.farm;
  });

  it('a new set of data to the database', async () => {
    const newData = DataFactory.data({ farmFk: farm.uuid });

    const response = await request(app).post(`/farms/${farm.uuid}/data`).send({ data: newData });
    const { id } = response.body.data; 
    const newDataRecord = await Data.findByPk(id, { raw: true });

    expect(response.status).to.equal(201);

    expect(newData.uuid).to.equal(newData.uuid);
    
    expect(new Date(newData.date)).to.deep.equal(newData.date);
    expect(newData.noOfCows).to.equal(newData.noOfCows);
    expect(newData.product).to.equal(newData.product);
    expect(newData.quantity).to.equal(newData.quantity);
    expect(newData.meterReading).to.equal(newData.meterReading);
    expect(newData.waterUsage).to.equal(newData.waterUsage);
    expect(newData.pumpDial).to.equal(newData.pumpDial);
    expect(newData.floatBeforeDelivery).to.equal(newData.floatBeforeDelivery);
    expect(newData.kgActual).to.equal(newData.kgActual);
    expect(newData.targetFeedRate).to.equal(newData.targetFeedRate);
    expect(newData.floatAfterDelivery).to.equal(newData.floatAfterDelivery);
    expect(newData.comments).to.equal(newData.comments);
  });

  xit('creates a new farm in the database with access codes and comment section defaulting to null', async () => {
    const response = await request(app).post('/farms').send({ farm: newFarm });
    const newFarmRecord = await Farm.findByPk(response.body.farm.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(response.body.farm.farmName).to.equal('New Farm');
    expect(response.body.farm.postcode).to.equal('NE3 4RM');
    expect(response.body.farm.contactName).to.equal('Farmer Giles');
    expect(response.body.farm.contactNumber).to.equal('01234567890');
    expect(response.body.farm.status).to.equal('enabled');
    expect(response.body.farm.accessCodes).to.be.null;
    expect(response.body.farm.comments).to.be.null;

    expect(newFarmRecord).to.contain(newFarm);
  });

  xit('returns 401 when the farmName field is null', async () => {
    const { farmName, ...noFarmName } = newFarm;  
    const response = await request(app).post('/farms').send({ farm: noFarmName });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Farm name must be given");
  });

  xit('returns 401 when the farmName field is empty string', async () => {
    const farmEmptyName = { ...newFarm, farmName: '' };
    const response = await request(app).post('/farms').send({ farm: farmEmptyName });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Farm name must be given");
  });

  xit('returns 401 when the postcode field is null', async () => {
    const { postcode, ...noPostcode } = newFarm;  
    const response = await request(app).post('/farms').send({ farm: noPostcode });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Postcode must be given");
  });

  xit('returns 401 when the postcode field is empty', async () => {
    const farmEmptyPostcode = { ...newFarm, postcode: '' };
    const response = await request(app).post('/farms').send({ farm: farmEmptyPostcode });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Postcode must be given");
  });

  xit('returns 401 when the contactName field is null', async () => {
    const { contactName, ...noContactName } = newFarm;  
    const response = await request(app).post('/farms').send({ farm: noContactName });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Contact name must be given");
  });

  xit('returns 401 when the contactName field is empty', async () => {
    const farmEmptyContactName = { ...newFarm, contactName: '' };
    const response = await request(app).post('/farms').send({ farm: farmEmptyContactName});

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Contact name must be given");
  });

  xit('returns 401 when the contactNumber field is null', async () => {
    const { contactNumber, ...noContactNumber } = newFarm;  
    const response = await request(app).post('/farms').send({ farm: noContactNumber });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Contact number must be given");
  });

  xit('returns 401 when the contactNumber field is empty', async () => {
    const farmEmptyContactNumber = { ...newFarm, contactNumber: '' };
    const response = await request(app).post('/farms').send({ farm: farmEmptyContactNumber });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Contact number must be given");
  });
});