const { expect } = require('chai');
const request = require('supertest'); 
const app = require('../src/app');

describe('create book', () => {
  describe('/books', () => {
    describe('POST', () => {
      it('creates a new book in the database', async () => {
        const response = await request(app).post('/books').send({
          name: 'Harry Potter and the Philosophers Stone',
          author: 'JK Rowling',
        });

        expect(response.status).to.equal(201);
      });
    });
  });
});
