const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Region } = require('../../src/models');
const app = require('../../src/app');

describe('POST /regions', () => {
  before(async () => Region.sequelize.sync());

  afterEach(async () => {
    sinon.restore();
    await Region.destroy({ where: {} });
  });

  it('adds a region to the database', async () => {
    const response = await request(app).post('/regions').send({ region: 'North West' });
    const { id } = response.body.region;
    const newRegion = await Region.findByPk(id, { raw: true });
  
    expect(response.status).to.equal(201);
    expect(newRegion.region).to.equal('North West');
    expect(newRegion).to.have.property('uuid');
    expect(newRegion).not.to.have.property('id');
  });

  it('should return a 401 when the region is null', async () => {
    const response = await request(app).post('/regions').send(null);
  
    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal('The region must be given');
  });

  it('should return a 401 when the region is empty', async () => {
    const response = await request(app).post('/regions').send({ region: '' });
  
    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal('The region must be given');
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(Region, 'create').throws(() => new Error());
    const response = await request(app).post('/regions').send({ region: 'North West' });

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});
