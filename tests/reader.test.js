const { expect } = require('chai');
const request = require('supertest');
const { Reader } = require ('../src/models');
const app = require('../src/app');

describe('/reader', () => {
  before(async () => Reader.sequelize.sync());

  afterEach(async () => {
    await Reader.destroy({ where: {} });
  });

  describe('with no records in the database', () => {
    describe('POST /readers', () => {
      it('creates a new reader in the database', async () => {
        const response = await request(app).post('/readers').send({
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
          password: 'password1',
        });

        const newReaderRecord = await Reader.findByPk(response.body.id, { raw: true });

        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal('Elizabeth Bennet');
        expect(!!response.body.password).to.be.false;
        expect(newReaderRecord.name).to.equal('Elizabeth Bennet');
        expect(newReaderRecord.email).to.equal('future_ms_darcy@gmail.com');
        expect(newReaderRecord.password).to.equal('password1');
      });

      it('returns 404 when any field is null', async () => {
        const noNameResponse = await request(app).post('/readers').send({
          email: 'future_ms_darcy@gmail.com',
          password: 'password',
        });
        const noEmailResponse = await request(app).post('/readers').send({
          name: 'Elizabeth Bennet',
          password: 'password',
        });
        const noPasswordResponse = await request(app).post('/readers').send({
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
        });

        expect(noNameResponse.status).to.equal(401);
        expect(noNameResponse.body.error.errors[0].message).to.equal('Reader.name cannot be null');
        expect(noEmailResponse.status).to.equal(401);
        expect(noEmailResponse.body.error.errors[0].message).to.equal('Email must be given');
        expect(noPasswordResponse.status).to.equal(401);
        expect(noPasswordResponse.body.error.errors[0].message).to.equal('Reader.password cannot be null');
      });

      it('returns 404 if an invalid email is given', async () => {
        const response = await request(app).post('/readers').send({
          name: 'Elizabeth Bennet',
          email: "invalid email",
          password: 'password',
        });

        expect(response.status).to.equal(401);
        expect(response.body.error.errors[0].message).to.equal('Must be a valid email address.');
      });

      it('returns 404 if the password does not have at least 8 characters', async () => {
        const response = await request(app).post('/readers').send({
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
          password: 'asdf',
        });

        expect(response.status).to.equal(401);
        expect(response.body.error.errors[0].message).to.equal('Password must be at least 8 characters long.');
      });
    });
  });

  describe('with records in the database', () => {
    let readers;

    beforeEach(async () => {
      readers = await Promise.all([
        Reader.create({ name: 'Elizabeth Bennet', email: 'future_ms_darcy@gmail.com', password: 'password' }),
        Reader.create({ name: 'Arya Stark', email: 'vmorgul@me.com', password: 'password' }),
        Reader.create({ name: 'Lyra Belacqua', email: 'darknorth123@msn.org', password: 'password' }),
      ]);
    });


    describe('GET /readers', () => {
      it('gets all readers records', async () => {
        const response = await request(app).get('/readers');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach(reader => {
          const expected = readers.find(a => a.id === reader.id);

          expect(reader.name).to.equal(expected.name);
          expect(reader.email).to.equal(expected.email);
          expect(!!reader.password).to.be.false;
        });
      });
    });

    describe('GET /readers/:id', () => {
      it('gets readers record by id', async () => {
        const reader = readers[0];
        const response = await request(app).get(`/readers/${reader.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(reader.name);
        expect(response.body.email).to.equal(reader.email);
        expect(!!response.body.password).to.be.false;
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app).get('/readers/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The reader could not be found.');
      });
    });

    describe('PATCH /readers/:id', () => {
      it('updates readers email by id', async () => {
        const reader = readers[0];
        const response = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: 'miss_e_bennet@gmail.com' });

        const updatedReaderRecord = await Reader.findByPk(reader.id, { raw: true });

        expect(response.status).to.equal(200);
        expect(updatedReaderRecord.email).to.equal('miss_e_bennet@gmail.com');
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app)
          .patch('/readers/12345')
          .send({ email: 'some_new_email@gmail.com' });
        
          expect(response.status).to.equal(404);
          expect(response.body.error).to.equal('The reader could not be found.');
      });
    });

    describe('DELETE /readers/:id', () => {
      it('deletes reader record by id', async () => {
        const reader = readers[0];
        const response = await request(app).delete(`/readers/${reader.id}`);
        const deletedReader = await Reader.findByPk(reader.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedReader).to.equal(null);
      });

      it('returns 404 if the reader does not exist', async () => {
        const response = await request(app).delete('/readers/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The reader could not be found.');
      });
    });
  });
});

