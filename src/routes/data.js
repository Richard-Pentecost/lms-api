const express = require('express');
const addData = require('../controllers/data/addData');
const getDataByFarmId = require('../controllers/data/getDataByFarmId');
const updateDataByDataId = require('../controllers/data/updateDataByDataId');
const deleteDataByDataId = require('../controllers/data/deleteDataByDataId');

const router = express.Router({ mergeParams: true });

router.post('/', addData);
router.get('/', getDataByFarmId);
router.patch('/:dataId', updateDataByDataId);
router.delete('/:dataId', deleteDataByDataId);

module.exports = router;
