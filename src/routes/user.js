const express = require('express');
const userController = require('../controllers/user');
const createUser = require('../controllers/createUser');
const getAllUsers = require('../controllers/getAllUsers');
const getUserByUuid = require('../controllers/getUserByUuid');
const updateUserByUuid = require('../controllers/updateUserByUuid');

const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:uuid', getUserByUuid);
router.patch('/:uuid', updateUserByUuid);
// router.patch('/:uuid', userController.update);
router.delete('/:uuid', userController.delete);

module.exports = router;
