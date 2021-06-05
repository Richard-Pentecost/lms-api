const express = require('express');
const createFarm = require('../controllers/createFarm');
const getAllFarms = require('../controllers/getAllFarms');
const getFarmById = require('../controllers/getFarmById');

const router = express.Router();

router.post('/', createFarm);
router.get('/', getAllFarms);
router.get('/:id', getFarmById);

module.exports = router;