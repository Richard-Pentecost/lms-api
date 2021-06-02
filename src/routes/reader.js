const express = require('express');
const readerController = require('../controllers/reader');

const router = express.Router();

router.post('/', readerController.create);
router.get('/', readerController.list);
router.get('/:id', readerController.findById);
router.patch('/:id', readerController.update);
router.delete('/:id', readerController.delete);

module.exports = router;
