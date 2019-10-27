const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
  login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean
  }
});

user.set('toJSON', { virtuals: true });

module.exports = mongoose.model('UserModel', user);
