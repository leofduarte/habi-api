var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user.controller.js');

//$ Get user by ID and email
router.get('/:id', UserController.getUserById);
router.get('/', UserController.getUserByEmail);

//$ Update user
router.put('/:id', UserController.updateUser);

module.exports = router;