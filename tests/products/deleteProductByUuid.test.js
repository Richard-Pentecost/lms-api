const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Product, FarmProduct, Farm } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');

describe('DELETE /product/:uuid', () => {
  let product;

  afterEach(async () => {
    sinon.restore();
    await Product.destroy({ where: {} });
    await FarmProduct.destroy({ where: {} });
    await Farm.destroy({ where: {} });
  });

  beforeEach(async () => {
    product = await Product.create(DataFactory.product());
  });

  it('should delete the product in the database', async () => {
    const response = await request(app).delete(`/products/${product.uuid}`);

    const productEntry = await Product.findByPk(product.id, { raw: true });
    expect(response.status).to.equal(201);
    expect(productEntry).to.be.null;
  });

  it('should delete the all entries in the FarmProduct table with the product id', async () => {
    const farm = await Farm.create(DataFactory.farm());
    const secondProduct = await Product.create(DataFactory.product());
    const associationOne = await FarmProduct.create({ farmId: farm.uuid, productId: product.uuid });
    const associationTwo = await FarmProduct.create({ farmId: farm.uuid, productId: secondProduct.uuid }); 

    const response = await request(app).delete(`/products/${product.uuid}`);
    const associationOneEntry = await FarmProduct.findByPk(associationOne.id, { raw: true });
    const associationTwoEntry = await FarmProduct.findByPk(associationTwo.id, { raw: true });

    expect(response.status).to.equal(201);
    expect(associationOneEntry).to.be.null;
    expect(associationTwoEntry).to.deep.equal({ id: associationTwo.id, farmId: farm.uuid, productId: secondProduct.uuid });
  });

  it('should return a 401 if the product does not exist', async () => {
    const invalidUuid = DataFactory.uuid;
    const response = await request(app).delete(`/products/${invalidUuid}`);

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('There was an error deleting the product');
  });

  it('should return 500 if an error is thrown', async () => {
    sinon.stub(Product, 'destroy').throws(() => new Error());
    const response = await request(app).delete(`/products/${product.uuid}`);

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was a problem connecting to the database');
  });
});
