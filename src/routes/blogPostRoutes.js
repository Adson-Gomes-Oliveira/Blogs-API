const express = require('express');
const blogPostController = require('../controllers/blogPostController');

const router = express.Router();

router.post('/', blogPostController.create);

module.exports = router;
