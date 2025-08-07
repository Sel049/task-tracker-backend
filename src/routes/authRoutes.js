const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/me', require('../middleware/auth'), authController.getCurrentUser);
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.post('/register', authController.register);
router.post('/login', authController.login);
const requireAuth = require('../middleware/auth');
router.get('/profile', requireAuth, authController.getProfile);
router.post('/logout', authController.logout);

module.exports = router;