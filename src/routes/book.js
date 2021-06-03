const express = require('express');
const bookController = require('../controllers/book');

const router = express.Router();

router.post('/', bookController.create);
router.get('/', bookController.list);
router.get('/:id', bookController.findById);
router.patch('/:id', bookController.update);
router.delete('/:id', bookController.delete);

module.exports = router;
