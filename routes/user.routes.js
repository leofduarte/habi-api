var express = require('express');
var UserController = require('../controllers/user.controller.js');
const validateRequest = require('../middlewares/validateRequest.middleware.js');
const {
    // userIdSchema,
    // userEmailSchema,
    updateUserSchema,
    //# changePasswordSchema
} = require('../validations/user.validation.js');
const authenticateToken = require('../middlewares/jwt.middleware.js');
const { authorizeResource, authorizeByQueryParam } = require('../middlewares/authorization.middleware.js');

var router = express.Router();

// Proteger todas as rotas de utilizadores com autenticação
router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management routes
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *       404:
 *         description: User not found
 */
router.get('/:id', authorizeResource('user'), UserController.getUserById);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a user by email
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email of the user
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *       400:
 *         description: Email is required
 *       404:
 *         description: User not found
 */
router.get('/', authorizeByQueryParam('email', 'user'), UserController.getUserByEmail);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user's details
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "newemail@example.com"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *               firstName:
 *                 type: string
 *                 example: "Jane"
 *               lastName:
 *                 type: string
 *                 example: "Smith"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "newemail@example.com"
 *                     first_name:
 *                       type: string
 *                       example: "Jane"
 *                     last_name:
 *                       type: string
 *                       example: "Smith"
 *       400:
 *         description: At least one field to update is required
 *       404:
 *         description: User not found
 */
router.put('/:id', authorizeResource('user'), validateRequest(updateUserSchema), UserController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "User deleted successfully"
 *       404:
 *         description: User not found
 */
router.delete('/:id', authorizeResource('user'), UserController.deleteUser);

/**
 * @swagger
 * /users/{id}/rest-days:
 *   get:
 *     summary: Get a user's rest days
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A list of rest days
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     restDays:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["SAT", "SUN"]
 *       404:
 *         description: User not found
 */
router.get('/:id/rest-days', authorizeResource('user'), UserController.getRestDays);

/**
 * @swagger
 * /users/{id}/rest-days:
 *   put:
 *     summary: Update a user's rest days
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restDays:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["SAT", "SUN"]
 *     responses:
 *       200:
 *         description: Rest days updated successfully
 *       400:
 *         description: Invalid data provided
 *       404:
 *         description: User not found
 */
router.put('/:id/rest-days', authorizeResource('user'), UserController.updateRestDays);

//# router.post('/:id/change-password', validateRequest(changePasswordSchema), UserController.changePassword);

module.exports = router;