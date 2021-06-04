const express = require('express');
const userRouter= require('./routes/user');
// const bookRouter = require('./routes/book');

const app = express();

app.use(express.json());
app.use('/users', userRouter);
// app.use('/books', bookRouter);


module.exports = app;
