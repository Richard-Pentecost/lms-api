const express = require('express');
const userController = require('../controllers/user');
const createUser = require('../controllers/users/createUser');
const getAllUsers = require('../controllers/users/getAllUsers');
const getUserByUuid = require('../controllers/users/getUserByUuid');
const updateUserByUuid = require('../controllers/users/updateUserByUuid');
const updatePasswordByUuid = require('../controllers/users/updatePasswordByUuid');

const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:uuid', getUserByUuid);
router.patch('/:uuid', updateUserByUuid);
router.delete('/:uuid', userController.delete);
router.patch('/:uuid/security', updatePasswordByUuid);

module.exports = router;
