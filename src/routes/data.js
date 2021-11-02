const express = require('express');
const addData = require('../controllers/data/addData');
const getDataByFarmId = require('../controllers/data/getDataByFarmId');

const router = express.Router({ mergeParams: true });

router.post('/', addData);
router.get('/', getDataByFarmId);

module.exports = router;
