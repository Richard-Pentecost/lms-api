const express = require('express');
// const readerRouter= require('./routes/reader');
const readerController = require('./controllers/reader');

const app = express();

app.use(express.json());
// app.use('/readers', readerRouter);
app.post('/readers', readerController.create);

// app.get('/', (req, res) => {
//   console.log('Hitting this endpoint');
//   res.status(200).json({ result: "Hello World" });
// });

// app.post('/readers', (req, res) => {
//   res.sendStatus(201);
// });

module.exports = app;
