const express = require('express');
const userController = require('../controllers/user');
const createUser = require('../controllers/createUser');

const router = express.Router();

router.post('/', createUser);
router.get('/', userController.list);
router.get('/:uuid', userController.findById);
router.patch('/:uuid', userController.update);
router.delete('/:uuid', userController.delete);

module.exports = router;
