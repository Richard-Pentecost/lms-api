const express = require('express');
const addRegion = require('../controllers/region/addRegion');
const getAllRegions = require('../controllers/region/getAllRegions');
const deleteRegionByUuid = require('../controllers/region/deleteRegionByUuid');
const updateRegionByUuid = require('../controllers/region/updateRegionByUuid');
const { auth, admin } = require('../middlewares/auth');

const router = express.Router();

router.post('/', admin, addRegion);
router.get('/', auth, getAllRegions);
router.patch('/:uuid', admin, updateRegionByUuid);
router.delete('/:uuid', admin, deleteRegionByUuid);

module.exports = router; 

