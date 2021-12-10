const express = require('express');
const addRegion = require('../controllers/region/addRegion');
const getAllRegions = require('../controllers/region/getAllRegions');
const deleteRegionByUuid = require('../controllers/region/deleteRegionByUuid');
const updateRegionByUuid = require('../controllers/region/updateRegionByUuid');

const router = express.Router();

router.post('/', addRegion);
router.get('/', getAllRegions);
router.patch('/:uuid', updateRegionByUuid);
router.delete('/:uuid', deleteRegionByUuid);

module.exports = router; 

