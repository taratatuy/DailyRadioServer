const dotenv = require('dotenv');
const Sentry = require('@sentry/node');

dotenv.config();
Sentry.init({ dsn: process.env.DSN });

module.exports = {
  PORT: process.env.PORT || 3000,
  SENTRY: Sentry || '',
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/DailyRadio'
};
