const { expect } = require('chai');
const request = require('supertest');
const { Farm } = require('../../src/models');
const app = require('../../src/app');

describe('POST /farms', () => {
  before(async () => Farm.sequelize.sync());

  afterEach(async () => {
    await Farm.destroy({ where: {} });
  });

  const newFarm = {
    farmName: 'New Farm',
    postcode: 'NE3 4RM',
    contactName: 'Farmer Giles',
    contactNumber: '01234567890',
  };

  it('creates a new farm in the database', async () => {
    const newCompleteFarm = {
      ...newFarm,
      accessCodes: 'access codes',
      comments: 'comments',
    };
    const response = await request(app).post('/farms').send({ farm: newCompleteFarm });
    const newFarmRecord = await Farm.findByPk(response.body.farm.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(response.body.farm.farmName).to.equal('New Farm');
    expect(response.body.farm.postcode).to.equal('NE3 4RM');
    expect(response.body.farm.contactName).to.equal('Farmer Giles');
    expect(response.body.farm.contactNumber).to.equal('01234567890');
    expect(response.body.farm.status).to.equal('enabled');
    expect(response.body.farm.accessCodes).to.equal('access codes');
    expect(response.body.farm.comments).to.equal('comments')

    expect(newFarmRecord).to.contain(newFarm);
  });

  it('creates a new farm in the database with access codes and comment section defaulting to null', async () => {
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

  it('returns 401 when the farmName field is null', async () => {
    const { farmName, ...noFarmName } = newFarm;  
    const response = await request(app).post('/farms').send({ farm: noFarmName });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Farm name must be given");
  });

  it('returns 401 when the farmName field is empty string', async () => {
    const farmEmptyName = { ...newFarm, farmName: '' };
    const response = await request(app).post('/farms').send({ farm: farmEmptyName });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Farm name must be given");
  });

  it('returns 401 when the postcode field is null', async () => {
    const { postcode, ...noPostcode } = newFarm;  
    const response = await request(app).post('/farms').send({ farm: noPostcode });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Postcode must be given");
  });

  it('returns 401 when the postcode field is empty', async () => {
    const farmEmptyPostcode = { ...newFarm, postcode: '' };
    const response = await request(app).post('/farms').send({ farm: farmEmptyPostcode });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Postcode must be given");
  });

  it('returns 401 when the contactName field is null', async () => {
    const { contactName, ...noContactName } = newFarm;  
    const response = await request(app).post('/farms').send({ farm: noContactName });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Contact name must be given");
  });

  it('returns 401 when the contactName field is empty', async () => {
    const farmEmptyContactName = { ...newFarm, contactName: '' };
    const response = await request(app).post('/farms').send({ farm: farmEmptyContactName});

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Contact name must be given");
  });

  it('returns 401 when the contactNumber field is null', async () => {
    const { contactNumber, ...noContactNumber } = newFarm;  
    const response = await request(app).post('/farms').send({ farm: noContactNumber });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Contact number must be given");
  });

  it('returns 401 when the contactNumber field is empty', async () => {
    const farmEmptyContactNumber = { ...newFarm, contactNumber: '' };
    const response = await request(app).post('/farms').send({ farm: farmEmptyContactNumber });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Contact number must be given");
  });
});
