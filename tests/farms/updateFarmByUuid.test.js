const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const DataFactory = require('../helpers/data-factory');
const { Farm, Region, Product, FarmProduct } = require('../../src/models');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe.only('PATCH /farms/:uuid', () => {
  let farm;
  let products;
  let farmProductAssociations;
  let productsCreated;

  beforeEach(async () => {
    farm = await Farm.create(DataFactory.farm());
    productsCreated = await Promise.all([
      await Product.create(DataFactory.product()),
      await Product.create(DataFactory.product()),
      await Product.create(DataFactory.product()),
      await Product.create(DataFactory.product()),
    ]);
    farmProductAssociations = await Promise.all([
      FarmProduct.create({ farmId: farm.id, productId: productsCreated[0].id, retrievedOrder: 1 }),
      FarmProduct.create({ farmId: farm.id, productId: productsCreated[1].id, retrievedOrder: 2 }),
      FarmProduct.create({ farmId: farm.id, productId: productsCreated[2].id, retrievedOrder: 3 }),
      FarmProduct.create({ farmId: farm.id, productId: productsCreated[3].id, retrievedOrder: 4 }),
    ]);
    products = productsCreated.map((product, index) => {
      return { id: product.id, uuid: product.uuid, order: index + 1 };
    });
    sinon.stub(jwt, 'verify').returns({ isAdmin: false });
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
    
    expect(associations.length).to.equal(4);
    associations.forEach(association => {
      const farmProductAssociation = farmProductAssociations.find(assoc => assoc.id === association.id);
      expect(association.farmId).to.equal(farmProductAssociation.farmId);
      expect(association.productId).to.equal(farmProductAssociation.productId);
    });
  });

  it('should add a FarmProduct association if a product has been added', async () => {
    const newProduct = await Product.create(DataFactory.product());
    const newProducts = [...products, { uuid: newProduct.uuid, order: 5 }];

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
    
    expect(associations.length).to.equal(5);
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

  it('should updated a FarmProduct assocation if a product order has been changed', async () => {
    const updateProduct1 = { ...products[2], order: 4 };
    const updateProduct2 = { ...products[3], order: 3 };
    const productsForUpdating = [products[0], products[1], updateProduct1, updateProduct2];

    const response = await request(app)
      .patch(`/farms/${farm.uuid}`)
      .send({ farm: { contactName: 'Farmer Giles', contactNumber: '01234567890' }, products: productsForUpdating });

    const associations = await FarmProduct.findAll({ where: { farmId: farm.id } });
    const updatedFarm = await Farm.findByPk(farm.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(updatedFarm.farmName).to.equal(farm.farmName);
    expect(updatedFarm.postcode).to.equal(farm.postcode);
    expect(updatedFarm.contactName).to.equal('Farmer Giles');
    expect(updatedFarm.contactNumber).to.equal('01234567890');

    expect(associations.length).to.equal(4);

    associations.forEach(association => {
      const farmProductAssociation = farmProductAssociations.find(assoc => assoc.id === association.id);
      expect(association.farmId).to.equal(farmProductAssociation.farmId);
      expect(association.productId).to.equal(farmProductAssociation.productId);
      const product = productsForUpdating.find(p => p.id === association.productId);
      expect(association.retrievedOrder).to.equal(product.order);
    })
  });

  it('should remove a FarmProduct association if a product has been removed', async () => {
    const [deletedProduct, ...existingProducts] = products;
    const response = await request(app)
      .patch(`/farms/${farm.uuid}`)
      .send({ farm: { contactName: 'Farmer Giles', contactNumber: '01234567890' }, products: existingProducts });

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
      expect(association.farmId).to.equal(farmProductAssociation.farmId);
      expect(association.productId).to.equal(farmProductAssociation.productId);
    });
  });


  it('should remove a multiple FarmProduct associations if multiple products has been removed', async () => {
    const response = await request(app)
      .patch(`/farms/${farm.uuid}`)
      .send({ farm: { contactName: 'Farmer Giles', contactNumber: '01234567890' }, products: [products[0], products[1]] });

    const associations = await FarmProduct.findAll({ where: { farmId: farm.id } });
    const updatedFarm = await Farm.findByPk(farm.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(updatedFarm.farmName).to.equal(farm.farmName);
    expect(updatedFarm.postcode).to.equal(farm.postcode);
    expect(updatedFarm.contactName).to.equal('Farmer Giles');
    expect(updatedFarm.contactNumber).to.equal('01234567890');

    expect(associations.length).to.equal(2);
    associations.forEach(association => {
      const farmProductAssociation = farmProductAssociations.find(assoc => assoc.id === association.id);
      expect(association.farmId).to.equal(farmProductAssociation.farmId);
      expect(association.productId).to.equal(farmProductAssociation.productId);
    });
  });

  it('should remove all but one FarmProduct associations if all but one products have been removed', async () => {
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
    expect(associations[0].farmId).to.equal(farmProductAssociations[0].farmId);
    expect(associations[0].productId).to.equal(farmProductAssociations[0].productId);
  });

  it('should have removed and added a FarmProduct association if there are the same number of products but they have been changed', async () => {
    const newProduct = await Product.create(DataFactory.product());
    const newProducts = [products[0], products[1], products[2], { uuid: newProduct.uuid, order: 4 }];
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
    
    expect(associations.length).to.equal(4);
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

  it('should not create association for an invalid product', async () => {
    const invalidProductUuid = DataFactory.uuid;
    const response = await request(app)
      .patch(`/farms/${farm.uuid}`)
      .send({ farm: { contactName: 'Farmer Giles', contactNumber: '01234567890' }, products: [products[0], invalidProductUuid] });

    const associations = await FarmProduct.findAll({ where: { farmId: farm.id } });
    const updatedFarm = await Farm.findByPk(farm.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(updatedFarm.farmName).to.equal(farm.farmName);
    expect(updatedFarm.postcode).to.equal(farm.postcode);
    expect(updatedFarm.contactName).to.equal('Farmer Giles');
    expect(updatedFarm.contactNumber).to.equal('01234567890');

    expect(associations.length).to.equal(1);
    expect(associations[0].farmId).to.equal(farmProductAssociations[0].farmId);
    expect(associations[0].productId).to.equal(farmProductAssociations[0].productId);
  });

  it('returns a 401 if the farm does not exist', async () => {
    const invalidUuid = DataFactory.uuid;
    const response = await request(app)
      .patch(`/farms/${invalidUuid}`)
      .send({ farm: { farmName: 'Old Farm', postcode: 'OL0 4RM' }, products });
    
    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('The farm could not be found');
  });

  it('returns a 401 if there are no products in the request', async () => {
    const response = await request(app)
      .patch(`/farms/${farm.uuid}`)
      .send({ farm: { farmName: 'Old Farm', postcode: 'OL0 4RM' } });
    
    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('A farm must have products');
  });

  it('should return a 500 if an error is thrown when updating the farm', async () => {
    sinon.stub(Farm, 'update').throws(() => new Error());

    const response = await request(app)
      .patch(`/farms/${farm.uuid}`)
      .send({ farm: { farmName: 'Old Farm', postcode: 'OLO 4RM' }, products });

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });

  it('should return a 500 if an error is thrown fetching the farm', async () => {
    sinon.stub(Farm, 'fetchFarmByUuid').throws(() => new Error());

    const response = await request(app)
      .patch(`/farms/${farm.uuid}`)
      .send({ farm: { farmName: 'Old Farm', postcode: 'OLO 4RM' }, products });

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });

  it('should return a 500 if an error is thrown fetching farm product associations', async () => {
    sinon.stub(FarmProduct, 'fetchAssociationsByFarmId').throws(() => new Error());

    const response = await request(app)
      .patch(`/farms/${farm.uuid}`)
      .send({ farm: { farmName: 'Old Farm', postcode: 'OLO 4RM' }, products });

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });

  it('should return a 500 if an error is thrown fetching a product', async () => {
    sinon.stub(Product, 'fetchProductsByUuid').throws(() => new Error());

    const response = await request(app)
      .patch(`/farms/${farm.uuid}`)
      .send({ farm: { farmName: 'Old Farm', postcode: 'OLO 4RM' }, products });

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});
