const { expect } = require('chai');
const request = require('supertest');
const { Farm } = require('../src/models');
const app = require('../src/app');

describe('PATCH /farms/:id', () => {
  let farm;
  before(async () => Farm.sequelize.sync());

  beforeEach(async () => {
    farm = await Promise.resolve(
      Farm.create({
        farmName: 'New Farm',
        postcode: 'NE3 4RM',
        contactName: 'Farmer Giles',
        contactNumber: '01234567890',
        deliveryMethod: 'IBC',
      })
    );
  });

  afterEach(async () => {
    await Farm.destroy({ where: {} })
  });

  it('updates farm by id', async () => {
    const response = await request(app)
      .patch(`/farms/${farm.id}`)
      .send({ farmName: 'Old Farm', postcode: 'OL0 4RM' });

    const updatedFarm = await Farm.findByPk(farm.id, { raw: true });
    
    expect(response.status).to.equal(201);
    expect(updatedFarm.farmName).to.equal('Old Farm');
    expect(updatedFarm.postcode).to.equal('OL0 4RM');
    expect(updatedFarm.contactName).to.equal('Farmer Giles');
    expect(updatedFarm.contactNumber).to.equal('01234567890');
    expect(updatedFarm.deliveryMethod).to.equal('IBC');
  });  

  it('returns a 401 if the farm does not exist', async () => {
    const response = await request(app)
      .patch('/farms/12345')
      .send({ farmName: 'Old Farm', postcode: 'OL0 4RM' });
    
    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('The farm could not be found.');
  });
});
