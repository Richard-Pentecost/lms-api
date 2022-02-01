const express = require('express');
const createFarm = require('../controllers/farms/createFarm');
const getAllFarms = require('../controllers/farms/getAllFarms');
const getFarmByUuid = require('../controllers/farms/getFarmByUuid');
const updateFarmByUuid = require('../controllers/farms/updateFarmByUuid');
const deleteFarmByUuid = require('../controllers/farms/deleteFarmByUuid');
const getActiveFarms = require('../controllers/farms/getActiveFarms');
const disableFarmByUuid = require('../controllers/farms/disableFarmByUuid');
const { auth, admin } = require('../middlewares/auth');

const router = express.Router();

router.post('/', admin, createFarm);
router.get('/', auth, getAllFarms);
router.get('/active', auth, getActiveFarms);
router.get('/:uuid', auth, getFarmByUuid);
router.patch('/:uuid', auth, updateFarmByUuid);
router.delete('/:uuid', admin, deleteFarmByUuid);
router.patch('/:uuid/disable', admin, disableFarmByUuid);

module.exports = router;