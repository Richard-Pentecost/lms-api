const express = require('express');
const getAllProducts = require('../controllers/products/getAllProducts');

const router = express.Router();

router.get('/', getAllProducts);

module.exports = router;
