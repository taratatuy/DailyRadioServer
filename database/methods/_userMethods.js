const bcrypt = require('bcrypt');
const models = require('../models');

async function CreateUser(login, password, email) {
  password = password.toLowerCase();
  email = email.toLowerCase();

  const foudLogin = await FindLogin(login);
  if (foudLogin) return `Login "${login}" is already exist.`;

  const foundEmail = await FindEmail(email);
  if (foundEmail) return `Email "${email}" is already exist.`;

  let hashPassword = await bcrypt.hash(password, 10);

  await models.users.create({
    login: login,
    password: hashPassword,
    email: email,
    verified: false
  });

  return 'Successfuly created.';
}

async function GetUser(login) {
  const data = await models.users.findOne({
    login: login
  });

  if (data)
    return `{"login": "${data.login}", "email": "${data.email}", "verified": "${data.verified}"}`;
  return 'User not found.';
}

async function SetEmailVerification(email) {
  email = email.toLowerCase();

  const data = await models.users.updateOne(
    {
      email: email
    },
    {
      verified: true
    }
  );

  if (data.n == 0) return `Email not found.`;
  return `${email} successfully verified.`;
}

async function ChangeEmail(login, newEmail) {
  newEmail = newEmail.toLowerCase();

  const foundEmail = await FindEmail(newEmail);
  if (foundEmail) return `Email "${newEmail}" is already exist.`;

  const data = await models.users.updateOne(
    {
      login: login
    },
    {
      email: newEmail,
      verified: false
    }
  );

  if (data.n == 0) return `User not found.`;
  return `Email successfully changed.`;
}

async function ChangePassword(login, newPassword) {
  newPassword = newPassword.toLowerCase();

  const data = await models.users.updateOne(
    {
      login: login
    },
    {
      password: newPassword
    }
  );

  if (data.n == 0) return `User not found.`;
  return `Password successfully changed.`;
}

async function FindLogin(login) {
  const data = await models.users.findOne({
    login: login
  });

  if (data) return true;
  return false;
}

async function FindEmail(email) {
  email = email.toLowerCase();

  const data = await models.users.findOne({
    email: email
  });

  if (data) return true;
  return false;
}

async function Verification(login, password) {
  password = password.toLowerCase();

  const data = await models.users.findOne({
    login: login
  });

  if (!data) return false;

  let hash = await bcrypt.compare(password, data.password);
  return hash;
}

const methods = {
  CreateUser,
  GetUser,
  SetEmailVerification,
  ChangeEmail,
  ChangePassword,
  Verification,
  FindLogin
};

module.exports = methods;
