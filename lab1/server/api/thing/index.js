'use strict';

var express = require('express');
var controller = require('./thing.controller');
var cpCore = require('./cpCore');

var router = express.Router();

//router.get('/', controller.index);
router.get('/cp', function (req, res) {
   var cpRecursive = cpCore.cpRecursive;
    var response = cpRecursive.closestPairRecursive(cpRecursive.sortedByX,cpRecursive.sortedByY);
  res.json(response);

});

module.exports = router;
