var express = require('express');
var router = express.Router();
var AuthController = require('../controllers/auth.controller.js');

//$ Register user
router.post('/register', AuthController.registerUser);

//$ Login user
router.post('/login', AuthController.authenticateUser);

//$ Logout user
router.post('/logout', AuthController.revokeSession);

//$ Refresh access token - when the user is logged in and the access token is about to expire
// router.post('/auth/refresh', AuthController.refreshAccessToken);

//$ Initiate password reset
// router.post('/auth/forgot-password', AuthController.initiatePasswordReset);

//$ Complete password reset
// router.post('/auth/reset-password', AuthController.completePasswordReset);

// router.post('/auth/verify-email', AuthController.initiateEmailVerification);
// router.post('/auth/confirm-email', AuthController.completeEmailVerification);

module.exports = router;