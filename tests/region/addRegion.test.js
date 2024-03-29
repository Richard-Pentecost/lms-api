const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Region } = require('../../src/models');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('POST /regions', () => {

  beforeEach(() => {
    sinon.stub(jwt, 'verify').returns({ isAdmin: true });
  });

  afterEach(async () => {
    sinon.restore();
    await Region.destroy({ where: {} });
  });

  it('adds a region to the database', async () => {
    const response = await request(app).post('/regions').send({ region: { regionName: 'North West' } });
    const { id } = response.body.region;
    const newRegion = await Region.findByPk(id, { raw: true });
  
    expect(response.status).to.equal(201);
    expect(newRegion.regionName).to.equal('North West');
    expect(newRegion).to.have.property('uuid');
    expect(newRegion).not.to.have.property('id');
  });

  it('should remove any whitespace at the start or end of the region', async () => {
    const response = await request(app).post('/regions').send({ region: { regionName: '   North West   ' } });
    const { id } = response.body.region;
    const newRegion = await Region.findByPk(id, { raw: true });

    expect(response.status).to.equal(201)
    expect(response.body.region.regionName).to.equal('North West');
    expect(newRegion.regionName).to.equal('North West');
  }); 

  it('should return a 401 when the region is null', async () => {
    const response = await request(app).post('/regions').send(null);

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('The region must be given');
  });

  it('should return a 401 when the region is empty', async () => {
    const response = await request(app).post('/regions').send({ region: { regionName: '' } });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal('The region must be given');
  });

  it('should return a 401 if a region with the same name already exists', async () => {
    await Region.create({ regionName: 'Devon' });

    const response = await request(app).post('/regions').send({ region: { regionName: 'Devon' } });
    expect(response.status).to.equal(401);
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(Region, 'create').throws(() => new Error());
    const response = await request(app).post('/regions').send({ region: { regionName: 'North West' } });

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});
