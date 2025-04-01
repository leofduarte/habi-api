var express = require('express');
var router = express.Router();
var indexController = require('../controllers/index.controller.js');

router.get('/', indexController.getHomePage);

module.exports = router;