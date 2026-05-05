const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/login', AuthController.login);
router.get('/me', verifyToken, AuthController.me);

module.exports = router;