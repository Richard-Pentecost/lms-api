const express = require('express');
const addData = require('../controllers/data/addData');
const getDataByFarmId = require('../controllers/data/getDataByFarmId');
const updateDataByDataId = require('../controllers/data/updateDataByDataId');

const router = express.Router({ mergeParams: true });

router.post('/', addData);
router.get('/', getDataByFarmId);
router.patch('/:dataId', updateDataByDataId);

module.exports = router;
