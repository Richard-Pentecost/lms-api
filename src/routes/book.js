const express = require('express');
const bookController = require('../controllers/book');

const router = express.Router();

router.post('/', bookController.create);

module.exports = router;
