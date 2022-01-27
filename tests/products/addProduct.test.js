const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Product } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('POST /products', () => {
  let product;

  beforeEach(async () => {
    product = DataFactory.product();
    sinon.stub(jwt, 'verify').returns({ isAdmin: true });
  })
  
  afterEach(async () => {
    sinon.restore();
    await Product.destroy({ where: {} });
  });

  it('adds a product to the database', async () => {
    const response = await request(app).post('/products').send({ product });
    const { id } = response.body.product;
    const newProduct = await Product.findByPk(id, { raw: true });

    expect(response.status).to.equal(201);
    expect(newProduct.productName).to.equal(product.productName);
    expect(+newProduct.specificGravity).to.equal(product.specificGravity)
    expect(newProduct).to.have.property('uuid');
    expect(newProduct).not.to.have.property('id');
  });

  it('should return a 401 when the product name is null', async () => {
    const { productName, ...noProductName } = product;
    const response = await request(app).post('/products').send({ product: noProductName });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal('A product must be given')
  });

  it('should return a 401 when the product name is empty', async () => {
    const productWithBlankName = { ...product, productName: '' };
    const response = await request(app).post('/products').send({ product: productWithBlankName });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal('A product must be given')
  });

  it('should return a 401 when the specific gravity is null', async () => {
    const { specificGravity, ...noSpecificGravity } = product;
    const response = await request(app).post('/products').send({ product: noSpecificGravity });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal('A specific gravity must be given')
  });

  it('should return a 401 when the specific gravity is empty', async () => {
    const productWithBlankSG = { ...product, specificGravity: '' };
    const response = await request(app).post('/products').send({ product: productWithBlankSG });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal('A specific gravity must be given')
  });

  it('should return a 401 when the specific gravity is negative', async () => {
    const productWithNegativeSG = { ...product, specificGravity: -1 };
    const response = await request(app).post('/products').send({ product: productWithNegativeSG });

    expect(response.status).to.equal(401);
    expect(response.body.error.errors[0].message).to.equal('The target feed rate cannot be a negative number')
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(Product, 'create').throws(() => new Error());
    const response = await request(app).post('/products').send({ product });

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});