const express = require('express');
const createFarm = require('../controllers/createFarm');
const getAllFarms = require('../controllers/getAllFarms');
const getFarmById = require('../controllers/getFarmById');
const updateFarmById = require('../controllers/updateFarmById');

const router = express.Router();

router.post('/', createFarm);
router.get('/', getAllFarms);
router.get('/:id', getFarmById);
router.patch('/:id', updateFarmById);

module.exports = router;