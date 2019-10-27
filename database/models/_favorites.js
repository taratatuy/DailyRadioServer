const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favorite = new Schema({
  login: {
    type: String,
    required: true
  },
  songs: {
    type: Array
  }
});

favorite.set('toJSON', { virtuals: true });

module.exports = mongoose.model('FavoriteModel', favorite);
