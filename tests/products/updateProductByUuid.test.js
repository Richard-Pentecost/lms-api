const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const DataFactory = require('../helpers/data-factory');
const { Product } = require('../../src/models');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('PATCH /products/:uuid', () => {
  let product;

  beforeEach(async () => {
    product = await Product.create(DataFactory.product());
    sinon.stub(jwt, 'verify').returns({ isAdmin: true });
  });

  afterEach(async () => {
    sinon.restore();
    await Product.destroy({ where: {} });
  });

  it('updates product by uuid', async () => {
    const response = await request(app)
      .patch(`/products/${product.uuid}`)
      .send({ product: { productName: 'new IBC', specificGravity: '2.4' } });
    
    const updatedProduct = await Product.findByPk(product.id, { raw: true });
    
    expect(response.status).to.equal(201);
    expect(updatedProduct.uuid).to.equal(product.uuid);
    expect(updatedProduct.productName).to.equal('new IBC');
    expect(updatedProduct.specificGravity).to.equal('2.4');
  });

  it('should return a 401 if the product does not exist', async () => {
    const invalidUuid = DataFactory.uuid;
    const response = await request(app)
      .patch(`/products/${invalidUuid}`)
      .send({ product: { productName: 'new IBC', specificGravity: '2.8' } });
    
    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('The product could not be found');
  });

  it('should return a 401 if the product name is changed to a name that already exists', async () => {
    await Product.create({ productName: 'acid-drum', specificGravity: '1.02' });
    const response = await request(app)
      .patch(`/products/${product.uuid}`)
      .send({ product: { productName: 'acid-drum' } });

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('A product with this name already exists');
  });

  it('should return a 401 if the product is not being updated by an admin', async () => {
    sinon.restore();
    sinon.stub(jwt, 'verify').returns({ isAdmin: false });

    const response = await request(app)
      .patch(`/products/${product.uuid}`)
      .send({ product: { productName: 'new IBC', specificGravity: '2.4' } });

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('You must be an admin to do this');
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(Product, 'update').throws(() => new Error());
    const response = await request(app)
      .patch(`/products/${product.uuid}`)
      .send({ product: { productName: 'new IBC', specificGravity: '2.4' } });

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});