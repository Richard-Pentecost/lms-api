const express = require('express');
const createFarm = require('../controllers/createFarm');
const getAllFarms = require('../controllers/getAllFarms');

const router = express.Router();

router.post('/', createFarm);
router.get('/', getAllFarms);

module.exports = router;