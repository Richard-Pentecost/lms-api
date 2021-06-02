const express = require('express');
const readerController = require('../controllers/reader');

const router = express.Router();

router.post('/', readerController.create);

module.exports = router;
