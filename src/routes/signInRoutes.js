const express = require('express');
const signInController = require('../controllers/signInController');

const router = express.Router();

router.post('/', signInController.signIn);

module.exports = router;
