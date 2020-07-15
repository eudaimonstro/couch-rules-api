var Motion = require('../models/motion');
const {
  ObjectID
} = require('mongodb');

var MOTIONS_COLLECTION = 'motions'
module.exports = function (io) {

  const _io = io;
  exports = {}

  exports.index = async (req, res, next) => {
    const motion = await Motion.find({})
      .catch((error) => {
        res.status(400).send(error);
      });

    const temp = motion.map((motionItem) => {
      return {
        id: motionItem._id,
        name: motionItem.name
      }
    });
    res.send(temp);
  };


  exports.create = async (req, res, next) => {
    const motion = new Motion({
      name: req.body.name
    });

    const savedMotion = await motion.save()

    const newMotion = {
      id: savedMotion._id,
      name: savedMotion.name
    }

    io.emit('motionCreated', newMotion);
    res.send(newMotion)
  }

  exports.get = async (req, res, next) => {
    const motionId = req.params.id;

    if (!ObjectID.isValid(motionId)) {
      return res.status(400).send()
    }

    const motion = await Motion.findOne({
        _id: motionId
      })
      .catch((error) => {
        return res.status(400).send(error);
      });

    if (!motion) {
      return res.status(404).send();
    }

    const newMotion = {
      id: motion._id,
      name: motion.name
    }
    res.send(newMotion);
  }

  exports.update = async (req, res, next) => {
    const motionId = req.params.id;
    const body = _.pick(req.body, ['name']);

    if (!ObjectID.isValid(motionId)) {
      return res.status(404).send();
    }

    const motion = await Motion.findOneAndUpdate({
        _id: req.params.id
      }, {
        $set: body
      }, {
        new: true
      })
      .catch((error) => {
        return res.status(400).send()
      })
    res.status(200).send(motion)
  };


  exports.delete = async (req, res, next) => {
    const motionId = req.params.id;

    if (!ObjectID.isValid(motionId)) {
      return res.status(404).send();
    }

    const motion = await Motion.findOneAndRemove({
      _id: motionId
    });

    if (!motion) {
      res.status(404).send();
    }

    io.emit('motionDeleted', motion);

    res.send({
      motion
    });
  }

  return exports;
}