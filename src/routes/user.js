const express = require('express');
const createUser = require('../controllers/users/createUser');
const getAllUsers = require('../controllers/users/getAllUsers');
const getUserByUuid = require('../controllers/users/getUserByUuid');
const updateUserByUuid = require('../controllers/users/updateUserByUuid');
const updatePasswordByUuid = require('../controllers/users/updatePasswordByUuid');
const deleteUserByUuid = require('../controllers/users/deleteUserByUuid');
const { auth, admin } = require('../middlewares/auth');

const router = express.Router();

router.post('/', admin, createUser);
router.get('/', admin, getAllUsers);
router.get('/:uuid', auth, getUserByUuid);
router.patch('/:uuid', auth, updateUserByUuid);
router.delete('/:uuid', admin, deleteUserByUuid);
router.patch('/:uuid/security', auth, updatePasswordByUuid);

module.exports = router;
