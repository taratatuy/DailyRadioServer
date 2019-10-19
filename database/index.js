const mongoose = require('mongoose');
const { MONGO_URL, SENTRY } = require('../config');

new Promise((resolve, reject) => {
  mongoose.Promise = global.Promise;

  mongoose.connection
    .on('error', error =>
      SENTRY.captureException('Mongoose connection error: ', error)
    )
    .on('close', () => SENTRY.captureMessage('Database connection closed.'))
    .once('open', () => {
      const info = mongoose.connections[0];
      console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    });

  mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}).catch(err => {
  SENTRY.captureException('Database connection error: ', err);
});

const methods = require('./methods');

module.exports = methods;
