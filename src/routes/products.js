const express = require('express');
const addProduct = require('../controllers/products/addProduct');
const getAllProducts = require('../controllers/products/getAllProducts');
const deleteProductByUuid = require('../controllers/products/deleteProductByUuid');
const { auth, admin } = require('../middlewares/auth');

const router = express.Router();

router.post('/', admin, addProduct);
router.get('/', auth, getAllProducts);
router.delete('/:uuid', admin, deleteProductByUuid);

module.exports = router;
