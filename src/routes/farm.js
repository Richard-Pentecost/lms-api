const express = require('express');
const createFarm = require('../controllers/farms/createFarm');
const getAllFarms = require('../controllers/farms/getAllFarms');
const getFarmByUuid = require('../controllers/farms/getFarmByUuid');
const updateFarmByUuid = require('../controllers/farms/updateFarmByUuid');
const deleteFarmByUuid = require('../controllers/farms/deleteFarmByUuid');

const router = express.Router();

router.post('/', createFarm);
router.get('/', getAllFarms);
router.get('/:uuid', getFarmByUuid);
router.patch('/:uuid', updateFarmByUuid);
router.delete('/:uuid', deleteFarmByUuid);

module.exports = router;