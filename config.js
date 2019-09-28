const dotenv = require('dotenv');
const path = require('path');
const Sentry = require('@sentry/node');

const root = path.join.bind(this, __dirname);
dotenv.config({ path: root('.env') });

Sentry.init({ dsn: process.env.DSN });

module.exports = {
  PORT: process.env.PORT || 3000,
  SENTRY: Sentry || '',
  MONGO_URL:
    process.env.MONGO_URL || 'mongodb://localhost:27017/DailyRadioDebug'
};
