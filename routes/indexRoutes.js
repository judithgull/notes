var express = require('express');
var indexController = require('../controller/indexController');

var router = express.Router();

router.get("/", indexController.index);

module.exports = router;