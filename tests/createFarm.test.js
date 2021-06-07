const { expect } = require('chai');
const request = require('supertest');
const { Farm } = require('../src/models');
const app = require('../src/app');

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
    const response = await request(app).post('/farms').send(newCompleteFarm);
    const newFarmRecord = await Farm.findByPk(response.body.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(response.body.farmName).to.equal('New Farm');
    expect(response.body.postcode).to.equal('NE3 4RM');
    expect(response.body.contactName).to.equal('Farmer Giles');
    expect(response.body.contactNumber).to.equal('01234567890');
    expect(response.body.status).to.equal(1);
    expect(response.body.accessCodes).to.equal('access codes');
    expect(response.body.comments).to.equal('comments')

    expect(newFarmRecord).to.contain(newFarm);
  });

  it('creates a new farm in the database with access codes and comment section defaulting to null', async () => {
    const response = await request(app).post('/farms').send(newFarm);
    const newFarmRecord = await Farm.findByPk(response.body.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(response.body.farmName).to.equal('New Farm');
    expect(response.body.postcode).to.equal('NE3 4RM');
    expect(response.body.contactName).to.equal('Farmer Giles');
    expect(response.body.contactNumber).to.equal('01234567890');
    expect(response.body.status).to.equal(1);
    expect(response.body.accessCodes).to.be.null;
    expect(response.body.comments).to.be.null;

    expect(newFarmRecord).to.contain(newFarm);
  });

  it('returns 401 when the farmName field is empty', async () => {
    const { farmName, ...noFarmName } = newFarm;  
    const response = await request(app).post('/farms').send(noFarmName);

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Farm name must be given.");
  });

  it('returns 401 when the postcode field is empty', async () => {
    const { postcode, ...noPostcode } = newFarm;  
    const response = await request(app).post('/farms').send(noPostcode);

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Postcode must be given.");
  });

  it('returns 401 when the contactName field is empty', async () => {
    const { contactName, ...noContactName } = newFarm;  
    const response = await request(app).post('/farms').send(noContactName);

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Contact name must be given.");
  });

  it('returns 401 when the contact number field is empty', async () => {
    const { contactNumber, ...noContactNumber } = newFarm;  
    const response = await request(app).post('/farms').send(noContactNumber);

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal("Contact number must be given.");
  });
});
