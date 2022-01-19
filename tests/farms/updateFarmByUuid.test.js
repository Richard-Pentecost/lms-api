const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const DataFactory = require('../helpers/data-factory');
const { Farm, Region, Product, FarmProduct } = require('../../src/models');
const app = require('../../src/app');

describe('PATCH /farms/:uuid', () => {
  let farm;
  let products;
  let farmProductAssociations;
  let productsCreated;

  beforeEach(async () => {
    farm = await Farm.create(DataFactory.farm());
    productsCreated = await Promise.all([
      await Product.create(DataFactory.product()),
      await Product.create(DataFactory.product()),
    ]);
    farmProductAssociations = await Promise.all([
      FarmProduct.create({ farmId: farm.id, productId: productsCreated[0].id }),
      FarmProduct.create({ farmId: farm.id, productId: productsCreated[1].id })
    ]);
    products = productsCreated.map(product => product.uuid);
  });

  afterEach(async () => {
    sinon.restore();
    await Farm.destroy({ where: {} })
    await Region.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await FarmProduct.destroy({ where: {} });
  });

  it('updates farm by uuid', async () => {
    const response = await request(app)
    .patch(`/farms/${farm.uuid}`)
    .send({ farm: { farmName: 'Old Farm', postcode: 'OL0 4RM' }, products });

    const updatedFarm = await Farm.findByPk(farm.id, { raw: true });
  
    expect(response.status).to.equal(201);
    expect(updatedFarm.uuid).to.equal(farm.uuid);
    expect(updatedFarm.farmName).to.equal('Old Farm');
    expect(updatedFarm.postcode).to.equal('OL0 4RM');
    expect(updatedFarm.contactName).to.equal(farm.contactName);
    expect(updatedFarm.contactNumber).to.equal(farm.contactNumber);
    expect(updatedFarm.accessCodes).to.be.null;
    expect(updatedFarm.comments).to.be.null;
    expect(updatedFarm.regionFk).to.be.null;
  });
  
  it('updates the farm adding comments, access codes and region when given', async () => {
    const region = await Region.create({ regionName: 'North West' });
    const farmWithUpdates = {
      ...farm,
      accessCodes: 'access codes',
      comments: 'comments',
      regionFk: region.uuid,
    };

    const response = await request(app)
    .patch(`/farms/${farm.uuid}`)
    .send({ farm: farmWithUpdates, products });

    const updatedFarm = await Farm.findByPk(farm.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(updatedFarm.uuid).to.equal(farm.uuid);
    expect(updatedFarm.farmName).to.equal(farm.farmName);
    expect(updatedFarm.postcode).to.equal(farm.postcode);
    expect(updatedFarm.contactName).to.equal(farm.contactName);
    expect(updatedFarm.contactNumber).to.equal(farm.contactNumber);
    expect(updatedFarm.accessCodes).to.equal(farmWithUpdates.accessCodes);
    expect(updatedFarm.comments).to.equal(farmWithUpdates.comments);
    expect(updatedFarm.regionFk).to.equal(region.uuid);
  });

  it('should not update FarmProducts associations if they have not been changed', async () => {
    const response = await request(app)
      .patch(`/farms/${farm.uuid}`)
      .send({ farm: { farmName: 'Old Farm', postcode: 'OL0 4RM' }, products });
    
    const associations = await FarmProduct.findAll({ where: { farmId: farm.id } });
    const updatedFarm = await Farm.findByPk(farm.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(updatedFarm.farmName).to.equal('Old Farm');
    expect(updatedFarm.postcode).to.equal('OL0 4RM');
    expect(updatedFarm.contactName).to.equal(farm.contactName);
    expect(updatedFarm.contactNumber).to.equal(farm.contactNumber);
    
    expect(associations.length).to.equal(2);
    associations.forEach(association => {
      const farmProductAssociation = farmProductAssociations.find(assoc => assoc.id === association.id);
      expect(association.farmId).to.equal(farmProductAssociation.farmId);
      expect(association.productId).to.equal(farmProductAssociation.productId);
    });
  });

  it('should add a FarmProduct association if a product has been added', async () => {
    const newProduct = await Product.create(DataFactory.product());
    const newProducts = [...products, newProduct.uuid];

    const response = await request(app)
      .patch(`/farms/${farm.uuid}`)
      .send({ farm: { contactName: 'Farmer Giles', contactNumber: '01234567890' }, products: newProducts });

    const associations = await FarmProduct.findAll({ where: { farmId: farm.id } });
    const updatedFarm = await Farm.findByPk(farm.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(updatedFarm.farmName).to.equal(farm.farmName);
    expect(updatedFarm.postcode).to.equal(farm.postcode);
    expect(updatedFarm.contactName).to.equal('Farmer Giles');
    expect(updatedFarm.contactNumber).to.equal('01234567890');
    
    expect(associations.length).to.equal(3);
    associations.forEach(association => {
      const farmProductAssociation = farmProductAssociations.find(assoc => assoc.id === association.id);
      if (farmProductAssociation) {
        expect(association.farmId).to.equal(farmProductAssociation.farmId);
        expect(association.productId).to.equal(farmProductAssociation.productId);
      } else {
        expect(association.farmId).to.equal(farm.id);
        expect(association.productId).to.equal(newProduct.id);
      }
    });
  });

  //  Not done
  it.skip('should remove a FarmProduct association if a product has been removed', async () => {
    const response = await request(app)
      .patch(`/farms/${farm.uuid}`)
      .send({ farm: { contactName: 'Farmer Giles', contactNumber: '01234567890' }, products: [products[0]] });

    const associations = await FarmProduct.findAll({ where: { farmId: farm.id } });
    const updatedFarm = await Farm.findByPk(farm.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(updatedFarm.farmName).to.equal(farm.farmName);
    expect(updatedFarm.postcode).to.equal(farm.postcode);
    expect(updatedFarm.contactName).to.equal('Farmer Giles');
    expect(updatedFarm.contactNumber).to.equal('01234567890');

    expect(associations.length).to.equal(1);
    expect(associations[0].farmId).to.equal(farmProductAssociation[0].farmId);
    expect(associations[0].productId).to.equal(farmProductAssociations[0].productId);
  });

  //  In progress
  it.skip('should have removed and added a FarmProduct association if there are the same number of products, they have been changed', async () => {
    const newProduct = await Product.create(DataFactory.product());
    const newProducts = [products[0], newProduct.uuid];
    console.log("**************");
    console.log(products);
    console.log(newProducts);
    const response = await request(app)
    .patch(`/farms/${farm.uuid}`)
    .send({ farm: { farmName: 'Old Farm', postcode: 'OL0 4RM' }, products: newProducts });
  
    const associations = await FarmProduct.findAll({ where: { farmId: farm.id } });
    const updatedFarm = await Farm.findByPk(farm.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(updatedFarm.farmName).to.equal('Old Farm');
    expect(updatedFarm.postcode).to.equal('OL0 4RM');
    expect(updatedFarm.contactName).to.equal(farm.contactName);
    expect(updatedFarm.contactNumber).to.equal(farm.contactNumber);
    
    expect(associations.length).to.equal(2);
    associations.forEach(association => {
      const farmProductAssociation = farmProductAssociations.find(assoc => assoc.id === association.id);
      expect(association.farmId).to.equal(farmProductAssociation.farmId);
      expect(association.productId).to.equal(farmProductAssociation.productId);
    });
  });

  it.skip('should add association between products and farm to FarmProduct table', async () => {
    const response = await request(app).patch(`/farms/${farm.uuid}`).send({ farm, products });
    const associations = await FarmProduct.findAll({ where: { farmId: farm.id } });

    expect(response.status).to.equal(201);
    expect(associations.length).to.equal(2);

    associations.forEach(association => {
      expect(association.farmId).to.equal(farm.id);
      expect(productsCreated.find(product => product.id === association.productId)).to.exist;
    })
  });

  it('returns a 401 if the farm does not exist', async () => {
    const invalidUuid = DataFactory.uuid;
    const response = await request(app)
      .patch(`/farms/${invalidUuid}`)
      .send({ farm: { farmName: 'Old Farm', postcode: 'OL0 4RM' }, products });
    
    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('The farm could not be found');
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(Farm, 'update').throws(() => new Error());

    const response = await request(app)
      .patch(`/farms/${farm.uuid}`)
      .send({ farm: { farmName: 'Old Farm', postcode: 'OLO 4RM' }, products });

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});
