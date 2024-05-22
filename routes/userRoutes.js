// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/info', userController.getUserInfo);
router.get('/active', userController.active);

module.exports = router;
