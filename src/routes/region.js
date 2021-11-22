const express = require('express');
const addRegion = require('../controllers/region/addRegion');
const getAllRegions = require('../controllers/region/getAllRegions');

const router = express.Router();

router.post('/', addRegion);
router.get('/', getAllRegions);

module.exports = router; 

