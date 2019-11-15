const express = require('express');
const MM = require('music-metadata');

const { SENTRY } = require('../config.js');
const database = require('../database');
const authentication = require('./middleware/authentication.js');

const router = express.Router();

router.post('/', authentication, (req, res) => {
  const { login } = req.user;

  if (!login) return res.status(400).json({ message: 'Bad request data.' });

  database
    .GetFavorites(login)
    .then(async data => {
      res.send(await GetMetadata(data));
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
    .then(async data => {
      if (data) {
        data = await database.GetFavorites(login);
        res.send(await GetMetadata(data));
      } else {
        res.send(false);
      }
    })
    .catch(err => {
      SENTRY.captureException('Get favorites processing error: ', err);
      res.status(500).end('Internal Server Error');
    });
});

async function GetMetadata(filenames) {
  let songsData = [];
  let filePath;

  for (file of filenames) {
    filePath = './Music/' + file;
    const { format, common } = await MM.parseFile(filePath);
    const picture = common.picture || [{ data: { data: undefined } }];
    songsData.push({
      title: common.title || 'Unknown title',
      artist: common.artist || 'Unknown artist',
      album: common.album || '',
      duration: parseInt(format.duration),
      picture: picture[0].data,
      fileName: file
    });
  }
  return songsData;
}

module.exports = router;
