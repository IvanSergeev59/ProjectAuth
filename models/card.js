const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(str) {
        return validator.isURL(str);
      },
      message: 'Эта строка должна быть url',
    },
  },
  owner: {
    type: String,
    required: true,
  },
  likes: [{
    type: ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('cards', cardSchema);
