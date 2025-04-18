const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const validateRequest = require('../middlewares/validateRequest.middleware.js');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and authorization routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Register:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (min 6 characters)
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request
 */
router.post('/register', validateRequest(registerSchema), AuthController.registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateRequest(loginSchema), AuthController.authenticateUser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post('/logout', AuthController.revokeSession);

module.exports = router;

//$ refresh access token - when the user is logged in and the access token is about to expire
// router.post('/auth/refresh', AuthController.refreshAccessToken);
//$ initiate password reset
// router.post('/auth/forgot-password', AuthController.initiatePasswordReset);
//$ complete password reset
// router.post('/auth/reset-password', AuthController.completePasswordReset);

//$ email verification
// router.post('/auth/verify-email', AuthController.initiateEmailVerification);
// router.post('/auth/confirm-email', AuthController.completeEmailVerification);