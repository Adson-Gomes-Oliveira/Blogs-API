const express = require('express');
const blogPostController = require('../controllers/blogPostController');

const router = express.Router();

router.get('/', blogPostController.getAll);
router.get('/:id', blogPostController.getByID);
router.post('/', blogPostController.create);
router.put('/:id', blogPostController.edit);
router.delete('/:id', blogPostController.exclude);

module.exports = router;
