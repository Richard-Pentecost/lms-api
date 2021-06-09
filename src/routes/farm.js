const express = require('express');
const createFarm = require('../controllers/createFarm');
const getAllFarms = require('../controllers/getAllFarms');
const getFarmById = require('../controllers/getFarmById');
const updateFarmById = require('../controllers/updateFarmById');
const deleteFarmById = require('../controllers/deleteFarmById');

const router = express.Router();

router.post('/', createFarm);
router.get('/', getAllFarms);
router.get('/:id', getFarmById);
router.patch('/:id', updateFarmById);
router.delete('/:id', deleteFarmById);

module.exports = router;