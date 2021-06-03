const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db'); 
const app = require('../src/app');

describe('/books', () => {
  let db;
  beforeEach(async () => db = await getDb());
  
  afterEach(async () => {
    await db.query('DELETE FROM Book');
    await db.close();
  });
  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const response = await request(app).post('/books').send({
          name: 'Harry Potter and the Philosophers Stone',
          author: 'JK Rowling',
        });
  
        expect(response.status).to.equal(201);
  
        const [[ books ]] = await db.query(
          `SELECT * FROM Book WHERE name = 'Harry Potter and the Philosophers Stone'`
        );
  
        expect(books.name).to.equal('Harry Potter and the Philosophers Stone');
        expect(books.author).to.equal('JK Rowling');
      });
    });
  });

  describe('with records in the database', () => {
    let books;

    beforeEach(async () => {
      await Promise.all([
        db.query('INSERT INTO Book (name, author) VALUES (?, ?)', ['Bravo 2 Zero', 'Andy McNab']),
        db.query('INSERT INTO Book (name, author) VALUES (?, ?)', ['Ice Man', 'Wim Hof']),
        db.query('INSERT INTO Book (name, author) VALUES (?, ?)', ['Angels and Demons', 'Dan Brown']),
      ]);

      [ books ] = await db.query('SELECT * FROM Book');
    });

    describe('GET /books', () => {
      it('returns all book records in the database', async () => {
        const res = await request(app).get('/books').send();
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);
  
        res.body.forEach(book => {
          const expected = books.find(b => b.id === book.id);
          expect(book).to.deep.equal(expected);
        });
      });
    });

    describe('GET /books/:id', () => {
      it('returns the book for a given id', async () => {
        const book = books[0];
        const res = await request(app).get(`/books/${book.id}`).send();

        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(book);
      });

      it('returns 404 if the book is not in the database', async () => {
        const res = await request(app).get('/books/12345').send();

        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The book could not be found.');
      });
    });

    describe('PATCH /books/:id', () => {
      it('updates the book with a given id', async () => {
        const book = books[0];
        const res = await request(app)
          .patch(`/books/${book.id}`)
          .send({ author: 'Ant Middleton' });

        expect(res.status).to.equal(200);
        
        const [[ newBook ]] = await db.query('SELECT * FROM Book WHERE id = ?', [book.id]);
        expect(newBook.name).to.equal('Bravo 2 Zero');
        expect(newBook.author).to.equal('Ant Middleton');
      });

      it('returns 404 if the book is not in the database', async () => {
        const res = await request(app)
          .patch(`/books/12345`)
          .send({ author: 'Ant Middleton' });
        
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The book could not be found.');
      });
    });

    describe('DELETE /books/:id', () => {
      it('deletes a book with a given id', async () => {
        const book = books[0];
        const res = await request(app).delete(`/books/${book.id}`).send();

        expect(res.status).to.equal(200);

        const [[ deletedBook ]] = await db.query('SELECT * FROM Book WHERE id = ?', [book.id]);
        const [ totalBooks ] = await db.query('SELECT * FROM Book');
        
        expect(totalBooks.length).to.equal(2);
        expect(!!deletedBook).to.be.false;
      });

      it('returns 404 if the book is not in the database', async () => {
        const res = await request(app).delete('/books/12345').send();

        expect(res.status).to.equal(404);

        const [ totalBooks ] = await db.query('SELECT * FROM Book');

        expect(totalBooks.length).to.equal(3);
        expect(res.body.error).to.equal('The book could not be found.');
      });
    });
  })
});
