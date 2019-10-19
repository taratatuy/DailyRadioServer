const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const token = new Schema({
  login: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  }
});

token.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('TokenModel', token);
