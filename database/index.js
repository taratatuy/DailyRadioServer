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

async function CreateUser(login, password, email) {
  let foudLogin = await FindLogin(login);
  if (foudLogin == 'Login is already exist.') {
    let message = `Login "${login}" is already exist.`;
    SENTRY.captureMessage(message);
    return message;
  }

  let foundEmail = await FindEmail(email);
  if (foundEmail == 'Email is already exist.') {
    let message = `Email "${email}" is already exist.`;
    SENTRY.captureMessage(message);
    return message;
  }

  await models.users.create({
    login: login,
    password: password,
    email: email,
    verified: false
  });

  return 'Successfuly created.';
}

async function GetUser(login, password) {
  let data = await models.users.findOne({
    login: login,
    password: password
  });

  if (data == null) {
    return 'User not found.';
  } else {
    return `{"login": "${data.login}", "email": "${data.email}", "verified": "${data.verified}"}`;
  }
}

async function SetEmailVerification(email) {
  let data = await models.users.updateOne(
    {
      email: email
    },
    {
      verified: true
    }
  );

  if (data.n == 0) {
    SENTRY.captureMessage(`Email ${email} not found.`);
    return `Email not found.`;
  } else {
    SENTRY.captureMessage(`${email} successfully verified.`);
    return `${email} successfully verified.`;
  }
}

async function ChangeEmail(login, newEmail) {
  let data = await models.users.updateOne(
    {
      login: login
    },
    {
      email: newEmail,
      verified: false
    }
  );

  if (data.n == 0) {
    SENTRY.captureMessage(`User ${login} not found.`);
    return `User not found.`;
  } else {
    SENTRY.captureMessage(`${login}'s email successfully changed.`);
    return `Email successfully changed.`;
  }
}

async function ChangePassword(login, newPassword) {
  let data = await models.users.updateOne(
    {
      login: login
    },
    {
      password: newPassword
    }
  );

  if (data.n == 0) {
    SENTRY.captureMessage(`User ${login} not found.`);
    return `User not found.`;
  } else {
    SENTRY.captureMessage(`${login}'s password successfully changed.`);
    return `Password successfully changed.`;
  }
}

async function FindLogin(login) {
  let data = await models.users.findOne({
    login: login
  });

  if (data == null) {
    return 'Login not found.';
  } else {
    return 'Login is already exist.';
  }
}

async function FindEmail(email) {
  let data = await models.users.findOne({
    email: email
  });

  if (data == null) {
    return 'Email not found.';
  } else {
    return 'Email is already exist.';
  }
}

module.exports = {
  CreateUser,
  GetUser,
  SetEmailVerification,
  ChangeEmail,
  ChangePassword
};
