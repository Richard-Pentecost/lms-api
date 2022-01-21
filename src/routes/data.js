const express = require('express');
const addData = require('../controllers/data/addData');
const getDataByFarmId = require('../controllers/data/getDataByFarmId');
const updateDataByDataId = require('../controllers/data/updateDataByDataId');
const deleteDataByDataId = require('../controllers/data/deleteDataByDataId');
const { auth, admin } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router.post('/', auth, addData);
router.get('/', auth, getDataByFarmId);
router.patch('/:dataId', auth, updateDataByDataId);
router.delete('/:dataId', admin, deleteDataByDataId);

module.exports = router;
