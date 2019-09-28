const { MONGO_URL, SENTRY } = require('../config');
const mongoose = require('mongoose');
const models = require('./models');

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

function CreateUser(login, password, email) {
  return FindLogin(login)
    .then(foudLogin => {
      if (foudLogin == 'Login is already exist.') {
        return Promise.reject(Error(`Login "${login}" is already exist.`));
      }
    })
    .then(() => {
      return FindEmail(email).then(foundEmail => {
        if (foundEmail == 'Email is already exist.') {
          return Promise.reject(Error(`Email "${email}" is already exist.`));
        }
      });
    })
    .then(() => {
      return models.users.create({
        login: login,
        password: password,
        email: email,
        verified: false
      });
    })
    .then(() => {
      return 'Successfuly created.';
    })
    .catch(err => {
      SENTRY.captureMessage(err.message);
      return err.message;
    });
}

function GetUser(login, password) {
  return models.users
    .findOne({
      login: login,
      password: password
    })
    .then(data => {
      if (data == null) {
        return 'User not found.';
      } else {
        return data;
      }
    })
    .catch(err => {
      SENTRY.captureException('DB find user error: ', err);
    });
}

function SetEmailVerification(email) {
  return models.users
    .updateOne(
      {
        email: email
      },
      {
        verified: true
      }
    )
    .then(data => {
      if (data.n == 0) {
        SENTRY.captureMessage(`Email ${email} not found.`);
        return `Email not found.`;
      } else {
        SENTRY.captureMessage(`${email} successfully verified.`);
        return `${email} successfully verified.`;
      }
    })
    .catch(err => {
      SENTRY.captureException(`DB verification error: `, err);
    });
}

function ChangeEmail(login, newEmail) {
  return models.users
    .updateOne(
      {
        login: login
      },
      {
        email: newEmail,
        verified: false
      }
    )
    .then(data => {
      if (data.n == 0) {
        SENTRY.captureMessage(`User ${login} not found.`);
        return `User not found.`;
      } else {
        SENTRY.captureMessage(`${login}'s email successfully changed.`);
        return `Email successfully changed.`;
      }
    })
    .catch(err => {
      SENTRY.captureException(`DB email change error: `, err);
    });
}

function FindLogin(login) {
  return models.users
    .findOne({
      login: login
    })
    .then(data => {
      if (data == null) {
        return 'Login not found.';
      } else {
        return 'Login is already exist.';
      }
    })
    .catch(err => {
      SENTRY.captureException('DB find login error: ', err);
    });
}

function FindEmail(email) {
  return models.users
    .findOne({
      email: email
    })
    .then(data => {
      if (data == null) {
        return 'Email not found.';
      } else {
        return 'Email is already exist.';
      }
    })
    .catch(err => {
      SENTRY.captureException('DB find email error: ', err);
    });
}

module.exports = {
  CreateUser,
  GetUser,
  SetEmailVerification,
  ChangeEmail
};
