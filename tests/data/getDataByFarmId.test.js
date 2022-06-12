const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Data, Farm, Product } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('/GET /farms/:farmId/data', () => {
  let farm;
  let dataArr;
  let product1;
  let product2;

  afterEach(async () => {
    await Data.destroy({ where: {} });
    await Farm.destroy({ where: {} });
    await Product.destroy({ where: {} });
    sinon.restore();
  });

  beforeEach(async () => {
    sinon.stub(jwt, 'verify').returns({ isAdmin: true });
    product1 = await Product.create(DataFactory.product({ specificGravity: 1 }));
    product2 = await Product.create(DataFactory.product({ specificGravity: 2 }));
    
    const farmData = DataFactory.farm();
    const response = await request(app).post('/farms').send({ farm: farmData, products: [{ uuid: product1.uuid, order: 1}, { uuid: product2.uuid, order: 2 }] });
    farm = response.body.farm;
    const secondFarmResponse = await request(app).post('/farms').send({ farm: DataFactory.farm(), products: [{ uuid: product1.uuid, order: 1 }] });

    dataArr = await Promise.all([
      Data.create(DataFactory.data({ farmFk: farm.uuid, date: new Date('01/01/2022'), product: product1.productName })),
      Data.create(DataFactory.data({ farmFk: farm.uuid, date: new Date('02/02/2022'), product: product2.productName })),
      Data.create(DataFactory.data({ farmFk: farm.uuid, date: new Date('02/02/2022'), product: product1.productName })),
      Data.create(DataFactory.data({ farmFk: secondFarmResponse.body.farm.uuid, date: new Date('01/01/2022'), product: product1.productName })),
      Data.create(DataFactory.data({ farmFk: farm.uuid, date: new Date('01/01/2022'), product: product2.productName })),
    ]);

    // reset jwt token mock to set isAdmin to false for the data functionality
    sinon.restore();
    sinon.stub(jwt, 'verify').returns({ isAdmin: false });
  });

  describe('getDataByFarmId', () => {
    it('should retrieve the data from the database for a given farm', async () => {
      const response = await request(app).get(`/farms/${farm.uuid}/data`);
    
      const totalDataRecords = await Data.findAll();

      expect(response.status).to.equal(201);
      expect(response.body.data.length).to.equal(4);
      expect(totalDataRecords.length).to.equal(5);
    
      const farmData = dataArr.filter(data => {
        return data.farmFk === farm.uuid;
      })

      response.body.data.forEach(data => {
        const expected = farmData.find(fData => fData.uuid === data.uuid);
        expect(data.farmFk).to.equal(expected.farmFk);
        expect(new Date(data.date)).to.deep.equal(expected.date);
        expect(data.noOfCows).to.equal(expected.noOfCows);
        expect(data.product).to.equal(expected.product);
        expect(data.quantity).to.equal(expected.quantity);
        expect(data.meterReading).to.equal(expected.meterReading);
        expect(data.waterUsage).to.equal(expected.waterUsage);
        expect(data.averageWaterIntake).to.equal(expected.averageWaterIntake);
        expect(data.pumpDial).to.equal(expected.pumpDial);
        expect(data.floatBeforeDelivery).to.equal(expected.floatBeforeDelivery);
        expect(data.kgActual).to.equal(expected.kgActual);
        expect(data.targteFeedRate).to.equal(expected.targteFeedRate);
        expect(data.actualFeedRate).to.equal(expected.actualFeedRate);
        expect(data.floatAfterDelivery).to.equal(expected.floatAfterDelivery);
        expect(data.comments).to.equal(expected.comments);
      })
    });

    it('should retrieve the data oredering it by date and then product order', async () => {
      const response = await request(app).get(`/farms/${farm.uuid}/data`);

      const data = response.body.data;

      expect(data[0].product).to.equal(product1.productName);
      expect(new Date(data[0].date)).to.deep.equal(new Date('01/01/2022'));
      expect(data[1].product).to.equal(product2.productName);
      expect(new Date(data[1].date)).to.deep.equal(new Date('01/01/2022'));
      expect(data[2].product).to.equal(product1.productName);
      expect(new Date(data[2].date)).to.deep.equal(new Date('02/02/2022'));
      expect(data[3].product).to.equal(product2.productName);
      expect(new Date(data[3].date)).to.deep.equal(new Date('02/02/2022'));
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