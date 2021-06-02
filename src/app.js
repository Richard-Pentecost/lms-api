const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  console.log('Hitting this endpoint');
  res.status(200).json({ result: "Hello World" });
});

module.exports = app;