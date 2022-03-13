const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Farm } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe.only('GET /farms/active', () => {
  let farms;

  afterEach(async () => {
    sinon.restore();
    await Farm.destroy({ where: {} });
  });

  beforeEach(async () => {
    farms = await Promise.all([
      Farm.create(DataFactory.farm({ farmName: 'New Farm', contactName: "John Doe", postcode: 'NE3 4RM' })),
      Farm.create(DataFactory.farm({ farmName: 'Old Farms', contactName: "Jane Doe", postcode: 'OL0 4RM' })),
      Farm.create(DataFactory.farm({ farmName: 'Heath Hill', contactName: "Rob Robson", postcode: 'HE6 1LL' })),
      Farm.create(DataFactory.farm({ farmName: 'The Farm', contactName: 'Giles', postcode: 'TH3 4RM', isActive: false })),
    ]);
    sinon.stub(jwt, 'verify').returns({ isAdmin: false });
  });

  it('should return all active farm', async () => {
    const response = await request(app).get('/farms/active');

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(3);

    const activeFarms = farms.filter(farm => {
      return farm.isActive;
    });
    
    response.body.forEach(farm => {
      const expected = activeFarms.find(activeFarm => activeFarm.uuid === farm.uuid);
      expect(farm.farmName).to.equal(expected.farmName);
      expect(farm.postcode).to.equal(expected.postcode);
      expect(farm.contactName).to.equal(expected.contactName);
      expect(farm.contactNumber).to.equal(expected.contactNumber);
      expect(farm.isActive).to.be.true;
      expect(farm.regionFk).to.equal(expected.regionFk);
      expect(farm.accessCodes).to.equal(expected.accessCodes);
      expect(farm.comments).to.equal(expected.comments);
    });
  });

  it('should return the farm that has the same farm name as the search criteria', async () => {
    const response = await request(app).get('/farms/active').query({ query: 'New Farm' });

    const expectedFarm = farms[0];

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(1);
    expect(response.body[0].farmName).to.equal('New Farm');
    expect(response.body[0].contactName).to.equal('John Doe');
    expect(response.body[0].postcode).to.equal('NE3 4RM');
    expect(response.body[0].contactNumber).to.equal(expectedFarm.contactNumber);
    expect(response.body[0].isActive).to.be.true;
    expect(response.body[0].regionFk).to.equal(expectedFarm.regionFk);
    expect(response.body[0].accessCodes).to.equal(expectedFarm.accessCodes);
    expect(response.body[0].comments).to.equal(expectedFarm.comments);
  });

  it('should return the farm that has the same farm name as the search criteria and the search string is lower case', async () => {
    const response = await request(app).get('/farms/active').query({ query: 'old farms' });

    const expectedFarm = farms[1];

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(1);
    expect(response.body[0].farmName).to.equal('Old Farms');
    expect(response.body[0].contactName).to.equal('Jane Doe');
    expect(response.body[0].postcode).to.equal('OL0 4RM');
    expect(response.body[0].contactNumber).to.equal(expectedFarm.contactNumber);
    expect(response.body[0].isActive).to.be.true;
    expect(response.body[0].regionFk).to.equal(expectedFarm.regionFk);
    expect(response.body[0].accessCodes).to.equal(expectedFarm.accessCodes);
    expect(response.body[0].comments).to.equal(expectedFarm.comments);
  });

  it('should return the farm that has the same farm name as the search criteria and the search sting is upper case', async () => {
    const response = await request(app).get('/farms/active').query({ query: 'HEATH HILL' });

    const expectedFarm = farms[2];  

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(1);
    expect(response.body[0].farmName).to.equal('Heath Hill');
    expect(response.body[0].contactName).to.equal('Rob Robson');
    expect(response.body[0].postcode).to.equal('HE6 1LL');
    expect(response.body[0].contactNumber).to.equal(expectedFarm.contactNumber);
    expect(response.body[0].isActive).to.be.true;
    expect(response.body[0].regionFk).to.equal(expectedFarm.regionFk);
    expect(response.body[0].accessCodes).to.equal(expectedFarm.accessCodes);
    expect(response.body[0].comments).to.equal(expectedFarm.comments);
  });

  it('should return the farm that has the same partial farm name as the search criteria', async () => {
    const response = await request(app).get('/farms/active').query({ query: 'Hill' });

    const expectedFarm = farms[2];  

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(1);
    expect(response.body[0].farmName).to.equal('Heath Hill');
    expect(response.body[0].contactName).to.equal('Rob Robson');
    expect(response.body[0].postcode).to.equal('HE6 1LL');
    expect(response.body[0].contactNumber).to.equal(expectedFarm.contactNumber);
    expect(response.body[0].isActive).to.be.true;
    expect(response.body[0].regionFk).to.equal(expectedFarm.regionFk);
    expect(response.body[0].accessCodes).to.equal(expectedFarm.accessCodes);
    expect(response.body[0].comments).to.equal(expectedFarm.comments);
  });

  it('should return multiple farms that have the same partial farm name as the search criteria', async () => {
    const response = await request(app).get('/farms/active').query({ query: 'Farm' });

    const expectedFarms = [farms[0], farms[1]]; 

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(2);

    response.body.forEach(farm => {
      const expected = expectedFarms.find(expectedFarm => expectedFarm.uuid === farm.uuid);
      expect(farm.farmName).to.equal(expected.farmName);
      expect(farm.postcode).to.equal(expected.postcode);
      expect(farm.contactName).to.equal(expected.contactName);
      expect(farm.contactNumber).to.equal(expected.contactNumber);
      expect(farm.isActive).to.be.true;
      expect(farm.regionFk).to.equal(expected.regionFk);
      expect(farm.accessCodes).to.equal(expected.accessCodes);
      expect(farm.comments).to.equal(expected.comments);
    });
  });

  it('should return the farm that has the same postcode as the search criteria', async () => {
    const response = await request(app).get('/farms/active').query({ query: 'OL0 4RM' });

    const expectedFarm = farms[1];  

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(1);
    expect(response.body[0].farmName).to.equal('Old Farms');
    expect(response.body[0].contactName).to.equal('Jane Doe');
    expect(response.body[0].postcode).to.equal('OL0 4RM');
    expect(response.body[0].contactNumber).to.equal(expectedFarm.contactNumber);
    expect(response.body[0].isActive).to.be.true;
    expect(response.body[0].regionFk).to.equal(expectedFarm.regionFk);
    expect(response.body[0].accessCodes).to.equal(expectedFarm.accessCodes);
    expect(response.body[0].comments).to.equal(expectedFarm.comments);
  });

  it('should return the farm that has the same postcode as the search criteria and the search string is lower case', async () => {
    const response = await request(app).get('/farms/active').query({ query: 'ne3 4rm' });

    const expectedFarm = farms[0]; 

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(1);
    expect(response.body[0].farmName).to.equal('New Farm');
    expect(response.body[0].contactName).to.equal('John Doe');
    expect(response.body[0].postcode).to.equal('NE3 4RM');
    expect(response.body[0].contactNumber).to.equal(expectedFarm.contactNumber);
    expect(response.body[0].isActive).to.be.true;
    expect(response.body[0].regionFk).to.equal(expectedFarm.regionFk);
    expect(response.body[0].accessCodes).to.equal(expectedFarm.accessCodes);
    expect(response.body[0].comments).to.equal(expectedFarm.comments);
  });

  it.skip('should return the farm that has the same postcode as the search criteria and the search sting has no spaces', async () => {
    const response = await request(app).get('/farms/active').query({ query: 'HE61LL' });

    const expectedFarm = farms[2];  

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(1);
    expect(response.body[0].farmName).to.equal('Heath Hill');
    expect(response.body[0].contactName).to.equal('Rob Robson');
    expect(response.body[0].postcode).to.equal('HE6 1LL');
    expect(response.body[0].contactNumber).to.equal(expectedFarm.contactNumber);
    expect(response.body[0].isActive).to.be.true;
    expect(response.body[0].regionFk).to.equal(expectedFarm.regionFk);
    expect(response.body[0].accessCodes).to.equal(expectedFarm.accessCodes);
    expect(response.body[0].comments).to.equal(expectedFarm.comments);
  });

  it('should return the farm that has the same partial postcode as the search criteria', async () => {
    const response = await request(app).get('/farms/active').query({ query: '1l' });

    const expectedFarm = farms[2];  

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(1);
    expect(response.body[0].farmName).to.equal('Heath Hill');
    expect(response.body[0].contactName).to.equal('Rob Robson');
    expect(response.body[0].postcode).to.equal('HE6 1LL');
    expect(response.body[0].contactNumber).to.equal(expectedFarm.contactNumber);
    expect(response.body[0].isActive).to.be.true;
    expect(response.body[0].regionFk).to.equal(expectedFarm.regionFk);
    expect(response.body[0].accessCodes).to.equal(expectedFarm.accessCodes);
    expect(response.body[0].comments).to.equal(expectedFarm.comments);
  });

  it('should return multiple farms that have the same partial postcode as the search criteria', async () => {
    const response = await request(app).get('/farms/active').query({ query: '4rm' });

    const expectedFarms = [farms[0], farms[1]]; 

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(2);

    response.body.forEach(farm => {
      const expected = expectedFarms.find(expectedFarm => expectedFarm.uuid === farm.uuid);
      expect(farm.farmName).to.equal(expected.farmName);
      expect(farm.postcode).to.equal(expected.postcode);
      expect(farm.contactName).to.equal(expected.contactName);
      expect(farm.contactNumber).to.equal(expected.contactNumber);
      expect(farm.isActive).to.be.true;
      expect(farm.regionFk).to.equal(expected.regionFk);
      expect(farm.accessCodes).to.equal(expected.accessCodes);
      expect(farm.comments).to.equal(expected.comments);
    });
  });

  it('should return the farm that has the same contact name as the search criteria', async () => {
    const response = await request(app).get('/farms/active').query({ query: 'John Doe' });

    const expectedFarm = farms[0]; 

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(1);
    expect(response.body[0].farmName).to.equal('New Farm');
    expect(response.body[0].contactName).to.equal('John Doe');
    expect(response.body[0].postcode).to.equal('NE3 4RM');
    expect(response.body[0].contactNumber).to.equal(expectedFarm.contactNumber);
    expect(response.body[0].isActive).to.be.true;
    expect(response.body[0].regionFk).to.equal(expectedFarm.regionFk);
    expect(response.body[0].accessCodes).to.equal(expectedFarm.accessCodes);
    expect(response.body[0].comments).to.equal(expectedFarm.comments);
  });

  it('should return the farm that has the same contact name as the search criteria and the search string is lower case', async () => {
    const response = await request(app).get('/farms/active').query({ query: 'jane doe' });

    const expectedFarm = farms[1]; 

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(1);
    expect(response.body[0].farmName).to.equal('Old Farms');
    expect(response.body[0].contactName).to.equal('Jane Doe');
    expect(response.body[0].postcode).to.equal('OL0 4RM');
    expect(response.body[0].contactNumber).to.equal(expectedFarm.contactNumber);
    expect(response.body[0].isActive).to.be.true;
    expect(response.body[0].regionFk).to.equal(expectedFarm.regionFk);
    expect(response.body[0].accessCodes).to.equal(expectedFarm.accessCodes);
    expect(response.body[0].comments).to.equal(expectedFarm.comments);
  });

  it('should return the farm that has the same contact name as the search criteria and the search sting is upper case', async () => {
    const response = await request(app).get('/farms/active').query({ query: 'ROB ROBSON' });

    const expectedFarm = farms[2]; 

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(1);
    expect(response.body[0].farmName).to.equal('Heath Hill');
    expect(response.body[0].contactName).to.equal('Rob Robson');
    expect(response.body[0].postcode).to.equal('HE6 1LL');
    expect(response.body[0].contactNumber).to.equal(expectedFarm.contactNumber);
    expect(response.body[0].isActive).to.be.true;
    expect(response.body[0].regionFk).to.equal(expectedFarm.regionFk);
    expect(response.body[0].accessCodes).to.equal(expectedFarm.accessCodes);
    expect(response.body[0].comments).to.equal(expectedFarm.comments);
  });

  it('should return the farm that has the same partial contact name as the search criteria', async () => {
    const response = await request(app).get('/farms/active').query({ query: 'Robs' });

    const expectedFarm = farms[2]; 

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(1);
    expect(response.body[0].farmName).to.equal('Heath Hill');
    expect(response.body[0].contactName).to.equal('Rob Robson');
    expect(response.body[0].postcode).to.equal('HE6 1LL');
    expect(response.body[0].contactNumber).to.equal(expectedFarm.contactNumber);
    expect(response.body[0].isActive).to.be.true;
    expect(response.body[0].regionFk).to.equal(expectedFarm.regionFk);
    expect(response.body[0].accessCodes).to.equal(expectedFarm.accessCodes);
    expect(response.body[0].comments).to.equal(expectedFarm.comments);
  });

  it('should return multiple farms that have the same partial contact name as the search criteria', async () => {
    const response = await request(app).get('/farms/active').query({ query: 'Doe' });

    const expectedFarms = [farms[0], farms[1]];  

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(2);

    response.body.forEach(farm => {
      const expected = expectedFarms.find(expectedFarm => expectedFarm.uuid === farm.uuid);
      expect(farm.farmName).to.equal(expected.farmName);
      expect(farm.postcode).to.equal(expected.postcode);
      expect(farm.contactName).to.equal(expected.contactName);
      expect(farm.contactNumber).to.equal(expected.contactNumber);
      expect(farm.isActive).to.be.true;
      expect(farm.regionFk).to.equal(expected.regionFk);
      expect(farm.accessCodes).to.equal(expected.accessCodes);
      expect(farm.comments).to.equal(expected.comments);
    });
  });

  it('should return multiple farms when farmName, contactName or postcode matches the search criteria', async () => {
    const response = await request(app).get('/farms/active').query({ query: 's' });

    const expectedFarms = [farms[1], farms[2]];  

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(2);

    response.body.forEach(farm => {
      const expected = expectedFarms.find(expectedFarm => expectedFarm.uuid === farm.uuid);
      expect(farm.farmName).to.equal(expected.farmName);
      expect(farm.postcode).to.equal(expected.postcode);
      expect(farm.contactName).to.equal(expected.contactName);
      expect(farm.contactNumber).to.equal(expected.contactNumber);
      expect(farm.isActive).to.be.true;
      expect(farm.regionFk).to.equal(expected.regionFk);
      expect(farm.accessCodes).to.equal(expected.accessCodes);
      expect(farm.comments).to.equal(expected.comments);
    });
  });

  it('should return a 500 if an error is thrown',  async () => {
    sinon.stub(Farm, 'fetchActiveFarms').throws(() => new Error());

    const response = await request(app).get('/farms/active');

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});