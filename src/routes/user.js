const express = require('express');
const createUser = require('../controllers/users/createUser');
const getAllUsers = require('../controllers/users/getAllUsers');
const getUserByUuid = require('../controllers/users/getUserByUuid');
const updateUserByUuid = require('../controllers/users/updateUserByUuid');
const updatePasswordByUuid = require('../controllers/users/updatePasswordByUuid');
const deleteUserByUuid = require('../controllers/users/deleteUserByUuid');

const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:uuid', getUserByUuid);
router.patch('/:uuid', updateUserByUuid);
router.delete('/:uuid', deleteUserByUuid);
router.patch('/:uuid/security', updatePasswordByUuid);

module.exports = router;
