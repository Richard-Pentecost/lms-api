const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Product } = require('../../src/models');
const DataFactory = require('../helpers/data-factory');
const app = require('../../src/app');

describe('GET /products', () => {
  let products;

  afterEach(async () => {
    sinon.restore();
    await Product.destroy({ where: { } });
  });

  beforeEach(async () => {
    products = await Promise.all([
      Product.create(DataFactory.product()),
      Product.create(DataFactory.product()),
    ]);
  });

  it('gets all the products', async () => {
    const response = await request(app).get('/products');

    expect(response.status).to.equal(201);
    expect(response.body.length).to.equal(2);

    response.body.forEach(product => {
      const expected = products.find(p => p.uuid === product.uuid);
      expect(product.productName).to.equal(expected.productName);
      expect(product.specificGravity).to.equal(expected.specificGravity);
    })
  });

  it('should return a 500 if an error is thrown', async () => {
    sinon.stub(Product, 'findAll').throws(() => new Error());

    const response = await request(app).get('/products');

    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('There was an error connecting to the database');
  });
});
