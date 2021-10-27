const express = require('express');
const loginUser = require('../controllers/auth/loginUser');

const router = express.Router();

router.post('/', loginUser);

module.exports = router;