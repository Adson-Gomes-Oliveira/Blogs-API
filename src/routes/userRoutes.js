const express = require('express');
const userController = require('../controllers/userController');
const authorization = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', userController.create);
router.use(authorization);
router.get('/', userController.getAll);
router.get('/:id', userController.getByID);

module.exports = router;
