const express = require('express');
const addProduct = require('../controllers/products/addProduct');
const getAllProducts = require('../controllers/products/getAllProducts');
const deleteProductByUuid = require('../controllers/products/deleteProductByUuid');

const router = express.Router();

router.post('/', addProduct);
router.get('/', getAllProducts);
router.delete('/:uuid', deleteProductByUuid);

module.exports = router;
