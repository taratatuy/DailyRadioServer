const express = require('express');
const jwt = require('jsonwebtoken');

const { SENTRY } = require('../config.js');
const database = require('../database');
const authentication = require('./middleware/authentication.js');

const router = express.Router();

// {login: 'asd', password: 'qwe'}
router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  if (!(login && password))
    return res.status(400).json({ message: 'Bad post data.' });

  database
    .Verification(login, password)
    .then(data => {
      if (!data) return res.status(404).json({ message: 'User not found.' });

      const accessToken = GenerateAccessToken(login);
      const refreshToken = GenerateRefreshToken(login);

      database.SetRefreshToken(login, refreshToken).then(rtData => {
        if (!rtData)
          return res
            .status(501)
            .json({ message: 'Refresh token not updated.' });
        res.json({ accessToken: accessToken, refreshToken: refreshToken });
      });
    })
    .catch(err => {
      SENTRY.captureException('Login POST processing error: ', err);
      res.status(500).end('Internal Server Error');
    });
});

// { refreshToken: 'refreshToken' }
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(400).json({ message: 'Bad post data.' });

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, token) => {
      if (err) return res.status(403).json({ message: 'Bad token.' });

      const loginVerify = await database.FindLogin(token.login);
      if (!loginVerify)
        return res
          .status(404)
          .json({ message: `User ${token.login} not found` });

      const previousToken = await database.GetRefreshToken(token.login);
      if (previousToken != refreshToken)
        return res.status(426).json({ message: 'Overdue refresh token.' });

      const newAccessToken = GenerateAccessToken(token.login);
      const newRefreshToken = GenerateRefreshToken(token.login);
      await database.SetRefreshToken(token.login, newRefreshToken);
      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    }
  );
});

router.get('/logout', authentication, (req, res) => {
  const { login } = req.user;

  if (!login) return res.status(400).json({ message: 'Bad request data.' });

  database
    .SetRefreshToken(login, 'Logged out.')
    .then(rtData => {
      if (!rtData)
        return res.status(501).json({ message: 'Refresh token not updated.' });
      res.json({ message: 'Logged out.' });
    })
    .catch(err => {
      SENTRY.captureException('Login POST processing error: ', err);
      res.status(500).end('Internal Server Error');
    });
});

function GenerateAccessToken(login) {
  return jwt.sign({ login: login }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30s'
  });
}

function GenerateRefreshToken(login) {
  return jwt.sign({ login: login }, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = router;
