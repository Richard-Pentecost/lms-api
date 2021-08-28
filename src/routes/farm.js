const express = require('express');
const createFarm = require('../controllers/createFarm');
const getAllFarms = require('../controllers/getAllFarms');
const getFarmByUuid = require('../controllers/getFarmByUuid');
const updateFarmByUuid = require('../controllers/updateFarmByUuid');
const deleteFarmByUuid = require('../controllers/deleteFarmByUuid');

const router = express.Router();

router.post('/', createFarm);
router.get('/', getAllFarms);
router.get('/:uuid', getFarmByUuid);
router.patch('/:uuid', updateFarmByUuid);
router.delete('/:uuid', deleteFarmByUuid);

module.exports = router;