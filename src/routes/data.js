const express = require('express');
const addData = require('../controllers/data/addData');

const router = express.Router();

router.post('/', addData);

module.exports = router;
