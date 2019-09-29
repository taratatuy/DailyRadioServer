const express = require('express');

const { SENTRY } = require('../config.js');
const database = require('../database');

const router = express.Router();

router.post('/create', (req, res) => {
  let { login, password, email } = req.body;
  if (login != undefined && password != undefined && email != undefined) {
    password = password.toLowerCase();
    email = email.toLowerCase();
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
  if (login != undefined && newEmail != undefined) {
    newEmail = newEmail.toLowerCase();
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
  if (login != undefined && newPassword != undefined) {
    newPassword = newPassword.toLowerCase();
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
  if (login != undefined && password != undefined) {
    password = password.toLowerCase();
    database
      .GetUser(login, password)
      .then(data => {
        if (data == 'User not found.') {
          res.status(404);
        } else {
          res.status(200);
        }
        res.end(data);
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
