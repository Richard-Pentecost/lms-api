const express = require('express');
// const readerRouter= require('./routes/reader');
const readerController = require('./controllers/reader');

const app = express();

app.use(express.json());
// app.use('/readers', readerRouter);
app.post('/readers', readerController.create);
app.get('/readers', readerController.list);
app.get('/readers/:id', readerController.findById);
app.patch('/readers/:id', readerController.update);
app.delete('/readers/:id', readerController.delete);

module.exports = app;
