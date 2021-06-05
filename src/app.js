const express = require('express');
const userRouter = require('./routes/user');
const farmRouter = require('./routes/farm');

const app = express();

app.use(express.json());
// app.use('/login', authRouter);
app.use('/farms', farmRouter);
app.use('/users', userRouter);
// app.use('/farms/:farmId/data', dataRouter);

module.exports = app;
