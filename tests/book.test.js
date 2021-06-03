const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db'); 
const app = require('../src/app');

describe('create book', () => {
  let db;
  beforeEach(async () => db = await getDb());
  
  afterEach(async () => {
    await db.query('DELETE FROM Book');
    await db.close();
  });

  describe('/books', () => {
    describe('POST', () => {
      it('creates a new book in the database', async () => {
        const response = await request(app).post('/books').send({
          name: 'Harry Potter and the Philosophers Stone',
          author: 'JK Rowling',
        });

        expect(response.status).to.equal(201);

        const [[ books ]] = await db.query(
          `SELECT * FROM Book WHERE name = 'Harry Potter and the Philosophers Stone'`
        );
        // console.log(books);

        expect(books.name).to.equal('Harry Potter and the Philosophers Stone');
        expect(books.author).to.equal('JK Rowling');
      });
    });
  });
});
