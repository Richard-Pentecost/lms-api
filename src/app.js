const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user');
const farmRouter = require('./routes/farm');
const authRouter = require('./routes/auth');
const dataRouter = require('./routes/data');
const regionRouter = require('./routes/region');
const productRouter = require('./routes/products');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(cors());

app.use('/login', authRouter);
app.use('/farms', farmRouter);
app.use('/users', userRouter);
app.use('/farms/:farmId/data', dataRouter);
app.use('/regions', regionRouter);
app.use('/products', productRouter);

module.exports = app;
