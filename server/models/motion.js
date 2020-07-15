var mongoose = require('mongoose');

var Schema = mongoose.Schema

var MotionSchema = new Schema({
  // mover: {
  //   type: Schema.ObjectId,
  //   ref: 'Person'
  // },
  type: {
    type: Schema.ObjectId,
    ref: 'MotionType'
  },
  text: {
    type: String
  },
  revisions: [{
    type: Schema.ObjectId,
    ref: 'Motion'
  }],
  name: {
    type: String
  }
});

module.exports = mongoose.model('Motion', MotionSchema)
