const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/', categoryController.getAll);
router.post('/', categoryController.create);

module.exports = router;
