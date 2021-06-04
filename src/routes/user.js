const express = require('express');
const userController = require('../controllers/user');
const createUser = require('../controllers/createUser');

const router = express.Router();

router.post('/', createUser);
router.get('/', userController.list);
router.get('/:id', userController.findById);
router.patch('/:id', userController.update);
router.delete('/:id', userController.delete);

module.exports = router;
