const express = require('express');
const MM = require('music-metadata');
const fs = require('fs');
const util = require('util');

// const filePath = './Music/';
// const stat = fs.statSync(filePath);

// const { SENTRY } = require('../config.js');
// const database = require('../database');

const readDirP = util.promisify(fs.readdir);
const router = express.Router();

router.get('/playlist', async (req, res) => {
  const files = await readDirP('./Music');

  files.sort(() => Math.random() - 0.5);

  res.json(files);
});

router.get('/play/:name', (req, res) => {
  const name = req.params.name;
  const filePath = './Music/' + name;

  const stat = fs.statSync(filePath);
  fs.createReadStream(filePath).pipe(res);
  res.writeHead(200, {
    'Content-Type': 'audio/mpeg',
    'Content-Length': stat.size
  });
});

router.get('/play/:name/stats', (req, res) => {
  const name = req.params.name;
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
      console.error(err.message);
    });
});

// function getMusicStream() {}

module.exports = router;
