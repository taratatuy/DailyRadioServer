const express = require('express');
const MM = require('music-metadata');
const fs = require('fs');
const util = require('util');
const { SENTRY } = require('../config.js');

const readDirP = util.promisify(fs.readdir);
const router = express.Router();

router.get('/playlist', async (req, res) => {
  try {
    const files = await readDirP('./Music');
    if (!files[0]) return res.status(503);

    files.sort(() => Math.random() - 0.5);
    res.json(files);
  } catch (err) {
    SENTRY.captureException('Get playlist processing error: ', err);
    res.status(500).end('Internal Server Error');
  }
});

router.get('/play/:name', (req, res) => {
  try {
    const name = req.params.name;
    if (name === 'undefined')
      return res.status(404).json({ message: 'Cant find track.' });

    const filePath = './Music/' + name;
    const stat = fs.statSync(filePath);

    fs.createReadStream(filePath).pipe(res);

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size
    });
  } catch (err) {
    res.status(404).json({ message: 'Cant find track.' });
  }
});

router.get('/play/:name/stats', (req, res) => {
  const name = req.params.name;
  if (name === 'undefined')
    return res.status(404).json({ message: 'Cant find track.' });

  const filePath = './Music/' + name;

  MM.parseFile(filePath)
    .then(({ common }) => {
      res.json({
        title: common.title,
        artist: common.artist,
        picture: common.picture[0]
      });
    })
    .catch(err => {
      console.log(err);
      res.status(404);
    });
});

module.exports = router;
