const express = require('express');

const { SENTRY } = require('../config.js');
const database = require('../database');
const authentication = require('./middleware/authentication.js');

const router = express.Router();

router.get('/', authentication, (req, res) => {
  const { login } = req.user;

  if (!login) return res.status(400).json({ message: 'Bad request data.' });

  database
    .GetFavorites(login)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      SENTRY.captureException('Get favorites processing error: ', err);
      res.status(500).end('Internal Server Error');
    });
});

router.post('/add', authentication, (req, res) => {
  const { login } = req.user;
  const { song } = req.body;

  if (!(login && song))
    return res.status(400).json({ message: 'Bad request data.' });

  database
    .AddFavorite(login, song)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      SENTRY.captureException('Get favorites processing error: ', err);
      res.status(500).end('Internal Server Error');
    });
});

router.post('/delete', authentication, (req, res) => {
  const { login } = req.user;
  const { song } = req.body;

  if (!(login && song))
    return res.status(400).json({ message: 'Bad request data.' });

  database
    .DelFavorite(login, song)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      SENTRY.captureException('Get favorites processing error: ', err);
      res.status(500).end('Internal Server Error');
    });
});

module.exports = router;
