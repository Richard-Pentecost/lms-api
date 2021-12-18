const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Farm, Region } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');

describe('POST /farms', () => {
  let farm;
  before(async () => Farm.sequelize.sync());

  afterEach(async () => {
    sinon.restore();
    await Farm.destroy({ where: {} });
    await Region.destroy({ where: {} });
  });

  beforeEach(async () => {
    farm = DataFactory.farm();
  });

  it('creates a new farm in the database with region, access codes and comment section defaulting to null', async () => {
    const response = await request(app).post('/farms').send({ farm });
    const newFarmRecord = await Farm.findByPk(response.body.farm.id, { raw: true });

    expect(response.status).to.equal(201);

    expect(newFarmRecord).to.have.property('uuid');
    expect(newFarmRecord).not.to.have.property('id');
    expect(newFarmRecord.farmName).to.equal(farm.farmName);
    expect(newFarmRecord.postcode).to.equal(farm.postcode);
    expect(newFarmRecord.contactName).to.equal(farm.contactName);
    expect(newFarmRecord.contactNumber).to.equal(farm.contactNumber);
    expect(newFarmRecord.isActive).to.equal(true);
    expect(newFarmRecord.accessCodes).to.be.null;
    expect(newFarmRecord.comments).to.be.null;
    // expect(newFarmRecord.regionFk).to.be.null;
  });

  it('creates a new farm in the database', async () => {
    // const region = await Region.create({ regionName: 'North West' });
    const newCompleteFarm = {
      ...farm,
      accessCodes: 'access codes',
      comments: 'comments',
      // regionFk: region.uuid,
    };
    const response = await request(app).post('/farms').send({ farm: newCompleteFarm });
    const newFarmRecord = await Farm.findByPk(response.body.farm.id, { raw: true });

    expect(response.status).to.equal(201);

    expect(newFarmRecord).to.have.property('uuid');
    expect(newFarmRecord).not.to.have.property('id');
    expect(newFarmRecord.farmName).to.equal(newCompleteFarm.farmName);
    expect(newFarmRecord.postcode).to.equal(newCompleteFarm.postcode);
    expect(newFarmRecord.contactName).to.equal(newCompleteFarm.contactName);
    expect(newFarmRecord.contactNumber).to.equal(newCompleteFarm.contactNumber);
    expect(newFarmRecord.isActive).to.equal(true);
    expect(newFarmRecord.accessCodes).to.equal(newCompleteFarm.accessCodes);
    expect(newFarmRecord.comments).to.equal(newCompleteFarm.comments);
    // expect(newFarmRecord.regionFk).to.equal(region.uuid);
  });

  it('should return 401 when the farmName field is null', async () => {
    const { farmName, ...noFarmName } = farm;  
    const response = await request(app).post('/farms').send({ farm: noFarmName });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Farm name must be given");
  });

  it('should return 401 when the farmName field is empty string', async () => {
    const farmEmptyName = { ...farm, farmName: '' };
    const response = await request(app).post('/farms').send({ farm: farmEmptyName });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Farm name must be given");
  });

  it('should return 401 when the postcode field is null', async () => {
    const { postcode, ...noPostcode } = farm;  
    const response = await request(app).post('/farms').send({ farm: noPostcode });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Postcode must be given");
  });

  it('should return 401 when the postcode field is empty', async () => {
    const farmEmptyPostcode = { ...farm, postcode: '' };
    const response = await request(app).post('/farms').send({ farm: farmEmptyPostcode });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Postcode must be given");
  });

  it('should return 401 when the contactName field is null', async () => {
    const { contactName, ...noContactName } = farm;  
    const response = await request(app).post('/farms').send({ farm: noContactName });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Contact name must be given");
  });

  it('should return 401 when the contactName field is empty', async () => {
    const farmEmptyContactName = { ...farm, contactName: '' };
    const response = await request(app).post('/farms').send({ farm: farmEmptyContactName});

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Contact name must be given");
  });

  it('should return 401 when the contactNumber field is null', async () => {
    const { contactNumber, ...noContactNumber } = farm;  
    const response = await request(app).post('/farms').send({ farm: noContactNumber });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Contact number must be given");
  });

  it('should return 401 when the contactNumber field is empty', async () => {
    const farmEmptyContactNumber = { ...farm, contactNumber: '' };
    const response = await request(app).post('/farms').send({ farm: farmEmptyContactNumber });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Contact number must be given");
  });
  
  // it('should return 401 when the region is invalid', async () => {
  //   const invalidRegionFarm = { ...farm, regionFk: 'invalidRegionUid' };  
  //   const response = await request(app).post('/farms').send({ farm: invalidRegionFarm });

  //   expect(response.status).to.equal(401);
  //   expect(response.body.error).to.equal("The region is invalid");
  // });

  it('should return 500 if an error is thrown trying to check region', async () => {
    sinon.stub(Region, 'findOne').throws(() => new Error());
    const region = await Region.create({ regionName: 'North West' });
    const validRegionFarm = { ...farm, regionFk: region.uuid }; 
    const response = await request(app).post('/farms').send({ farm: validRegionFarm });

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });

  it('should return 500 if an error is thrown trying to create farm', async () => {
    sinon.stub(Farm, 'create').throws(() => new Error());
    const response = await request(app).post('/farms').send({ farm });

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});
