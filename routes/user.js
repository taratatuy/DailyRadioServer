const express = require('express');

const { SENTRY } = require('../config.js');
const database = require('../database');
const authentication = require('./middleware/authentication.js');

const router = express.Router();

router.post('/create', (req, res) => {
  const { login, password, email } = req.body;

  if (!(login && password && email))
    return res.status(400).json({ message: 'Bad request data.' });

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
      res.status(500).end('Internal Server Error');
    });
});

router.post('/changeEmail', authentication, (req, res) => {
  const { login } = req.user;
  const { newEmail } = req.body;

  if (!(login && newEmail))
    return res.status(400).json({ message: 'Bad request data.' });

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
      res.status(500).end('Internal Server Error');
    });
});

router.post('/changePassword', authentication, (req, res) => {
  const { login } = req.user;
  const { newPassword } = req.body;

  if (!(login && newPassword))
    return res.status(400).json({ message: 'Bad request data.' });

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
      res.status(500).end('Internal Server Error');
    });
});

router.get('/get', authentication, (req, res) => {
  const { login } = req.user;

  if (!login) return res.status(400).json({ message: 'Bad request data.' });

  database
    .GetUser(login)
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
      res.status(500).end('Internal Server Error');
    });
});

module.exports = router;
