var express = require('express');
var app = express();

module.exports = function (io) {
  var motionController = require('../controllers/motionController')(io)
  var router = express.Router();

  router.get('/', motionController.index)
  router.post('/', motionController.create)
  router.get('/:id', motionController.get)
  router.patch('/:id', motionController.update)
  router.delete('/:id', motionController.delete)

  return router
}