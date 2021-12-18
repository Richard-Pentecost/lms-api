const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Data, Farm } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');

describe('/GET /farms/:farmId/data', () => {
  let farm;
  let newData;

  before(async () => Data.sequelize.sync());

  afterEach(async () => {
    await Data.destroy({ where: {} });
    await Farm.destroy({ where: {} });
    sinon.restore();
  });

  beforeEach(async () => {
    const farmData = DataFactory.farm();
    farm = await Farm.create(farmData);
    const dataData = DataFactory.data({ farmFk: farm.uuid });
    newData = await Data.create(dataData);
  });

  describe('getDataByFarmId', () => {
    it('should retrieve the data from the database', async () => {
      const response = await request(app).get(`/farms/${farm.uuid}/data`)
    
      const data = response.body.data[0];

      expect(response.status).to.equal(201);
      expect(data.uuid).to.equal(newData.uuid);
      expect(data.farmFk).to.equal(newData.farmFk);
      // expect(new Date(data.date)).to.deep.equal(newData.date);
      expect(data.noOfCows).to.equal(newData.noOfCows);
      expect(data.product).to.equal(newData.product);
      expect(data.quantity).to.equal(newData.quantity);
      expect(data.meterReading).to.equal(newData.meterReading);
      expect(data.waterUsage).to.equal(newData.waterUsage);
      // expect(data.averageWaterIntake).to.equal(newData.averageWaterIntake);
      expect(data.pumpDial).to.equal(newData.pumpDial);
      expect(data.floatBeforeDelivery).to.equal(newData.floatBeforeDelivery);
      expect(data.kgActual).to.equal(newData.kgActual);
      expect(data.targteFeedRate).to.equal(newData.targteFeedRate);
      // expect(data.actualFeedRate).to.equal(newData.actualFeedRate);
      expect(data.floatAfterDelivery).to.equal(newData.floatAfterDelivery);
      expect(data.comments).to.equal(newData.comments);
    });

    it('retrieves all the data for a given farm from the database', async () => {
      await Data.create(DataFactory.data({ farmFk: farm.uuid }));
      const secondFarm = await Farm.create(DataFactory.farm());
      await Data.create(DataFactory.data({ farmFk: secondFarm.uuid }));

      const totalDataRecords = await Data.findAll();
      const response = await request(app).get(`/farms/${farm.uuid}/data`);
      
      expect(response.status).to.equal(201);
      expect(response.body.data.length).to.equal(2);
      expect(totalDataRecords.length).to.equal(3);
    })

    it('returns a 401 if the farm does not exist', async () => {
      const invalidUuid = DataFactory.uuid;
      const response = await request(app).get(`/farms/${invalidUuid}/data`);
    
      expect(response.status).to.equal(401);
      expect(response.body.error).to.equal('The farm could not be found');
    });

    it('returns a 401 if the data is not retrieved', async () => {
      sinon.stub(Data, 'findAll').returns(null);  // .callsFake(() => {}) can be used instead of returns

      const response = await request(app).get(`/farms/${farm.uuid}/data`);

      expect(response.status).to.equal(401);
      expect(response.body.error).to.equal('Could not retrieve data for this farm');
    });

    it('returns a 500 if an error is thrown', async () => {
      sinon.stub(Farm, 'findOne').throws(() => new Error());

      const response = await request(app).get(`/farms/${farm.uuid}/data`);

      expect(response.status).to.equal(500);
      expect(response.body.error).to.equal('There was an error connecting to the database');
    });
  });

  describe('defaultScope', () => {
    it('should return a farm without the id, createdAt or updatedAt field', async () => {
      const response = await request(app).get(`/farms/${farm.uuid}/data`);

      expect(response.body.data[0]).not.to.have.property('id');
      expect(response.body.data[0]).not.to.have.property('createdAt');
      expect(response.body.data[0]).not.to.have.property('updatedAt');
    });
  });
});