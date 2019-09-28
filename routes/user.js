const express = require('express');

const { SENTRY } = require('../config.js');
const database = require('../database');

const router = express.Router();

router.post('/create', (req, res) => {
  let { login, password, email } = req.body;
  password = password.toLowerCase();
  email = email.toLowerCase();
  if (login != undefined && password != undefined && email != undefined) {
    database
      .CreateUser(login, password, email)
      .then(data => {
        if (data == 'Successfuly created.') {
          res.status(200);
        } else {
          res.status(422);
        }
        res.end(data);
      })
      .catch(err => {
        SENTRY.captureException('CreateUser POST processing error: ', err);
        res.status(500);
        res.end('Internal Server Error');
      });
  } else {
    res.status(400);
    res.end('Wrong post data.');
  }
});

router.post('/changeEmail', (req, res) => {
  let { login, newEmail } = req.body;
  newEmail = newEmail.toLowerCase();
  if (login != undefined && newEmail != undefined) {
    database
      .ChangeEmail(login, newEmail)
      .then(data => {
        if (data == `Email successfully changed.`) {
          res.status(200);
        } else {
          res.status(422);
        }
        res.end(data);
      })
      .catch(err => {
        SENTRY.captureException('ChangeEmail POST processing error: ', err);
        res.status(500);
        res.end('Internal Server Error');
      });
  } else {
    res.status(400);
    res.end('Wrong post data.');
  }
});

router.post('/changePassword', (req, res) => {
  let { login, newPassword } = req.body;
  newPassword = newPassword.toLowerCase();
  if (login != undefined && newPassword != undefined) {
    database
      .ChangePassword(login, newPassword)
      .then(data => {
        if (data == `Password successfully changed.`) {
          res.status(200);
        } else {
          res.status(422);
        }
        res.end(data);
      })
      .catch(err => {
        SENTRY.captureException('ChangePassword POST processing error: ', err);
        res.status(500);
        res.end('Internal Server Error');
      });
  } else {
    res.status(400);
    res.end('Wrong post data.');
  }
});

router.post('/get', (req, res) => {
  let { login, password } = req.body;
  password = password.toLowerCase();
  if (login != undefined && password != undefined) {
    database
      .GetUser(login, password)
      .then(data => {
        if (data == 'User not found.') {
          res.status(404);
          res.end(data);
        } else {
          res.status(200);
          res.end(
            `{"login": "${data.login}", "password": "${data.password}", "email": "${data.email}", "verified": "${data.verified}"}`
          );
        }
      })
      .catch(err => {
        SENTRY.captureException('GetUser POST processing error: ', err);
        res.status(500);
        res.end('Internal Server Error');
      });
  } else {
    res.status(400);
    res.end('Wrong post data.');
  }
});

module.exports = router;
